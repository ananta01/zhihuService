'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/topSearchList', controller.home.getSearchList);

  router.post('/api/user/register', controller.user.register);
  router.get('/api/user/email', controller.user.setEmail);
  router.get('/api/user/captcha', controller.user.setCaptcha);
};
