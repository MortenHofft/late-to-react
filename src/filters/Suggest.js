import React, { Component } from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import ReactAutocomplete from 'react-autocomplete';

class Suggest extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state = { suggestions: [], value: props.value };
  }

  componentDidMount() {
    this.getSuggestions();
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.value !== nextProps.value) {
    //   this.setState({value: nextProps.value});
    // }
    this.setState({value: nextProps.value});
  }

  getSuggestions(searchText) {
    let filter = {limit: 10, q: searchText};
    fetch(this.props.endpoint + '?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (suggestions) => {
          this.setState({ suggestions: suggestions });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({ error: true });
        }
      )
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
    return (
        <ReactAutocomplete
            wrapperStyle={{}}
            items={this.state.suggestions}
            shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={item => item}
            renderItem={(item, highlighted) =>
                <div
                key={item}
                style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                >
                {item}
                </div>
            } 
            inputProps={{ placeholder: 'Search' }}
            value={this.state.value}
            onChange={e => this.onChange(e.target.value)}
            onSelect={value => this.onSelect( value )}
            />
    );
  }
}

export default Suggest;