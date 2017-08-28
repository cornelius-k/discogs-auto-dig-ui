import React, { Component } from 'react';
import './App.css';
import SearchBox from './components/SearchBox.js';
import RecordsList from './components/RecordsList.js';
import MediaPane from './components/MediaPane.js';
import Logo from './components/Logo.js';
import DiscogsService from './services/DiscogsService';
import ProgressTracker from './ProgressTracker';
import ReleasesService from './services/ReleasesService';
import Youtube from 'react-youtube';


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
  getSellerInventory(username){
    let app = this;
    DiscogsService.getCompleteInventory(username, this.state.progressTracker)
    .then(listings => {
      let listingsById = DiscogsService.sortListingsById(listings);
      fetchReleaseData(listings).then(listings => {
        app.setState({listings: listingsById});
      });
    }).catch(e =>{
      console.log('error', e)
    });

    function fetchReleaseData(listings){
      // fetch complete release data for every listing
      let releasesRequests = listings.map(function(listing){
        console.log(listing);
        return ReleasesService.getRelease(listing.release.id).then(completeReleaseData => {
          Object.assign(listing.release, completeReleaseData);
        });
      });
      // resolve when all completed
      return Promise.all(releasesRequests);
    }
  }

  // Handle search keypress event
  Search_onKeyPress(e){
    if(e.key === 'Enter') {
      this.getSellerInventory(e.target.value);
    }
  }

  // Activate a particular listing for display
  viewRecord(listing){
    this.setState({selectedRecord: listing});
  }

  // Parse a listing and generate an array of youtube video components
  getYoutubeVideos(record, opts){
     const app = this;
     let videos = [];
     if(record.release.videos){
       try{
         let videos = record.release.videos.video || record.release.videos;
         return videos.map(function(videoData){
           let videoUrl = videoData.src || videoData.uri;
           let videoId = app.parseYoutubeId(videoUrl);
           return <Youtube key={videoId} videoId={videoId} opts={opts}/>
         });
       }catch(exception){
         console.error("Error parsing youtube videos for record", exception);
       }
     }else{
       console.error("Videos missing for ", record);
     }
    return videos;
  }

  // parse youtube video id from a url string
  parseYoutubeId(url){
    let videoId;
    let idPosition = url.indexOf('v=');
    if(idPosition !== -1) {
      videoId = url.slice(idPosition + 2);
      console.log(videoId);
    }else{
      console.error("Error parsing video id for video url: ", url);
      videoId = "dQw4w9WgXcQ"; // rickroll
    }
    return videoId;
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
            getYoutubeVideos={this.getYoutubeVideos.bind(this)}
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
