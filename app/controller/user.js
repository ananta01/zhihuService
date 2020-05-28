'use strict';
const CommonController = require('./commonController')
const md5 = require('md5')
const { loginTokenExpire } = require('../config/config')

class UserController extends CommonController {
  // 检查是否有邮箱
  async checkEmail(email) {
    return await this.ctx.model.User.findOne({
      where: {
        email,
      }, raw: true,
      attributes: [ 'nickname', 'id', 'email' ],
    });
  }
  // 注册账号
  async register() {
    const { ctx } = this;
    const { email, password, emailCode, nickname } = ctx.request.body.params;
    if (emailCode !== ctx.session.emailCode) {
      return this.error('请输入正确的邮箱验证码');
    }
    if (await this.checkEmail(email)) {
      return this.error('该邮箱已注册');
    }

    const res = await ctx.model.User.create({
      nickname,
      email,
      password: md5(password),
    });

    if (res) {
      this.success('注册成功');
      ctx.session.emailCode = '';
    }

  }
  // 验证码
  async setCaptcha() {
    const { ctx } = this;
    // 生成验证码
    const captcha = await this.service.tools.captcha();
    ctx.session.captcha = captcha.text;
    console.log('验证码' + captcha.text);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
  // 发送邮箱验证码
  async setEmail() {
    const { ctx } = this;
    const email = ctx.query.email;
    const emailCode = Math.random().toString().slice(2, 6);

    console.log('邮件' + email + '验证码是' + emailCode);

    const title = '欢迎注册，邮箱验证码'
    const html = `
      <h1>ananta注册验证码</h1>
      <div>
        邮箱注册验证码为：${emailCode}
      </div>
    `;
    const hasSend = await this.service.tools.sendEmail(email, title, html);
    if (hasSend) {
      ctx.session.emailCode = emailCode;
      this.success('发送成功，请注意查收');
    } else {
      this.error('发送失败，请检查邮箱');
    }
  }
  // 登录
  async login() {
    const { ctx, app } = this;
    const { email, password, captcha } = ctx.request.body.params;
    if (captcha.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
      return this.error('请输入正确的验证码');
    }

    if (!await this.checkEmail(email)) {
      return this.error('该邮箱暂未注册');
    }

    const user = await ctx.model.User.findOne({
      where: {
        email,
        password: md5(password),
      },
      raw: true,
    });

    if (user) {
      const { nickname, id } = user;
      const token = app.jwt.sign({
        nickname,
        email,
        id,
      }, app.config.jwt.secret, {
        expiresIn: loginTokenExpire,
      });
      this.success({ message: '登陆成功', token });
      ctx.session.captcha = '';
    } else {
      this.error('邮箱或密码错误');
    }

  }
  // 根据token解析用户信息
  async info() {
    const { ctx } = this
    if (ctx.state.email) {
      const user = await this.checkEmail(ctx.state.email)
      this.success(user);
    }
  }
}

module.exports = UserController;
