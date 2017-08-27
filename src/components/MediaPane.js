import React, { Component } from 'react';
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

      thumbnail = record.release.thumbnail;
      addToCartUrl ="https://www.discogs.com/sell/cart/?add=" + record.id;
      youtubeVids = this.props.getYoutubeVideos(record, youtubeOpts);
    }

    // build content or display a hint
    if (recordIsSelected)
      content = (
        <div id="media-content">
          <span className="title">{record.release.description}</span>
          <img src={thumbnail} />
          <span className="add-to-cart">
            <a href={addToCartUrl}>
            <i className="fa fa-shopping-cart" />
            </a>
          </span>
          <div className="youtube-vids">
            {youtubeVids}
          </div>
        </div>
        );
    else // display hint
      content = <span className="hint">Select A Record</span>
    return (
      <div id="MediaPane">
          {content}
      </div>
    )
  }

}

export default MediaPane;
