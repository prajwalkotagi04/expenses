// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // default MySQL username in XAMPP
  password: '', // default MySQL password is empty
  database: 'expenses_db', // the database you created in phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// POST endpoint to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = `SELECT * FROM login WHERE email = ?`;
  db.execute(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch data', error: err });
    }

    if (results.length > 0) {
      const user = results[0];
      if (user.password === password) {
        res.status(200).json({ message: 'Login successful!', user });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// API endpoint to add an expense
app.post('/expenses', (req, res) => {
  const { amount, category, date, time, paymentMethod, location, note } = req.body;

  if (!amount || !category || !date || !time || !paymentMethod || !location || !note) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO expenses (amount, category, date, time, paymentMethod, location, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(query, [amount, category, date, time, paymentMethod, location, note], (err, results) => {
    if (err) {
      console.error('Error inserting expense:', err);
      res.status(500).json({ message: 'Failed to add expense', error: err });
    } else {
      res.status(201).json({ message: 'Expense added successfully!', expenseId: results.insertId });
    }
  });
});

// API endpoint to get all expenses
app.get('/expenses', (req, res) => {
  const query = 'SELECT * FROM expenses';

  db.execute(query, (err, results) => {
    if (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ message: 'Failed to fetch expenses', error: err });
    } else {
      res.status(200).json({ expenses: results });
    }
  });
});

// Delete an expense by ID
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM expenses WHERE id = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting expense:', err);
      res.status(500).json({ message: 'Failed to delete expense', error: err });
    } else if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  });
});

// PUT endpoint to update an expense
app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, paymentMethod, location, note } = req.body;

  const query = `
    UPDATE expenses
    SET amount = ?, category = ?, paymentMethod = ?, location = ?, note = ?
    WHERE id = ?
  `;

  db.execute(
    query,
    [amount, category, paymentMethod, location, note, id],
    (err, results) => {
      if (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ message: 'Failed to update expense', error: err });
      } else {
        res.status(200).json({ message: 'Expense updated successfully!' });
      }
    }
  );
});


// POST endpoint to fetch dashboard data (today, yesterday, month, year)
app.post('/dashboard', (req, res) => {
  console.log("Request received at /dashboard route");

  const todayQuery = `SELECT SUM(amount) AS todayexpenses FROM expenses WHERE DATE(date) = CURDATE()`;
  const yesterdayQuery = `SELECT SUM(amount) AS yesterdayexpenses FROM expenses WHERE DATE(date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
  const monthQuery = `SELECT SUM(amount) AS monthexpenses FROM expenses WHERE YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE())`;
  const yearQuery = `SELECT SUM(amount) AS yearexpenses FROM expenses WHERE YEAR(date) = YEAR(CURDATE())`;

  Promise.all([
    new Promise((resolve, reject) => {
      db.execute(todayQuery, (err, results) => {
        if (err) {
          console.error("Error with today query:", err);
          reject(err);
        } else {
          resolve(results[0]?.todayexpenses || 0);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.execute(yesterdayQuery, (err, results) => {
        if (err) {
          console.error("Error with yesterday query:", err);
          reject(err);
        } else {
          resolve(results[0]?.yesterdayexpenses || 0);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.execute(monthQuery, (err, results) => {
        if (err) {
          console.error("Error with month query:", err);
          reject(err);
        } else {
          resolve(results[0]?.monthexpenses || 0);
        }
      });
    }),
    new Promise((resolve, reject) => {
      db.execute(yearQuery, (err, results) => {
        if (err) {
          console.error("Error with year query:", err);
          reject(err);
        } else {
          resolve(results[0]?.yearexpenses || 0);
        }
      });
    }),
  ])
    .then(([todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses]) => {
      // const insertQuery = `
      //   INSERT INTO dashboard (todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses)
      //   VALUES (?, ?, ?, ?)
      //   ON DUPLICATE KEY UPDATE
      //     todayexpenses = VALUES(todayexpenses),
      //     yesterdayexpenses = VALUES(yesterdayexpenses),
      //     monthexpenses = VALUES(monthexpenses),
      //     yearexpenses = VALUES(yearexpenses)
      // `;
      const insertQuery = `
    REPLACE INTO dashboard (id, todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses)
    VALUES (1, ?, ?, ?, ?)
`;

      db.execute(
        insertQuery,
        [todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses],
        (err, results) => {
          if (err) {
            console.error("Error updating dashboard:", err);
            res.status(500).json({ message: 'Failed to update dashboard', error: err });
          } else {
            res.status(200).json({
              message: 'Dashboard updated successfully',
              data: { todayexpenses, yesterdayexpenses, monthexpenses, yearexpenses },
            });
          }
        }
      );
    })
    .catch((err) => {
      console.error('Error calculating expenses:', err);
      res.status(500).json({ message: 'Failed to calculate expenses', error: err });
    });
});

// Start the server on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
