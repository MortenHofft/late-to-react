import React from 'react';
import _ from 'lodash';

import displayName from './filters/fieldFormats';
import SearchBar from './filters/searchBar/SearchBar';

function getListItem(param, value, index, cb) {
    let DisplayName = displayName(param);
    return <li key={index} className="chip" onClick={() => cb(param, value, 'REMOVE')}><span>{param}</span><DisplayName id={value} /></li>
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
            <h4>Filters: {filters.length}</h4>
            <ul className="chips">
                {filters}
            </ul>
            <SearchBar />
        </div>
    );
    return element;
}

export default Summary;