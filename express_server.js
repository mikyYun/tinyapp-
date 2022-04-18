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




