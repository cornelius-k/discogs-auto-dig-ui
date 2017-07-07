/*
* Discogs Service
* makes requests to Discogs.com api
*/
const fetchJsonp = require('fetch-jsonp');
const rp = require('request-promise');

// Discogs API pagination maximum number of results per page
const MAX_PER_PAGE = 100;
const USER_AGENT = 'DiscogsAutoDig/0.1 +http://discogsautodig.com';

class DiscogsService{

  /**
   * Makes a GET request to Discogs API
   * @param {string} url The full URL for a request, including query string params
   * @returns {object|Error} An object parsed from JSON a response body
   */
  static async makeRequest(url){
    let options = {
      uri: url,
      headers: {
        'User-Agent': USER_AGENT
      }
    };
    const result = await rp(options);
    const data = JSON.parse(result);
    return data;
  }

  /**
   * Builds inventory endpoint URL string
   * @param {string} userName The username to be included in the URL string
   * @returns {string} URL including username and query string
   */
  static getInventoryURLFor(username){
    return `https://api.discogs.com/users/${username}/inventory?per_page=${MAX_PER_PAGE}`;
  }

  /**
   * Requests inventory from Discogs API /users/<username>/inventory
   * @param {string} userName The username for whose inventory you are querying
   * @returns {Promise.<Array|Error>} Response object from Discogs
   */
  static async getInventory(username){
    let url = DiscogsService.getInventoryURLFor(username);
    let result = await DiscogsService.makeRequest(url);
    return result;
  }

  /**
   * Retreives the complete (all pages) data set of a user’s inventory
   * @param {string} userName The username for whose inventory you are querying
   * @returns {Promise.<Array|Error>} Array of objects detailing a user's inventory
   */
  static async getCompleteInventory(username){
    let url = DiscogsService.getInventoryURLFor(username);
    let currentResponseData = await DiscogsService.makeRequest(url);
    let allListings = currentResponseData.listings;

    while('next' in currentResponseData.pagination.urls){
      currentResponseData = await DiscogsService.makeRequest(currentResponseData.pagination.urls.next);
      allListings.push(currentResponseData.listings);
    }

    return allListings;
  }

}

export default DiscogsService;
