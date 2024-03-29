// schemas/resolvers.js
const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Resolvers will go here
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    // Mutation resolvers will go here
    login: async (parent, { email, password }) => {
      // ... login logic
    },
    addUser: async (parent, args) => {
      // ... add user logic
    },
    saveBook: async (parent, { bookData }, context) => {
      // ... save book logic
    },
    removeBook: async (parent, { bookId }, context) => {
      // ... remove book logic
    },
  },
};

module.exports = resolvers;
