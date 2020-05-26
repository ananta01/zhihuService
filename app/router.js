'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/topSearchList', controller.home.getSearchList);

  router.post('/user/register', controller.user.register);
  router.get('/user/email', controller.user.setEmail);
  router.get('/user/captcha', controller.user.setCaptcha);
};
