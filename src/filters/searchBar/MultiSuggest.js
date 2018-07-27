import axios from 'axios';
import queryString from 'query-string';
import Promise from 'bluebird';

import config from '../../config';
let suggestConfig = config.suggest

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

        let suggestPromises = {};
        Object.keys(suggestConfig).forEach(function(field){
            let url = suggestConfig[field].endpoint + '?' + queryString.stringify(filter);
            suggestPromises[field] = axios.get(url, {
                cancelToken: cancelToken
            }).then(function(response){
                response.data = response.data.slice(0, filter.limit);
                if (suggestConfig[field].type === 'ENUM') {
                    return response.data.filter((e) => (e.toLowerCase().replace('_', ' ').startsWith(searchText.toLowerCase()))).slice(0,2);
                } else {
                    return response.data;
                }
            });
        });

        return Promise.props(suggestPromises)
            .then(function(result) {
                let list = [];
                Object.keys(result).forEach(function(field){
                    let mapper;
                    if (suggestConfig[field].type === 'ENUM' || suggestConfig[field].type === 'STRING') {
                        mapper = (e) => ({type: 'VALUE', field: field, key: e, value: e});
                    } else {
                        let description = suggestConfig[field].description || ((e) => (undefined));
                        mapper = (e) => ({type: 'VALUE', field: field, key: e[suggestConfig[field].key], value: e[suggestConfig[field].title], description: description(e)});
                    }
                    let mappedSuggestions = result[field].map(mapper);
                    list = list.concat(mappedSuggestions);
                });
                return list;
            });
    };

    return suggester;
}

export default MultiSuggest;
