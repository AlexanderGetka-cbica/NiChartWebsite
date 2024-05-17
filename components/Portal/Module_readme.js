import React, { useState } from 'react'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import { Flex, Heading, Divider, Text } from '@aws-amplify/ui-react';
import styles from '../../styles/Portal_Module_1.module.css'

// Concept: This tab serves as an on-portal quick reference and helps clarify terminology.

function Module_readme({moduleSelector}) {
    const [fileBrowserModalOpen, setFileBrowserModalOpen] = useState(false);
    const [userReceivedWarning, setUserReceivedWarning] = useState(false);
  
    const handleFileBrowserOpen = () => setFileBrowserModalOpen(true);
    const handleFileBrowserClose = () => setFileBrowserModalOpen(false);
      
    return (
      <div>
        
        <Heading level={1}>NiChart Cloud Info</Heading>
        <div className={styles.moduleContainer}>
            <Divider orientation="horizontal" />
            <Flex direction={{ base: 'column', large: 'row' }} maxWidth="100%" padding="1rem" width="100%" justifyContent="flex-start">
                <Flex justifyContent="flex-start" direction="column" width="100%">
                    <Heading level={3}>How to Use</Heading>
                    <p>Start in Module 0 by creating a cohort to contain your patient data. This cohort will track your input scans and the related demographics information required for downstream analyses. You may create multiple cohorts to track them separately, which may be useful for some experiments.</p>
                    <p>Demographics CSV files are tabular files that contain your subject IDs and corresponding clinical information such as Age and Sex. We provide a template file you can download as an example.</p>
                    <p>Drag and drop NIfTI-format (.nii, .nii.gz) T1 MRI brain scans only, or .zip archives containing them. Please be aware that filenames with characters other than alphanumerics, hyphens or underscores will be changed automatically.</p>       
                    <p><b>Alternatively,</b> you may upload a .zip file containing your .nii.gz files. <b>We strongly recommend this option if you are uploading multiple scans, and require it if you are uploading more than 10 simultaneously.</b>. The system will unpack the archive which may take up to a minute after the upload succeeds (you may check using <b>Browse Uploads + Check QC</b>). Note that we cannot support archives greater than 10GB, but you can upload multiple archives.</p>
                    <p>Depending on your connection, you may see fluctuations in the displayed progress, or the download may appear to be stuck at 0%. Do not worry -- as long as the upload does not fail, it will correct itself. Your upload is complete when you see the check mark next to all files.</p>
                </Flex>
            </Flex>
        </div>
      </div>
    );
  }
  
  export default Module_readme;