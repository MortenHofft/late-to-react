import React, { Component } from 'react';

import OccurrenceStore from '../stores/OccurrenceStore';
import FilterStore from '../stores/FilterStore';
import * as OccurrenceActions from '../actions/OccurrenceActions';
import * as FilterActions from '../actions/FilterActions';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.getOccurrences = this.getOccurrences.bind(this);
    OccurrenceActions.getOccurrences({});
    this.state = {
      occurrences: OccurrenceStore.getAll()
    }
  }

  componentDidMount() {
    OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch callback?
    OccurrenceStore.removeListener('change', this.getOccurrences);
  }

  getOccurrences() {
    this.setState({
      occurrences: OccurrenceStore.getAll()
    });
  }

  reload() {
    FilterActions.updateParam('offset', 0);
  }

  next() {
    //OccurrenceActions.getOccurrences({offset: 10});
    FilterActions.updateParam('offset', FilterStore.getQuery('offset') + 10);
  }

  render() {
    const listItems = this.state.occurrences.map(function(e, i){
      return (
        <li key={i}>{e}</li>
      );
    });

    return (
      <div>
        <h4>Table component</h4>
        <ul>{listItems}</ul>
        <button onClick={this.reload.bind(this)}>Get occurrences</button>
        <button onClick={this.next.bind(this)}>next page</button>
      </div>
    );
  }
}

export default Gallery;