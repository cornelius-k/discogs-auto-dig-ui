import request from 'request';
import DiscogsService from '../services/DiscogsService.js';
import ReleasesService from '../services/ReleasesService.js';
const releasesResponse = require('./__mocks__/releasesResponse.json');
const releasesUrl = require('../config.json').RELEASES_URL;

const testReleaseID = '200';

/**
 * Ensure internal releases API is available, requires network
 */
describe('Releases API', () => {
   it('should respond to GET / with a valid response', () => {
     let options = {
       uri: releasesUrl
     };

     request(options, (err, response, body) => {
       expect(err).toBeNull();
       expect(response.statusCode).toBe(200);
     });
   });
 });


describe('Releases Service', () => {

  // use mock response data for tests
  beforeEach(function(){
    ReleasesService.makeRequest = async function(){
      return JSON.parse(releasesResponse['Item']['data']);
    };
  });

  it('should retrieve release info for a given release id', () => {
    ReleasesService.getRelease(testReleaseID)
    .then(info => {
      expect(info.id).toBe(testReleaseID);
    })
    .catch(err => expect(err).toBeNull());
  });

});
