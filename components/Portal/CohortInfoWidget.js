import React, { useState } from 'react';



// Related Component (You can define this separately)
const CohortInfoWidget = ({ selectedItem }) => {
    
    const refresh = () => {

        return
    }

    

    // This component will receive the selected item as props and can render accordingly
    return (
      <div>
        <h2>Cohort: {selectedItem} </h2>
        <p>Scans: </p>
        <p>Demographics: </p>
        <p></p>

        {/* You can render more content based on the selected item */}
      </div>
    );
  };