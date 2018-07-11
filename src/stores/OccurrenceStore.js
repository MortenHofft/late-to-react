import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';
import * as OccurrenceActions from '../actions/OccurrenceActions';

class OccurrenceStore extends EventEmitter {
    constructor() {
        super();
        this.occurrences = [];
    }

    getAll() {
        return this.occurrences;
    }

    handleActions(action) {
        switch(action.type) {
            case 'OCCURRENCES_RECIEVED': 
                this.occurrences = action.data;
                this.emit('change');
                break;
            case 'FILTER_PARAM_UPDATED': 
                OccurrenceActions.getOccurrences({offset: 10});
                this.emit('change');
                break;
            default:
        }
    }
}

const occurrenceStore = new OccurrenceStore();
dispatcher.register(occurrenceStore.handleActions.bind(occurrenceStore));

export default occurrenceStore;