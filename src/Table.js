import React from 'react';

function OccurrenceListItem(props) {
    return <div>{props.occurrence.scientificName}</div>
  }
  
  function OccurrenceResults(props) {
    const listItems = props.results.map((result) => (
       <li key={result.key} onClick={props.update.bind(this, result.taxonKey)}>
        <OccurrenceListItem occurrence={result} />
      </li>
      )
    );
    return (
      <ul>{listItems}</ul>
    );
  }
  
export default OccurrenceResults;