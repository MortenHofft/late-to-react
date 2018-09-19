import React from 'react';
import _ from 'lodash';

import displayName from './filters/fieldFormats';
import SearchBar from './filters/searchBar/SearchBar';

function getListItem(param, value, index, cb, negated) {
    let DisplayName = displayName(param);
    let className = 'chip' + (negated ? ' chip--not' : '');
    return <li key={index} className={className} onClick={() => cb(param, value, 'REMOVE', negated)}><span>{param}</span><DisplayName id={value} /></li>
}
function Summary(props) {
    const style = {margin: '10px 0 10px 10px'};
    let filterChips = [];
    let negatedFilterChips = [];
    let index = 0;
    
    Object.keys(props.filter.query.must).forEach(function(param){
        if (_.isArray(props.filter.query.must[param])) {
            props.filter.query.must[param].forEach(function(value){
                filterChips.push(getListItem(param, value, index++, props.updateFilter));
            });
        } else {
            filterChips.push(getListItem(param, props.filter.query.must[param], index++, props.updateFilter));
        }
    });
    Object.keys(props.filter.query.must_not).forEach(function(param){
        if (_.isArray(props.filter.query.must_not[param])) {
            props.filter.query.must_not[param].forEach(function(value){
                negatedFilterChips.push(getListItem(param, value, index++, props.updateFilter, true));
            });
        } else {
            negatedFilterChips.push(getListItem(param, props.filter.query.must_not[param], index++, props.updateFilter, true));
        }
    });
    const element = (
        <div style={style}>
            <SearchBar filter={props.filter} updateFilter={props.updateFilter}/>
            <ul className="chips">
                {filterChips}
            </ul>
            <ul className="chips">
                {negatedFilterChips}
            </ul>
        </div>
    );
    return element;
}

export default Summary;