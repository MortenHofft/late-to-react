import React, { Component } from 'react';
import { Router, Route, Switch, NavLink } from "react-router-dom";
import _ from 'lodash';
import objectHash from 'object-hash';
import queryString from 'qs'
import bodybuilder from 'bodybuilder'

import history from './history'

import { SearchContext } from './searchContext';

import Gallery from './views/Gallery';
import Table from './views/Table';
import Split from './views/Split';
import Filter from './Filter';
import Summary from './Summary';
import If from './filters/If';

require('./App.css');


// let searchManager = new SearchManager();
// console.log(searchManager.state);

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    this.getFilterFromUrl = this.getFilterFromUrl.bind(this);
    this.updateWidgets = this.updateWidgets.bind(this);
    this.hasWidget = this.hasWidget.bind(this);
    this.filterAsUrl = this.filterAsUrl.bind(this);

    const filter = this.getFilterFromUrl(window.location.search);
    console.log(filter);
    this.state = {
      filter: filter,
      widgets: [
        // { type: 'FILTER', field: 'taxonKey' },
        { type: 'FILTER', field: 'issue' }
      ],
      updateFilter: this.updateFilter,
      updateWidgets: this.updateWidgets,
      hasWidget: this.hasWidget
    };

    history.listen((location, action) => {
      this.setState({ filter: this.getFilterFromUrl(location.search) });
    });
  }

  updateWidgets(field, action) {
    let widgets = [];
    if (action === 'REMOVE') {
      widgets = _.filter(this.state.widgets, item => {return item.field !== field});
    } else {
      widgets = _.uniqBy(this.state.widgets.concat([{ type: 'FILTER', field: field }]), objectHash);
    }
    this.setState({ widgets: widgets });
  }

  hasWidget(field){
    return typeof _.find(this.state.widgets, {field: field}) !== 'undefined';
  }

  updateFilter(param, value, action, negated) {
    let type = negated ? 'must_not' : 'must'
    let paramValues = asArray(_.get(this.state, `filter.query.${type}[${param}]`, []));
    if (action === 'CLEAR') {
      paramValues = '';
    } else if (action === 'ADD') {
      paramValues = _.uniq(paramValues.concat(value));
    } else if (action === 'UPDATE') {
      paramValues = _.uniq([].concat(value));
    } else if (action === 'REMOVE') {
      _.remove(paramValues, function (n) {
        return n === value;
      });
      if (_.isEmpty(paramValues)) {
        paramValues = undefined;
      }
    } else {
      paramValues = [value];
    }
    // let filter = _.assign({}, this.state.filter.query, { [param]: paramValues });
    let filter = _.assign({}, this.state.filter.query);
    _.set(filter, `${type}.${param}`, paramValues);
    if (!paramValues) {
      delete filter[type][param];
    }
    if (_.isEmpty(filter[type])) {
      delete filter[type];
    }

    if (_.isEmpty(filter)) {
      history.push(window.location.pathname);
    } else {
      history.push(window.location.pathname + '?filter=' + this.filterAsUrl(filter));
    }
  }

  filterAsUrl(filter) {
    filter.must = _.omitBy(filter.must || {}, _.isEmpty);
    filter.must_not = _.omitBy(filter.must_not || {}, _.isEmpty);
    filter = _.omitBy(filter || {}, _.isEmpty);
    return encodeURIComponent(JSON.stringify(filter));
  }

  getFilterFromUrl(location) {
    const filter = {};
    const query = queryString.parse(location, { ignoreQueryPrefix: true });
    if (query.filter) {
      filter.query = JSON.parse(decodeURIComponent(query.filter));
    } else {
      filter.query = {};
    }
    filter.hash = objectHash(filter.query);
    console.log(filter);
    return filter;
  }

  render() {
    let showWidgetPanel = this.state.widgets.length > 0;
    return (
      <Router history={history}>
        <SearchContext.Provider value={this.state}>
          <div>
            <div className="menu"></div>
            <If show={showWidgetPanel}>
              <Filter filter={this.state.filter} updateFilter={this.updateFilter} widgets={this.state.widgets} updateWidgets={this.updateWidgets} />
            </If>
            <main className={showWidgetPanel ? 'showWidgetPanel': null}>
                <section>
                  <Summary filter={this.state.filter} updateFilter={this.updateFilter} />
                </section>
                <If show={true}>
                <section className="viewSelectorWrapper">
                  <ul className="viewSelector">
                    <li>
                      <NavLink to={{ pathname: '/', search: queryString.stringify({filter: this.filterAsUrl(this.state.filter.query)}, { indices: false, allowDots: true }) }} exact={true} activeClassName="active">Table</NavLink>
                    </li>
                    <li>
                      <NavLink to={{ pathname: '/gallery', search: queryString.stringify({filter: this.filterAsUrl(this.state.filter.query)}, { indices: false, allowDots: true }) }} activeClassName="active">Gallery</NavLink>
                    </li>
                  </ul>
                </section>
                <Switch>
                  <Route exact path="/" render={(props) => <Table filter={this.state.filter} updateFilter={this.updateFilter} />} />
                  <Route path="/gallery" render={(props) => <Gallery filter={this.state.filter} updateFilter={this.updateFilter} />} />
                  <Route path="/split" render={(props) => <Split filter={this.state.filter} updateFilter={this.updateFilter} />} />
                  <Route component={NoMatch} />
                </Switch>
                </If>
            </main>
          </div>
        </SearchContext.Provider>
      </Router>
    );
  }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>
      404 - No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

export default App;