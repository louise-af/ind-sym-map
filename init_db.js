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
  db.run("CREATE TABLE users (Id INTEGER PRIMARY KEY AUTOINCREMENT, OrgName TEXT NOT NULL, Email varchar(255) NOT NULL, HashedPassword TEXT NOT NULL)");

  console.log('Successfully created the users table in data.db');

  // dummy data:
  db.run("INSERT INTO users (OrgName, Email, HashedPassword) VALUES ('Vatten AB', 'admin@va.se', '$2b$10$pQNU6yWdqQazcjykk7z5O.sAvEPWSyceltm5yw.cHELouR2490tQK')");
  db.run("INSERT INTO users (OrgName, Email, HashedPassword) VALUES ('Energi AB', 'energi@energi.com', '$2b$10$pQNU6yWdqQazcjykk7z5O.sAvEPWSyceltm5yw.cHELouR2490tQK')"); // password is hh

  db.each("SELECT OrgName, Email, HashedPassword FROM users", (err, row) => {
      console.log(row.OrgName + ": " + row.Email + ' - ' + row.HashedPassword);
  });
});

db.close();
