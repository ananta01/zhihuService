'use strict';
module.exports = app => {
  app.beforeStart(async function() {
    await app.model.sync({ force: false }); // false 为不覆盖 true会删除再创建
  });
};
