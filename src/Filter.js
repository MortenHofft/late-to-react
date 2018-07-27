import React, { Component } from 'react';

import FreeText from './filters/FreeText';

import config from './config';

class Filter extends Component {
  render() {
    console.log(this.props.widgets);
    let props = this.props;
    let widgets = this.props.widgets.map(function(widget){
      return <FreeText key={widget.type + '_' + widget.field} filter={props.filter} updateFilter={props.updateFilter} options={config.widgets.filters[widget.field].options}/>;
    });

    return (
        <div className="navDrawer">
          <section>
            {widgets}
          </section>
        </div>
    );
  }
}

export default Filter;

/*
<FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={config.widgets.filters.basisOfRecord.options}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'taxonKey', displayName: displayName('taxonKey'), showSuggestions: false, autoComplete: {endpoint: '//api.gbif.org/v1/species/suggest', key: 'key', renderItem: speciesTemplate}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'datasetKey', displayName: displayName('datasetKey'), showSuggestions: true, autoComplete: {endpoint: '//api.gbif.org/v1/dataset/suggest', key: 'key'}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'publishingOrg', displayName: displayName('publishingOrg'), showSuggestions: true, autoComplete: {endpoint: '//api.gbif.org/v1/organization/suggest', key: 'key'}}}/>
            <FreeText filter={this.props.filter} updateFilter={this.props.updateFilter} options={{field: 'institutionCode', displayName: displayName('institutionCode'), showSuggestions: true, autoComplete: {endpoint: '//api.gbif.org/v1/occurrence/search/institutionCode'}}}/>
*/