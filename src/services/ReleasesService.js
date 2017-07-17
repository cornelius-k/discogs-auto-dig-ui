/*
* Releases Service
* Fetches release data from internal Releases API
*/
const rp = require('request-promise');
const releasesUrl = require('../config.json').RELEASES_URL;

class ReleasesService {

  /**
  * Make Request to releases API and parse response
  * @param {string} path The full path including query string parameters
  * @returns {object|Error} An object parsed from JSON a response body
  */
  static async makeRequest(path){
    const url = releasesUrl + path;
    const result = await rp(url);
    const data = result.Item.data;
    return JSON.parse(data);
  }

  /**
  * Get release info for a given release id
  * @param {string} id Release ID
  * @returns {object|Error} An object containing the information for a release
  */
  static async getRelease(id){
    const path = `?id=${id}`;
    const release = ReleasesService.makeRequest(path);
    return release;
  }

}

export default ReleasesService;
