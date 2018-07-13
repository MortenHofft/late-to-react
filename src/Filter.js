import React, { Component } from 'react';

import FilterStore from './stores/FilterStore';
import * as FilterActions from './actions/FilterActions';

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <h4>Filter</h4>
            <pre>{JSON.stringify(this.props.filter, null, 2)}</pre>
            <button onClick={() => this.props.updateFilter('datasetKey', '84d26682-f762-11e1-a439-00145eb45e9a')}>update filter to Fungal records</button>
        </div>
    );
  }
}

export default Filter;