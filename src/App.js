import React, { Component } from 'react';
import { Router, Route, Switch, NavLink } from "react-router-dom";
import _ from 'lodash';
import objectHash from 'object-hash';
import queryString from 'qs'

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
    this.filterFromUrl = this.filterFromUrl.bind(this);
    this.updateWidgets = this.updateWidgets.bind(this);
    this.hasWidget = this.hasWidget.bind(this);

    const query = queryString.parse(window.location.search, { ignoreQueryPrefix: true });
    this.state = {
      filter: {
        query: query
      },
      widgets: [
        { type: 'FILTER', field: 'datasetKey' }
      ],
      updateFilter: this.updateFilter,
      updateWidgets: this.updateWidgets,
      hasWidget: this.hasWidget
    };
    this.state.filter.hash = objectHash(this.state.filter.query);

    history.listen((location, action) => {
      this.filterFromUrl(location);
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

  updateFilter(param, value, action) {
    let paramValues = asArray(this.state.filter.query[param]);
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
    } else {
      paramValues = [value];
    }
    let filter = _.assign({}, this.state.filter.query, { [param]: paramValues });
    if (!paramValues) {
      delete filter[param];
    }
    history.push(window.location.pathname + '?' + queryString.stringify(filter, { indices: false, allowDots: true }));
  }

  filterFromUrl(location) {
    const filter = {};
    const query = queryString.parse(location.search, { ignoreQueryPrefix: true });
    filter.hash = objectHash(query);
    filter.query = query;
    this.setState({ filter: filter });
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
              <section className="viewSelectorWrapper">
                <ul className="viewSelector">
                  <li>
                    <NavLink to={{ pathname: '/', search: queryString.stringify(this.state.filter.query, { indices: false, allowDots: true }) }} exact={true} activeClassName="active">Table</NavLink>
                  </li>
                  <li>
                    <NavLink to={{ pathname: '/gallery', search: queryString.stringify(this.state.filter.query, { indices: false, allowDots: true }) }} activeClassName="active">Gallery</NavLink>
                  </li>
                </ul>
              </section>
              <Switch>
                <Route exact path="/" render={(props) => <Table filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/gallery" render={(props) => <Gallery filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/split" render={(props) => <Split filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route component={NoMatch} />
              </Switch>
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