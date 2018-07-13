import React from 'react';

function Summary(props) {
    const style = {border: '1px solid tomato', padding: '10px'};
    const element = (
        <div style={style}>
            <h2>Summary</h2>
            <h4>Count: 10</h4>
            <div>
                <span>Filter</span>
                {JSON.stringify(props.filter, null, 2)}
            </div>
        </div>
    );
    return element;
}

export default Summary;