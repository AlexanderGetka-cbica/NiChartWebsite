import { React, useState } from 'react';
import { Flex, Text, Heading, Divider} from '@aws-amplify/ui-react';
import { SpareScoresInputStorageManager, SpareScoresDemographicStorageManager, JobList, launchSpareScores, getSpareScoresOutput, emptyBucketForUser, uploadToModule2, getCombinedCSV, downloadBlob } from '../../utils/uploadFiles.js'
import { getUseModule1Results, setUseModule1Results, setUseModule2Results, getModule2Cache, getModule1Cache } from '../../utils/NiChartPortalCache.js'
import styles from '../../styles/Portal_Module_2.module.css'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import Modal from '../Components/Modal';
import { ModelSelectionMenu } from './ModelSelectionMenu.js'
import { downloadTemplateDemographics } from '../../utils/uploadFiles.js';
import { CohortListing } from './CohortListing.js'
import { getModule0Cohorts, getModule0SelectedCohort } from '../../utils/NiChartPortalCache.js';

async function exportModule2Results(moduleSelector) {
    // Perform the caching transfer operation
    setUseModule2Results(true);
    await getSpareScoresOutput(false);
    let cachedResult = await getModule2Cache();
    if (Object.keys(cachedResult).length === 0) {
        alert("We couldn't export your results because there doesn't appear to be output from Module 2. Please generate the output first or upload the file to Module 3 manually.")
        return;
    }
    // Switch to module 3
    moduleSelector("module3");
}



function Module_2({moduleSelector}) {
  const [useModule1Cache, setUseModule1Cache] = useState(getUseModule1Results());
  
  // Modal dialog stuff for model selection
  const [modelSelectionModalOpen, setModelSelectionModalOpen] = useState(false);
  const handleModelSelectionOpen = () => setModelSelectionModalOpen(true);
  const handleModelSelectionClose = () => setModelSelectionModalOpen(false);
  
  async function disableModule1Results() {
      setUseModule1Results(false);
      setUseModule1Cache(false);
  }
  
  async function enableModule1Results() {
      setUseModule1Results(true);
      setUseModule1Cache(true);
      await getCombinedCSV(false);
      let cachedResult = await getModule1Cache();
      if (Object.keys(cachedResult).length === 0) {
         alert("We couldn't import your results because there doesn't appear to be output from Module 1. Please generate the output first or upload the file to Module 2 manually.")
         return;
      }
      await uploadToModule2(cachedResult.csv)
      

  }
  
  const [selectedCohort, setSelectedCohort] = useState(getModule0SelectedCohort());
  const [cohorts, setCohorts] = useState(getModule0Cohorts());

  const handleNewCohortSelected = (selected) => setSelectedCohort(selected);
  const handleCohortsUpdated = (cohorts) => setCohorts(cohorts);
    
  return (
    <div>
      <Heading level={1}>Module 2: Machine Learning</Heading>
      <p>Select a cohort which has completed processing in module 1, then click the "Generate SPARE scores" to run prediction. Please be advised that prediction jobs may take up to 1 minute to start, and should finish within 30 seconds after entering the "RUNNING" phase. When done, export your results to module 3 or download them directly. </p>
      <div className={styles.moduleContainer}>
          <Divider orientation="horizontal" />
          <Flex direction={{ base: 'column', large: 'row' }} maxWidth="100%" padding="1rem" width="100%" justifyContent="flex-start">
              
              <Flex justifyContent="flex-start" direction="column" width="33%">
                {/* <Heading level={3}>Upload Subject CSV</Heading>
                Upload your ROI volume CSV. Alternatively, import your results directly from Module 1. If you clear your output data from Module 1, you may need to import it again for your jobs in this module to succeed.
                { !getUseModule1Results() && (<SpareScoresInputStorageManager />)}
                { !getUseModule1Results() && (<Button variation="primary" colorTheme="info" loadingText="Importing..." onClick={async () => await enableModule1Results()}>Import from Module 1</Button>)}
                { getUseModule1Results() && (<p>Using results from Module 1!</p>)}
                { getUseModule1Results() && (<Button variation="primary" colorTheme="info" onClick={async () => await disableModule1Results()}>Upload a CSV Instead</Button>) }
                <Heading level={3}>Upload Demographic CSV</Heading>
                <p>This file should correspond to the scans present in the ROI CSV, and should contain demographic data. Scans should be on individual rows and IDs should correspond to the original T1 filename (without the extension). At minimum, your file should have columns for ID, Age (in years) and Sex (M or F).</p>
                <p>You may download an example template for this file with the "Download Template" button.</p>
                <SpareScoresDemographicStorageManager />
              */}
                <Heading level={3}>Select Cohort</Heading>
                <CohortListing emitNewSelection={(cohort) => handleNewCohortSelected(cohort)} emitCohorts={(cohorts) => handleCohortsUpdated(cohorts)} allowCreation={false} />
                    {/*<Button variation="primary" colorTheme="info" onClick={handleFileBrowserOpen}>Browse Uploads + Check QC</Button>*/}
                <Button loadingText="Selecting..." variation="primary" colorTheme="info" onClick={handleModelSelectionOpen}>Select Models</Button> 
                <Modal
                    open={modelSelectionModalOpen}
                    handleClose={handleModelSelectionClose}
                    title="Select SPARE models"
                    content="Check any number of models to use during SPARE score generation. This list will be expanded as we release new models."
                >
                    <ModelSelectionMenu category="module2" />
                </Modal>
                <Button loadingText="Submitting..." variation="primary"  onClick={async () => launchSpareScores() } >Generate SPARE scores</Button>
                {/* <Button loadingText="Downloading..." variation="primary" colorTheme="info" onClick={async () => downloadTemplateDemographics() }>Download Template</Button> */}
              </Flex>
              <Divider orientation="vertical" />
              <Flex direction="column" width="33%">
                <Heading level={3}>Jobs in Progress</Heading>
                SPARE score calculations that have been submitted will appear here. Finished jobs will be marked with a green smiley. Please wait for your jobs to finish before proceeding. If your job fails, please contact us and provide the job ID listed below.
                <JobList jobQueue="cbica-nichart-sparescores-jobqueue" />
              </Flex>
              <Divider orientation="vertical" />
              <Flex direction="column" width="33%">
                <Heading level={3}>Results</Heading>
                Here you can download the results (a merged CSV with ROI volumes, demographic info, and calculated SPARE scores for each scan).
                You can also export this file directly to module 3 for visualization.
                <Button loadingText="Downloading CSV..." variation="primary" onClick={async () => getSpareScoresOutput(true) } >Download SPARE score CSV</Button>
                <Button loadingText="Exporting..." variation="primary" colorTheme="info" onClick={async () => exportModule2Results(moduleSelector) } >Export to Module 3: Visualization</Button>
                <Button loadingText="Emptying..." variation="destructive" onClick={async () => emptyBucketForUser('cbica-nichart-outputdata', 'sparescores/')} >Clear All Data</Button>
              </Flex>
          </Flex>
      </div>
    </div>
  );
}

export default Module_2;