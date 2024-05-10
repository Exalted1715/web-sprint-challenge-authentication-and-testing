
const db = require('../../data/dbConfig.js')


  function findBy(filter) {
    return db('users')
      .select('user_id', 'username', 'password')
      .where(filter)
  
  }


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

}