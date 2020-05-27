'use strict';

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    const token = ctx.request.header.authorization.replace('Bearer ', '');
    try {
      const ret = await app.jwt.verify(token, app.config.jwt.secret);
      console.log('中间件获取token信息', ret);
      ctx.state.email = ret.email;
      ctx.state.userid = ret.id;
      await next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        ctx.state.email = '';
        ctx.state.userid = '';

        ctx.body = {
          code: 2020,
          message: 'token过期了，请重新登录',
        };
        return;
      }
      console.log(err);
    }
  };
};
