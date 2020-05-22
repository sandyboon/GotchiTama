module.exports = function (sequelize, DataTypes) {
  const Pet = sequelize.define('Pet', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    stage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val <= 0) {
            throw new Error('Stage should be a positive number');
          }
        },
      },
    },
    healthlevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have a negative health');
          }
        },
      },
    },
    currentHealthExp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative health');
          }
        },
      },
    },
    speedlevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative speed');
          }
        },
      },
    },
    currentSpeedExp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative speed experience');
          }
        },
      },
    },
    strengthlevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative speed');
          }
        },
      },
    },
    currentStrengthExp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative speed experience');
          }
        },
      },
    },

    numberOfBattles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative number of battles');
          }
        },
      },
    },

    numberOfBattlesWon: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        isPositive(val) {
          if (val < 0) {
            throw new Error('A pet can not have negative number of wins');
          }
        },
      },
    },
  });

  // define association with users
  // define association with pets
  Pet.associate = function (models) {
    Pet.belongsTo(models.User, {
      foreignKey: { allowNull: false }, // A pet may not exist without a user
    });
  };

  return Pet;
};
