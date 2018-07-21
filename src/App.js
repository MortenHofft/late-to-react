import React, { Component } from 'react';
import { Router, Route, Switch, Link } from "react-router-dom";
import history from './history'

import Gallery from './views/Gallery';
import Table from './views/Table';
import Split from './views/Split';
import Filter from './Filter';
import Summary from './Summary';
import _ from 'lodash';
import objectHash from 'object-hash';
import queryString from 'query-string'

require('./App.css');

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
    const query = queryString.parse(window.location.search);
    this.state = {
      filter: {
        query: query
      }
    };
    this.state.filter.hash = objectHash(this.state.filter.query);

    history.listen((location, action) => {
      this.filterFromUrl(location);
    });
  }

  updateFilter(param, value, action) {
    let paramValues = asArray(this.state.filter.query[param]);
    if (action === 'CLEAR') {
      console.log('clear');
      paramValues = '';
    } else if (action === 'ADD') {
      paramValues.push(value);
    } else if (action === 'REMOVE') {
      _.remove(paramValues, function(n) {
        return n === value;
      });
    } else {
      paramValues = [value];
    }
    let filter = _.merge({}, this.state.filter.query, {[param]: paramValues});
    if (!paramValues) {
      delete filter[param];
    }
    history.push(window.location.pathname + '?' + queryString.stringify(filter));
    // filter.hash = objectHash(filter);
    // this.setState({filter: filter});
  }

  filterFromUrl(location) {
    const filter = {};
    const query = queryString.parse(location.search);
    filter.hash = objectHash(query);
    filter.query = query;
    this.setState({filter: filter});
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <div className="menu"></div>
          <Filter filter={this.state.filter} updateFilter={this.updateFilter} />
          <main>
            <section>
              <Summary filter={this.state.filter} updateFilter={this.updateFilter} />
            </section>
            <section>
              <Switch>
                <Route exact path="/" render={(props) => <Table filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/gallery" render={(props) => <Gallery filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/split" render={(props) => <Split filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route component={NoMatch} />
              </Switch>
              <ul className="viewSelector">
                <li>
                  <Link to={{ pathname: '/', search: queryString.stringify(this.state.filter.query) }}>Table</Link>
                </li>
                <li>
                  <Link to={{ pathname: '/gallery', search: queryString.stringify(this.state.filter.query) }}>Gallery</Link>
                </li>
                <li>
                <Link to={{ pathname: '/split', search: queryString.stringify(this.state.filter.query) }}>Split</Link>
                </li>
              </ul>
            </section>
          </main>
        </div>
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