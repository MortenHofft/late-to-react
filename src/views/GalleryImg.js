import React, { Component } from 'react';

require('./GalleryImg.css');

const thinner = 0.6,
    thin = 0.8,
    wide = 1.4,
    wider = 1.8,
    widest = 2.0;

class GalleryImg extends Component {
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);

        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    // Cancel fetch callback?
    }

//   componentDidUpdate(prevProps) {
//     if (prevProps.src !== this.props.src) {
//       this.updateResults();
//     }
//   }

    onLoad(event) {
        let element = event.target;
        this.setState({backgroundImg: this.props.src});

        var ratio = (element.naturalWidth) / element.naturalHeight;
        if (ratio > widest) this.setState({width: 'widest'});
        else if (ratio > wider && ratio <= widest) this.setState({width: 'wider'});
        else if (ratio > wide && ratio <= wider) this.setState({width: 'wide'});
        else if (ratio > thinner && ratio <= thin) this.setState({width: 'thin'});
        else if (ratio <= thinner) this.setState({width: 'thinner'});
        this.setState({valid: true});
    }

    render() {
        let styleItem = {backgroundImage: 'url(' + this.state.backgroundImg + ')'};
        let imgStyle = {visibility: 'hidden'};
        if (this.state.backgroundImg) {

        }

        return (
            <a href="" style={styleItem} data-width={this.state.width}>
                <img src={this.props.src} width="100" onLoad={this.onLoad} />
            </a>
        );
    }
}

export default GalleryImg;