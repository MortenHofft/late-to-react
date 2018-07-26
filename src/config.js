import displayName from './filters/fieldFormats';
import { speciesTemplate } from './filters/SuggestKey';

var widgets = {
    filters: {
        basisOfRecord: {
            options: {field: 'basisOfRecord', displayName: displayName('basisOfRecord'), showSuggestions: true, search: false }
        },
        taxonKey: {
            options: {field: 'taxonKey', displayName: displayName('taxonKey'), showSuggestions: false, autoComplete: {endpoint: 'https://api.gbif.org/v1/species/suggest', key: 'key', renderItem: speciesTemplate}}
        },
        datasetKey: {
            options: {field: 'datasetKey', displayName: displayName('datasetKey'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/dataset/suggest', key: 'key'}}
        },
        publishingOrg: {
            options: {field: 'publishingOrg', displayName: displayName('publishingOrg'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/organization/suggest', key: 'key'}}
        },
        institutionCode: {
            options: {field: 'institutionCode', displayName: displayName('institutionCode'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/occurrence/search/institutionCode'}}
        }
    }
};

let config = {
    widgets: widgets,
    activeWidgets: [
        {type: 'FILTER', field: 'taxonKey'}
    ]
};

export default config;
