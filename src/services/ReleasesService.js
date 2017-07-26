/*
* Releases Service
* Fetches release data from internal Releases API
*/
const rp = require('request-promise');
const releasesUrl = require('../config.json').RELEASES_URL;
const request = require('request');

class ReleasesService {

  /**
  * Make Request to releases API and parse response
  * @param {string} path The full path including query string parameters
  * @returns {object|Error} An object parsed from JSON a response body
  */
  static async makeRequest(path){
    const url = releasesUrl + path;
    const strResponse = await rp(url);
    const response = JSON.parse(strResponse);
    const data = response['Item']['data'];
    return JSON.parse(data);
  }

  /**
  * Get release info for a given release id
  * @param {string} id Release ID
  * @returns {object|Error} An object containing the information for a release
  */
  static async getRelease(id){
    const path = `?id=${3}`;
    const release = ReleasesService.makeRequest(path);
    return release;
  }

  // /**
  // * Get youtube video ids for a release with a given id
  // * @param {string} releaseId Release ID
  // * @returns {array} An array of youtube video IDs
  // */
  // static async getYoutubeVideos(releaseId){
  //   const release = await ReleasesService.getRelease(releaseId);
  //   const videos = release.videos;
  //   const videos = videos.map( video => {
  //     {
  //       id : getIdFromYoutubeURL(video.),
  //       title : v
  //   })
  //   return ids;
  // }
  //
  // // adapted from answer post by Jacob Relkin on Stack Overflow
  // function getIdFromYoutubeURL(url){
  //   let youtubeID = window.location.search.split('v=')[1];
  //   const ampersandPosition = youtubeID.indexOf('&');
  //   if(ampersandPosition != -1) {
  //     youtubeID = youtubeID.substring(0, ampersandPosition);
  //   }
  //   return youtubeID;
  // }
}

export default ReleasesService;
