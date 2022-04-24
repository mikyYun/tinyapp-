const cookieSession = require('cookie-session');
const express = require('express');
const methodOverride = require('method-override');
const serve = require('express-static')
const { generateRandomString, userIDSeeker, getUserByEmail } = require('./helpers');
const bcrypt = require('bcryptjs');
const PORT = 8080;
const app = express();

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["securedKeys"],
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

const urlDatabase = {};
const users = {};
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/', (request, response) => {
  console.log('GET /')
  response.redirect('/urls');
});

app.get('/urls', (request, response) => {
  console.log("GET/URLS");
  const userID = request.session['user_id'];
  const user = users[userID];
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  response.render('urls_index', templateVars);
});

app.get("/urls/new", (request, response) => {
  console.log("GET/URLS NEW");
  if (!request.session.user_id) {
    return response.redirect('/login');
  }
  const userID = request.session['user_id'];
  const user = users[userID];
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  response.render("urls_new", templateVars);
  console.log()
});

app.get("/urls/:id", (request, response) => {
  console.log("GET/URLS:ID");
  if (!request.session.user_id) {
    return response.send("'/login'");
    // return response.redirect('/login');
  }
  response.render("urls_new", templateVars);
  console.log()
});

app.get("/urls/:shortURL", (request, response) => {
  console.log("GET/URLS:SHORTURL");
  const userID = request.session['user_id'];
  const user = users[userID];
  const shorturl = request.params.shortURL;
  const templateVars = {
    shortURL: shorturl,
    longURL: urlDatabase[shorturl].longURL,
    user: user
  };
  response.render("urls_show", templateVars);
});

app.get('/login', (request, response) => {
  console.log("GET/LOGIN");
  const userID = request.session['user_id'];
  const user = users[userID];
  const templateVars = {
    user: user
  };
  response.render('urls_login', templateVars);
});

app.get('/logout', (request, response) => {
  console.log("GET/LOGOUT");
  response.redirect("/urls");
});

app.get("/u/:shortURL", (request, response) => {
  console.log("GET/u/SHORTURL");
  const longURL = urlDatabase[request.params.shortURL]['longURL'];
  if (!longURL) {
    response.sendStatus(404);
  }
  response.redirect(longURL);
});

app.get('/register', (request, response) => {
  console.log("GET/REGISTER");
  const userID = request.session['user_id'];
  const user = users[userID];
  const templateVars = {
    user: user
  };
  response.render("urls_registration", templateVars);
});

app.get('/invalid', (request, response) => {
  console.log('GET/INVALID REGISTRATION')
  const userID = request.session['user_id'];
  const user = users[userID];
  const templateVars = {
    user: user
  };
  response.render('urls_invalid', templateVars)
})

app.post('/urls', (request, response) => {
  const userID = request.session.user_id;
  const newLongURL = request.body.longURL;
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = {
    longURL: newLongURL,
    userID: userID
  };
  response.redirect(`/urls/${newShortURL}`);
});

app.post('/login', (request, response) => {
  console.log("POST/LOGIN");
  // if registered users are 0, redirect to register page
  if (Object.keys(users).length === 0) {
    alert("NEW USER")
    // setTimeout(() => {

      return response.redirect('invalid');
    // }, 3000)
  }

  // email & password check
  for (const existUserId in users) {
    const userID = users[existUserId];
    const hashedPassword = userID.password;
    const userPassword = request.body.password;
    // true or false
    const bcryptPasswordCheck = bcrypt.compareSync(userPassword, hashedPassword); 
    // if submitted email are not in the database, go to register page
    if (userID.email !== request.body.email) {
    alert("NEW USER")

    return response.redirect('invalid');
    }
    // if email & password both correct, redirect to main page
    if (bcryptPasswordCheck &&
      userID.email === request.body.email) {
      request.session['user_id'] = existUserId;
      return response.redirect('/urls');
    }
  }
  return response.status(409).redirect('https://httpstatusdogs.com/409-conflict');
});

app.post('/logout', (request, response) => {
  console.log("POST/LOGOUT");
  response.clearCookie('session');
  request.session = null;
  response.redirect('/logout');
});

app.post('/register', (request, response) => {
  console.log("POST/REGISTER");
  const newRandomID = generateRandomString();
  const submittedEmail = request.body.email;
  const submittedPassword = request.body.password;

  // if invalid email or password, let client know invalid information
  if (!submittedEmail || !submittedPassword) {
    return response.redirect('invalid')
  }
  // if submitted email is in the server's database, 
  if (getUserByEmail(submittedEmail, users) !== false) {
    return response.status(409).redirect('invalid');
  }

  // hashedPassword
  const hashedPssword = bcrypt.hashSync(submittedPassword, 10);
  users[newRandomID] = {
    id: newRandomID,
    email: submittedEmail,
    password: hashedPssword
  };
  request.session['user_id'] = newRandomID;
  // passed information goes '/'
  response.redirect('/');
});

app.post('/urls/:shortURL/delete', (request, response) => {
  console.log("POST/URLS:SHORTURL,delete");
  const shortURL = request.params.shortURL;
  const currentUserID = request.session.user_id;
  if (userIDSeeker(currentUserID, urlDatabase)) {
    delete urlDatabase[shortURL];
    return response.redirect('/urls');
  } else {
    return response.status(400).redirect('https://http.cat/400');
  }
});

app.post('/urls/:shortURL/edit', (request, response) => {
  console.log("POST/URLS:SHORTURL");
  const shortURL = request.params.shortURL;
  const currentUserID = request.session.user_id;
  if (userIDSeeker(currentUserID, urlDatabase)) {
    return response.redirect(`/urls/${shortURL}`);
  } else {
    return response.status(400).redirect('https://http.cat/400');
  }
});

app.post('/urls/:id', (request, response) => {
  console.log("POST/URLS:ID");
  const shortURL = request.params.id;
  const longURL = request.body.longURL;
  urlDatabase[shortURL]['longURL'] = longURL;
  response.redirect('/urls/');
});