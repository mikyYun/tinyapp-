
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const express = require('express');
const app = express();
const PORT = 8080;


app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {};

app.get('/', (request, response) => {
  response.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>\n')
})

app.get('/urls', (request, response) => {
  const templateVars = {
    urls: urlDatabase,
    username: request.cookies['username']
  }
  response.render('urls_index', templateVars);
});

app.get("/urls/new", (request, response) => {
  const templateVars = {
    urls: urlDatabase,
    username: request.cookies['username']
  }
  response.render("urls_new", templateVars);// rendering
});

app.get("/urls/:shortURL", (request, response) => {
  const templateVars = { shortURL: request.params.shortURL,
    longURL: urlDatabase[request.params.shortURL],
    username: request.cookies['username']
  };
  response.render("urls_show", templateVars);
});

app.get('/urls/logout', (request, response) => {
  console.log("TEST", request.cookies)
  response.render("/urls_logout");

})

function generateRandomString () {
  let randomString = Math.random().toString(32)
  return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6)
}

app.post('/urls', (request, response) => {
  const newLongURL = request.body.longURL
  const newShortURL = generateRandomString()
  urlDatabase[newShortURL] = newLongURL;
  console.log(urlDatabase)
  response.redirect(`/urls/${newShortURL}`)

})

app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL]
  if (!longURL) {
    response.sendStatus(404)
  }
  response.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDatabase[request.params.shortURL]
  response.redirect('/urls')
})

app.post('/urls/:shortURL/edit', (request, response) => {
  console.log(request.params)
  const shortURL = request.params.shortURL
  response.redirect(`/urls/${shortURL}`)
})

app.post('/urls/:id', (request, response) => {
  
  const shortURL = request.params.id
  const longURL = request.body.longURL
  urlDatabase[shortURL] = longURL
  response.redirect('/urls/')
})

app.post('/login', (request, response) => {
  const newUserId = request.body.username
  response.cookie('username', newUserId)
  response.redirect('/urls')
})
app.post('/logout', (request, response) => {
  console.log("TEST", request.cookies)
  response.clearCookie('username')

  response.redirect('/urls/urls_logout')
})
