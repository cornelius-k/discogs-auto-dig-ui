import React, { Component } from 'react';

/**
 * Renders a list of records
 */
class RecordsList extends React.Component{
  constructor(){
    super();
    this.state = {selectedListingId: null};
  }
  _onClick(listingId, e){
    this.props.viewRecord(this.props.records[listingId]);
    this.setState({selectedListingId: listingId});
  }

  // generate display string for a record
  generateLineItem(record){
    let lineSize = 50;
    let name = record.release.description;
    let paddingSize = lineSize - name.length;

  }

  render(){
    let records = [];
    // build an array of li elements
    for (let listingId in this.props.records){
      let record = this.props.records[listingId];
      let releaseId = record.release.id;
      let activeClass = '';

      // highlight selected record
      if (listingId === this.state.selectedListingId){
        activeClass = 'active';
      }

      if(record.release)
        records.push(
          <li
          key={listingId}
          className={activeClass}
          onClick={this._onClick.bind(this, listingId)}>
          <span className="description">
            {record.release.description}
          </span>
          <span className="right-aligned">
            <span className="cost">
              <i className="fa fa-money" aria-hidden="true" />
              <span className="text">{record.original_price.formatted.split('.')[0]}</span>
            </span>
            <span className="wants">
              <i className="fa fa-smile-o" aria-hidden="true"></i>
              <span className="text">14</span>
            </span>

            </span>
        </li>);
    }

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
