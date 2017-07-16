import React, { Component } from 'react';
import './App.css';
import SearchBox from './components/SearchBox.js';
import RecordsList from './components/RecordsList.js';
import MediaPane from './components/MediaPane.js';
import Logo from './components/Logo.js';
import DiscogsService from './services/DiscogsService';
import ProgressTracker from './ProgressTracker';
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

  onProgressAdvance(currentStep, totalSteps){
    console.log('PROGRESS', currentStep, totalSteps);
    this.setState({
      progress: {
        currentStep: currentStep,
        totalSteps: totalSteps,
        percentage: (currentStep / totalSteps) * 100
      }
    });
  }

  update(username){
    // fetch inventory for username
    let genres = [];
    DiscogsService.retreiveAndSortInventory(username, genres, this.state.progressTracker)
    .then(result => {
      this.setState({listings: result});
    }).catch(e =>{
      console.log('error', e)
    });
  }

  componentDidMount(){
  }

  Search_onKeyPress(e){
    // trigger update on enter press
    if(e.key === 'Enter') {
      this.update(e.target.value);
    }
  }

  viewRecord(listing){
    console.log(listing);
    YoutubeService.getVideoIds(listing.release.id).then((videoIds) => {
      this.setState({selectedRecord: listing, youtubeIds: videoIds});
    });

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
