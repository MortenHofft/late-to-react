import React, { Component } from 'react';
import _ from 'lodash';
import queryString from 'query-string'
import Suggest from './Suggest'

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
    this.formatOption = this.formatOption.bind(this);
    this.onSelect = this.onSelect.bind(this);

    this.state = { value: 'hej' };
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
    let filter = _.merge({}, this.props.filter, { limit: 0, facet: 'datasetKey', facetMultiselect: true });
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ facets: result.facets[0].counts });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      )
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  formatOption(id, count) {
    return (
      <li key={id}>
        <label onClick={() => this.props.updateFilter('datasetKey', id, 'ADD')}>
          <input type="checkbox" />
          <div className="filter__facet">
            <div className="filter__facet__title">
              <div className="u-ellipsis u-semibold u-medium"><DatasetTitle id={id} /></div><div className="u-secondaryTextColor u-small">{count}</div>
            </div>
            <div className="percentageBar"><div></div></div>
          </div>
        </label>
      </li>
    );
  }

  onSelect(val) {
    console.log('selected', val);
    this.setState({value: ''});
  }

  render() {
    let props = this.props;
    let formatOption = this.formatOption;
    let datasets = asArray(this.props.filter.datasetKey).map(function (e) {
      //return <li key={e} onClick={() => props.updateFilter('datasetKey', e, 'REMOVE')}><DatasetTitle id={e} /> </li>
      return formatOption(e);
    });
    let facets = asArray(this.state.facets);
    _.remove(facets, function (e) {
      return asArray(props.filter.datasetKey).indexOf(e.name) !== -1;
    });
    facets = facets.map(function (e) {
      return formatOption(e.name, e.count);
    });
    return (
      <div>
        <div className="filter">
          <div className="loader"></div>
          <div className="filter__content">
            <div className="filter__header">
              <h3 className="ellipsis">Datasets</h3>
              <div>
                <a><i className="material-icons u-secondaryTextColor">more_vert</i></a>
              </div>
            </div>
            <div className="filter__info">
              <dl className="u-secondaryTextColor u-upperCase u-small">
                <dt>1.302</dt><dd>Datasets</dd>
                <dt>26</dt><dd>in view</dd>
              </dl>
            </div>
            <div className="filter__search">
              <i className="material-icons u-secondaryTextColor">search</i>
              <Suggest endpoint="https://api.gbif.org/v1/occurrence/search/institutionCode" onSelect={this.onSelect} value={this.state.value} />
            </div>
            <div className="filter__actions u-secondaryTextColor u-upperCase u-small">
              <p className="u-semibold">2 selected</p>
              <a>All</a>
            </div>
            <div className="filter__options">
              <ul>
                {datasets}
                {facets}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FreeText;