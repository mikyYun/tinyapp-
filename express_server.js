
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
const PORT = 8080;
const {generateRandomString} = require('./helpers')
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}))

const urlDatabase = {};
const users = {};
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/urls', (request, response) => {
  console.log("GET/URLS")
  console.log(request)
  console.log("DATABASE", urlDatabase)
  const userID = request.cookies['user_id']
  const user = users[userID]

    const templateVars = {
      urls: urlDatabase,
      user: user,
    };
  response.render('urls_index', templateVars);

});

app.get("/urls/new", (request, response) => {
  console.log("GET/URLS NEW")
  if (!request.cookies.user_id) {
    return response.redirect('/login')
  }
  const userID = request.cookies['user_id']
  const user = users[userID]

    const templateVars = {
      urls: urlDatabase,
      user: user
    };
    response.render("urls_new", templateVars);// rendering


});

app.get("/urls/:shortURL", (request, response) => {
  console.log("GET/URLS:SHORTURL")
  const userID = request.cookies['user_id']
  const user = users[userID]
  const shorturl = request.params.shortURL
  const templateVars = {
    shortURL: shorturl,
    longURL: urlDatabase[shorturl].longURL,
    user: user
  };
  console.log("DATABASE", urlDatabase[shorturl].longURL)
  response.render("urls_show", templateVars);
});

app.get('/login', (request, response) => {
  console.log("GET/LOGIN")
  const userID = request.cookies['user_id']
  const user = users[userID]
  const templateVars = {
    user: user
  }
  response.render('urls_login', templateVars)
})

app.get('/logout', (request, response) => {
  console.log("GET/LOGOUT")
  response.redirect("/urls");

});

app.get("/u/:shortURL", (request, response) => {
  console.log("GET/u/SHORTURL")
  const longURL = urlDatabase[request.params.shortURL];
  if (!longURL) {
    response.sendStatus(404);
  }
  response.redirect(longURL);
});

app.get('/register', (request, response) => {
  console.log("GET/REGISTER")
  const userID = request.cookies['user_id']
  const user = users[userID]
  const templateVars = {
    user: user
  };
  response.render("urls_registration", templateVars);
});

// function generateRandomString() {
//   let randomString = Math.random().toString(32);
//   return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6);
// }

app.post('/urls', (request, response) => {
  const userID = request.cookies.user_id
  const newLongURL = request.body.longURL;
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: newLongURL,
    userID: userID
  };
  // console.log(urlDatabase)
  response.redirect(`/urls/${newShortURL}`);

});

const emailChecker = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return true
    }
  }
  return false
}

////////////////////////////
app.post('/login', (request, response) => {
  console.log("POST/LOGIN")
  for (const existUserId in users) {
      const userID = users[existUserId]

      if (userID.password === request.body.password &&
        userID.email === request.body.email ) {
            response.cookie('user_id', existUserId);
          return response.redirect('/urls')
      }
      if (userID.password !== request.body.password || userID.email !== request.body.email) {
        return response.status(406).redirect('https://http.cat/406')
      }
  }
      return response.status(409). redirect('https://httpstatusdogs.com/409-conflict')
});



app.post('/logout', (request, response) => {
  console.log("POST/LOGOUT")
  response.clearCookie('user_id');
  response.redirect('/logout');
});
// V1 : set cookies at the registeration
app.post('/register', (request, response) => {
  console.log("POST/REGISTER")
  const newRandomID = generateRandomString()
  const submittedEmail = request.body.email
  const submittedPassword = request.body.password
  if (!submittedEmail || !submittedPassword) {
    return response.status(400).redirect('https://httpstatusdogs.com/404-not-found')
  }
  for (const existUserId in users) {
    if (users[existUserId].email === submittedEmail) {
      return response.status(409). redirect('https://httpstatusdogs.com/409-conflict')
    }
  }

  users[newRandomID] = {
    id: newRandomID,
    email: submittedEmail,
    password: submittedPassword
  }
  response.cookie('user_id', newRandomID);
  response.redirect('/urls')
})



app.post('/urls/:shortURL/delete', (request, response) => {
  console.log("POST/URLS:SHORTURL,delete")
  delete urlDatabase[request.params.shortURL];
  response.redirect('/urls');
});

app.post('/urls/:shortURL/edit', (request, response) => {
  console.log("POST/URLS:SHORTURL")
  const shortURL = request.params.shortURL;
  response.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id', (request, response) => {
  console.log("POST/URLS:ID")
  const shortURL = request.params.id;
  const longURL = request.body.longURL;
  urlDatabase[shortURL]['longURL'] = longURL;
  response.redirect('/urls/');
});