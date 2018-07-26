import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import ReactAutocomplete from 'react-autocomplete';

let CancelToken = axios.CancelToken;
let cancel;

class Suggest extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = { suggestions: [], value: props.value };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  getSuggestions(searchText) {
    //first of - cancel pending requests for suggestions
    if (cancel !== undefined) {
      cancel();
    }
    //construct search query
    let filter = {limit: 10, q: searchText};
    
    axios.get(this.props.endpoint + '?' + queryString.stringify(filter), {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(
        (response) => {
          this.setState({ suggestions: response.data });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      )
      .catch(function(err){
        console.log(err);
      });
  }

  onChange(val) {
    this.setState({ value: val });
    this.getSuggestions(val);
  }

  onSelect(val) {
    this.setState({ value: val });
    this.props.onSelect(val);
  }

  render() {
    let keyField = this.props.itemKey;
    let titleField = keyField ? this.props.itemTitle || 'title' : undefined;
    let getItemValue = this.props.itemKey ? item => '' + item[keyField] : item => '' + item;
    let renderItem = function(item, highlighted) {
      let key = getItemValue(item);
      let title = keyField ? item[titleField] : item;
      return (
      <div key={key} style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}>
        {title}
      </div>
      )};
    renderItem = this.props.renderItem ? this.props.renderItem : renderItem;

    return (
        <ReactAutocomplete
          wrapperStyle={{ position: 'relative'}}
          renderMenu={children =>
            <div className="suggestMenu">
              {children}
            </div>
          }
          items={this.state.suggestions}
          getItemValue={getItemValue}
          renderItem={renderItem} 
          inputProps={{ placeholder: 'Search' }}
          value={this.state.value}
          onChange={e => this.onChange(e.target.value)}
          onSelect={value => this.onSelect( value )}
          />
    );
  }
}

function speciesTemplate(item, highlighted) {
  let classification = [];
  ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].forEach(function(e){
    if (item[e]) {
      classification.push(<span key={e}>{item[e]}</span>);
    }
  });
  return (
    <div key={item.key} style={{ backgroundColor: highlighted ? 'tomato' : 'deepskyblue'}}>
      {item.scientificName}
      <div>
        {classification}
      </div>
    </div>
  );
}

export {speciesTemplate, Suggest};
export default Suggest;