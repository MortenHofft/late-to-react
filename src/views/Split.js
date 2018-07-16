import React from 'react';
import Gallery from './Gallery';
import Table from './Table';

function Summary(props) {
    const style = {border: '1px solid deepskyblue', padding: '10px', margin: '10px'};
    const element = (
        <div style={style}>
            <h4>Split view</h4>
            <div style={style}>
                <Table filter={props.filter} updateFilter={props.updateFilter} location={props.location}/>
            </div>
            <div style={style}>
                <Gallery filter={props.filter} updateFilter={props.updateFilter} location={props.location}/>
            </div>
        </div>
    );
    return element;
}

export default Summary;