import React, { Component } from 'react';
import queryString from 'qs'
import _ from 'lodash';

import builder from '../queryStringBuilder';

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
    let filter = _.merge({}, this.props.filter.query, {media_type: 'STILL_IMAGE'});
    // fetch('//api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter, { indices: false, allowDots: true }))
    fetch('//localhost:9200/occurrences2/_search?size=50&' + builder.esBuilder(this.props.filter.query))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({occurrences: _.map(result.hits.hits, '_source')});
        },
        (error) => {
            this.setState({error: true});
        }
      )
  }

  render() {
    const listItems = this.state.occurrences.map(function(e, i){
      return (
        <GalleryImg key={i} src={e.imageIdentifier} />
      );
    });

    return (
      <section>
        <div className="imageGallery">
          {listItems}
          <div className="imageGallery__more p-hidden" ng-click="occGallery.loadMore()" ng-if="!occGallery.endOfRecords"><span>Load more</span></div>
          <div className="imageGallery__more imageGallery__more__filler" ng-if="occGallery.endOfRecords"></div>
        </div>
      </section>
    );
  }
}

export default Gallery;