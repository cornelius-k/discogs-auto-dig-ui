import React from 'react';
import ascii from './logo-ascii.js';
/*
* Ascii art logo component
* Actual text is loaded from a separate file and set as component's
* inner html due to its wildness.
*/
class Logo extends React.Component{
  createMarkup() {
    return {__html: ascii};
  }
  render(){
    // div width is dynamic to allow loading-bar-esque visual feedback
    const progressStyles = { width: this.props.progressPercentage + 'vw' }

    return(
      <div id="logo" style={progressStyles}
      dangerouslySetInnerHTML={this.createMarkup()} />
    )
  }
}

export default Logo;
