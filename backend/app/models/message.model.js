module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define(
    "Messages",
    {
      MessageID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ChatroomID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "UserID",
        },

        ChatroomID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Chatrooms",
            key: "ChatroomID",
          },
        },
      },
    },
    { timestamps: false }
  );

  // Define foreign key relationships

  return Message;
};
