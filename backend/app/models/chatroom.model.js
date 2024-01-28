module.exports = (sequelize, Sequelize) => {
  const Chatroom = sequelize.define(
    "Chatrooms",
    {
      ChatroomID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "UserID",
        },
      },
    },
    { timestamps: false }
  );
  return Chatroom;
};
