//import _ from 'lodash';
let _ = require('lodash');
let qs = require('qs');

let config = require('./config').default;

function asArray(value) {
    if (_.isUndefined(value)) {
      return [];
    } else if (_.isArray(value)) {
      return value;
    } else {
      return [value];
    }
}

function getValue(val) {
    if (_.isString(val)) {
        return `"${val}"`;
    } else {
        return val;
    }
}

function esBuilder(query) {
    query = query || {};
    query = JSON.parse(JSON.stringify(query));

    let querystring = '';
    if (query.q) {
        querystring += query.q;
        delete query.q;
    }
    
    Object.keys(query).forEach(function(key){
        let a = query[key];
        let negated = false;
        if (key.startsWith('!')) {
            key = key.substr(1);
            negated = true;
        }
        key = _.get(config.widgets.filters[key], 'options.esField') || key;
        let fieldQuery = negated ? `(!${key}:` : `${key}:`;
        if (_.isArray(a)) {
            fieldQuery += `(${_.join(a.map(getValue), ' OR ')})`;
        } else {
            fieldQuery += getValue(a);
        }
        if (querystring.length > 2) {
            querystring += ' AND ';
        }
        if (negated) {
            fieldQuery += ')';
        }
        querystring += fieldQuery;
    });
    return querystring;
}

function removeQuotes(str) {
    return str.startsWith('"') ? str.substr(1, str.length - 2) : str;
}

function parseValue(str) {
    if (str.startsWith('(')) {
        str = str.substr(1, str.length - 2);
        let parts = str.split(' OR ');
        return parts.map(removeQuotes);
    } else {
        return removeQuotes(str);
    }
}

function esParser(str) {
    let query = {};
    let parts = str.split(' AND ');
    parts.forEach(function(part){
        let negated = false;
        if (part.startsWith('(!')) {
            negated = true;
            part = part.substr(1, part.length - 3);
        }
        let colonIndex = part.indexOf(':');
        let key = 'q';
        if (colonIndex !== -1) {
            key = part.substr(0, colonIndex);
        }
        let values = parseValue(part.substr(colonIndex + 1));
        query[key] = values;
    });
    return query;
}

let a = 'fungi AND backbone.taxonKey:95 AND (!issue:("TAXON_MATCH_HIGHERRANK" OR "ZERO_COORDINATE")) AND issue:("COUNTRY_COORDINATE_MISMATCH")';
console.log(esParser(a))
// console.log(esBuilder(
//     {
//         q: 'fungi',
//         'backbone.taxonKey': 95, 
//         "!issue": ['TAXON_MATCH_HIGHERRANK', 'ZERO_COORDINATE'],
//         "issue": ['COUNTRY_COORDINATE_MISMATCH']
//     }
// ));

// console.log(qs.stringify({
//     q: 'fungi',
//     'backbone.taxonKey': 95, 
//     "issue": ['TAXON_MATCH_HIGHERRANK', 'b']
// }, { indices: false, allowDots: true }));

// let b = qs.stringify({
//     q: 'fungi',
//     'backbone.taxonKey': 95, 
//     "issue": ['TAXON_MATCH_HIGHERRANK', 'b']
// });
// console.log(qs.parse(b, { indices: false, allowDots: true }));

export default {
    esBuilder, esParser
};