/*
 * @Author: WangLi
 * @Date: 2021-04-13 19:21:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-07-02 08:55:00
 */
const { exec } = require("../db/mysql");

const creatProduct = async (params) => {
  const {
    brand,
    classify,
    classify_name,
    description,
    en_name,
    market_price,
    main_picture,
    carousel_picture,
    detail_picture,
    name,
    origin_place,
    quality_period,
    remarks,
    sales_price,
    sales_status,
    specs,
    stock,
    storage_conditions,
    storage_conditions_name,
    unit,
  } = params;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE name='${name}'`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    if (total) {
      return { status: "E", msg: "商品名称已存在" };
    }
  }
  const sql = `INSERT INTO tbl_product (brand,
    classify,
    classify_name,
    description,
    en_name,
    market_price,
    main_picture,
    carousel_picture,
    detail_picture,
    name,
    origin_place,
    quality_period,
    remarks,
    sales_price,
    sales_status,
    specs,
    stock,
    storage_conditions,
    storage_conditions_name,
    unit) VALUES ('${brand}',${classify},'${classify_name}','${description}','${en_name}',${market_price},'${main_picture}','${carousel_picture}','${detail_picture}','${name}','${origin_place}','${quality_period}','${remarks}',${sales_price},'${sales_status}','${specs}',${stock},'${storage_conditions}','${storage_conditions_name}','${unit}')`;
  const res = await exec(sql);
  return res ? true : false;
};

const updateProduct = async (params) => {
  const {
    id,
    brand,
    classify,
    classify_name,
    description,
    en_name,
    market_price,
    main_picture,
    carousel_picture,
    detail_picture,
    name,
    origin_place,
    quality_period,
    remarks,
    sales_price,
    sales_status,
    specs,
    stock,
    storage_conditions,
    storage_conditions_name,
    unit,
  } = params;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product WHERE name='${name}' and id!=${id}`;
  const countData = await exec(countSql);
  if (countData) {
    const total = countData[0].TOTAL;
    if (total) {
      return { status: "E", msg: "商品名称已存在" };
    }
  }
  const sql = `UPDATE tbl_product SET name='${name}',brand='${brand}',classify=${classify},classify_name='${classify_name}',description='${description}',en_name='${en_name}',market_price=${market_price},main_picture='${main_picture}',carousel_picture='${carousel_picture}',detail_picture='${detail_picture}',origin_place='${origin_place}',quality_period='${quality_period}',remarks='${remarks}',sales_price=${sales_price},sales_status='${sales_status}',specs='${specs}',stock=${stock},storage_conditions='${storage_conditions}',storage_conditions_name='${storage_conditions_name}',unit='${unit}'  WHERE id='${id}'`;
  const res = await exec(sql);
  return res ? true : false;
};

const deleteProduct = async (params) => {
  const { id } = params;
  const sql = `DELETE FROM tbl_product WHERE id=${id}`;
  const res = await exec(sql);
  return res ? true : false;
};

const getList = async (params) => {
  const { currentPage, pageSize } = params;
  const startCount = (currentPage - 1) * pageSize;
  const countSql = `SELECT COUNT(*) as TOTAL FROM tbl_product`;
  const sql = `SELECT * FROM tbl_product ORDER BY creat_time DESC LIMIT ${startCount},${pageSize}`;
  const countData = await exec(countSql);
  let data = [];
  if (countData) {
    const total = countData[0].TOTAL;
    if (total) {
      data = await exec(sql);
    }
    return { list: data, count: data.length, total };
  }
  return false;
};
module.exports = {
  creatProduct,
  updateProduct,
  deleteProduct,
  getList,
};
