'use strict';
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const TopSearch = app.model.define('topSearch', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    query: {
      type: STRING,
      allowNull: false,
    },
    display_query: {
      type: STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return TopSearch;
};
