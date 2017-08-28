/*
* Releases Service
* Fetches release data from internal Releases API
*/
const rp = require('request-promise');
const releasesUrl = require('../config').RELEASES_URL;
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
    return response.data;
  }

  /**
  * Get release info for a given release id
  * @param {string} id Release ID
  * @returns {object|Error} An object containing the information for a release
  */
  static async getRelease(id){
    const path = `?id=${id}`;
    const release = await ReleasesService.makeRequest(path);
    return release;
  }

}

export default ReleasesService;
