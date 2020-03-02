"use strict";
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      AgencyCode: DataTypes.STRING,
      AgencyName: DataTypes.STRING,
      home_tel: DataTypes.STRING,
      mob_tel: DataTypes.STRING,
      user_id: DataTypes.STRING,
      password: DataTypes.STRING,
      agt_id: DataTypes.STRING,
      agtgroup: DataTypes.STRING,
      class: DataTypes.STRING,
      state: DataTypes.STRING,
      fk_userId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
