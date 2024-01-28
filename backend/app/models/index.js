const dbConfigProd = require("../config/db.config.js");

const Sequelize = require("sequelize");

const dbConfig = dbConfigProd; // be sure to change this if you are running the unit tests.

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.chatrooms = require("./chatroom.model.js")(sequelize, Sequelize);
db.messages = require("./message.model.js")(sequelize, Sequelize);

// DB Relationships

//========================

//User-Chatrooms One to Many relationship
db.users.hasOne(db.chatrooms, {
  foreignKey: "UserID",
  onDelete: "CASCADE",
});
db.chatrooms.belongsTo(db.users, {
  foreignKey: "UserID",
});

//User-Messages: One to Many relationship
db.users.hasMany(db.messages, {
  foreignKey: "UserID",
  onDelete: "CASCADE",
});
db.messages.belongsTo(db.users, {
  foreignKey: "UserID",
});

//Chatrooms-User:

module.exports = db;
