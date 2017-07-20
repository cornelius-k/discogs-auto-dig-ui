import React, { Component } from 'react';
import Youtube from 'react-youtube';
/**
 * Media Pane Component
 * Displays actively selected record information, audio samples via youtube
 * videos, and provides a link to buy on Discogs.com marketplace.
 */
class MediaPane extends React.Component {

  render(){
    let record, thumbnail, addToCartUrl, content;
    let recordIsSelected = Boolean(this.props.selectedRecord);
    // A selected record must be provided as a prop
    if (recordIsSelected){
      record = this.props.selectedRecord;
      thumbnail = record.release.thumbnail;
      addToCartUrl ="https://www.discogs.com/sell/cart/?add=" + record.id;
    }

    const youtubeOpts = {
      height: '50',
      width: '60',
      playerVars: {
        autoplay: 0
      }
    };


    if (recordIsSelected) // build content
      content = (
        <div id="media-content">
          <span className="title">{record.release.description}</span>
          <img src={thumbnail} />
          <span className="add-to-cart">
            <a href={addToCartUrl}>
            <i className="fa fa-shopping-cart" />
            </a>
          </span>
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
