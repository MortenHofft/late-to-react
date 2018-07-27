/**
 * Lav en ny med parametre om endpoint
 * Den har ansvar for at lave api kald og sørge for at anullere gamle kald. Undgå duplicates? samle flere forspørgsler i een? konstruerer requests
 * måske kommunikerer den også med routes/search strings/url og konstruerer filtre derefter.
 * holder også styr på filtre? Evt separat enhed.
 * 
 * urlmanager (ikke nødvendig. man kan have en en app uden states)
 * Sørger for at synkronisere filter og component state med url'en search params. route håndteres andetsteds.
 * 
 * filter - det centrale filter som bruges af alle andre. Giver vel mening at have som seperat enhed
 * 
 * search manager - koordinerer søgninger, så aggregater/facets samles i et kald. Kan findes i 2 udgaver, til at bruge GBIF API eller ES. Så bruger kan sige, facet=xyz, facetLimit:10, facetOffset: 20, bucketSize: 10
 * hvis syntax ikke er understøttes, så smid fejl. I så fald bruger man et filter der ikke understøttes af ens API. 
 * 
 * 
 * 
 * 
 * ideelt så kan search filtre og tabel/galleri/map/charts også bruges i en single route app eller en angular routed app. 
 * Man sætter blot et filter ind og en tabel ind der hvor det skal bruges? det virker egnetlig lidt ureliastisk. 
 * Måske er det snarere hele pakken og så kan man rykke view til en parameter. Kibana betragter view som en del af path (hash routing dog)
 */

import objectHash from 'object-hash';
import queryString from 'qs'
import _ from 'lodash';

import history from './history'

function asArray(value) {
    if (_.isUndefined(value)) {
        return [];
    } else if (_.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}

export default class SearchManager {
    constructor() {
        this.updateFilter = this.updateFilter.bind(this);
        this.filterFromUrl = this.filterFromUrl.bind(this);
        this.updateWidgets = this.updateWidgets.bind(this);

        const query = queryString.parse(window.location.search, { ignoreQueryPrefix: true });
        this.filter = {
            query: query
        };
        this.filter.hash = objectHash(this.filter.query);

        this.widgets = [
            {
                type: 'FILTER',
                field: 'datasetKey'
            }
        ];

        history.listen((location, action) => {
            this.filterFromUrl(location);
        });
    }

    updateWidgets(widget) {
        let widgets = this.widgets.concat([{ type: 'FILTER', field: widget }]);
        this.widgets = widgets;
    }

    updateFilter(param, value, action) {
        let paramValues = asArray(this.filter.query[param]);
        if (action === 'CLEAR') {
            paramValues = '';
        } else if (action === 'ADD') {
            paramValues = _.uniq(paramValues.concat(value));
        } else if (action === 'UPDATE') {
            paramValues = _.uniq([].concat(value));
        } else if (action === 'REMOVE') {
            _.remove(paramValues, function (n) {
                return n === value;
            });
        } else {
            paramValues = [value];
        }
        let filter = _.assign({}, this.filter.query, { [param]: paramValues });
        if (!paramValues) {
            delete filter[param];
        }
        history.push(window.location.pathname + '?' + queryString.stringify(filter, { indices: false, allowDots: true }));
    }

    filterFromUrl(location) {
        const filter = {};
        const query = queryString.parse(location.search, { ignoreQueryPrefix: true });
        filter.hash = objectHash(query);
        filter.query = query;
        this.filter = filter;
    }
}