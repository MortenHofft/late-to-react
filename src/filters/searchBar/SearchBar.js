import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import queryString from 'query-string';
import ReactAutocomplete from 'react-autocomplete';

require('./SearchBar.css');

const suggestions = [
  {
    field: 'Field',
    description: 'Description',
    disabled: true
  },
  {
    field: 'datasetKey',
    description: 'From what dataset does the occurrence come from'
  },
  {
    field: 'taxonKey',
    description: 'What taxon should the occurrence be or has as a parent'
  }
];
['q','w','e','r','t','y','u','i','a','s','d','f','g','h','j','k','z','x','c','v','b','n','m'].forEach(function(e){
  suggestions.push({field: e, description: 'something goes here'});
});

const menuStyle = {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  border: '1px solid #ddd',
  background: 'white',
  padding: '2px 0',
  fontSize: '90%',
  position: 'fixed',
  overflow: 'auto',
  maxHeight: '50%',
  zIndex: '998',
};

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = { suggestions: suggestions, value: props.value };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  getSuggestions(searchText) {
    this.setState({
      suggestions: [
        {}
      ]
    });
  }

  onChange(val) {
    this.setState({ value: val });
    // this.getSuggestions(val);
  }

  onSelect(val) {
    this.setState({ value: val });
    this.props.onSelect(val);
  }

  render() {
    let renderItem = function (item, highlighted) {
      return (
        <div key={item.field} style={{ backgroundColor: highlighted ? '#d3dce0' : 'transparent' }}>
          <div>{item.field}</div>
          <div>{item.description}</div>
        </div>
      )
    };

    return (
      <div className="searchBar">
        <ReactAutocomplete
          open={this.state.value}
          autoHighlight={false}
          shouldItemRender={(item, str) => (item.field.startsWith(str) || item.disabled)}
          wrapperProps={{className: 'searchBarSuggest'}}
          isItemSelectable={item => !item.disabled}
          wrapperStyle={{}}
          items={this.state.suggestions}
          getItemValue={item => item.field}
          renderItem={renderItem}
          inputProps={{ placeholder: 'Search' }}
          value={this.state.value}
          menuStyle={menuStyle}
          onChange={e => this.onChange(e.target.value)}
          onSelect={value => this.onSelect(value)}
        />
      </div>
    );
  }
}

export default SearchBar;