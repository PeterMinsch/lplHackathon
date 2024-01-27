module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "Users",
    {
      UserID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Username: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      AuthenticationData: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      FirstName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      LastName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  );
  return User;
};
