/**
 * helpers.js is a moduled file containing repeated functions in the express-server.js
 */
const { request, response } = require("express");

// generate 6 digits of random string (a-z and 0-9)
const generateRandomString = () => {
  let randomString = Math.random().toString(32);
  return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6);
}

// check the current user's information is in the server's database
const userIDSeeker = (currentUserID, urlDatabase) => {
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL]['userID'] === currentUserID) {
      return true
    }
  }
  return false
}

// check the submitted email is in the server's database
const getUserByEmail = (email, users) => {
  for (const shortID in users) {
    if (users[shortID]['email'] === email) {
      return shortID
    } 
  }
  return false
}


module.exports = { generateRandomString, userIDSeeker, getUserByEmail}