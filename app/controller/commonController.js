'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {

  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    };
  }
  // @ 公用代码抽离
  success(data) {
    this.ctx.body = {
      code: 200,
      data,
    };
  }
  error(message, code = 400) {
    this.ctx.body = {
      code,
      message,
    };
  }
}

module.exports = CommonController;
