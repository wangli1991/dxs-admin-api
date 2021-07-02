/*
 * @Author: wangli
 * @Date: 2020-05-18 15:29:43
 * @Last Modified by: wangli
 * @Last Modified time: 2020-07-10 14:48:35
 */
const bcrypt = require("bcryptjs");
const { exec } = require("../db/mysql");

const creat = async (params) => {
  const { username, password, userno } = params;
  const sql = `SELECT * FROM tbl_user WHERE username='${username}'`;
  const res = exec(sql);
  if (!res || !res.length) {
    const salt = bcrypt.genSaltSync(10); //设置加密等级，如果不设置默认为10，最高为10
    const hashPwd = bcrypt.hashSync(password, salt); //将获取到的密码进行加密，得到密文hash
    const insertSql = `INSERT INTO tbl_user (username,password, userno) VALUES('${username}','${hashPwd}','${userno}')`;
    const insertRes = await exec(insertSql);
    if (insertRes) {
      return true;
    }
  }
  return false;
};

const login = async (username, password) => {
  const sql = `SELECT * FROM tbl_user WHERE username='${username}'`;
  const res = await exec(sql);
  if (res.length > 0) {
    const hashPassword = res[0].password;
    const flag = bcrypt.compareSync(password, hashPassword);
    if (flag) {
      return res[0];
    }
  }
  return false;
};

const modifyPwd = async (params) => {
  const { userId, originalPassword, password } = params;
  const sql = `SELECT * FROM tbl_user WHERE id=${userId}`;
  const res = await exec(sql);
  if (res.length > 0) {
    const hashPassword = res[0].password;
    const flag = bcrypt.compareSync(originalPassword, hashPassword);
    if (flag) {
      const salt = bcrypt.genSaltSync(10); //设置加密等级，如果不设置默认为10，最高为10
      const hashPwd = bcrypt.hashSync(password, salt);
      const updateSql = `UPDATE tbl_user SET password='${hashPwd}' WHERE id='${userId}'`;
      const updateRes = await exec(updateSql);
      if (updateRes) {
        return res[0];
      }
    }
  }
  return false;
};

module.exports = { creat, login, modifyPwd };
