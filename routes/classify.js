/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:25:31
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 08:56:50
 */
const express = require("express");
const router = express.Router();
const {
  creatClassify,
  updateClassify,
  deleteClassify,
  getList,
  getItemList,
} = require("../controller/classify");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 创建分类数据
router.post("/creat", function (req, res, next) {
  const result = creatClassify(req.body);
  return result.then((data) => {
    if (data) {
      if (data.status === "E") {
        res.json(new ErrorModel([], data.msg, 500));
      } else {
        res.json(new SuccessModel(data, "创建商品分类成功"));
      }
    } else {
      res.json(new ErrorModel("创建商品分类失败！"));
    }
  });
});

// 修改分类数据
router.post("/update", function (req, res, next) {
  const result = updateClassify(req.body);
  return result.then((data) => {
    if (data) {
      if (data.status === "E") {
        res.json(new ErrorModel([], data.msg, 500));
      } else {
        res.json(new SuccessModel(data, "修改商品分类成功"));
      }
    } else {
      res.json(new ErrorModel("修改商品分类失败！"));
    }
  });
});

// 删除分类数据
router.post("/delete", function (req, res, next) {
  const result = deleteClassify(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data, "删除商品分类成功"));
    } else {
      res.json(new ErrorModel("删除商品分类失败！"));
    }
  });
});

// 获取分类列表数据
router.post("/list", function (req, res, next) {
  const result = getList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取分类列表失败！"));
    }
  });
});

// 获取分类下拉列表数据
router.post("/itemList", function (req, res, next) {
  const result = getItemList(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("获取分类列表失败！"));
    }
  });
});

module.exports = router;
