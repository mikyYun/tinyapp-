// When sending variables to an EJS template, we need to send them inside an object, enven if we are only sending one variable.
// This is so we can use the key of that variable (in the above case the key is urls)
// to access the data within our template

// from the .js file
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

// In the example above, the templateVars object contains the string 'Hello World' under the key greeting.
// We then pass the templateVars object to the template called hello_world
// In our hello_world.ejs file, we can display the 'Hello World!' string stored in the templateVars object by calling the key greeting:

// from the .ejs file
<!-- This would display the string "Hello World!" -->
<h1><%= greeting %></h1>

// By using the <%= %> syntax, we tell EJS that we want the result of this code to show up on our page.
// If we would like to reun some code without it displaying on the page, then we can use the slightly different syntax of <% %>.
// For example, if we only wanted to show our greeting if it has a value, then we could do something like this below..

// .ejs
<!-- This line will not show up on the page -->
<% if(greeting) {%>
  <!-- This line will only show if greeting is truthy -->
  <h1><%= greeting %></h1>
<% }%>
