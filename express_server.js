const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');
const cookieSession = require('cookie-session');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const getUserByEmail = (email, database) => {
  return Object.values(database).find(user => user.email === email);
};

const addUser = (email, password) => {
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  return id;
};

// homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// LOGIN
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("urls_login", templateVars);
  }
});

app.post("/login", (req,res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    let templateVars = {
      status: 401,
      message: "Can't find email.... where is it?",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("urls_error", templateVars);
  } else if (!bcryptjs.compareSync(password, user.password)) {
    let templateVars = {
      status: 401,
      message: "BRRR Password Incorrecto",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("urls_error", templateVars);
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// REGISTER
app.get("/register", (req,res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  let user = {email: 'undefined'};
  if (!email || !password) {
    let templateVars = {
      status: 400,
      message: "so... your email and/or password is missing...",
      user
    };
    res.status(401);
    res.render("urls_error", templateVars);
    ("so... your email and/or password is missing...");
  } else if (getUserByEmail(email, users)) {
    let templateVars = {
      status: 409,
      message: "Uh... that email is already registered sooo.....",
      user: users[req.session.user_id]
    };
    res.status(409);
    res.render("urls_error", templateVars);
  } else {
    const user_id = addUser(email, password, users);
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});