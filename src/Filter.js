import React, { Component } from 'react';

import FreeText from './filters/FreeText';
import DatasetTitle from './filters/DatasetTitle';
import SpeciesTitle from './filters/SpeciesTitle';

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="navDrawer">
          <section>
            <h4>Filters</h4>
          </section>
          <section>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'datasetKey', displayName: DatasetTitle}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'taxonKey', displayName: SpeciesTitle}}/>
          </section>
        </div>
    );
  }
}

export default Filter;


/*
  <pre>{JSON.stringify(this.props.filter, null, 2)}</pre>
  <button onClick={() => this.props.updateFilter('datasetKey', '84d26682-f762-11e1-a439-00145eb45e9a')}>update filter to Fungal records</button>
*/

/*
list: all option, search option, pagination, counts, negation?
*/