import React, { Component } from 'react';
import { Router, Route, Switch, Link } from "react-router-dom";
import _ from 'lodash';
import objectHash from 'object-hash';
import queryString from 'query-string'

import history from './history'

import Gallery from './views/Gallery';
import Table from './views/Table';
import Split from './views/Split';
import Filter from './Filter';
import Summary from './Summary';

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
    this.updateWidgets = this.updateWidgets.bind(this);

    const query = queryString.parse(window.location.search);
    this.state = {
      filter: {
        query: query
      },
      widgets: [
        {
          type: 'FILTER',
          field: 'datasetKey'
        },
        {
          type: 'FILTER',
          field: 'country'
        },
        {
          type: 'FILTER',
          field: 'institutionCode'
        },
        {
          type: 'FILTER',
          field: 'taxonKey'
        }
      ]
    };
    this.state.filter.hash = objectHash(this.state.filter.query);

    history.listen((location, action) => {
      this.filterFromUrl(location);
    });
  }

  updateWidgets(widget) {
    let widgets = this.state.widgets.concat([{type: 'FILTER', field: widget}]);
    this.setState({widgets: widgets});
  }

  updateFilter(param, value, action) {
    console.log('update in ap.js');
    let paramValues = asArray(this.state.filter.query[param]);
    if (action === 'CLEAR') {
      paramValues = '';
    } else if (action === 'ADD') {
      paramValues = _.uniq(paramValues.concat(value));
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
          { this.state.widgets.length == 0 || <Filter filter={this.state.filter} updateFilter={this.updateFilter} widgets={this.state.widgets} updateWidgets={this.updateWidgets}/> }
          <main>
            <section>
              <button onClick={() => (this.updateWidgets('datasetKey'))}>add new widget</button>
              <Summary filter={this.state.filter} updateFilter={this.updateFilter} />
            </section>
            <section>
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
              <Switch>
                <Route exact path="/" render={(props) => <Table filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/gallery" render={(props) => <Gallery filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route path="/split" render={(props) => <Split filter={this.state.filter} updateFilter={this.updateFilter} />} />
                <Route component={NoMatch} />
              </Switch>
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