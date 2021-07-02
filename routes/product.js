/*
 * @Author: WangLi
 * @Date: 2021-04-13 19:21:20
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 08:54:46
 */
const express = require("express");
const router = express.Router();
const {
  creatProduct,
  updateProduct,
  deleteProduct,
  getList,
} = require("../controller/product");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 获取分类商品数据
router.post("/list", async (req, res, next) => {
  const data = await getList(req.body);
  if (data) {
    res.json(new SuccessModel(data));
  } else {
    res.json(new ErrorModel("获取商品数据失败！"));
  }
});

// 创建商品数据
router.post("/creat", function (req, res, next) {
  const result = creatProduct(req.body);
  return result.then((data) => {
    if (data) {
      if (data.status === "E") {
        res.json(new ErrorModel([], data.msg, 500));
      } else {
        res.json(new SuccessModel(data, "创建商品成功"));
      }
    } else {
      res.json(new ErrorModel("创建商品失败！"));
    }
  });
});

// 修改商品数据
router.post("/update", function (req, res, next) {
  const result = updateProduct(req.body);
  return result.then((data) => {
    if (data) {
      if (data.status === "E") {
        res.json(new ErrorModel([], data.msg, 500));
      } else {
        res.json(new SuccessModel(data, "修改商品成功"));
      }
    } else {
      res.json(new ErrorModel("修改商品失败！"));
    }
  });
});

// 删除商品数据
router.post("/delete", function (req, res, next) {
  const result = deleteProduct(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data, "删除商品成功"));
    } else {
      res.json(new ErrorModel("删除商品失败！"));
    }
  });
});

module.exports = router;
