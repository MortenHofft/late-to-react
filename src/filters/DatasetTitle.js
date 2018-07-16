import React, { Component } from 'react';

class DatasetTitle extends Component {
  constructor(props) {
    super(props);
    this.getTitle = this.getTitle.bind(this);
    this.state = {
      title: ''
    }
  }

  componentDidMount() {
    this.getTitle();
    // OccurrenceStore.on('change', this.getOccurrences);
  }

  componentWillUnmount() {
    // Cancel fetch callback?
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== this.props.id) {
      this.getTitle();
    }
  }

  getTitle() {
    fetch('https://api.gbif.org/v1/dataset/' + this.props.id)
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({title: result.title});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({title: 'unknown', error: true});
        }
      )
  }
  render() {
    let title = this.state.error ? <span className="discreet">unknown</span> : this.state.title;
    return (
      <span>{title}</span>
    );
  }
}

export default DatasetTitle;