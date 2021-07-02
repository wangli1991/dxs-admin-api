/*
 * @Author: wangli
 * @Date: 2020-06-18 12:53:41
 * @Last Modified by: wangli
 * @Last Modified time: 2020-06-18 21:14:26
 */
const { exec } = require("../db/mysql");

const picUpload = async (params) => {
  const { billId, imgPath, fileName, fileGroup, fileMimetype, tempPath } =
    params;
  const insertSql = `INSERT INTO tbl_file (bill_id,file_path,file_name,file_mode,file_group,file_mimetype,file_temp_path) VALUES('${billId}','${imgPath}','${fileName}','PIC','${fileGroup}','${fileMimetype}','${tempPath}')`;
  const insertRes = await exec(insertSql);
  if (insertRes) {
    const sql = `SELECT * FROM tbl_file WHERE id='${insertRes.insertId}'`;
    const res = await exec(sql);
    return res[0];
  }
  return false;
};

const picDownload = async (params) => {
  const { fileId } = params;
  const sql = `SELECT * FROM tbl_file WHERE id='${fileId}'`;
  const res = await exec(sql);
  if (res) {
    return res;
  }
  return false;
};

const getFileList = async (params) => {
  const { billId, fileGroup } = params;
  const sql = `SELECT * FROM tbl_file WHERE bill_id='${billId}' AND file_group='${fileGroup}' ORDER BY creat_time DESC`;
  const res = await exec(sql);
  if (res) {
    return { list: res, count: res.length };
  }
  return false;
};

const deleteFile = async (params) => {
  const { id } = params;
  const sql = `DELETE FROM tbl_file WHERE id=${id}`;
  const res = await exec(sql);
  return res ? true : false;
};

module.exports = {
  picUpload,
  picDownload,
  getFileList,
  deleteFile,
};
