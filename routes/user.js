/*
 * @Author: wangli
 * @Date: 2020-06-14 17:40:23
 * @Last Modified by: wangli
 * @Last Modified time: 2020-07-10 18:29:59
 */
const express = require("express");
const router = express.Router();
const { creat, login, modifyPwd } = require("../controller/user");
const { creatToken, verifyToken } = require("../utils/token");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// PC注册接口
router.post("/creat", function (req, res, next) {
  const result = creat(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel("用户已存在"));
    }
  });
});

// 登录接口
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const data = await login(username, password);
  if (data) {
    const tokenPayload = { username: username, userid: data.id };
    const token = creatToken(tokenPayload);
    delete data.password;
    res.json(
      new SuccessModel({
        token: token,
        userInfo: data,
      })
    );
  } else {
    res.json(new ErrorModel([], "用户名或密码错误"));
  }
});

// 修改密码
router.post("/modifyPwd", async (req, res, next) => {
  const data = await modifyPwd(req.body);
  if (data) {
    const tokenPayload = { username: data.username, userid: data.id };
    const token = creatToken(tokenPayload);
    delete data.password;
    res.json(
      new SuccessModel(
        {
          token: token,
          userInfo: data,
        },
        "修改密码成功"
      )
    );
  } else {
    res.json(new ErrorModel([], "修改失败，原密码错误", 500));
  }
});

//退出登录
router.post("/logout", function (req, res, next) {
  res.json(new SuccessModel("退出成功"));
});

// 微信登录接口
router.post("/wxLogin", function (req, res, next) {
  const { code } = req.body;
  const result = wxLogin(code);
  return result.then((data) => {
    if (data) {
      data = JSON.parse(data);
      const token = creatToken(data);
      req.session.jwt = token;
      res.json(
        new SuccessModel({
          token: token,
          openid: data.openid,
        })
      );
    } else {
      res.json(new ErrorModel([], "获取用户信息失败", data.code));
    }
  });
});

//设置默认提货人信息
router.post("/receiver/creat", function (req, res, next) {
  const result = setReceiver(req.body);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});

//获取默认提货人信息
router.get("/receiver/info", function (req, res, next) {
  const { userId } = req.query;
  const result = getReceiver(userId);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});

//获取APP用户信息
router.post("/appInfo", function (req, res, next) {
  const result = getUserInfo(req.session.jwt);
  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel(data));
    } else {
      res.json(new ErrorModel(""));
    }
  });
});
module.exports = router;
