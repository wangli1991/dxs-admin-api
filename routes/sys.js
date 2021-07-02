/*
 * @Author: 王利
 * @Date: 2020-08-05 10:22:27
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-29 15:27:33
 */
const express = require("express");
const router = express.Router();
const {
  getAllDict,
  getDictMainList,
  dictMainDelete,
  dictMainSave,
  getDictSubList,
  dictUpdate,
} = require("../controller/sys");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 搜有数据字典数据
router.get("/dictionary/getAllDict", function (req, res, next) {
  const result = getAllDict();
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加失败！"));
    }
  });
});

// 数据字典主表列表
router.post("/dictMain/list", function (req, res, next) {
  const { dict, dictname, pageSize, currentPage } = req.body;
  const result = getDictMainList(dict, dictname, pageSize, currentPage);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加失败！"));
    }
  });
});
// 数据字典主表删除
router.post("/dictMain/delete", function (req, res, next) {
  const { dicts } = req.body;
  const result = dictMainDelete(dicts);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel("删除成功！"));
    } else {
      res.json(new ErrorModel("删除失败！"));
    }
  });
});
// 数据字典主表保存
router.post("/dictMain/save", function (req, res, next) {
  const { dict, dictname } = req.body;
  const result = dictMainSave(dict, dictname, req.get("userId"));
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel("保存成功！"));
    } else {
      res.json(new ErrorModel("保存失败！"));
    }
  });
});
// 数据字典子表列表
router.post("/dictionary/list", function (req, res, next) {
  const { dict, pageSize, currentPage } = req.body;
  const result = getDictSubList(dict, pageSize, currentPage);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("添加失败！"));
    }
  });
});
// 数据字典更新
router.post("/dictionary/update", function (req, res, next) {
  const { childAdd, childDel, childUpdate, main } = req.body;
  const result = dictUpdate(
    childAdd,
    childDel,
    childUpdate,
    main,
    req.get("userId")
  );
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel("保存成功！"));
    } else {
      res.json(new ErrorModel("保存失败！"));
    }
  });
});
module.exports = router;
