import React, { Component } from 'react';
import './App.css';
import Login from './components/Login.js';
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
    this.state = {listings: [], loggedIn: false};
  }

  componentWillMount(){
  }

  update(username){
    // fetch inventory for username
    DiscogsService.getCompleteInventory(username).then(result => {
      this.setState({listings: result});
    }).catch(e =>{
      console.log('error', e)
    })
  }

  componentDidMount(){
  }

  _onKeyPress(e){
    // trigger update on enter press
    if(e.key === 'Enter') {
      this.update(e.target.value);
    }
  }

  render() {

    let mainDisplay = (
      <div>
        <SearchBox onKeyPress={this._onKeyPress.bind(this)}/>
        <div id="main-left">
          <RecordsList id="RecordList" records={this.state.listings} />
        </div>
      </div>
    );

    return (
      <div id="App">
        {mainDisplay}
      </div>
    );
  }
}

export default App;
