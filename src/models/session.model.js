const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Session = sequelize.define(
    "Session",
    {
      // Model attributes
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Reference the User table
          key: "id",
        },
        onDelete: "CASCADE",
      },
      jwtRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true, // Allow empty for initial setup
      },
    },
    {
      tableName: "sessions",
      sequelize,
      timestamps: true, // Automatically add `createdAt` and `updatedAt`
      indexes: [
        {
          unique: true,
          fields: ["userId"], // Ensure each user can have only one session
        },
      ],
    }
  );
  return Session;
};
