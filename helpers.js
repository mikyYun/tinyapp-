const { request, response } = require("express");

const generateRandomString = () => {
  let randomString = Math.random().toString(32);
  return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6);
}

const userIDSeeker = (currentUserID, urlDatabase) => {
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL]['userID'] === currentUserID) {
      return true
    }
  }
  return false
}

const getUserByEmail = (email, users) => {
  for (const shortID in users) {
    if (users[shortID]['email'] === email) {
      return shortID
    } 
  }
  return false
}


module.exports = { generateRandomString, userIDSeeker, getUserByEmail}