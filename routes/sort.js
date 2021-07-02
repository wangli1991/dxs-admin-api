/*
 * @Author: WangLi
 * @Date: 2021-07-02 08:56:01
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 08:58:59
 */
const express = require("express");
const router = express.Router();
const { getSortList } = require("../controller/sort");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 排序列表数据
router.post("/list", function (req, res, next) {
  const result = getSortList();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取排序列表失败！"));
    }
  });
});
module.exports = router;
