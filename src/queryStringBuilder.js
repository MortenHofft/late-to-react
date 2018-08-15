//import _ from 'lodash';
let _ = require('lodash');
let qs = require('qs');

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

    let querystring = 'q=';
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
        let fieldQuery = negated ? `!(${key}:` : `${key}:`;
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

console.log(esBuilder(
    {
        q: 'fungi',
        'backbone.taxonKey': 95, 
        "!issue": ['TAXON_MATCH_HIGHERRANK', 'b']
    }
));

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

// export default esBuilder;