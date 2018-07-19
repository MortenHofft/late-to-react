function If(props) {
    let display = typeof (props.show) !== 'undefined' ? props.show : !props.hidden;
    let element = '';
    if (display) {
        element = props.children;
    }
    return element;
}

export default If;