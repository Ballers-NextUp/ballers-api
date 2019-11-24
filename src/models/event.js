'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    startAt: DataTypes.DATE,
    endAt: DataTypes.DATE
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};