import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Favicons from '../components/Favicons/Favicons';
import Sidebar from '../components/Portal/Sidebar';
import Module_0 from '../components/Portal/Module_0';
import Module_1 from '../components/Portal/Module_1';
import Module_2 from '../components/Portal/Module_2';
import Module_3 from '../components/Portal/Module_3';
import Module_readme from '../components/Portal/Module_readme'
import NiChartAuthenticator from '../components/Portal/NiChartAuthenticator';
import styles from '../styles/Portal.module.css'
import { Heading, Button, Flex, Authenticator } from '@aws-amplify/ui-react';
import awsExports from '../utils/aws-exports';

function Portal() {

  // State to track the selected module
  const [selectedModule, setSelectedModule] = useState('module0'); 
  // Function to handle module selection
  const handleModuleSelection = (module) => {
    setSelectedModule(module);
  };
  
  return (
  <div>
  <NiChartAuthenticator>
  {({ signOut, user }) => (
    <div className={styles.container}>
      <Head>
        <title>NiChart | Portal</title>
        <Favicons />
      </Head>
      <Header user={user} signOut={signOut}/>
      <div className={styles.portalPage}>
        <Sidebar handleModuleSelection={handleModuleSelection}/>
        <div className={styles.modulePage}>
            {selectedModule === 'modulereadme' && <Module_readme moduleSelector={handleModuleSelection} />}
            {selectedModule === 'module0' && <Module_0 moduleSelector={handleModuleSelection} />}
            {selectedModule === 'module1' && <Module_1 moduleSelector={handleModuleSelection} />}
            {selectedModule === 'module2' && <Module_2 moduleSelector={handleModuleSelection} />}
            {selectedModule === 'module3' && <Module_3 moduleSelector={handleModuleSelection} />}
            <div>
              <h4> By using NiChart Cloud, you agree to share your uploaded image data with the University of Pennsylvania for processing only. You are responsible for ensuring your activities on this site, including but not limited to data uploads, are in compliance with your organization's data policies. Please see the <a href="/about" >About page</a> for more details. All data is deleted from our cloud storage after a maximum period of 36 hours after creation. </h4>
            </div>
        </div>
      </div> 
      <Footer />
    </div>
  )}
  </NiChartAuthenticator>
  </div>
  );
}

export default Portal;

