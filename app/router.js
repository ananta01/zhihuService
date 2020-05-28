'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });

  router.get('/api/topSearchList', controller.home.getSearchList);

  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/email', controller.user.setEmail);
  router.get('/api/user/captcha', controller.user.setCaptcha);
  router.get('/api/user/info', jwt, controller.user.info);

};
