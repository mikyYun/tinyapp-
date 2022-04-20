// body-parser library will convert the request body from a Buffer into string that we can read.
// It will then add the data to the request objcet under the key body
// the data in the 'input' filed will be available to us in the request.body.longURL variable that we can store in 'urlDatabase' object
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
// const { response } = require('express');

const express = require('express');
const app = express();
const PORT = 8080;

// app.set('view engine', 'ejs');
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  // 'b2xVn2': 'http://www.lighthouselabs.ca',
  // '9sm5xK': 'http://www.google.com'
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
  const templateVars = {
    urls: urlDatabase,
    username: request.cookies['username']
  }
  // console.log(request.cookies)
  // console.log('Cookies: ', request.cookies)
  response.render('urls_index', templateVars);
});

// The order of route definition matters.
// GET /urls/new route needs to be difined before the :id. Routes defined earlier will take precedence -> if we place this route after :id, any calls to /urls/new will be handled by app.get('/urls/:id', ...) because Express will think that 'new' is a route parameter
app.get("/urls/new", (request, response) => {
  const templateVars = {
    urls: urlDatabase,
    username: request.cookies['username']
  }
  response.render("urls_new", templateVars);// rendering
});

app.get("/urls/:shortURL", (request, response) => {
  const templateVars = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL], username: request.cookies['username'] };
  response.render("urls_show", templateVars);
  // response.render("./partials/urls_show_copy.html", templateVars);
});

// app.get('/urls/login', (request, response) => {
//   console.log("TEST", request.cookies)

//   // response.redirect('/urls')
//   response.render("/urls_logout");

// })

app.get('/urls/logout', (request, response) => {
  console.log("TEST", request.cookies)

  // response.redirect('/urls')
  response.render("/urls_logout");

})

function generateRandomString () {
  let randomString = Math.random().toString(32)
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
  if (!longURL) {
    response.sendStatus(404)
  }
  response.redirect(longURL);
  // console.log(request.params);
});

app.post('/urls/:shortURL/delete', (request, response) => {
  // console.log(request.params, "REQUEST")
  // console.log(urlDatabase)
  // console.log(request.params)
  delete urlDatabase[request.params.shortURL]
  response.redirect('/urls')
})

app.post('/urls/:shortURL/edit', (request, response) => {
  // console.log(request.params, "REQUEST")
  // console.log(urlDatabase)
  // console.log(request.params)
  console.log(request.params)
  const shortURL = request.params.shortURL
  response.redirect(`/urls/${shortURL}`)
})

app.post('/urls/:id', (request, response) => {
  
  console.log("TEST", request.params.id)
  const shortURL = request.params.id
  // const edit
  // console.log("TEST", request)
  console.log("FIRST", urlDatabase)
  const longURL = request.body.longURL
  urlDatabase[shortURL] = longURL
  console.log("SECOND", urlDatabase)

  // const newLongURL = request.body.longURL
  // const newShortURL = generateRandomString()
  // console.log(newShortURL);
  // urlDatabase[newShortURL] = newLongURL;
  response.redirect('/urls/')
})

// app.get('/login', (request, response) => {
//   console.log(request)
// })

app.post('/login', (request, response) => {
  // console.log(request.body.username)
  const newUserId = request.body.username
  response.cookie('username', newUserId)
  // console.log(newUserId)
  // console.log(response.cookie(newUserId))
  response.redirect('/urls')
})
app.post('/logout', (request, response) => {
  console.log("TEST", request.cookies)
  response.clearCookie('username')

  response.redirect('/urls/urls_logout')
})
// app.post('/logout', (request, response) => {
  // console.log(request.body.username)
  // console.log(request.cookies)
  // response.clearCookie('username')
  // response.clearCookeis(request.cookies.username)
  // console.log("cookie removed!!")
  // const newUserId = request.body.username
  // response.cookie('username', newUserId)
  // console.log('username!!!!')
  // console.log(response.cookie(newUserId))
  // response.redirect('/urls')
// })
// app.use(cookieParser());


// /pkill node