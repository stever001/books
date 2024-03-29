const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function to be used as middleware in the context of Apollo Server
  authMiddleware: function ({ req }) {
    // New context for storing user data
    let authToken = null;
    let user = null;

    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // if no token, return null user in the context
    if (!token) {
      return { user };
    }

    // Verify token and get user data out of it
    try {
      // we don't need to send the error response like before,
      // just assign the user data to context or null if no valid token
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      user = data;
    } catch {
      console.log('Invalid token');
      user = null;
    }

    // Return the new context with the user and token
    return { user, authToken: token };
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

