// body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the request objcet under the key body
// the data in the 'input' filed will be available to us in the request.body.longURL variable that we can store in 'urlDatabase' object
const bodyParser = require('body-parser');
const { response } = require('express');

const express = require('express');
const app = express();
const PORT = 8080;

// app.set('view engine', 'ejs');
app.set("view engine", "ejs");

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (request, response) => {
  response.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Adding routes
app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

// Sending HTML
app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>\n')
})

// new route handler for '/urls'. and pass the url data to our template by using .render()
app.get('/urls', (request, response) => {
  const templateVars = { urls: urlDatabase };
  response.render('urls_index', templateVars);
});

// The order of route definition matters.
// GET /urls/new route needs to be difined before the :id. Routes defined earlier will take precedence -> if we place this route after :id, any calls to /urls/new will be handled by app.get('/urls/:id', ...) because Express will think that 'new' is a route parameter
app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:shortURL", (request, response) => {
  const templateVars = { shortURL: request.params.shortURL, longURL: request.params.longURL };
  response.render("urls_show", templateVars);
});

app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString () {
  let randomString = Math.random().toString(36)
  return randomString.length === 13 ? randomString.slice(7) : randomString.slice(6)
}


app.post('/urls', (request, response) => {
  // console.log(request.body.longURL);
  const newLongURL = request.body.longURL
  const newShortURL = generateRandomString()
  // console.log(newShortURL);
  urlDatabase[newShortURL] = newLongURL;
  console.log(urlDatabase)
  // response.send('OK');
  response.redirect(`/urls/${newShortURL}`)

})

app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL]
  response.redirect(longURL);
  // console.log(request.params);
});
