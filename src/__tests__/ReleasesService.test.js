import request from 'request';
import DiscogsService from '../services/DiscogsService.js';
import ReleasesService from '../services/ReleasesService.js';
const releasesResponse = require('./__mocks__/releasesResponse.json');
const releasesUrl = require('../config.json').RELEASES_URL;

const testReleaseId = '3';

/**
 * Ensure internal releases API is available, requires network
 */
describe('Releases API', () => {
   it('should respond to GET / with a valid response', () => {
     let options = {
       uri: releasesUrl
     };

     request(options, (err, response, body) => {
       expect(err.stack).toBeNull();
       expect(response.statusCode).toBe(200);
     });
   });
 });


describe('Releases Service', () => {
  it('should retrieve release info for a given release id', () => {
    // use mock response
    ReleasesService.makeRequest = async function(){
      return JSON.parse(releasesResponse.data);
    };

    ReleasesService.getRelease(testReleaseId)
    .then(info => {
      expect(info.id).toBe('3');
    })
    .catch(err => expect(err.stack).toBeNull());
  });
})
