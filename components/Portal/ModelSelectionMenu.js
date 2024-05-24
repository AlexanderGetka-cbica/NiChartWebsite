import React, { useState } from "react";

export const ModelSelectionMenu = ({category}) => {
  // State with list of all checked item
  const [checked, setChecked] = useState([]);
  let checkList = [];
  if (category == "module2") {checkList = ["Alzheimer's Disease risk score + Brain Age prediction"];}
  else {checkList = ["DLMUSE "]}

  let unavailable = [];
  if (category == "module2") {unavailable = ["Cardiovascular Disease risk score (coming soon!)", "Diabetes risk score (coming soon!)"]}

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  // Ugly hack to get default checked
  // TODO: Replace with elegant solution from DDB, which already exists
  checked += " Alzheimer's Disease risk score + Brain Age prediction ";
  checked += " DLMUSE "
  return (
    <div className="model-selector">
      <div className="checkList">
        <div className="title">Available Models:</div>
        <div className="list-container">
          {checkList.map((item, index) => (
            <div key={index}>
              <input value={item} type="checkbox" onChange={handleCheck} checked={isChecked(item)} />
              <span className={isChecked(item)}>{item}</span>
            </div>
            
          ))}
          <div className="title">Currently Unavailable:</div>
          {unavailable.map((item, index) => (
            <div key={index}>
              <input value={item} disabled={true} type="checkbox" onChange={handleCheck} />
              <span className={isChecked(item)}>{item}</span>
            </div>
            
          ))}
        </div>
      </div>
      <br />
      <div hidden>
        <p>{`Items checked are: ${checkedItems}`}</p>
      </div>
    </div>
  );
}

export default ModelSelectionMenu;