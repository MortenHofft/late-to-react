import React, { Component } from 'react';
import _ from 'lodash';
import queryString from 'query-string'
import humanize from 'humanize-num'

import Suggest from './Suggest'
import If from './If'

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

    this.state = { value: '' };
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
    let filter = _.merge({}, this.props.filter, { limit: 0, facet: 'datasetKey' });
    delete filter.hash;
    let p1 = fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter));
    this.setState({loading: true});
    p1.then(res => res.json())
      .then(
        (result) => {
          this.setState({ facets: result.facets[0].counts, count: result.count });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      )
    filter.datasetKey = undefined;
    let p2 = fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter));
    p2.then(res => res.json())
      .then(
        (result) => {
          this.setState({ multiFacets: result.facets[0].counts, total: result.count });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      );
    Promise.all([p1, p2])
      .then(() => {this.setState({loading: false})})
      .catch(() => {this.setState({loading: false})});
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  formatOption(id, count, total, action, active) {
    action = action || 'ADD';
    let progress;
    count = count || 0;
    total = total || count;
    let width = {width: (100*count/total) + '%'};
    progress = (
      <div className="percentageBar"><div style={width}></div></div>
    );
    
    return (
      <li key={id} className={active ? 'active' : 'disabled'}>
        <label onClick={() => this.props.updateFilter('datasetKey', id, action)}>
          <input type="checkbox" />
          <div className="filter__facet">
            <div className="filter__facet__title">
              <div className="u-ellipsis u-semibold u-medium"><DatasetTitle id={id} /></div><If show={count > 0}><div className="u-secondaryTextColor u-small">{ humanize(count) }</div></If>
            </div>
            {progress}
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
    let count = this.state.count;
    let total = this.state.total;
    let formatOption = this.formatOption;
    
    let facets = asArray(this.state.facets);
    let datasets = asArray(this.props.filter.datasetKey);
    if (facets.length > 0) {
      facets = _.keyBy(facets, 'name');
    }
    datasets = datasets.map(function (e) {
      return formatOption(e, _.get(facets, e + '.count'), count, 'REMOVE', true);
    });
    let multiFacets = asArray(this.state.multiFacets);
    _.remove(multiFacets, function (e) {
      return asArray(props.filter.datasetKey).indexOf(e.name) !== -1;
    });
    multiFacets = multiFacets.map(function (e) {
      return formatOption(e.name, e.count, total, 'ADD', datasets.length == 0);
    });
    let selectedCount = asArray(this.props.filter.datasetKey).length;
    
    return (
      <div>
        <div className="filter">
          <If show={this.state.loading}><div className="loader"></div></If>
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
              <If show={selectedCount > 0}>
                <p className="u-semibold">{selectedCount} selected</p>
              </If>
              <If show={selectedCount == 0}>
                <p>&nbsp;</p>
              </If>
              <button className="u-actionTextColor" onClick={() => this.props.updateFilter('datasetKey', null, 'CLEAR')}>All</button>
            </div>
            <div className="filter__options">
              <ul>
                {datasets}
                {multiFacets}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FreeText;