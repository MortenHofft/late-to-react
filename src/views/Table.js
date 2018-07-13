import React, { Component } from 'react';
import queryString from 'query-string'
import _ from 'lodash';

class Table extends Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.state = {
      page: {limit: 5, offset: 0},
      occurrences: []
    }
  }

  componentDidMount() {
    this.updateResults();
    // OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter !== this.props.filter) {
      this.updateResults();
    }
  }

  updateResults() {
    let filter = _.merge({}, this.props.filter, this.state.page);
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({occurrences: result.results.map((e) => (e.scientificName))});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({error: true});
        }
      )
  }

  nextPage() {
    this.setState({page: {offset: this.state.page.offset + this.state.page.limit, limit: this.state.page.limit}}, this.updateResults);
  }

  updateFilter(key, value) {
    this.props.updateFilter(key, value);
  }

  render() {
    const listItems = this.state.occurrences.map(function(e, i){
      return (
        <li key={i}>{e}</li>
      );
    });

    return (
      <div>
        <h4>Table component</h4>
        <ul>{listItems}</ul>
        <button onClick={() => this.nextPage()}>next</button>
        <div>
          <span>Filter</span>
          {JSON.stringify(this.props.filter, null, 2)}
          {JSON.stringify(this.state.page , null, 2)}
        </div>
      </div>
    );
  }
}

export default Table;