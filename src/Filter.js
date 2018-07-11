import React, { Component } from 'react';

import FilterStore from './stores/FilterStore';
import * as FilterActions from './actions/FilterActions';

class Filter extends Component {
  constructor(props) {
    super(props);
    
    this.getQuery = this.getQuery.bind(this);
    this.fungiOnly = this.fungiOnly.bind(this);
    
    this.state = FilterStore.getQuery();
  }

  componentDidMount() {
    FilterStore.on('change', this.getQuery);
  }

  componentWillUnmount() {
    FilterStore.removeListener('change', this.getQuery);
  }

  fungiOnly() {
    FilterActions.updateParam('taxonKey', 5);
  }

  getQuery() {
    this.setState(FilterStore.getQuery());
  }

  render() {
    return (
        <div>
            <h4>Filter</h4>
            <button onClick={this.fungiOnly}>Set kingdom to fungi</button>
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
    );
  }
}

export default Filter;