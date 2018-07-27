import React, { Component } from 'react';
import _ from 'lodash';
import queryString from 'query-string'
import humanize from 'humanize-num'

import Suggest from './SuggestKey'
import If from './If'

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function identity(props) {
  return <span>{props.id}</span>
}
class FreeText extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.updateFacets = this.updateFacets.bind(this);
    this.formatOption = this.formatOption.bind(this);
    this.onSelect = this.onSelect.bind(this);

    this.state = _.merge({}, { value: '', expanded: true, displayName: identity }, this.props.options);
  }

  componentDidMount() {
    this.updateFacets();
    // OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch 
    /*
    Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
    in FreeText (at SearchBar.js:247)
    in div (at ModalBlocker.js:13)
    in div (at ModalBlocker.js:12)
    in div (at ModalBlocker.js:10)
    in Modal (at ModalBlocker.js:9)
    in ModalBlocker (at SearchBar.js:246)
    */
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateFacets();
    }
  }

  updateFacets() {
    let promises = [];
    let filter = _.merge({}, this.props.filter.query, { limit: 0, facetLimit: 5, facet: this.props.options.field });
    delete filter.hash;

    if (this.props.filter.query[this.props.options.field]) {
      let p1 = fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter));
      promises.push(p1);
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
    }


    if (this.props.options.showSuggestions) {
      filter[this.props.options.field] = undefined;
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
      promises.push(p2);
    }

    Promise.all(promises)
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
    
    let Formater = this.state.displayName;
    return (
      <li key={id} className={active ? 'active' : 'disabled'}>
        <label onClick={() => this.props.updateFilter(this.props.options.field, id, action)}>
          <input type="checkbox" />
          <div className="filter__facet">
            <div className="filter__facet__title">
              <div className="u-ellipsis u-semibold u-medium"><Formater id={id} /></div><If show={count > 0}><div className="u-secondaryTextColor u-small">{ humanize(count) }</div></If>
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
    this.props.updateFilter(this.props.options.field, val, 'ADD')
  }

  render() {
    let props = this.props;
    let count = this.state.count;
    let total = this.state.total;
    let formatOption = this.formatOption;
    
    let facets = asArray(this.state.facets);
    let selectedValues = asArray(this.props.filter.query[this.props.options.field]);
    if (facets.length > 0) {
      facets = _.keyBy(facets, 'name');
    }
    selectedValues = selectedValues.map(function (e) {
      return formatOption(e, _.get(facets, e + '.count'), count, 'REMOVE', true);
    });
    let multiFacets = asArray(this.state.multiFacets);
    _.remove(multiFacets, function (e) {
      return asArray(props.filter.query[props.options.field]).indexOf(e.name) !== -1;
    });
    multiFacets = multiFacets.map(function (e) {
      return formatOption(e.name, e.count, total, 'ADD', selectedValues.length === 0);
    });
    let selectedCount = asArray(this.props.filter.query[this.props.options.field]).length;
    
    let searchBlock = '';
    if (this.state.expanded && this.props.options.search !== false) {
      searchBlock = (
        <div className="filter__search">
          <i className="material-icons u-secondaryTextColor">search</i>
          <Suggest  endpoint={this.props.options.autoComplete.endpoint} 
                    onSelect={this.onSelect} value={this.state.value}
                    itemKey={this.props.options.autoComplete.key}
                    itemTitle={this.props.options.autoComplete.title}
                    itemDescription={this.props.options.autoComplete.description}
                    renderItem={this.props.options.autoComplete.renderItem}
                    />
        </div>
      );
    }
    return (
      <div>
        <div className="filter">
          <If show={this.state.loading}><div className="loader"></div></If>
          <div className="filter__content">
            <div className="filter__header">
              <h3 className="ellipsis">{this.props.options.field}</h3>
              <div>
                <If show={this.state.expanded}>
                  <a onClick={() => this.setState({expanded: false})}><i className="material-icons u-secondaryTextColor">expand_less</i></a>
                </If>
                <If show={!this.state.expanded}>
                  <a onClick={() => this.setState({expanded: true})}><i className="material-icons u-secondaryTextColor">expand_more</i></a>
                </If>
              </div>
            </div>
            <div className="filter__info">
              <dl className="u-secondaryTextColor u-upperCase u-small">
                <dt>1.302</dt><dd>Datasets</dd>
                <dt>26</dt><dd>in view</dd>
              </dl>
            </div>
            {searchBlock}
            <div className="filter__actions u-secondaryTextColor u-upperCase u-small">
              <If show={selectedCount > 0}>
                <p className="u-semibold">{selectedCount} selected</p>
              </If>
              <If show={selectedCount === 0 && this.state.expanded}>
                <p>All selected</p>
              </If>
              <If show={selectedCount > 0}>
                <button className="u-actionTextColor" onClick={() => this.props.updateFilter(this.props.options.field, null, 'CLEAR')}>All</button>
              </If>
            </div>
            <div className="filter__options">
              <ul>
                {selectedValues}
                <If show={this.state.expanded && this.props.options.showSuggestions}>
                  {multiFacets}
                </If>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FreeText;