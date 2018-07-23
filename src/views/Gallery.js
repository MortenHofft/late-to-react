import React, { Component } from 'react';
import queryString from 'query-string'
import _ from 'lodash';

import GalleryImg from './GalleryImg';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.updateResults = this.updateResults.bind(this);
    this.state = {
      occurrences: []
    }
  }

  componentDidMount() {
    this.updateResults();
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter.hash !== this.props.filter.hash) {
      this.updateResults();
    }
  }

  updateResults() {
    let filter = _.merge({}, this.props.filter.query, {media_type: 'StillImage', limit: 3});
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({occurrences: result.results});
        },
        (error) => {
            this.setState({error: true});
        }
      )
  }

  render() {
    const styleItem = {display: 'inline-block'};
    const listItems = this.state.occurrences.map(function(e, i){
      return (
        <li key={i} style={styleItem}>
          <GalleryImg src={e.media[0].identifier} />
        </li>
      );
    });

    return (
      <div>
        <h4>Gallery component</h4>
        <div>
          <span>Filter</span>
          {JSON.stringify(this.props.filter.query, null, 2)}
        </div>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

export default Gallery;