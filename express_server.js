/* eslint-disable camelcase */
const express = require("express");
const app = express();
const PORT = 8090; // default port 8080
const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');
const cookieSession = require('cookie-session');

// -----------------FOR SOME REASON, COULD NOT LINK HELPERS.JS AND DATABASE.JS WITHOUT ERROR----------------- //
const schedDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

const addURL = (longURL, userID, db) => {
  const dateCreation = new Date();
  const visitCount = 0;
  const visitHistory = [];
  const uVisitCount = 0;
  const visitorIDList = [];
  const shortURL = generateRandomString();
  db[shortURL] = { userID, longURL, dateCreation, visitCount, visitHistory, visitorIDList, uVisitCount };
  return shortURL;
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
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

const schedsForUser = (id) => {
  let filtered = {};
  for (let schedID of Object.keys(schedDatabase)) {
    if (schedDatabase[schedID].userID === id) {
      filtered[schedID] = schedDatabase[schedID];
    }
  }
  return filtered;
};


app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cookieSession({
    name: 'session',
    keys: [' '],
  })
);

app.set("view engine", "ejs");

// --------------------- ALL ROUTES --------------------------- //

// homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/scheds");
  } else {
    res.redirect("/login");
  }
});

// URLS
app.get("/scheds", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    scheds: schedsForUser(req.session.user_id, schedDatabase)
  };
  res.render("scheds_index", templateVars);
});


app.post("/scheds", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    let templateVars = {
      status: 401,
      message: 'Hey, Fool! You need to login first!',
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  } else {
    const longURL = req.body.longURL;
    const shortURL = addURL(longURL, userID, schedDatabase);
    res.redirect(`/scheds/${shortURL}`);
  }
});

// URLS/NEW
app.get("/scheds/new", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (templateVars.user) {
    res.render("scheds_new", templateVars);
  } else {
    res.render("scheds_login", templateVars);
  }
});


app.post("/scheds/new", (req, res) => {
  console.log(req.body);
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const newURL = addURL(longURL, userID, schedDatabase);
  res.redirect(`/scheds/${newURL}`);
});


// URLS/:SHORTURL
app.get("/scheds/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;
  if (!schedDatabase[shortURL]) {
    let templateVars = {
      status: 404,
      message: 'TinyURL has not yet been born!!!',
    };
    res.status(404);
    res.render("scheds_error", templateVars);
  } else {
    const longURL = schedDatabase[shortURL].longURL;
    let templateVars = {user: userID, scheds: schedsForUser(userID), longURL, shortURL};
    res.render("scheds_show", templateVars);
  }
});

app.post("/scheds/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const newDate = new Date();
  if (req.session.user_id === schedDatabase[shortURL].userID) {
    schedDatabase[shortURL].longURL = longURL;
    schedDatabase[shortURL].visitCount = 0;
    schedDatabase[shortURL].visitHistory = [];
    schedDatabase[shortURL].uVisitCount = 0;
    schedDatabase[shortURL].visitorIDList = [];
    schedDatabase[shortURL].dateCreation = newDate;
    res.redirect(`/scheds/${shortURL}`);
  } else {
    let templateVars = {
      status: 401,
      message: "Hey! You can't make changes to that TinyURL!!!",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  }
});

// URLS/:SHORTURL/DELETE
app.post("/scheds/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id === schedDatabase[shortURL].userID) {
    delete schedDatabase[req.params.shortURL];
    res.redirect("/scheds");
  } else {
    let templateVars = {
      status: 401,
      message: "Hey! You can't delete that TinyURL!!!",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  }
});

// U/:SHORTURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = schedDatabase[shortURL].longURL;
  const dateVisit = new Date();
  if (!schedDatabase[shortURL]) {
    let templateVars = {
      status: 404,
      message: "Hey! This TinyURL ain't been born yet!",
      user: users[req.session.user_id]
    };
    res.status(404);
    res.render("scheds_error", templateVars);
  } else if (!req.session.user_id) {
    req.session.user_id = generateRandomString();
    schedDatabase[shortURL].visitHistory.push([dateVisit,req.session.user_id]);
    schedDatabase[shortURL].visitCount++;
    schedDatabase[shortURL].visitorIDList.push(req.session.user_id);
    schedDatabase[shortURL].uVisitCount++;
  } else {
    const visitorId = schedDatabase[shortURL].visitorIDList;
    schedDatabase[shortURL].visitHistory.push([dateVisit,req.session.user_id]);
    schedDatabase[shortURL].visitCount++;
    if (!visitorId.includes(req.session.user_id)) {
      visitorId.push(req.session.user_id);
      schedDatabase[shortURL].uVisitCount++;
    }
  }
  if (longURL.startsWith("http://")) {
    res.redirect(longURL);
  } else {
    res.redirect(`http://${longURL}`);
  }
});

// LOGIN
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("/scheds");
  } else {
    res.render("scheds_login", templateVars);
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
    res.render("scheds_error", templateVars);
  } else if (!bcryptjs.compareSync(password, user.password)) {
    let templateVars = {
      status: 401,
      message: "BRRR Password Incorrecto",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  } else {
    req.session.user_id = user.id;
    res.redirect("/scheds");
  }
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/scheds");
});

// REGISTER
app.get("/register", (req,res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  if (templateVars.user) {
    res.redirect("/scheds");
  } else {
    res.render("scheds_register", templateVars);
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
    res.render("scheds_error", templateVars);
    ("so... your email and/or password is missing...");
  } else if (getUserByEmail(email, users)) {
    let templateVars = {
      status: 409,
      message: "Uh... that email is already registered sooo.....",
      user: users[req.session.user_id]
    };
    res.status(409);
    res.render("scheds_error", templateVars);
  } else {
    const user_id = addUser(email, password, users);
    req.session.user_id = user_id;
    res.redirect("/scheds");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});