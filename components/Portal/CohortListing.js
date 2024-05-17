import React, { useState } from 'react';
import CohortInfoWidget from './CohortInfoWidget'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import { Divider } from '@aws-amplify/ui-react';

const placeholderFunction = () => {
  return null;
}


// Persistent List Component
export const CohortListing = ({updateSelection, updateCohorts}) => {

  const refreshCohortInfo = () => {

  }

  // State to manage the list of items and the selected item
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Function to add a new item
  const addItem = () => {
    const newItem = prompt('Enter the new cohort identifier:');
    if (newItem) {
      const isSanitary = /^[a-zA-Z0-9_]+$/.test(newItem);
      if (!isSanitary) {
        alert("Invalid cohort identifier: cohort IDs can only contain alphanumerics or underscores.")
      }
      else if (!items.includes(newItem)) {
        setItems(prevItems => [...prevItems, newItem]);
        setSelectedItem(newItem);
        updateCohorts(items);
        updateSelection(newItem);
        refreshCohortInfo();
      }
      else {
        alert("Invalid cohort identifier: already in use!")
      }

    }
  };
  
  // Function to handle item click
  const handleItemClick = (item) => {
    // Update the selected item state when an item is clicked
    updateSelection(item);
    setSelectedItem(item);
    refreshCohortInfo();
  };
  
  return (
    <div>
      <Button variation="primary" loadingText="Creating..." onClick={addItem}>Create New Cohort</Button>
      <Divider orientation='vertical'/>
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item)}>
            <Divider orientation='vertical'/>
            {(item == selectedItem)? <b>{item}</b> : item}

          </li>
        ))}
      </ul>
      {/* Conditionally render the RelatedComponent */}
      {/* selectedItem && <RelatedComponent selectedItem={selectedItem} /> */}
    </div>
  );
};

export default CohortListing;