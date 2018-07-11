import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';

class FilterStore extends EventEmitter {
    constructor() {
        super();
        this.query = {
            limit: 10, 
            offset: 0
        };
    }

    getQuery(key) {
        if (key) {
            return this.query[key];
        } else {
            return this.query;
        }
    }

    handleActions(action) {
        switch(action.type) {
            case 'FILTER_PARAM_UPDATED': 
                this.query[action.key] = action.value;
                console.log(action);
                this.emit('change');
                break;
            default:
        }
    }
}

const filterStore = new FilterStore();
dispatcher.register(filterStore.handleActions.bind(filterStore));

export default filterStore;