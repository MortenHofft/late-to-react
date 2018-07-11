import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Gallery from './views/Gallery';
import Table from './views/Table';
import Filter from './Filter';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Table</Link>
        </li>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
      </ul>
      <hr />
      <Filter />
      <Switch>
        <Route exact path="/" component={Table} />
        <Route path="/gallery" component={Gallery} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

const NoMatch = ({ location }) => (
  <div>
    <h3>
      404 - No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

export default BasicExample;











// import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
// import logo from './logo.svg';
// import './App.css';

// import OccurrenceResults from './Table';
// import ClippedDrawer from './ClippedDrawer';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.filterChange = this.filterChange.bind(this);
//     this.updateContent = this.updateContent.bind(this);
//     this.state = {count: 0, results: [], taxonKey: ''};
//   }
  
//   filterChange(taxonKey) {
//     console.log(taxonKey, 'hej');
//     this.setState({taxonKey: taxonKey}, this.updateContent);
//   }
  
//   updateContent() {
//     fetch("https://api.gbif.org/v1/occurrence/search?limit=10&taxonKey=" + this.state.taxonKey)
//       .then(res => res.json())
//       .then(
//         (result) => {
//           this.setState({
//             count: result.count,
//             results: result.results
//           });
//         },
//         // Note: it's important to handle errors here
//         // instead of a catch() block so that we don't swallow
//         // exceptions from actual bugs in components.
//         (error) => {
//           this.setState({
//             isLoaded: true,
//             error
//           });
//         }
//       )
//   }

//   componentDidMount() {
//     this.updateContent();
//   }

//   componentWillUnmount() {
//     // Cancel fetch callback?
//   }
  
  

//   render() {
//     return (
//       <ClippedDrawer>
//         <h1>Hello, world!</h1>
//         <h2>It is {this.state.count.toLocaleString()}</h2>
//         <OccurrenceResults results={this.state.results} update={this.filterChange}/>
//         <Button onClick={this.filterChange.bind(this, '')} variant="contained" color="primary">
//           CLEAR
//         </Button>
//       </ClippedDrawer>
//     );
//   }
// }

// export default App;