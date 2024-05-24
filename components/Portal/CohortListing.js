import React, { useState, useEffect } from 'react';
import CohortInfoWidget from './CohortInfoWidget'
import { ResponsiveButton as Button } from '../Components/ResponsiveButton.js'
import { Divider } from '@aws-amplify/ui-react';
import { getModule0Cohorts, setModule0Cohorts, getModule0SelectedCohort, setModule0SelectedCohort } from '../../utils/NiChartPortalCache.js';
import { createCohort } from '../../utils/uploadFiles.js'
const placeholderFunction = () => {
  return null;
}


// Persistent List Component
export const CohortListing = ({emitNewSelection, emitCohorts, allowCreation}) => {

  const loadFromLocal = () => {
    const loaded = JSON.parse(window.localStorage.getItem("nichart_cohorts"))
    emitCohorts(loaded ? loaded : {})
    return loaded ? loaded : {};
  }
  // State to manage the list of items and the selected item
  const [items, setItems] = useState(loadFromLocal);
  const [selectedItem, setSelectedItem] = useState(getModule0SelectedCohort());

  useEffect(() => {
    window.localStorage.setItem("nichart_cohorts", JSON.stringify(items));
  }, [items])

  // Function to add a new item
  const addItem = () => {
    const newItem = prompt('Enter the new cohort identifier:');
    if (newItem) {
      const isSanitary = /^[a-zA-Z0-9_]+$/.test(newItem);
      const itemAlreadyExists = newItem in items;
      if (!isSanitary) {
        alert("Invalid cohort identifier: cohort IDs can only contain alphanumerics or underscores.")
      }
      else if (!itemAlreadyExists) {
        createCohort(newItem);
        setItems(prevItems => { return {...prevItems, [newItem] : {} }; });
        setSelectedItem(newItem);
        setModule0SelectedCohort(newItem);
        //updateCohorts(items);
        //updateSelection(newItem);
        setModule0Cohorts(items);
      }
      else {
        alert("Invalid cohort identifier: already in use!")
      }

    }
  };
  
  // Function to handle item click
  const handleItemClick = (item) => {
    // Update the selected item state when an item is clicked
    setModule0SelectedCohort(item);
    setSelectedItem(item);
    emitNewSelection(item);
  };

  console.log("items: ", items)
  console.log("keys: ", Object.keys(items))
  
  return (
    <div>
      {allowCreation ? <Button isDisabled={!allowCreation}  variation="primary" loadingText="Creating..." onClick={addItem}>Create New Cohort</Button> : null }
      <Divider orientation='vertical'/>
      <ul>
        {Object.keys(items).map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item)}>
            <Divider orientation='vertical'/>
            {(item == selectedItem)? <b>{item + ' - (current selection)'}</b> : <i>{item + ' - (click to select)'}</i>}

          </li>
        ))}
      </ul>
      {/* Conditionally render the RelatedComponent */}
      {/* selectedItem && <RelatedComponent selectedItem={selectedItem} /> */}
    </div>
  );
};

export default CohortListing;