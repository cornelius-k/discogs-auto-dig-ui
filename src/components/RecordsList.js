import React, { Component } from 'react';

/**
 * Renders a list of records
 */
class RecordsList extends React.Component{
  render(){
    // build an array of li elements
    let records = this.props.records.map((each, i) => {
      if(each.release)
        return <li key={i}>{each.release.description}</li>
    });

    return(
      <div id="RecordsList">
        <ul>
          {records}
        </ul>
      </div>
    )
  }
}

export default RecordsList
