// Node.js + Express server backend for ind-sym-map
// use SQLite (https://www.sqlite.org/index.html) as a database
//
// run this once to initialize the database as the data.db file
//   node init_db.js
//     or
//   npm run initDB

// In order to clear the database, delete the data.db file:
//   rm data.db

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/data.db');

// runs each database statement *serially* one after another
// (alternative is to run all statements will run in parallel, which we don't want)
db.serialize(() => {
  db.run("CREATE TABLE users (Id INTEGER PRIMARY KEY AUTOINCREMENT, orgName TEXT NOT NULL, email varchar(255) NOT NULL, hashedPassword TEXT NOT NULL)");

  console.log('Successfully created the users table in data.db');

  // dummy data:
  db.run("INSERT INTO users (orgName, email, hashedPassword) VALUES ('Vatten AB', 'admin@va.se', '$2b$10$pQNU6yWdqQazcjykk7z5O.sAvEPWSyceltm5yw.cHELouR2490tQK')");
  db.run("INSERT INTO users (orgName, email, hashedPassword) VALUES ('Energi AB', 'energi@energi.com', '$2b$10$pQNU6yWdqQazcjykk7z5O.sAvEPWSyceltm5yw.cHELouR2490tQK')"); // password is hh

  db.each("SELECT orgName, email, hashedPassword FROM users", (err, row) => {
      console.log(row.orgName + ": " + row.email + ' - ' + row.hashedPassword);
  });
});

db.close();
