'use strict';

const CommonController = require('./commonController')

class HomeController extends CommonController {
  // 获取搜索热门提示
  async getSearchList() {
    const { ctx } = this;
    const data = await ctx.model.TopSearch.findAll();
    if (data && data.length) {
      this.success(data);
    } else {
      this.success('暂无最新信息');
    }
  }
}

module.exports = HomeController;
