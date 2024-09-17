const jwt = require('jsonwebtoken')

function isValidUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ error: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({ error: 'Invalid token' });
        }
        return res.status(403).json({ error: 'Could not authenticate token' });
      }
  
      // Token is valid, attach user info to request and proceed
      req.body.user = user;
      next();
    });
  }

const parseHeader = (header="") => {
    let token = "";
    if(header.includes("bearer ") || header.includes("Bearer ")){
        const tmp = header.split(" ")
        if(tmp.length > 1)
            token = tmp[1]
    }
    else token = header
    return token;
}

module.exports = {
    isValidUser,
    parseHeader
}