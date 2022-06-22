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

const addSched = (longSched, userID, db) => {
  const dateCreation = new Date();
  const visitCount = 0;
  const visitHistory = [];
  const uVisitCount = 0;
  const visitorIDList = [];
  const shortSched = generateRandomString();
  db[shortSched] = { userID, longSched, dateCreation, visitCount, visitHistory, visitorIDList, uVisitCount };
  return shortSched;
};

const generateRandomString = () => {
  console.log('yo')
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

const ANAsched = require('./db/anaheim-ducks/ANAsched')
const ARIsched = require('./db/arizona-coyotes/ARIsched')
const BOSsched = require('./db/boston-bruins/BOSsched')
const BUFsched = require('./db/buffalo-sabres/BUFsched')
const CALsched = require('./db/calgary-flames/CALsched')
const CARsched = require('./db/carolina-hurricanes/CARsched')
const CHIsched = require('./db/chicago-blackhawks/CHIsched')
const COLsched = require('./db/colorado-avalanche/COLsched')
const CBJsched = require('./db/columbus-blue-jackets/CBJsched')
const DALsched = require('./db/dallas-stars/DALsched')
const DETsched = require('./db/detroit-red-wings/DETsched')
const EDMsched = require('./db/edmonton-oilers/EDMsched')
const FLOsched = require('./db/florida-panthers/FLOsched')
const LAKsched = require('./db/los-angeles-kings/LAKsched')
const MINsched = require('./db/minnesota-wild/MINsched')
const MTLsched = require('./db/montreal-canadiens/MTLsched')
const NASsched = require('./db/nashville-predators/NASsched')
const NJDsched = require('./db/new-jersey-devils/NJDsched')
const NYIsched = require('./db/new-york-islanders/NYIsched')
const NYRsched = require('./db/new-york-rangers/NYRsched')
const OTTsched = require('./db/ottawa-senators/OTTsched')
const PHIsched = require('./db/philadelphia-flyers/PHIsched')
const PITsched = require('./db/pittsburgh-penguins/PITsched')
const SJSsched = require('./db/san-jose-sharks/SJSsched')
const SEAsched = require('./db/seattle-kraken/SEAsched')
const STLsched = require('./db/st-louis-blues/STLsched')
const TBLsched = require('./db/tampa-bay-lightning/TBLsched')
const TMLsched = require('./db/toronto-maple-leafs/TMLsched')
const VANsched = require('./db/vancouver-canucks/VANsched')
const VGKsched = require('./db/vegas-golden-knights/VGKsched')
const WASsched = require('./db/washington-capitals/WASsched')
const WINsched = require('./db/winnipeg-jets/WINsched')




const scheduleComparison = (arr1, arr2, date) => {
  const sameDays = [];  // Array to contain match elements
  for(var i=0 ; i<arr1.length ; ++i) {
    for(var j=0 ; j<arr2.length ; ++j) {
      if (date >= arr1[i]) { // only access numbers greater than current date (later days)
        
      } else {
      if(arr1[i] == arr2[j]) {    // If element is in both the arrays
        sameDays.push(arr1[i]);        // Push to arr array
        }
      }
    }
  }
   
  return sameDays.length;  // Return the number of elements in sameDays 
}  

// --------------------- ALL ROUTES --------------------------- //

// homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/scheds");
  } else {
    res.redirect("/login");
  }
});

// SchedS
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
    const longSched = req.body.longSched;
    const shortSched = addSched(longSched, userID, schedDatabase);
    res.redirect(`/scheds/${shortSched}`);
  }
});

// Sched/NEW
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
  const longSched = req.body.longSched;
  const userID = req.session.user_id;
  const newSched = addSched(longSched, userID, schedDatabase);
  res.redirect(`/scheds/${newSched}`);
});


// SchedS/:SHORTSched
app.get("/scheds/:shortSched", (req, res) => {
  const shortSched = req.params.shortSched;
  const userID = req.session.user_id;
  if (!schedDatabase[shortSched]) {
    let templateVars = {
      status: 404,
      message: 'TinySched has not yet been born!!!',
    };
    res.status(404);
    res.render("scheds_error", templateVars);
  } else {
    const longSched = schedDatabase[shortSched].longSched;
    let templateVars = {user: userID, scheds: schedsForUser(userID), longSched, shortSched};
    res.render("scheds_show", templateVars);
  }
});

app.post("/scheds/:shortSched", (req, res) => {
  const shortSched = req.params.shortSched;
  const longSched = req.body.longSched;
  const newDate = new Date();
  if (req.session.user_id === schedDatabase[shortSched].userID) {
    schedDatabase[shortSched].longSched = longSched;
    schedDatabase[shortSched].visitCount = 0;
    schedDatabase[shortSched].visitHistory = [];
    schedDatabase[shortSched].uVisitCount = 0;
    schedDatabase[shortSched].visitorIDList = [];
    schedDatabase[shortSched].dateCreation = newDate;
    res.redirect(`/scheds/${shortSched}`);
  } else {
    let templateVars = {
      status: 401,
      message: "Hey! You can't make changes to that TinySched!!!",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  }
});

// SchedS/:SHORTSched/DELETE
app.post("/scheds/:shortSched/delete", (req,res) => {
  const shortSched = req.params.shortSched;
  if (req.session.user_id === schedDatabase[shortSched].userID) {
    delete schedDatabase[req.params.shortSched];
    res.redirect("/scheds");
  } else {
    let templateVars = {
      status: 401,
      message: "Hey! You can't delete that TinySched!!!",
      user: users[req.session.user_id]
    };
    res.status(401);
    res.render("scheds_error", templateVars);
  }
});

// U/:SHORTSched
app.get("/u/:shortSched", (req, res) => {
  const shortSched = req.params.shortSched;
  const longSched = schedDatabase[shortSched].longSched;
  const dateVisit = new Date();
  if (!schedDatabase[shortSched]) {
    let templateVars = {
      status: 404,
      message: "Hey! This TinySched ain't been born yet!",
      user: users[req.session.user_id]
    };
    res.status(404);
    res.render("scheds_error", templateVars);
  } else if (!req.session.user_id) {
    req.session.user_id = generateRandomString();
    schedDatabase[shortSched].visitHistory.push([dateVisit,req.session.user_id]);
    schedDatabase[shortSched].visitCount++;
    schedDatabase[shortSched].visitorIDList.push(req.session.user_id);
    schedDatabase[shortSched].uVisitCount++;
  } else {
    const visitorId = schedDatabase[shortSched].visitorIDList;
    schedDatabase[shortSched].visitHistory.push([dateVisit,req.session.user_id]);
    schedDatabase[shortSched].visitCount++;
    if (!visitorId.includes(req.session.user_id)) {
      visitorId.push(req.session.user_id);
      schedDatabase[shortSched].uVisitCount++;
    }
  }
  if (longSched.startsWith("http://")) {
    res.redirect(longSched);
  } else {
    res.redirect(`http://${longSched}`);
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