import dispatcher from '../dispatcher';

export function updateParam(key, value) {
    dispatcher.dispatch({
        type: 'FILTER_PARAM_UPDATED',
        key: key,
        value: value
    });
}