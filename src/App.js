import React, { Component } from 'react';
import './App.css';
import SearchBox from './components/SearchBox.js';
import RecordsList from './components/RecordsList.js';
import DiscogsService from './services/DiscogsService';
require('es6-promise').polyfill();

/**
 * Main application component
 * responsible for rendering entire UI
 */
class App extends Component {
  constructor(){
    super();
    this.state = {listings: []};
  }

  update(username){
    // fetch inventory for username
    DiscogsService.getInventory(username).then(result => {
      console.log('got inventory ', result);
      this.setState({listings: result.listings});
    }).catch(e =>{
      console.log('error', e)
    })
  }

  _onKeyPress(e){
    // trigger update on enter press
    if(e.key === 'Enter') {
      this.update(e.target.value);
    }
  }

  render() {
    let listings = this.state.listings.map((each, i) => {
      return <li key={i}>{each.release.description}</li>
    });

    return (
      <div id="App">
        <SearchBox onKeyPress={this._onKeyPress.bind(this)}/>
        <div id="main-left">
          <RecordsList id="RecordList" records={this.state.listings} />
        </div>
      </div>
    );
  }
}

export default App;
