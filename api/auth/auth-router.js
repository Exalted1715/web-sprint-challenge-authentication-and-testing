const router = require('express').Router();
const { checkUserNameExists } = require("./auth-middleware");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../../secrets');
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig');

router.post('/register', checkUserNameExists, async (req, res) => {
  const { username, password } = req.body;

  // Step 3: Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
  }

  try {
      // Step 1: Hash the password
      const hash = bcrypt.hashSync(password, 8);

      // Step 2: Insert the new user into the database
      await db('users').insert({ username, password: hash });

      // Step 3: Retrieve the newly inserted user's ID
      const newUser = await db('users').where({ username }).first();

      // Step 4: Generate a JWT token for the new user
      const token = buildToken(newUser);

      // Step 5: Return the user details along with the token
      res.status(201).json({
          id: newUser.id, // Use newUser.id instead of newUser.user_id
          username: newUser.username,
          password: newUser.password,
          token
      });
  } catch (error) {
      // Step 6: Handle any errors that occur during registration
      res.status(500).json({ message: "Error registering user" });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Step 3: Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
    }

    try {
        // Step 1: Find the user by username in the database
        const [user] = await db('users').where({ username });

        // Step 2: Check if the user exists and if the password is correct
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        // Step 2: Generate a JWT token for the authenticated user
        const token = buildToken(user);

        // Step 2: Return a success message and the token
        res.json({ message: `Welcome, ${user.username}`, token });
    } catch (error) {
        // Step 4: Handle any errors that occur during login
        res.status(500).json({ message: "error logging in" });
    }
});



function buildToken(user) {
    // Construct JWT payload
    const payload = {
        subject: user.id,
        username: user.username,
    };

    // Set options for JWT token
    const options = {
        expiresIn: '1d',
    };

    // Sign the payload and return the JWT token
    return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
