import React, { Component } from 'react';
import _ from 'lodash';
import queryString from 'query-string'

import DatasetTitle from './DatasetTitle';

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

class FreeText extends Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.updateFacets = this.updateFacets.bind(this);

    this.state = {value: ''};
  }

  componentDidMount() {
    this.updateFacets();
    // OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateFacets();
    }
  }

  updateFacets() {
    let filter = _.merge({}, this.props.filter, {limit: 0, facet: 'datasetKey', facetMultiselect: true});
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({facets: result.facets[0].counts});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({error: true});
        }
      )
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    let props = this.props;
    let datasets = asArray(this.props.filter.datasetKey).map(function(e){
      return <li key={e} onClick={() => props.updateFilter('datasetKey', e, 'REMOVE')}><DatasetTitle id={e}/> </li>
    });
    let facets = asArray(this.state.facets);
    _.remove(facets, function(e){
      return asArray(props.filter.datasetKey).indexOf(e.name) !== -1;
    });
    facets = facets.map(function(e){
      return <li key={e.name} onClick={() => props.updateFilter('datasetKey', e.name, 'ADD')}><DatasetTitle id={e.name}/> {e.count}</li>
    });
    return (
        <div className="filter">
            <div className="loader"></div>
            <div className="filter__content">
              <h4>Datasets</h4>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <button disabled={ this.state.value === '' } onClick={() => this.props.updateFilter('datasetKey', this.state.value, 'ADD')}>addFilter</button>
              <ul>
                {datasets}
              </ul>
              <ul>
                {facets}
              </ul>
            </div>
        </div>
    );
  }
}

export default FreeText;