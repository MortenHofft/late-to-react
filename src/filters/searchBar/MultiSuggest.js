import _ from 'lodash';
import axios from 'axios';
import queryString from 'query-string';

var Promise = require('bluebird');

let CancelToken = axios.CancelToken;

function MultiSuggest() {
    let cancel;
    let suggester = function(searchText) {
        //first of - cancel pending requests for suggestions
        if (cancel !== undefined) {
            cancel();
        }
        //construct search query
        let filter = {limit: 2, q: searchText};
        let cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        });

        let datasetKey = axios.get('https://api.gbif.org/v1/dataset/suggest?' + queryString.stringify(filter), {
            cancelToken: cancelToken
        });

        let taxonKey = axios.get('https://api.gbif.org/v1/species/suggest?' + queryString.stringify(filter), {
            cancelToken: cancelToken
        });

        let basisOfRecordResults = [
            'PRESERVED_SPECIMEN',
            'FOSSIL_SPECIMEN',
            'LIVING_SPECIMEN',
            'OBSERVATION',
            'HUMAN_OBSERVATION',
            'MACHINE_OBSERVATION',
            'MATERIAL_SAMPLE',
            'LITERATURE',
            'UNKNOWN'].filter((e) => (e.toLowerCase().replace('_', ' ').startsWith(searchText.toLowerCase())));

        return Promise.props({
            datasetKey: datasetKey,
            taxonKey: taxonKey,
            basisOfRecord: basisOfRecordResults
        }).then(function(result) {
            let datasets = result.datasetKey.data.map((e) => ({type: 'VALUE', field: 'datasetKey', key: e.key, value: e.title}));
            let species = result.taxonKey.data.map((e) => {
                    let classification = '';
                    ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].forEach(function(rank){
                        if (e[rank]) {
                            if (classification !== '') {
                                classification += ' ❯ ';
                            }
                            classification += e[rank];
                        }
                    });
                    return {type: 'VALUE', field: 'taxonKey', key: e.key, value: e.scientificName, description: classification}
                }
            );
            let basisOfRecord = result.basisOfRecord.map((e) => ({type: 'VALUE', field: 'basisOfRecord', key: e, value: e}));
            let suggestions = _.concat(species, datasets, basisOfRecord);
            return suggestions;
        });
    };

    return suggester;
}

export default MultiSuggest;
