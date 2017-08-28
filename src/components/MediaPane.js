import React, { Component } from 'react';
import RecordDisplay from './RecordDisplay';

/**
 * Media Pane Component
 * Displays actively selected record information, audio samples via youtube
 * videos, and provides a link to buy on Discogs.com marketplace.
 */
class MediaPane extends React.Component {


  render(){
    let record, thumbnail, addToCartUrl, content, youtubeVids;
    let recordIsSelected = Boolean(this.props.selectedRecord);
    const youtubeOpts = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 0
      }
    };

    const app = this;
    // A selected record must be provided as a prop
    if (recordIsSelected){
      record = this.props.selectedRecord;
      addToCartUrl ="https://www.discogs.com/sell/cart/?add=" + record.id;
      youtubeVids = this.props.getYoutubeVideos(record, youtubeOpts);
    }

    // build content or display a hint
    if (recordIsSelected)
      content = (
        <div id="media-content">
          <RecordDisplay record={record} />
          <div className="youtube-vids">
            {youtubeVids}
          </div>
        </div>
        );
    return (
      <div id="MediaPane">
          {content}
      </div>
    )
  }

}

export default MediaPane;
