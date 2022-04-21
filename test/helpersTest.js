const { assert } = require('chai');

const { generateRandomString, userIDSeeker, getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testDatabase = {
  "randomShortID1": {
    userID: "userRealID1", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "randomShortID2": {
    userID: "userRealID2", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert(user, expectedUserID)
  });
  it('should return false with invalid email', () => {
    const user = getUserByEmail("user@new.com", testUsers)
    assert.equal(user, false)
  });
  it('should return a randomString with 6 digits', () => {
    assert(generateRandomString().length, 6)
  });
  it(`useIDSeecker function should return true if currentUserID_submitted one, is already exist in urlDatabase`, () => {
    assert(userIDSeeker('userRealID1', testDatabase), true)
  });
  it(`useIDSeecker function should return false if currentUserID_submitted one, does not exist in urlDatabase`, () => {
    assert.equal(userIDSeeker('newButNonexistID', testDatabase), false)
  });
});