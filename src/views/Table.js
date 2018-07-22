import React, { Component } from 'react';
import queryString from 'query-string'
import _ from 'lodash';

import displayName from '../filters/fieldFormats';

require('./table.css');

class Table extends Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.getRow = this.getRow.bind(this);
    this.bodyScroll = this.bodyScroll.bind(this);
    this.fieldConfig = {
      fields: [
        {
          name: 'scientificName',
          width: 200
        },
        {
          name: 'datasetKey',
          width: 200
        },
        {
          name: 'year',
          width: 100
        }
      ]
    };
    this.state = {
      page: {limit: 50, offset: 0},
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
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  }

  updateResults() {
    let filter = _.merge({}, this.props.filter.query, this.state.page);
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({occurrences: result.results});
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

  getHeaders() {
    return this.fieldConfig.fields.map(function(field){
      return <th key={field.name}><span>{field.name}</span></th>;
    });
  }

  getRow(item) {
    return this.fieldConfig.fields.map(function(field){
      let DisplayName = displayName(field.name);
      return <th key={field.name}><DisplayName id={item[field.name]} /></th>;
    });
  }

  bodyScroll() {
    console.log(5);
    document.getElementById('headerdiv').scrollLeft = document.getElementById('bodyTable').scrollLeft
  }

  render() {
    let getRow = this.getRow;
    const tbody = this.state.occurrences.map(function(e, i){
      return (
        <tr key={i}>{getRow(e)}</tr>
      );
    });
    let headers = this.getHeaders();

    return (
      <div>
        <div>
        <table>
            <thead id="headerdiv">
              <tr>
                {headers}
              </tr>
            </thead>
          </table>
          <table>
            <tbody id="bodyTable" onScroll={ this.bodyScroll }>
              {tbody}
            </tbody>
          </table>
        </div>
        <button onClick={() => this.nextPage()}>next</button>
        <div>
          <span>Filter</span>
          {JSON.stringify(this.props.filter.query, null, 2)}
          {JSON.stringify(this.state.page , null, 2)}
        </div>
      </div>
    );
  }
}

export default Table;