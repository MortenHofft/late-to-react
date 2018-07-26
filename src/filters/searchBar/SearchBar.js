import React, { Component } from 'react';
import _ from 'lodash';
import ReactAutocomplete from 'react-autocomplete';

import MultiSuggest from './MultiSuggest';
import ModalFilter from '../ModalFilter';
import If from '../If';

require('./SearchBar.css');

function asArray(value) {
  if (_.isUndefined(value)) {
    return [];
  } else if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

const ARROW_DOWN_KEY = 40;
const ARROW_UP_KEY = 37;
const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const fieldSuggestions = [
  {
    type: 'FIELD',
    field: 'datasetKey',
    description: 'From what dataset does the occurrence come from'
  },
  {
    type: 'FIELD',
    field: 'taxonKey',
    description: 'What taxon should the occurrence be or has as a parent'
  }
];

const menuStyle = {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  border: '1px solid #ddd',
  background: 'white',
  padding: '2px 0',
  fontSize: '90%',
  overflow: 'auto',
  maxHeight: '60vh',
  zIndex: '998',
};

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.suggester = MultiSuggest();

    this.state = { fieldSuggestions: fieldSuggestions, value: props.value, showModal: false };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.setState({modalFilter: this.props.filter})
    }
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
    if (val.length > 2) {
    this.suggester(val)
      .then((suggestions) => {
        this.setState({suggestions: suggestions});
      })
      .catch((err) => (console.log(err)));
    } else {
      this.setState({suggestions: []});
    }

  }

  onSelect(item) {
    let val = item.field;
    this.setState({ value: val });
    if (item.type === 'FIELD') {
      console.log('Open select widget for: ' + val);
      this.setState({showModal: true});
    } else if (item.type === 'VALUE') {
      this.props.updateFilter(item.field, item.key, 'ADD');
    }
    
    this.setState({forceOpen: false, value: ''});
  }

  onKeyUp(e) {
    if (e.keyCode === ARROW_DOWN_KEY || e.keyCode === ARROW_UP_KEY) {
      this.setState({forceOpen: true});
    } else if(e.keyCode === ESCAPE_KEY) {
      this.setState({forceOpen: false });
    } else if(e.keyCode === ENTER_KEY && e.target.value && e.target.value !== '') {
      this.props.updateFilter('q', e.target.value, 'ADD');
      // this.setState({forceOpen: false, value: '' });
    }
  }

  onBlur() {
    this.setState({forceOpen: false, value: '', suggestions: []});
  }

  handleShow() {
    this.setState({showModal: true});
  }
  
  handleHide() {
    this.setState({showModal: false});
  }

  render() {
    let renderItem = function (item, highlighted) {
      switch (item.type) {
        case 'HEADER' :
          return (
            <div key={ 'col_' + item.name} className="disabled">
              <div>{item.col1}</div>
              <div>{item.col2}</div>
            </div>
          );
        case 'FIELD' :
          return (
            <div key={ 'field_' + item.field} style={{ backgroundColor: highlighted ? '#d3dce0' : undefined }}>
              <div><span className="fieldName">{item.field}</span></div>
              <div className="fieldDescription">{item.description}</div>
            </div>
          );
        default :
        return (
          <div key={ 'value_' + item.field + '_' + item.key} className="reverse" style={{ backgroundColor: highlighted ? '#d3dce0' : undefined }}>
            <div>
              <div className="fieldValue">
                {item.value}
              </div>
              <div className="fieldDescription">
                {item.description}
              </div>
            </div>
            <div><a className="fieldName">{item.field}</a></div>
          </div>
        );
      }
    };

    let items = _.filter(this.state.fieldSuggestions, (item) => (item.field.startsWith(this.state.value || '') || item.disabled));
    if (items.length > 0) {
      items.unshift(
        {
          type: 'HEADER',
          name: 'fieldSuggestions',
          col1: 'Field',
          col2: 'Description',
          disabled: true
        }
      );
    }
    if (_.isArray(this.state.suggestions) && this.state.suggestions.length > 0) {
      items.push({
        type: 'HEADER',
        col1: 'Value',
        name: 'valueSuggestions',
        col2: 'Field',
        disabled: true
      });
      items = _.concat(items, this.state.suggestions);
    }

    return (
      <React.Fragment>
        <div className="searchBar">
          <ReactAutocomplete
            open={!!this.state.value || this.state.forceOpen}
            autoHighlight={false}
            wrapperProps={{className: 'searchBarSuggest'}}
            renderMenu={children =>
              <div className="suggestMenu">
                {children}
              </div>
            }
            isItemSelectable={item => !item.disabled}
            wrapperStyle={{}}
            items={items}
            getItemValue={item => item}
            renderItem={renderItem}
            inputProps={{ placeholder: 'Search', onKeyUp: this.onKeyUp, onBlur: this.onBlur }}
            value={this.state.value}
            menuStyle={menuStyle}
            onChange={e => this.onChange(e.target.value)}
            onSelect={value => this.onSelect(value)}
          />
        </div>
        <If show={this.state.showModal}>
          <ModalFilter onClose={this.handleHide} filter={this.props.filter} updateFilter={this.props.updateFilter} field="datasetKey" />
        </If>
      </React.Fragment>
    );
  }
}

export default SearchBar;