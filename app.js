const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const { auth, requiresAuth } = require("express-openid-connect");
const database = require("./database");

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.DOMAIN,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
  })
);

/* // auth router attaches /login, /logout, and /callback routes to the baseURL
 */

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send("Logged In");
    dbEmail = `INSERT or IGNORE into customer (email, name) values ('${req.oidc.user.email}','${req.oidc.user.name}')`;
    console.log(req.oidc.user.email);
    dbEmail = `insert into customer (email, name) values ('${req.oidc.user.email}','${req.oidc.user.name}')`;
    database.connection.all(dbEmail);
  } else {
    res.send("Logged Out");
  }
});
/*
dbEmail = `insert into customer (email, name) values ('${req.oidc.user.email}','${req.oidc.user.name}')`;
console.log(req.oidc.user.email);
if (req.oidc.isAuthenticated()) {
    database.connection.all(dbEmail, (errors, results) => {
      if (errors) {
        res.status(500).send("Some error occurred" + dbEmail);
      } else {
        res.status(200).send(results);
      }
    });
  } 
});*/

app.get("/add", (req1, res1) => {
  console.log(req1.query.all);
  database.connection.all(
    `insert into customer (email, name) values ('${req1.oidc.user.email}','${req1.oidc.user.name}')`,
    (errors, results) => {
      if (errors) {
        res1.status(500).send("Some error occurred");
      } else {
        res1
          .status(200)
          .send(
            "User's name and email added into database if the email is not found."
          );
      }
    }
  );
});

/* app.get();
app.get("/profile", requiresAuth(), (req, res) => {
  res.send(`hello ${req.oidc.user.name}`);
}); */

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/login");
});

app.get("/profile", requiresAuth(), (req, res) => {
  console.log(req.oidc.user);
  // console.log(useProfile);
  const stringObj = JSON.stringify(req.oidc.user);
  res.send(req.oidc.user);
});

/* app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged In" : "Logged Out"); 
});*/
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
