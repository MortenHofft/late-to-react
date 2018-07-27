import dispatcher from '../dispatcher';
import FilterStore from '../stores/FilterStore';
import querystring from 'querystring';

export function getOccurrences(query) {
    console.log(FilterStore.getQuery());
    fetch('//api.gbif.org/v1/occurrence/search?' + querystring.stringify(FilterStore.getQuery(), { indices: false, allowDots: true }))
      .then(res => res.json())
      .then(
        (result) => {
            dispatcher.dispatch({
                type: 'OCCURRENCES_RECIEVED',
                data: result.results.map((e) => (e.scientificName))
            });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            dispatcher.dispatch({
                type: 'OCCURRENCES_RECIEVED',
                error: error
            });
        }
      )
}