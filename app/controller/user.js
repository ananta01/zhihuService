'use strict';
const CommonController = require('./commonController')
const md5 = require('md5')

class UserController extends CommonController {
  // 检查是否有邮箱
  async checkEmail(email) {
    return await this.ctx.model.User.findOne({ email });
  }
  // 注册账号
  async register() {
    const { ctx } = this;
    const { email, password, emailCode, captcha, nickname } = ctx.request.body;

    if (emailCode !== ctx.session.emailCode) {
      return this.error('请输入正确的邮箱验证码');
    }

    if (captcha.toLowerCase() !== ctx.session.captcha.toLowerCase()) {
      return this.error('请输入正确的验证码');
    }

    if (this.checkEmail(email)) {
      return this.error('该邮箱已注册');
    }

    const res = ctx.model.User.create({
      nickname,
      email,
      password: md5(password),
    });

    if (res) {
      this.success('注册成功');
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
      this.success('发送成功，请注意查收');
    } else {
      this.error('发送失败，请检查邮箱');
    }
  }
}

module.exports = UserController;
