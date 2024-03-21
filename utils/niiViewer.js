import { useRef, useEffect, useState } from "react";
import { Niivue } from "@niivue/niivue";
import { Button, Select, MenuItem } from "@mui/material";
import { getRelevantROIs, generateColormaps } from '/utils/roiColormaps';
import ROIDict from '../public/content/Portal/Visualization/Dicts/MUSE_ROI_complete_list.json';


const NiiVue = ({ subjectID, roi, closeModal }) => {
  const canvas = useRef(null);
  const [isError, setIsError] = useState(false);
  const [overlayColor, setOverlayColor] = useState("custom_blue");
  const originalScanURL = "/content/Portal/Visualization/Subject_Scans/IXI016-Guys-0697-T1.nii.gz";
  const overlayURL = "/content/Portal/Visualization/Subject_Scans/IXI016-Guys-0697-T1_DLMUSE.nii.gz";
  let nv;

  // Function to show header
  const showHeader = () => {
    if (nv) {
      alert(nv.volumes[0].hdr.toFormattedString());
    } 
  };

  // Function to update the location text
  function handleLocationChange(data) {
    if (nv) {
      const mm = data.mm;
      const vox = data.vox;
      let roiName = "";
      
      let strHtml = `
        <div>Cursor Location:</div>
        <div>&nbsp;&nbsp;- In millimeters: (${mm[0].toFixed(2)} mm, ${mm[1].toFixed(2)} mm, ${mm[2].toFixed(2)} mm)</div>
        <div>&nbsp;&nbsp;- In voxels: (${vox[0]}, ${vox[1]}, ${vox[2]})</div>
        <div>Values:</div>
        <div>&nbsp;&nbsp;- Raw image: ${data.values[0].value.toFixed(2)}</div>`
      
      const overlayVolume = nv.volumes[1];
      if (overlayVolume) {   
        const overlayValue = data.values[1].value.toFixed(0)
        roiName = ROIDict[Math.floor(overlayValue)]?.Full_Name || "";
        if (roiName != "")  {
          roiName = " - <b>" + ROIDict[Math.floor(overlayValue)]?.Full_Name + "</b>"
        }
        strHtml += `<div>&nbsp;&nbsp;- Overlay: ${data.values[1].value.toFixed(0)}${roiName}</div>`;   
      }
      
      document.getElementById("location").innerHTML = strHtml;
    }
  }
  
  function initializePosition(imageOptions, volume) {
    if (imageOptions.url == overlayURL)
    {
      const data = volume.img;
      const dims = volume.dimsRAS

      const voxelCount = dims[1] * dims[2] * dims[3];
      let sumX = 0, sumY = 0, sumZ = 0, count = 0;
      const relevantROIs = getRelevantROIs(roi); // a list

      for (let i = 0; i < voxelCount; i++) {
        if (relevantROIs.includes(data[i])) {
          const x = i / (dims[2] * dims[3]);
          const y = (i % (dims[1] * dims[2])) / dims[1];
          const z = (i % (dims[2] * dims[3])) / dims[2] ; 

          sumX += x;
          sumY += y;
          sumZ += z;
          count++;
        }
      }

      if (count > 0) {
        const fr_x = Math.floor(sumX / count)/dims[1]; // Find average, and then normalize to [0,1] because crosshairPos wants it like that.
        const fr_y = Math.floor(sumY / count)/dims[2];
        const fr_z = Math.floor(sumZ / count)/dims[3]; 

        nv.scene.crosshairPos = [fr_x, fr_y, fr_z];
      }
    }
  }

  // Function to load and process NIfTI files
  const loadNiftiFiles = async () => {
    try {
      const relevantROIs = getRelevantROIs(roi);
      let colormaps = generateColormaps(relevantROIs);
      const volumeList = [
        {
          url: originalScanURL,
          colormap: "gray",
          opacity: 1,
        },
        {
          url: overlayURL,
          colormap: overlayColor,
          opacity: 0.7,
        }
      ];
      const config = {
        crosshairColor: [1,1,1,1], // RGBA color array [0-1]
        show3Dcrosshair: true,
        onLocationChange: handleLocationChange,
        onVolumeAddedFromUrl: initializePosition,
      }

      // Initialize Niivue with the volume list
      if (canvas.current) {
        nv = new Niivue(config);
        nv.attachToCanvas(canvas.current);
        Object.keys(colormaps).forEach((key) => { nv.addColormap(key, colormaps[key]); });
        await nv.loadVolumes(volumeList);
      }

      // Process and add the overlay
      // addOverlay(overlayURL);
    } catch (error) {
      console.error(error.message);
      setIsError(true);
    }
  };
  
  // Toggle overlay visibility
  const toggleOverlayVisibility = async () => {
    try {
      if (nv) {
        const overlayVolume = nv.volumes[1];
  
        if (overlayVolume) {
          const overlayVolumeData = nv.volumes[1].img;
          const uniqueValues = new Set();
          for (let i = 0; i < overlayVolumeData.length; i++) {
            uniqueValues.add(overlayVolumeData[i]);
          }
          nv.removeVolumeByIndex(1);
          nv.drawScene();
        }
        else {
          await nv.addVolumeFromUrl({
            url: overlayURL,
            colormap: overlayColor,
            opacity: 0.6,
          })
          nv.drawScene();
        }
      } 
    } catch (error) {
      console.error(error.message);
      setIsError(true);
    }
  };

  // Change overlay color
  const handleOverlayColorChange = (color) => {
    if (nv) {
      const overlayVolume = nv.volumes[1];
      if (overlayVolume) {
        nv.removeVolumeByIndex(1);
        if (overlayColor === "nih") {
          nv.addVolumeFromUrl({
            url: overlayURL,
            colormap: overlayColor,
            opacity: 0.6,
          })
        }
        else{
          nv.addVolumeFromUrl({
            url: overlayURL,
            colormap: overlayColor,
            cal_min: 46,
            cal_max: 48,
            opacity: 0.7,
          })
        }
        nv.drawScene();
        setOverlayColor(color);
      }
    }
  };

  useEffect(() => {
    loadNiftiFiles();
  }, [overlayColor]);

  return (
    <>
      {isError ? (
        <p>Error: The original scan file (or more files) does not exist.</p>
      ) : (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '5%', display: 'flex', flexDirection: 'row', gap: '2%' }} id="niivue_controls">
            <Button onClick={toggleOverlayVisibility}>Toggle Overlay</Button>
            <Select
              value={overlayColor}
              onChange={(e) => handleOverlayColorChange(e.target.value)}
            >
              <MenuItem value="custom_blue">Blue - ROI {roi}</MenuItem>
              <MenuItem value="custom_green">Green - ROI {roi}</MenuItem>
              <MenuItem value="custom_red">Red - ROI {roi}</MenuItem>
              <MenuItem value="nih">NIH - all ROIs</MenuItem>
            </Select>
            <Button onClick={() => showHeader()}>Show Header</Button>
          </div>
          <div style={{ height: '70%', width: '80%', alignItems: 'center', marginTop: '1%', marginBottom: '1%', marginLeft: '10%', marginRight: '10%',}} id="niivue">
            <canvas ref={canvas}/>
          </div>
          <div style={{ height: '15%', paddingLeft: '2%', paddingBottom: '2%'}} id="location">
            <div>Cursor Location:</div>
              <div>&nbsp;&nbsp;- In millimeters: ( -mm, -mm, -mm)</div>
              <div>&nbsp;&nbsp;- In voxels: (-, -, -)</div>
              <div>Values:</div>
              <div>&nbsp;&nbsp;- Raw image: -</div>
          </div>
        </div>
      )}
    </>
  );
};

export default NiiVue;
