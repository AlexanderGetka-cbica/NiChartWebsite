import React, { useState } from 'react';

export const ExpandableComponent = props => {

  const {defaultExpandedSize, minSize, maxSize, ...other} = props;

  const [expanded, setExpanded] = useState(true);
  const [expandedSize, setExpandedSize] = useState(defaultExpandedSize);

  const toggleExpand = () => {
    setExpanded(!expanded);
    setExpandedSize(expanded ? defaultExpandedSize : maxSize);
  };

  const style = {
    width: expanded ? `${expandedSize}%` : `${minSize}%`,
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    position: 'relative',
  };

  const tabStyle = {
    position: 'absolute',
    right: '0',
    top: '0',
    backgroundColor: '#f0f0f0',
    padding: '5px',
    cursor: 'pointer',
    borderTopLeftRadius: '5px',
  };

  return (
    <div style={style}>
      {expanded && (
        <div style={tabStyle} onClick={toggleExpand}>
          -
        </div>
      )}
      {!expanded && (
        <div style={tabStyle} onClick={toggleExpand}>
          +
        </div>
      )}
      {props.children}
    </div>
  );
};

export default ExpandableComponent;