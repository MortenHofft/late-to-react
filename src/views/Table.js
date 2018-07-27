import React, { Component } from 'react';
import queryString from 'query-string'
import _ from 'lodash';

import displayName from '../filters/fieldFormats';
import If from '../filters/If';
import ModalFilter from '../filters/ModalFilter';
import config from '../config';

require('./table.css');

class Table extends Component {
  constructor(props) {
    super(props);

    this.updateFilter = this.updateFilter.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.getRow = this.getRow.bind(this);
    this.bodyScroll = this.bodyScroll.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.fieldConfig = {
      fields: [
        {
          name: 'scientificName',
          filter: 'taxonKey',
          width: 200
        },
        {
          name: 'country',
          width: 100
        },
        {
          name: 'basisOfRecord',
          width: 100
        },
        {
          name: 'datasetKey',
          width: 200
        },
        {
          name: 'institutionCode',
          width: 100
        },
        {
          name: 'year',
          width: 100
        },
        {
          name: 'kingdom',
          width: 100
        },
        {
          name: 'phylum',
          width: 100
        },
        {
          name: 'class',
          width: 100
        },
        {
          name: 'order',
          width: 100
        },
        {
          name: 'family',
          width: 100
        },
        {
          name: 'genus',
          width: 100
        },
        {
          name: 'species',
          width: 100
        },
      ]
    };
    this.state = {
      page: {limit: 50, offset: 0},
      occurrences: [],
      showModalFilter: false
    }
  }

  componentDidMount() {
    this.updateResults();
    // OccurrenceStore.on('change', this.getOccurrences);
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
    let filter = _.merge({}, this.props.filter.query, this.state.page);
    fetch('https://api.gbif.org/v1/occurrence/search?' + queryString.stringify(filter))
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({occurrences: result.results, count: result.count});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            this.setState({error: true});
        }
      )
  }

  nextPage() {
    this.setState({page: {offset: this.state.page.offset + this.state.page.limit, limit: this.state.page.limit}}, this.updateResults);
  }

  prevPage() {
    let offset = Math.max(0, this.state.page.offset - this.state.page.limit);
    this.setState({page: {offset: offset, limit: this.state.page.limit}}, this.updateResults);
  }

  firstPage() {
    this.setState({page: {offset: 0, limit: this.state.page.limit}}, this.updateResults);
  }

  updateFilter(key, value) {
    this.props.updateFilter(key, value);
  }

  getHeaders() {
    let handleShow = this.handleShow;
    let setState = () => (this.setState({stickyCol: !this.state.stickyCol}));
    let icon = this.state.stickyCol ? 'lock' : 'lock_open';

    return this.fieldConfig.fields.map(function(field, index){
      let name = field.filter || field.name;
      let filterButton = config.widgets.filters[name] ? <i className="material-icons u-secondaryTextColor u-small" onClick={() => (handleShow(name))} >filter_list</i> : null;
      let stickyButton = index === 0 ? <i className="material-icons u-secondaryTextColor u-small" onClick={setState}>{icon}</i> : null;
      return <th key={field.name}><span>{field.name} {filterButton} {stickyButton}</span></th>;
    });
  }

  getRow(item) {
    return this.fieldConfig.fields.map(function(field){
      let DisplayName = displayName(field.name);
      return <td key={field.name}><DisplayName id={item[field.name]} /></td>;
    });
  }

  bodyScroll() {
    this.setState({scrolled: document.getElementById('table').scrollLeft !== 0});
  }

  handleShow(field) {
    this.setState({showModalFilter: true, modalField: field});
  }
  
  handleHide() {
    this.setState({showModalFilter: false});
  }

  render() {
    let getRow = this.getRow;
    const tbody = this.state.occurrences.map(function(e, i){
      return (
        <tr key={i}>{getRow(e)}</tr>
      );
    });
    let headers = this.getHeaders();

    let scrolled = this.state.scrolled ? 'scrolled' : '';
    let stickyCol = this.state.stickyCol ? 'stickyCol' : '';

    let backButtons = '';
    if (this.state.page.offset > 0) {
      backButtons = (
        <React.Fragment>
          <i className="material-icons" onClick={() => this.firstPage()}>first_page</i>
          <i className="material-icons" onClick={() => this.prevPage()}>keyboard_arrow_left</i>
        </React.Fragment>
      );
    }
    let nextButton = this.state.page.offset + this.state.page.limit < this.state.count ? <i className="material-icons" onClick={() => this.nextPage()}>keyboard_arrow_right</i> : null;
    return (
      <div>
        <div className="tableArea">
          <table id="table" className={scrolled + ' ' + stickyCol} onScroll={ this.bodyScroll }>
            <thead>
              <tr>
                {headers}
              </tr>
            </thead>
            <tbody>
              {tbody}
            </tbody>
          </table>
          <div className="pagination">
            {backButtons}
            <div>
              {nextButton}
            </div>
          </div>
        </div>
        <If show={this.state.showModalFilter}>
          <ModalFilter onClose={this.handleHide} filter={this.props.filter} updateFilter={this.props.updateFilter} field={this.state.modalField}/>
        </If>
      </div>
    );
  }
}

export default Table;