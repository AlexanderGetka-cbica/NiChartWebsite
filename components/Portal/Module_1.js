import React, { useState } from 'react';
import { Flex, Heading, Divider, Text } from '@aws-amplify/ui-react';
import styles from '../../styles/Portal_Module_1.module.css'
import { DefaultStorageManagerExample, JobList, getCombinedImageZip, getCombinedCSV, runModule1Jobs, resubmitModule1Jobs, emptyBucketForUser, uploadToModule2 } from '../../utils/uploadFiles.js'
import { setUseModule1Results, getModule1Cache } from '../../utils/NiChartPortalCache.js'
import { RemoteFileDisplay } from './RemoteFileDisplay.js'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import Modal from '../Components/Modal'
import { DragAndDropUploader, TestUpload } from './DragAndDropUploader.js';
import { ModelSelectionMenu } from './ModelSelectionMenu.js'
import { getModule0SelectedCohort, setModule0SelectedCohort, getModule0Cohorts, setModule0Cohorts } from '../../utils/NiChartPortalCache.js'
import { CohortListing } from '../Portal/CohortListing.js'

async function exportModule1Results(moduleSelector) {
    // Perform the caching transfer operation
    setUseModule1Results(true);
    await getCombinedCSV(false);
    let cachedResult = await getModule1Cache();
    if (Object.keys(cachedResult).length === 0) {
        alert("We couldn't export your results because there doesn't appear to be output from Module 1. Please generate the output first or upload the file to Module 2 manually.")
        return;
    }
    await uploadToModule2(cachedResult.csv);
    
    // Switch to module 2
    moduleSelector("module2");
}

async function getCSV () {
    
}

async function getImages () {
    
}



function Module_1({moduleSelector}) {
  const [fileBrowserModalOpen, setFileBrowserModalOpen] = useState(false);
  const [userReceivedWarning, setUserReceivedWarning] = useState(false);

  const handleFileBrowserOpen = () => setFileBrowserModalOpen(true);
  const handleFileBrowserClose = () => setFileBrowserModalOpen(false);

  const handleNewCohortSelected = (selected) => setSelectedCohort(selected);
  const handleCohortsUpdated = (cohorts) => setCohorts(cohorts);

    // Modal dialog stuff for model selection
    const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
    const handleModelSelectionOpen = () => setModelSelectionModalOpen(true);
    const handleModelSelectionClose = () => setModelSelectionModalOpen(false);

    const [selectedCohort, setSelectedCohort] = useState(getModule0SelectedCohort());
    const [cohorts, setCohorts] = useState(getModule0Cohorts());
  
  async function submitJobs () {
    if (!userReceivedWarning) {
        // Warn user to browse files first
        let userVerify = confirm("This is your first time submitting jobs during this session, but you may have other files on our processing server. Before continuing, we suggest that you double-check the files to be processed using the View Uploaded Files button. Would you like to view that menu now? Hit OK to view or Cancel to continue without viewing. (You will not be reminded again until you refresh the page.)")
        setUserReceivedWarning(true);
        if (userVerify) {
            handleFileBrowserOpen()
            return;
        }
    }
        await runModule1Jobs(selectedCohort);
    }
    
  return (
    <div>
      
      <Modal
                    open={modelSelectionModalOpen}
                    handleClose={handleModelSelectionClose}
                    title="Select image processing models"
                    content="Check any number of models to use for image feature extraction. This list will be expanded as we release new models."
                >
                    <ModelSelectionMenu category="module1" />
    </Modal>

      <Modal
            open={fileBrowserModalOpen}
            handleClose={handleFileBrowserClose}
            title="Uploads and Quality Control"
            content="Files you have uploaded are visible here. You can also see some basic status information (including initial QC results) and delete files from the server if desired."
      >
         <RemoteFileDisplay bucket="cbica-nichart-inputdata" prefix={selectedCohort} height="75%" />
      </Modal>
      

      <Heading level={1}>Module 1: Image Processing</Heading>
      <p>Select a cohort, select an image processing model to extract biomarkers, then click "Submit Jobs" to start. Please be advised that jobs may take up to 6 minutes to begin running and should finish within 1 minute after reaching the "RUNNING" phase. When done, you may export your results to module 2 or download them directly.</p>
      <div className={styles.moduleContainer}>
          <Divider orientation="horizontal" />
          <Flex direction={{ base: 'column', large: 'row' }} maxWidth="100%" padding="1rem" width="100%" justifyContent="flex-start">
              <Flex justifyContent="flex-start" direction="column" width="33%">
                    <Heading level={3}>Select Cohort</Heading>
                    <CohortListing emitNewSelection={(cohort) => handleNewCohortSelected(cohort)} emitCohorts={(cohorts) => handleCohortsUpdated(cohorts)} allowCreation={false}/>
                    <Button variation="primary" colorTheme="info" onClick={handleFileBrowserOpen}>Browse Uploads + Check QC</Button>
                <Button variation="primary" colorTheme="info" onClick={handleModelSelectionOpen}>Select Models</Button>
                <Button variation="primary" loadingText="Submitting..." onClick={async () => submitJobs()} >Submit Jobs</Button> 
            </Flex>
              {/*
              <Flex justifyContent="space-between" direction="column" width="33%">
                
              <Heading level={3}>Upload Input T1 Scans</Heading>
              <DefaultStorageManagerExample prefix={selectedCohort} />
               <Button variation="primary" colorTheme="info" onClick={handleFileBrowserOpen}>Browse Uploads + Check QC</Button>
              <Button variation="primary" colorTheme="info" onClick={handleModelSelectionOpen}>Select Models</Button>
              <Button variation="primary" loadingText="Submitting..." onClick={async () => submitJobs(selectedCohort)} >Submit Jobs</Button> 
              <Button variation="destructive" loadingText="Emptying..." onClick={async () => emptyBucketForUser('cbica-nichart-inputdata', selectedCohort)}>Remove All Data</Button>
              <p>Drag and drop NIfTI-format (.nii, .nii.gz) T1 MRI brain scans only, or .zip archives containing them. Please be aware that filenames with characters other than alphanumerics, hyphens or underscores will be changed automatically.</p>       
              <p><b>Alternatively,</b> you may upload a .zip file containing your .nii.gz files. <b>We strongly recommend this option if you are uploading multiple scans, and require it if you are uploading more than 10 simultaneously.</b>. The system will unpack the archive which may take up to a minute after the upload succeeds (you may check using <b>Browse Uploads + Check QC</b> below). Note that we cannot support archives greater than 10GB, but you can upload multiple archives.</p>
              <p>Depending on your connection, you may see fluctuations in the displayed progress, or the download may appear to be stuck at 0%. Do not worry -- as long as the upload does not fail, it will correct itself. Your upload is complete when you see the check mark next to all files.</p></Flex>
              */}
              <Divider orientation="vertical" /> 
              <Flex direction="column" width="33%">
                  <Heading level={3}>Jobs in Progress</Heading>
                  <Text>Biomarker extraction jobs that have been submitted will appear here. Please wait for them to finish before proceeding. Successful jobs will be marked with a green smiley . If your job fails, please contact us and provide the job ID listed below.</Text>
                  <JobList jobQueue="cbica-nichart-helloworld-jobqueue2"/>
                  <Button variation="primary" loadingText="Re-submitting..." onClick={async () => await resubmitModule1Jobs(selectedCohort)}>Re-submit Incomplete Jobs</Button>
        
              </Flex>
              <Divider orientation="vertical" />
              <Flex direction="column" width="33%">
                  <Heading level={3}>Results</Heading>
                  <Text>Results will be downloaded for all scans that have finished processing (those marked green on the job list). All other scans will continue running but will not be included unless you re-download after they complete. In addition to downloads, you can also directly export your results to the next module.</Text>
                  <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                  <Button loadingText="Downloading CSV..." variation="primary" onClick={async () => await getCombinedCSV(true) } >Download MUSE CSV</Button>
                  <Button loadingText="Downloading Images..." variation="primary"  onClick={async () => {alert("Please be aware that this operation might take some time while we prepare your images. Your download will be interrupted if you leave this page."); await getCombinedImageZip(true)} } >Download MUSE ROIs</Button>
                  <Button loadingText="Exporting..." variation="primary" colorTheme="info" onClick={async () => await exportModule1Results(moduleSelector) } >Export to Module 2: Machine Learning</Button>
                  <Button loadingText="Emptying..." variation="destructive" onClick={async () => emptyBucketForUser('cbica-nichart-outputdata', selectedCohort) }>Clear All Output Data</Button>
              </Flex>
          </Flex>
      </div>
    </div>
  );
}

export default Module_1;