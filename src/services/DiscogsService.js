/*
* Discogs Service
* makes requests to Discogs.com api
*/
const fetchJsonp = require('fetch-jsonp');
const rp = require('request-promise');
const config = require('../config.json');

// Discogs API pagination maximum number of results per page
const MAX_PER_PAGE = 100;
const MAX_PAGES = 28;
const USER_AGENT = 'DiscogsAutoDig/0.1 +http://discogsautodig.com';

class DiscogsService{

  /**
   * Makes a GET request to Discogs API using JSONP and Discogs Auth
   * @param {string} url The full URL for a request, including query string params
   * @returns {object|Error} An object parsed from JSON a response body
   */
  static async makeRequest(url){
    // include Discogs Auth tokens taking advantage of higher rate limit
    url += `&key=${config.API_KEY}&secret=${config.API_SECRET}`;

    // make request
    return fetchJsonp(url, {
      timeout: 100000,                       // tolerate very long requests
      jsonpCallback: 'callback',             // required to enable jsonp
      jsonpCallbackFunction: 'jsonpcallback' // required but not used
    })
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      // check status code in response body for jsonp request
      let statusCode = json.meta.status
      if (statusCode != 200)
        throw new Error('Discogs API responded with status code: ' + statusCode)
      return json.data
    });
  }

  /**
   * Builds inventory endpoint URL string
   * @param {string} userName The username to be included in the URL string
   * @param {number} [page=1] Pagination page number
   * @returns {string} URL for inventory request
   */
  static getInventoryURLFor(username, page){
    page = page || 1;
    // sort all requests from price low to high
    let sort = '&sort=price&sort_order=desc';
    return `https://api.discogs.com/users/${username}/inventory?per_page=${MAX_PER_PAGE}&page=${page}` + sort;
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
   * @param {ProgressTracker} a ProgressTracker instance to be used to indicate
   * progress
   * Not a pure function, mutates progress tracker as a side effect
   */
  static async getCompleteInventory(username, progressTracker = false){

    const usingProgressTracker = Boolean(progressTracker);

    // make request for first page of data
    let url = DiscogsService.getInventoryURLFor(username);
    let firstResponseData = await DiscogsService.makeRequest(url);
    let allListings = firstResponseData.listings;

    // determine max requests to make and set progress tracker if in use
    let totalRequestsToMake = Math.min(firstResponseData.pagination.pages, MAX_PAGES);
    if(usingProgressTracker){
      progressTracker.setTotalSteps(totalRequestsToMake);
      progressTracker.advance();
    }

    let currentResponseData = firstResponseData;

    // make a request for each page, save results, and advance tracker each iteration
    while(currentResponseData.pagination.page < totalRequestsToMake){
      let nextPage = currentResponseData.pagination.page + 1;
      let nextUrl = DiscogsService.getInventoryURLFor(username, nextPage)
      currentResponseData = await DiscogsService.makeRequest(nextUrl);
      allListings = allListings.concat(currentResponseData['listings']);
      if(usingProgressTracker)
        progressTracker.advance();
    }
    return allListings;
  }

  /**
   * Organize listings by release ID
   * @param {Array} listings from Discogs API, seller's inventory
   * @returns {Object} listings keyed by release ID
   */
  static sortListingsById(listings){
    let releasesById = {};
    listings.forEach(listing => {
      releasesById[listing.release.id] =  listing;
    });
    return releasesById;
  }

  /**
   * Retrieve inventory and sort it
   * @param {string} username The username for whose inventory you are querying
   * @param {Array} genres An array of genres that all releases must be tagged with
   * @param {ProgressTracker} a ProgressTracker instance to be used to indicate
   *   the progress of a series of requests
   */
   static async retreiveAndSortInventory(username, progressTracker){
     let listings = await DiscogsService.getCompleteInventory(username, progressTracker);
     let listingsById = DiscogsService.sortListingsById(listings);
     return listingsById;
   }

 /**
  * Builds release endpoint URL string
  * @param {number}  releaseId The release ID
  * @returns {string} URL for inventory request
  */
  static getReleaseURL(releaseId){
   return `https://api.discogs.com/users/${releaseId}`;
  }


  /**
   * Retrieve full release information from Discogs API
   * @param {number} releaseId The release to request info for
   * @return {Promise.<Object|Error>} Response object containing release information
   */
  static async getReleaseData(releaseId){
    let url = DiscogsService.getReleaseURL(releaseId);
    let release = await DiscogsService.makeRequest(url);
    return release;
  }

}

export default DiscogsService;
