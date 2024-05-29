import React, { useState } from 'react'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import { ExpandableComponent } from '../Components/Expandable.js'
import Modal from '../Components/Modal'
import { RemoteFileDisplay } from './RemoteFileDisplay.js'
import { Flex, Heading, Divider, Text, Collection } from '@aws-amplify/ui-react';
import styles from '../../styles/Portal_Module_1.module.css'
import { DragAndDropUploader, TestUpload } from './DragAndDropUploader.js';
import { DefaultStorageManagerExample, getCombinedImageZip, getCombinedCSV, runModule1Jobs, resubmitModule1Jobs, uploadToModule2 } from '../../utils/uploadFiles.js'
import { setModule0Cohorts, getModule0Cohorts, getModule0SelectedCohort } from '../../utils/NiChartPortalCache.js'
import { CohortListing } from './CohortListing.js'
import { SpareScoresInputStorageManager, SpareScoresDemographicStorageManager, getSpareScoresOutput, emptyBucketForUser,  downloadBlob } from '../../utils/uploadFiles.js'
import { createCohort, downloadTemplateDemographics } from '../../utils/uploadFiles.js'

// Concept: User creates cohorts/datsets, uploads the corresponding files.
// These files are placed in subdirectories corresponding 
// to the cohort ID.
// These cohort IDs can then be used from subsequent 
// modules to specify which images to process.
// Cohorts are temporary (deletion lifecycle rule). 
// OPTIONAL: Allow users to mark as persistent?
// Module 0 can also display basic diagnostic informatio
// about the uploaded demographic CSV and QC info.
// Ideally, this will serve both as a uploader step to
// simplify modules 1 and 2, AND
// it will help perform any necessary input checks
// before the user gets there.



function Module_0({moduleSelector}) {
    const [fileBrowserModalOpen, setFileBrowserModalOpen] = useState(false);
    const [userReceivedWarning, setUserReceivedWarning] = useState(false);
  
    const handleFileBrowserOpen = () => setFileBrowserModalOpen(true);
    const handleFileBrowserClose = () => setFileBrowserModalOpen(false);
      
    const [cohorts, setCohorts] = useState(getModule0Cohorts());
    const [selectedCohort, setSelectedCohort] = useState(getModule0SelectedCohort());

    const handleNewCohortSelected = (cohort) => {
        setSelectedCohort(cohort);
    }

    const handleCohortsUpdated = (cohorts) => {
        setCohorts(cohorts);
        setModule0Cohorts(cohorts);
    }

    const removeCohort = (cohort) => {
        if (cohort in cohorts) {
            const tmp = cohorts;
            delete tmp[cohort];
            handleCohortsUpdated(tmp);
            
        } else {alert("Cohort doesn't exist.")}
        setSelectedCohort("");
    }

    function clearCohorts() {
        setModule0Cohorts({});
        setCohorts({});
    }

    function onUploadDemographicsSuccess() {

    }


    return (
      <div>
        <Modal
              open={fileBrowserModalOpen}
              handleClose={handleFileBrowserClose}
              
              title="Uploads and Quality Control"
              content="Files you have uploaded are visible here. You can also see some basic status information (including initial QC results) and delete files from the server if desired."
        >
           <RemoteFileDisplay bucket="cbica-nichart-inputdata" prefix={selectedCohort} height="75%" />
        </Modal>
        
        <Heading level={1}>Module 0: Data Management</Heading>
        <Text>Create or delete cohorts and upload associated scans and demographics here. At least one scan is required for biomarker extraction in module 1, and a corresponding demographics CSV is required for running predictions in module 2. You can browse your uploads for a given cohort (and view quality check results) with the "Browse Uploads + Check QC" button. When you are satisfied with your data, proceed to Module 1 using the navigation bar on the left.</Text>
        <div className={styles.moduleContainer}>
            <Divider orientation="horizontal" />
            <Flex direction={{ base: 'column', large: 'row' }} maxWidth="100%" padding="1rem" width="100%" justifyContent="flex-start">
                {/*<ExpandableComponent defaultExpandedSize={50} minSize={0} maxSize={50}>
                <Flex justifyContent="flex-start" direction="column">
                    <Heading level={3}>How to Use</Heading>
                    <p>Start by creating a cohort to contain your patient data. This cohort will track your input scans and the related demographics information required for downstream analyses. Click the cohort name to view. You may create multiple cohorts to track them separately, which may be useful for some experiments.</p>
                    <p>Drag and drop NIfTI-format (.nii, .nii.gz) T1 MRI brain scans only, or .zip archives containing them. Please be aware that filenames with characters other than alphanumerics, hyphens or underscores will be changed automatically.</p>       
                    <p><b>Alternatively,</b> you may upload a .zip file containing your .nii.gz files. <b>We strongly recommend this option if you are uploading multiple scans, and require it if you are uploading more than 10 simultaneously.</b>. The system will unpack the archive which may take up to a minute after the upload succeeds (you may check using the <b>Browse Uploads + Check QC</b> button). Note that we cannot support archives greater than 10GB, but you can upload multiple archives.</p>
                    <p>Depending on your connection, you may see fluctuations in the displayed progress, or the download may appear to be stuck at 0%. Do not worry -- as long as the upload does not fail, it will correct itself. Your upload is complete when you see the check mark next to all files.</p>
                </Flex>
                <Divider orientation='vertical' />
                </ExpandableComponent>*/}
                
                <Flex justifyContent="flex-start" direction="column" width="50%">
                <Heading level={3}>Manage Cohorts</Heading>
                <Text>Click to select a cohort and upload both scans and demographics CSV to the right.</Text>
                <CohortListing emitNewSelection={(cohort) => handleNewCohortSelected(cohort)} emitCohorts={(cohorts) => handleCohortsUpdated(cohorts)} allowCreation={true}/>
                <Divider orientation='horizontal' />
                    <Heading level={3}>Clear Data</Heading>
                    <Text>You can immediately delete any uploaded data from our servers by using these buttons. <b>WARNING: This is a destructive action</b> that will delete <b>all</b> files you have uploaded. Otherwise, your data will remain in our cloud storage for a maximum of 36 hours. Cohorts will remain (empty) unless individually deleted.</Text>
                    <Button variation="destructive" loadingText="Emptying..." onClick={async () => emptyBucketForUser('cbica-nichart-inputdata')}>Delete All Input Data</Button>
                <   Button loadingText="Emptying..." variation="destructive" onClick={async () => emptyBucketForUser('cbica-nichart-outputdata') }>Delete All Output Data</Button>
                </Flex>

                <Divider orientation='vertical' />
                <Flex justifyContent="flex-start" direction="column" width="50%">
                <Collection 
                    items={Object.entries(cohorts)}
                    type="list"
                    direction="column"
                    gap="10px"
                    wrap="nowrap"
                >
                {([key, item], index) => (
                    <>
                    <div hidden={key != selectedCohort}>
                    <Flex direction={{ base: 'column' }} width="100%" justifyContent="flex-start">
                    <Heading level={3}>Selected cohort: {key}</Heading>
                    <Heading level={5}>Upload Input T1 Scans</Heading>
                    <Text>Upload T1-weighted NIfTI-format (.nii.gz, .nii) brain scans. If uploading multiple scans we <b>highly recommend</b> putting your scans into a .zip archive and uploading that instead. Our system handles this automatically.</Text>
                    <DefaultStorageManagerExample prefix={key}/>
                    <Button variation="primary" colorTheme="info" onClick={handleFileBrowserOpen}>Browse Uploads + Check QC</Button> 
                    {/*<DragAndDropUploader prefix={item} />*/}
                    <Heading level={5}>Upload Demographics CSV</Heading>
                    <Text>You can use the "Download Template CSV" button to see a valid example. We <b>strongly recommend</b> checking your column headers for proper capitalization. Age should be an integer and Sex should be M or F. To replace your demographics file, simply upload another. The previous will be deleted.</Text>
                    <SpareScoresDemographicStorageManager prefix={key}></SpareScoresDemographicStorageManager>
                    <Button loadingText="Downloading..." variation="primary" colorTheme="info" onClick={async () => downloadTemplateDemographics() }>Download Template CSV</Button>
                    <Button variation="destructive" loadingText="Emptying..." onClick={async () => { emptyBucketForUser('cbica-nichart-inputdata', key); removeCohort(key); alert("Cohort data deleted.") }}>Delete Cohort</Button>
                    </Flex>
                    </div> 
                    </>
                    )}
                </Collection>

               </Flex>
            </Flex>
        </div>
      </div>
    );
  }
  
  export default Module_0;