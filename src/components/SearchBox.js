import React, { Component } from 'react';

/**
 * Renders a text box where a user can identify a seller whose inventory they'd
 * like to dig.
 */
class SearchBox extends React.Component{
  render(){
    return(
      <div id="SearchBox">
        <input type="text" onKeyPress={this.props.onKeyPress}
          placeholder="Paste seller profile URL or type a username here..." />
      </div>
    )
  }
}

export default SearchBox;
