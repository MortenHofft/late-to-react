import React, { Component } from 'react';
import _ from 'lodash';

import ModalBlocker from '../modal/ModalBlocker';
import FreeText from './FreeText';
import objectHash from 'object-hash';
import config from '../config';

import {SearchContext} from '../searchContext';

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

    handleHide(updateFilter) {
        if (this.state.modalFilter.query[this.props.field]) {
            updateFilter(this.props.field, this.state.modalFilter.query[this.props.field], 'UPDATE');
        } else {
            updateFilter(this.props.field, null, 'CLEAR');
        }
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
            <SearchContext.Consumer>
                {({updateFilter}) =>
                <ModalBlocker onClose={() => {this.handleHide(updateFilter)}}>
                    <FreeText filter={this.state.modalFilter} updateFilter={(a,b,c) => {this.updateModalFilter(a, b, c, updateFilter)}} options={config.widgets.filters[this.props.field].options} />
                </ModalBlocker>
                }
            </SearchContext.Consumer>
        );
    }
}

export default ModalFilter;