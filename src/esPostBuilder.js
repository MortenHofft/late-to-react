import bodybuilder from 'bodybuilder';
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
  let builder = bodybuilder();
  _.forOwn(query.must, function(value, field){
      console.log(field);
      if (field === 'taxonKey') {
          field = 'backbone.taxonKey'
      }
    builder.filter('terms', field, [].concat(value));
  });
  _.forOwn(query.must_not, function(value, field){
    builder.filter('terms', field, [].concat(value));
  });
  return builder.build();
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

export default {
    esBuilder, esParser
};