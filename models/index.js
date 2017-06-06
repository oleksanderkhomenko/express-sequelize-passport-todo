var db = {};
var Sequelize = require('sequelize');
var sequelize = new Sequelize('test', '', null, {
  host: 'localhost:8080',
  dialect: 'sqlite'
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;