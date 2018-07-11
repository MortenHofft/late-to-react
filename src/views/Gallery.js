import React, { Component } from 'react';
import queryString from 'query-string'

class Gallery extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    console.log(values.test) // "top"
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  render() {
    return (
      <h4>Gallery component {this.props.location.search}</h4>
    );
  }
}

export default Gallery;