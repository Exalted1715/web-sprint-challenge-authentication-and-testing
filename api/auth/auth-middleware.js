
const db = require('../../data/dbConfig.js')


  function findBy(filter) {
    return db('users')
      .select('id', 'username', 'password')
      .where(filter)
  
  }

  const validateRequestBody = (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }
  
    // If username and password are provided, proceed to the next middleware
    next();
  };

  const checkUserNameExists = async (req, res, next) => {
    try {
        const [user] = await findBy({ username: req.body.username });
        if (user) {
            return res.status(401).json({ message: 'username taken' });
        } else {
            // If the username doesn't exist, proceed to the next middleware
            next();
        }
    } catch (err) {
        // Handle any errors that might occur during the database query
        next(err);
    }
};




module.exports = {
    checkUserNameExists,
    validateRequestBody
}