import React, { Component } from 'react';

import FreeText from './filters/FreeText';
import DatasetTitle from './filters/DatasetTitle';
import SpeciesTitle from './filters/SpeciesTitle';
import PublisherTitle from './filters/PublisherTitle';
import displayName from './filters/fieldFormats';
import { speciesTemplate } from './filters/SuggestKey';

class Filter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="navDrawer">
          <section>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'basisOfRecord', displayName: displayName('basisOfRecord'), showSuggestions: true, search: false }}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'taxonKey', displayName: displayName('taxonKey'), showSuggestions: false, autoComplete: {endpoint: 'https://api.gbif.org/v1/species/suggest', key: 'key', renderItem: speciesTemplate}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'datasetKey', displayName: displayName('datasetKey'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/dataset/suggest', key: 'key'}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'publishingOrg', displayName: displayName('publishingOrg'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/organization/suggest', key: 'key'}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'institutionCode', displayName: displayName('institutionCode'), showSuggestions: true, autoComplete: {endpoint: 'https://api.gbif.org/v1/occurrence/search/institutionCode'}}}/>
          </section>
        </div>
    );
  }
}

export default Filter;


/*



*/

/*
list: all option, search option, pagination, counts, negation?
*/