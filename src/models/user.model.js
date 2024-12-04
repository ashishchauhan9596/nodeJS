const { DataTypes } = require("sequelize");
const ErrorHandler = require("../utilities/ErrorHandler");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      // Model attributes are defined here
      uniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      sequelize,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          unique: true,
          fields: ["uniqueId"],
        },
      ],
      // hooks: {
      //   // Hook to ensure email uniqueness before updates
      //   beforeUpdate: async (user, options) => {
      //     try {
      //       // Ensure the email is unique when it's updated (excluding the current user)
      //       const existingUserWithEmail = await sequelize.models.User.findOne({
      //         where: { email: user.email, id: { [Sequelize.Op.ne]: user.id } },
      //       });
      //       if (existingUserWithEmail) {
      //         return next(new ErrorHandler("Email is already in use.", 409)); // Use next() to pass error
      //       }
      //     } catch (error) {
      //       return next(
      //         new ErrorHandler(
      //           "Error checking email uniqueness during update",
      //           500
      //         )
      //       );
      //     }
      //   },
      // },
    }
  );
  return User;
};
