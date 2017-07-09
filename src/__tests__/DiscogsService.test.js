import request from 'request';
import DiscogsService from '../services/DiscogsService.js';
const inventoryResponses = require('./__mocks__/inventoryResponses.json');

let testUsername = 'testUser';


/**
 * Ensure discogs API is available, requires network
 */
describe('Discogs API', () => {
  it('should respond to GET / with a valid response', () => {
    let options = {
      uri: 'https://api.discogs.com/',
      headers: {
        'User-Agent': 'DiscogsAutoDig/0.1 +http://discogsautodig.com'
      }
    };

    request(options, (err, response, body) => {
      expect(err).toBeNull();
      let json = JSON.parse(body);
      expect(json).toHaveProperty('api_version');
    });
  });
});


describe('Make Request', () => {
  it('should return a valid response from Discogs API', () => {
    let url = DiscogsService.getInventoryURLFor(testUsername);
    DiscogsService.makeRequest(url)
    .then(result => expect(result).toBeDefined())
    .catch(err => expect(err).toBeNull());
  });
});


/**
 * Test inventory endpoint functions and logic
 */
describe('Inventory', () => {

    // shared between tests
    let testInventorySize = 0;
    let completeListings = [];

    // use generator to simulate paginated API responses
    function* createInvResponseGenerator(){
      yield(inventoryResponses[0]);
      yield(inventoryResponses[1]);
    }

    beforeEach(() => {
      let invResponseGenerator = createInvResponseGenerator();

      // redirect outgoing requests to mock data generator
      DiscogsService.makeRequest = async function(){
        return invResponseGenerator.next().value;
      }
    });

    it('can be requested for a test user', () => {
      // request inventory and save inventory size for other tests
      return DiscogsService.getInventory(testUsername)
      .then(inventoryResponse => {
        expect(inventoryResponse).toHaveProperty('pagination');
        testInventorySize = inventoryResponse.pagination.items;
      })
      .catch(err => expect(err).toBeNull())
    })

    it('can be retrieved in full for a test user', () => {
      // check that complete inventory is the correct size, save set for tests
      return DiscogsService.getCompleteInventory(testUsername)
      .then(allListings => {
        expect(allListings).toBeInstanceOf(Array);
        expect(allListings.length === testInventorySize);
        completeListings = allListings;
      })
      .catch(err => {
        expect(err).toBeNull();
      });
    });

    it('can organize a set of listings by release id', () => {
      // find a test release by id after sorting
      let listingsById = DiscogsService.sortListingsById(completeListings);
      let testID = completeListings[0].release.id;
      expect(listingsById[testID]).toBe(completeListings[0]);
    });

});
