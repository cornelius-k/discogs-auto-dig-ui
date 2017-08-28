import React, { Component } from 'react';
/**
 * Record Display Component
 * Displays an individual record and it's release details
 */
class RecordDisplay extends React.Component {
  render(){
    let record = this.props.record;
    let addToCartUrl = "https://www.discogs.com/sell/cart/?add=" + record.id;
    let description = record.release.description;
    let price = record.price.value;
    let currency = getCurrencySymbol(price.currency);
    let country = record.release.country;
    let year = record.release.year;

    // deal with inconsistent data structure using try blocks
    let thumbnail, format;
    try{thumbnail = record.release.images[0].resource_url;}
    catch(e){thumbnail = record.release.thumbnail;}

    try{format = record.release.formats[0].name + ' / ' + record.release.formats[0].descriptions[0];}
    catch(e){format = "N/A";}

    console.log(record);
    return (
      <div className="record-display">
        <span className="title">{description}</span>
        <span className="album-art-container">
          <img className="album-art" src={thumbnail} />
        </span>
        <div className="record-details-container">
          <div className="price-line">
            <span className="format">{format}</span>
            <span className="price-dots">.............................................</span>
            <span className="price-main-display">{currency}{price}</span>
        </div>

        <div className="condition-line">
          <span className="condition">
            {record.condition}
          </span>
          
          <span className="add-to-cart">
            <a href={addToCartUrl}>
            <i className="fa fa-shopping-cart" />
            </a>
          </span>
        </div>


        <span className="comments">
          {record.comments}
        </span>


        <div className="year-genre">
          {country}&nbsp;{year}
        </div>
        </div>

      </div>
    )
  }

}

function getCurrencySymbol(currency){
  switch (currency) {
    case "USD":
      return '$';
      break;
    case "GBP":
      return '£';
      break;
    case "EUR":
      return '€';
      break;
    default:
      return '$';
  }
}
export default RecordDisplay
