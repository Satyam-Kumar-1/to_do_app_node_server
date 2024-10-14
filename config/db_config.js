require('dotenv').config(); // Load environment variables from .env

const pg = require('pg'); // pg for PostgreSQL
const { Sequelize } = require('sequelize');

// Initialize Sequelize using the Vercel environment variable names
const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT, // Vercel defines the port as POSTGRES_PORT
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true, // Enforce SSL for PostgreSQL
      rejectUnauthorized: false, // Allow unauthorized SSL certs (necessary for Vercel)
    },
  },
});

// Connection test function
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Exporting connection and sequelize instance
module.exports = { connection, sequelize };
