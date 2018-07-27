import displayName from './filters/fieldFormats';

let suggest = {
    datasetKey: {
        type: 'KEY',
        endpoint: 'https://api.gbif.org/v1/dataset/suggest',
        key: 'key',
        title: 'title'
    },
    taxonKey: {
        type: 'KEY',
        endpoint: 'https://api.gbif.org/v1/species/suggest',
        key: 'key',
        title: 'scientificName',
        description: function(item){
            let classification = '';
            ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].forEach(function(rank){
                if (item[rank]) {
                    if (classification !== '') {
                        classification += ' ❯ ';
                    }
                    classification += item[rank];
                }
            });
            return classification;
        }
    },
    basisOfRecord: {
        type: 'ENUM',
        endpoint: 'http://api.gbif.org/v1/enumeration/basic/BasisOfRecord'
    },
    issue: {
        type: 'ENUM',
        endpoint: 'http://api.gbif.org/v1/enumeration/basic/OccurrenceIssue'
    },
    country: {
        type: 'ENUM',
        endpoint: 'http://api.gbif.org/v1/enumeration/basic/Country'
    },
    publishingOrg: {
        type: 'KEY',
        endpoint: 'https://api.gbif.org/v1/organization/suggest',
        key: 'key',
        title: 'title'
    },
    institutionCode: {
        type: 'STRING',
        endpoint: 'https://api.gbif.org/v1/occurrence/search/institutionCode'
    }
};

let widgets = {
    filters: {
        basisOfRecord: {
            options: {field: 'basisOfRecord', displayName: displayName('basisOfRecord'), showSuggestions: true, search: false }
        },
        taxonKey: {
            options: {field: 'taxonKey', displayName: displayName('taxonKey'), showSuggestions: false, autoComplete: suggest.taxonKey}
        },
        datasetKey: {
            options: {field: 'datasetKey', displayName: displayName('datasetKey'), showSuggestions: true, autoComplete: suggest.datasetKey}
        },
        publishingOrg: {
            options: {field: 'publishingOrg', displayName: displayName('publishingOrg'), showSuggestions: true, autoComplete: suggest.publishingOrg}
        },
        institutionCode: {
            options: {field: 'institutionCode', displayName: displayName('institutionCode'), showSuggestions: true, autoComplete: suggest.institutionCode}
        },
        country: {
            options: {field: 'country', displayName: displayName('country'), showSuggestions: true, autoComplete: suggest.country}
        }
    }
};

let config = {
    widgets: widgets,
    suggest: suggest
};

export default config;
