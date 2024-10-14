

const { Sequelize } = require('sequelize');

const db=process.env.DB_NAME_P;
const user=process.env.USERNAME_P;
const pass=process.env.PASSWORD_P;

// Initialize Sequelize with connection details
const sequelize = new Sequelize(db, user, pass, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,  
      rejectUnauthorized: true,  
      ca: process.env.DB_CERT
    }
  }
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
