import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import { ApolloServer, gql } from 'apollo-server-koa';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import db from './src/models';

const app = new Koa();

const typeDefs = gql`
scalar Date

type Query {
  events: [Event!]!
}

type Event {
  id: ID!
  name: String,
  description: String,
  startAt: Date,
  endAt: Date
}

type Mutation {
  createEvent(
    name: String!,
    description: String,
    startAt: Date!
    endAt: Date
  ): Event!

  updateEvent(
    id: ID!
    name: String,
    description: String,
    startAt: Date
    endAt: Date
  ): [Int!]!

  deleteEvent(id: ID!): Int!
}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    events: (parent, { name, description, startAt, endAt }, { db }, info) =>
      db.event.findAll()
  },
  Mutation: {
    createEvent: (parent, { name, description, startAt, endAt }, { db }, info) => {
      return db.event.create({
        name: name,
        description: description,
        startAt: startAt,
        endAt: endAt
      })
    },
    updateEvent: (parent, { id, name, description, startAt, endAt }, { db }, info) => {
      return db.event.update({
        name: name,
        description: description,
        startAt: startAt,
        endAt: endAt
      },
      {
        where: { id: id }
      })
    },
    deleteEvent: (parent, {id}, { db }, info) =>
      db.event.destroy({
        where: { id: id }
      })
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      return new Date(ast.value)
    },
  })
}

const apolloServer = new ApolloServer({ typeDefs, resolvers, context: { db } });

app.use(logger())
app.use(bodyParser());

apolloServer.applyMiddleware({ app });

app.listen(4000);
