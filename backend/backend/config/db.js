// db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database: ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to close the database connection gracefully
const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database: ' + err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
};

// Handle process exit events
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = { db, closeDatabase };
