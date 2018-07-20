import React from 'react';
import _ from 'lodash';

function getListItem(param, value, index, cb) {
    return <li key={index} className="chip" onClick={() => cb(param, value, 'REMOVE')}><span>{param}</span><span>{value}</span></li>
}
function Summary(props) {
    const style = {padding: '10px'};
    let filters = [];
    let index = 0;
    Object.keys(props.filter.query).forEach(function(param){
        if (_.isArray(props.filter.query[param])) {
            props.filter.query[param].forEach(function(value){
                filters.push(getListItem(param, value, index++, props.updateFilter));
            });
        } else {
            filters.push(getListItem(param, props.filter.query[param], index++, props.updateFilter));
        }
    });
    const element = (
        <div style={style}>
            <h4>Count: {filters.length}</h4>
            <ul className="chips">
                {filters}
            </ul>
        </div>
    );
    return element;
}

export default Summary;