const csvFilePath = __dirname + '/fungi.csv';
const datasetTitles = require('./datasetTitles');
const _ = require('lodash');


var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200'
});

let parse = require('csv-parse'),
    transform = require('stream-transform');
    fs = require('fs');

// let options = {delimiter: '\t'};
let rs = fs.createReadStream(csvFilePath);
parser = parse({delimiter: '\t', columns: true, relax: true, quote: false});

var idMap = {};
let ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
transformer = transform(function(row, next){
    // work with row

    // idMap[row.gbifid] = idMap[row.gbifid] ? idMap[row.gbifid]+1 : 1;
    // call next when finished
    Object.keys(row).forEach(function(key){
        if (row[key] === '') {
            delete row[key];
        }
    });
    row.location = {
        lat: row.decimalLatitude,
        lon: row.decimalLongitude
    };

    let backbone = [];
    ranks.forEach(function(rank){
        if (row[rank]) {
            row[rank + 'Key'] = _.toSafeInteger(row[rank + 'Key'])
            backbone.push({
                taxonKey: row[rank + 'Key'],
                name: row[rank]
            });
        }
    });
    
    backboneMap = {};
    backbone.forEach(function(e, i){
        e['depthKey_' + i] = e.taxonKey;
        // e.depth = i;
        e.rank = ranks[i].toUpperCase();
        e[ranks[i] + 'Key'] = e.taxonKey;
        backboneMap[i] = e;
    });
    row.taxonKeys = _.filter([row.kingdomKey, row.phylumKey, row.classKey, row.orderKey, row.familyKey, row.genusKey, row.speciesKey], _.identity);
    
    let issue = row.issue && row.issue.length > 0 ? row.issue.split(';') : undefined;
    var o = {
        "gbifID": row.gbifID,
        "scientificName": row.scientificName,
        /*"kingdom": row.kingdom,
        "kingdomKey": row.kingdomKey,
        "phylum": row.phylum,
        "phylumKey": row.phylumKey,
        "class": row.class,
        "classKey": row.classKey,
        "order": row.order,
        "orderKey": row.orderKey,
        "family": row.family,
        "familyKey": row.familyKey,
        "genus": row.genus,
        "genusKey": row.genusKey,
        "species": row.species,
        "speciesKey": row.speciesKey,*/
        "taxonKey": _.toSafeInteger(row.taxonKey),
        "rank": row.taxonRank,
        // "taxonKeys": row.taxonKeys,
        "backbone": backbone,
        // "backboneMap": backboneMap,
        "issue": issue,
        "datasetKey": row.datasetKey,
        "datasetTitle": datasetTitles[row.datasetKey] || 'Unknown',
        "countryCode": row.countryCode,
        "month": _.toSafeInteger(row.month),
        "recordedby": row.recordedBy,
        "hasCoordinate": row.hasCoordinate,
        "decimalLatitude": row.decimalLatitude,
        "decimalLongitude": row.decimalLongitude,
        "coordinate_point": row.decimalLatitude && row.decimalLongitude ? row.location : undefined,
        "elevation": row.elevation,
        "eventDate": row.eventDate,
        "locality": row.locality,
        "basisOfRecord": row.basisOfRecord,
        "institutionCode": row.institutionCode,
        "year": _.toSafeInteger(row.year),
        "evendate": row.eventDate,
        "media_type": ['STILL_IMAGE'],
        "imageIdentifier": 'http://collections.nmnh.si.edu/media/index.php?irn=7005184'
    };
    // console.log(o);
    // next();
    addToIndex(o).then(function(){
        next();
    }).catch(function(err){
        console.log(err);
    });

}, {parallel: 1}, function(err, b){
    console.log('error', err);
    console.log(b);
    console.log(Object.keys(idMap).length);
    Object.keys(idMap).forEach(function(e){
        if (idMap[e] > 1) {
            console.log(e + ' ' + idMap[e]);
        }
    });
    doBulkIndex(bulk);
});

rs.pipe(parser).pipe(transformer);


var bulk = [];
async function addToIndex(row) {
    bulk.push(row);
    if (bulk.length < 12800) {
        // console.log('bulk below threshold', bulk.length);
        return;
    } else {
        try {
            for (var j = 0; j < bulk.length; j++) {
                var item = bulk[j];
                idMap[item.gbifID] = idMap[item.gbifID] ? idMap[item.gbifID] + 1 : 1;
            }
            var whatever = await doBulkIndex(bulk);
            bulk = [];
            return;
        } catch(err){
            console.log('error', err);
        }

    }
}



function doBulkIndex(list) {

    return new Promise((resolve, reject) => {
        var actions = [];
        list.forEach(function(e){
            actions.push({index: {_index: 'occurrences2', _type: 'fungi'}});
            actions.push(e);
        });
        // console.log(actions);
        client.bulk({
            body: actions
        }, function (err, resp) {
            if (err) {
                console.log(err);
            }
            // for (var j = 0; j < resp.items.length; j++) {
            //     if (resp.items[j].index.status != 201) {
            //         console.log(resp.items[j]);
            //     }
            // }
            // setTimeout(function(){
            //     resolve();
            // }, 100);

            var backoff = false;
            if (resp && resp.errors) {
                //check for 429  - too many requests
                for (var j = 0; j < resp.items.length; j++) {
                    if (resp.items[j].index.status == 429) {
                        console.log('Too many requests - back off');
                        backoff = true;
                    }
                }
            }
            if (backoff) {
                setTimeout(function(){
                    resolve();
                }, 1000);
            } else {
                resolve();
            }
        });
    });
}