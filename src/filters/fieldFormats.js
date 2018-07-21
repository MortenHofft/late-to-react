import React from 'react';
import DatasetTitle from './DatasetTitle';
import SpeciesTitle from './SpeciesTitle';
import PublisherTitle from './PublisherTitle';

function identity(props) {
    return <span>{props.id}</span>
}
function displayName(field) {
    switch(field) {
        case 'datasetKey': 
            return DatasetTitle;
        case 'taxonKey': 
            return SpeciesTitle
        case 'publishingOrg': 
            return PublisherTitle
        default:
            return identity;
    }
}

export default displayName