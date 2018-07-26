import React, { Component } from 'react';
import _ from 'lodash';

import ModalBlocker from '../modal/ModalBlocker';
import FreeText from './FreeText';
import displayName from './fieldFormats';
import objectHash from 'object-hash';
import config from '../config';

function asArray(value) {
    if (_.isUndefined(value)) {
        return [];
    } else if (_.isArray(value)) {
        return value;
    } else {
        return [value];
    }
}

class ModalFilter extends Component {
    constructor(props) {
        super(props);

        this.handleHide = this.handleHide.bind(this);
        this.updateModalFilter = this.updateModalFilter.bind(this);

        this.state = { modalFilter: props.filter };
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
            this.setState({ modalFilter: this.props.filter })
        }
    }

    handleHide() {
        if (this.state.modalFilter.query.datasetKey) {
            this.props.updateFilter('datasetKey', this.state.modalFilter.query.datasetKey, 'ADD');
        } else {
            this.props.updateFilter('datasetKey', null, 'CLEAR');
        }
        console.log('update');
        this.props.onClose();
    }

    updateModalFilter(param, value, action) {
        let paramValues = asArray(this.state.modalFilter.query[param]);
        if (action === 'CLEAR') {
            paramValues = '';
        } else if (action === 'ADD') {
            paramValues.push(value);
        } else if (action === 'REMOVE') {
            _.remove(paramValues, function (n) {
                return n === value;
            });
        } else {
            paramValues = [value];
        }
        let query = _.merge({}, this.state.modalFilter.query, { [param]: paramValues });
        if (!paramValues) {
            delete query[param];
        }
        let filter = { hash: objectHash(query), query: query };
        this.setState({ modalFilter: filter });
    }

    render() {
        return (
            <ModalBlocker onClose={this.handleHide}>
                <FreeText filter={this.state.modalFilter} updateFilter={this.updateModalFilter} options={config.widgets.filters[this.props.field].options} />
            </ModalBlocker>
        );
    }
}

export default ModalFilter;