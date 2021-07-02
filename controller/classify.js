/*
 * @Author: WangLi
 * @Date: 2021-04-12 13:26:01
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 08:56:59
 */
const { transformDate } = require("../utils/utils");
const { exec } = require("../db/mysql");

const creatClassify = async (params) => {
  const { name } = params;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_classify WHERE name='${name}'`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    if (total) {
      return { status: "E", msg: "分类名称已存在" };
    }
  }
  const sql = `INSERT INTO tbl_classify (name) VALUES ('${name}')`;
  const res = await exec(sql);
  return res ? true : false;
};

const updateClassify = async (params) => {
  const { id, name } = params;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_classify WHERE name='${name}' and id!=${id}`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    if (total) {
      return { status: "E", msg: "分类名称已存在" };
    }
  }
  const sql = `UPDATE tbl_classify SET name='${name}' WHERE id='${id}'`;
  const res = await exec(sql);
  return res ? true : false;
};

const deleteClassify = async (params) => {
  const { id } = params;
  const sql = `DELETE FROM tbl_classify WHERE id=${id}`;
  const res = await exec(sql);
  return res ? true : false;
};

const getList = async (params) => {
  const { currentPage, pageSize } = params;
  const startCount = (currentPage - 1) * pageSize;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_classify`;
  const sql = `SELECT * FROM tbl_classify LIMIT ${startCount},${pageSize}`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    let count = 0,
      resData = [];
    if (total) {
      const res = await exec(sql);
      count = res.length;
      resData = res;
      console.log(res);
      resData.forEach((x) => {
        x.creat_time = transformDate(x.creat_time);
        x.update_time = transformDate(x.update_time);
        x.value = x.id;
        x.text = x.name;
      });
    }
    return { list: resData, count, total };
  }
  return false;
};

const getItemList = async (params) => {
  const sql = `SELECT * FROM tbl_classify`;
  const res = await exec(sql);
  if (res) {
    const resData = res.map((x) => {
      return { value: x.id, text: x.name };
    });
    return resData;
  }
  return false;
};

module.exports = {
  creatClassify,
  updateClassify,
  deleteClassify,
  getList,
  getItemList,
};
