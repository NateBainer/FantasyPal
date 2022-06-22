/* eslint-disable camelcase */
const express = require("express");
const app = express();
const PORT = 8090; // default port 8090
const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');
const cookieSession = require('cookie-session');

// -----------------FOR SOME REASON, COULD NOT LINK HELPERS.JS AND DATABASE.JS WITHOUT ERROR----------------- //
const schedDatabase = {
 
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

const addSched = (teamOne, teamTwo, numOfGames, dateSearched, user_id) => {
  if (user_id in schedDatabase) {
    schedDatabase[user_id].push({ teamOne, teamTwo, numOfGames, dateSearched, userID: user_id });

  } else {
    schedDatabase[user_id] = [{ teamOne, teamTwo, numOfGames, dateSearched, userID: user_id}];
  }
  // return schedDatabase[shortSched];
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


//do this for all other teams
const scheduleLookup = {
  "Anaheim Ducks": require('./db/anaheim-ducks/ANAsched'),
  "Arizona Coyotes": require('./db/arizona-coyotes/ARIsched'),
  "Boston Bruins": require('./db/boston-bruins/BOSsched'),
  "Buffalo Sabres": require('./db/buffalo-sabres/BUFsched'),
  "Calgary Flames": require('./db/calgary-flames/CALsched'),
  "Carolina Hurricanes": require('./db/carolina-hurricanes/CARsched'),
  "Chicago Blackhawks": require('./db/chicago-blackhawks/CHIsched'),
  "Colorado Avalanche": require('./db/colorado-avalanche/COLsched'),
  "Columbus Blue Jackets": require('./db/columbus-blue-jackets/CBJsched'),
  "Dallas Stars": require('./db/dallas-stars/DALsched'),
  "Detroit Red Wings": require('./db/detroit-red-wings/DETsched'),
  "Edmonton Oilers": require('./db/edmonton-oilers/EDMsched'),
  "Florida Panthers": require('./db/florida-panthers/FLOsched'),
  "Los Angeles Kings": require('./db/los-angeles-kings/LAKsched'),
  "Minnesota Wild": require('./db/minnesota-wild/MINsched'),
  "Montreal Canadiens": require('./db/montreal-canadiens/MTLsched'),
  "Nashville Predators": require('./db/nashville-predators/NASsched'),
  "New Jersey Devils": require('./db/new-jersey-devils/NJDsched'),
  "New York Islanders": require('./db/new-york-islanders/NYIsched'),
  "New York Rangers": require('./db/new-york-rangers/NYRsched'),
  "Ottawa Senators": require('./db/ottawa-senators/OTTsched'),
  "Philadelphia Flyers": require('./db/philadelphia-flyers/PHIsched'),
  "Pittsburgh Penguins": require('./db/pittsburgh-penguins/PITsched'),
  "San Jose Sharks": require('./db/san-jose-sharks/SJSsched'),
  "Seattle Kraken": require('./db/seattle-kraken/SEAsched'),
  "St Louis Blues": require('./db/st-louis-blues/STLsched'),
  "Tampa Bay Lightning": require('./db/tampa-bay-lightning/TBLsched'),
  "Toronto Maple Leafs": require('./db/toronto-maple-leafs/TMLsched'),
  "Vancouver Canucks": require('./db/vancouver-canucks/VANsched'),
  "Vegas Golden Knights": require('./db/vegas-golden-knights/VGKsched'),
  "Washington Capitals": require('./db/washington-capitals/WASsched'),
  "Winnipeg Jets": require('./db/winnipeg-jets/WINsched')
  }



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

// Scheds
app.get("/scheds", (req, res) => {
  console.log("Matchup", schedDatabase[req.session.user_id])
  console.log(schedDatabase)
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

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/scheds/new", (req, res) => {
  console.log(req.body, 'hello there');
  const teamOneSched = scheduleLookup[req.body["team-one"]];
  const teamTwoSched = scheduleLookup[req.body["team-two"]];
  const numOfGames = scheduleComparison(teamOneSched, teamTwoSched, req.body.date);
  const dateSearched = req.body["Date"];
  addSched(req.body["team-one"], req.body["team-two"], numOfGames, dateSearched, req.session.user_id);
  res.render("scheds_show", {teamOne: req.body["team-one"], teamTwo: req.body["team-two"], numOfGames, dateSearched, user: users[req.session.user_id]});
});


// Scheds/:SHORTSched
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



// SchedsDELETE
app.post("/scheds", (req, res) => {

})



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