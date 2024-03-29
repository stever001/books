const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas'); // Adjust the path as needed
const { authMiddleware } = require('./utils/auth'); // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3001;

// Create a new instance of Apollo server and pass typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // If authMiddleware is async, wrap it with a function: ({ req }) => authMiddleware({ req })
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Integrate Apollo server with Express application as middleware
server.applyMiddleware({ app });

// Replace the existing routes middleware with your GraphQL endpoint
// app.use(routes); // This line can be removed since Apollo Server replaces the RESTful API

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

