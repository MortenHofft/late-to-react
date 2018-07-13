import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Gallery from './views/Gallery';
import Table from './views/Table';
import Split from './views/Split';
import Filter from './Filter';
import Summary from './Summary';
import _ from 'lodash';
import objectHash from 'object-hash';
import queryString from 'query-string'

class App extends Component {
  constructor(props) {
    super(props);
    this.updateFilter = this.updateFilter.bind(this);
    const filter = queryString.parse(window.location.search);
    this.state = {
      filter: filter
    };
    this.state.filter.hash = objectHash(this.state.filter);
  }

  updateFilter(param, value) {
    console.log('filter updated', param, value);
    let filter = _.merge({}, this.state.filter, {[param]: value});
    filter.hash = objectHash(filter);
    console.log(filter);
    this.setState({filter: filter});
  }

  render() {
    return (
      <Router>
        <div>
          <div>
            <h4>App js</h4>
            <pre>{JSON.stringify(this.state.filter, null, 2)}</pre>
          </div>
          <ul>
            <li>
              <Link to="/">Table</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/split">Split</Link>
            </li>
          </ul>
          <hr />
          <Filter filter={this.state.filter} updateFilter={this.updateFilter} />
          <Summary filter={this.state.filter}/>
          <h3>Views</h3>
          <Switch>
            <Route exact path="/" render={(props) => <Table filter={this.state.filter} updateFilter={this.updateFilter} />} />
            <Route path="/gallery" render={(props) => <Gallery filter={this.state.filter} updateFilter={this.updateFilter} />} />
            <Route path="/split" render={(props) => <Split filter={this.state.filter} updateFilter={this.updateFilter} />} />
            <Route component={NoMatch} />
          </Switch>
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