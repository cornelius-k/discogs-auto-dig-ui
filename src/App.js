import React, { Component } from 'react';
import './App.css';
import SearchBox from './components/SearchBox.js';
import RecordsList from './components/RecordsList.js';
import MediaPane from './components/MediaPane.js';
import Logo from './components/Logo.js';
import DiscogsService from './services/DiscogsService';
import ProgressTracker from './ProgressTracker';
import ReleasesService from './services/ReleasesService';

require('es6-promise').polyfill();

/**
 * Main application component
 * responsible for rendering entire UI
 */

class App extends Component {

  constructor(){
    super();
    this.state = {
      listings: [],
      loggedIn: false,
      progress: {currentStep: 0, totalSteps: 0, percentage: 100},
      progressTracker: new ProgressTracker(this.onProgressAdvance.bind(this))
    }
  }

  // Progress Tracking callback for functions that use a Progress Tracker
  onProgressAdvance(currentStep, totalSteps){
    console.log('PROGRESS', currentStep, totalSteps);
    // update step state vars
    this.setState({
      progress: {
        currentStep: currentStep,
        totalSteps: totalSteps,
        percentage: (currentStep / totalSteps) * 100
      }
    });
  }

  // Get and display a user's inventory
  searchUsersInventory(username){
    let genres = [];
    DiscogsService.retreiveAndSortInventory(username, genres, this.state.progressTracker)
    .then(result => {
      this.setState({listings: result});
    }).catch(e =>{
      console.log('error', e)
    });
  }

  // Handle search keypress event
  Search_onKeyPress(e){
    if(e.key === 'Enter') {
      this.searchUsersInventory(e.target.value);
    }
  }

  // Activate a particular listing for display
  viewRecord(listing){
    this.setState({selectedRecord: listing});
  }

  render() {

    let mainDisplay = (
      <div>

        <Logo progressPercentage={this.state.progress.percentage} />
        <SearchBox onKeyPress={this.Search_onKeyPress.bind(this)}/>

        <div id="main-left">
          <RecordsList id="RecordList" records={this.state.listings}
            viewRecord={this.viewRecord.bind(this)} />
        </div>

        <div id="main-right">
          <MediaPane
            selectedRecord={this.state.selectedRecord}
            youtubeIds={this.state.youtubeIds}
          />
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
