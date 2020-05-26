'use strict';
const Service = require('egg').Service
const svgCaptcha = require('svg-captcha')
const nodemailer = require('nodemailer')
const { userEmail, userEmailPaw } = require('../config/config')

const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secure: true,
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: userEmailPaw,
  },
});

class ToolsService extends Service {
  // 生成验证码
  captcha() {
    return svgCaptcha.create({
      size: 4,
      fontSize: 50,
      color: true,
      noise: 6,
      width: 100,
      height: 40,
    });
  }
  // 发送邮件码
  async sendEmail(email, title, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject: title,
      text: '',
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

}


module.exports = ToolsService;
