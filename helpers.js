const { request, response } = require("express");

const generateRandomString = () => {
  let randomString = Math.random().toString(32);
  return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6);
}

// const existUserChecker = (req, res, obj) => {
//   for (const user in obj) {
//     const userID = obj[user]
//     if (obj[user].email === req.body.email) {
//       console.log(userID.password === req.body.password)
//       console.log(userID.email === req.body.email)
//       if (userID.password === req.body.password &&
//         userID.email === request.body.email) {
//           res.cookie('user_id', existUserId);
//           return redirect('/urls')
//       }
//       if (userID.password !== req.body.password || userID.emqil !== request.body.email) {
//         return res.status(406).redirect('https://http.cat/406')
//       }
//     }
//     return response.status(409).redirect('https://httpstatusdogs.com/409-conflict')
//   }
// }

// const existUserChecker = (req, res, obj) => {
//   for (const user in obj) {
//     const userID = obj[user]
//     if (obj[user].email === req.body.email) {
//       // console.log(userID.password === req.body.password)
//       // console.log(userID.email === req.body.email)
//       if (userID.password === req.body.password &&
//         userID.email === request.body.email) {
//           // res.cookie('user_id', existUserId);
//           return true
//       }
//       if (userID.password !== req.body.password || userID.emqil !== request.body.email) {
//         return false
//       }
//     }
//     return 1
//   }
// }

module.exports = { generateRandomString }