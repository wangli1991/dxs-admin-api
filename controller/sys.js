/*
 * @Author: 王利
 * @Date: 2020-09-30 10:45:59
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-29 16:05:29
 */
const { exec } = require("../db/mysql");
const { formatTime } = require("../utils/utils");

const getAllDict = async () => {
  const sql = "SELECT * FROM tbl_sys_subdictionary";
  const res = await exec(sql);
  let resData = {};
  if (res && res.length) {
    res.forEach((x) => {
      const { dict, dictchild, dictchildname } = x;
      if (resData[dict]) {
        resData[dict].push({ text: dictchildname, value: dictchild });
      } else {
        resData[dict] = [{ text: dictchildname, value: dictchild }];
      }
    });
  }
  return res ? resData : false;
};

const getDictMainList = (dict, dictname, pageSize, currentPage) => {
  const startCount = (currentPage - 1) * pageSize;
  let countSql = `select count(*) as total from tbl_sys_dictionary where 1=1 `;
  let sql = `select a.id,a.dict,a.dictname,a.create_user,a.update_user,a.dtstamp,date_format(a.create_time,'%Y-%m-%d %H:%i:%s') as create_time,date_format(a.update_time,'%Y-%m-%d %H:%i:%s') as update_time from tbl_sys_dictionary a where 1=1 `;
  if (dict) {
    countSql += `and dict='${dict}'`;
    sql += `and dict='${dict}'`;
  }
  if (dictname) {
    countSql += `and dictname='${dictname}'`;
    sql += `and dictname='${dictname}'`;
  }
  sql += ` order by id asc limit ${startCount},${pageSize}`;
  return exec(countSql).then((countData) => {
    if (countData) {
      const total = countData[0].total;
      if (total == 0) {
        return {
          total: 0,
          items: [],
          currentPage: 0,
          pageSize: pageSize,
          totalPages: 0,
        };
      }
      return exec(sql).then((data) => {
        if (data) {
          return {
            total: total,
            items: data,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: 1,
          };
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  });
};
const dictMainDelete = (dicts) => {
  const sql = `delete from tbl_sys_dictionary where dict in ('${dicts}')`;
  const childSql = `delete from tbl_sys_subdictionary where dict in ('${dicts}')`;
  const result = Promise.all([exec(sql), exec(childSql)]);
  return result.then((res) => {
    if (res && res.length === 2) {
      return true;
    } else {
      return false;
    }
  });
};
const dictMainSave = (dict, dictname, userId) => {
  const createTime = formatTime();
  const sql = `insert into tbl_sys_dictionary (dict,dictname,create_time,create_user) values('${dict}','${dictname}','${createTime}','${userId}')`;
  let countSql = `select count(*) as total from tbl_sys_dictionary where dict='${dict}'`;
  return exec(countSql).then((countData) => {
    if (countData) {
      const total = countData[0].total;
      if (total == 0) {
        return exec(sql);
      } else {
        return false;
      }
    }
  });
};
const getDictSubList = (dict, pageSize, currentPage) => {
  let countSql = `select count(*) as total from tbl_sys_subdictionary where dict='${dict}'`;
  let sql = `select*from tbl_sys_subdictionary where dict='${dict}' order by id asc`;
  if (pageSize) {
    const startCount = (currentPage - 1) * pageSize;
    sql += ` limit ${startCount},${pageSize}`;
  }

  return exec(countSql).then((countData) => {
    if (countData) {
      const total = countData[0].total;
      if (total == 0) {
        return {
          total: 0,
          items: [],
          currentPage: 1,
          pageSize: pageSize,
          totalPages: 0,
        };
      }
      return exec(sql).then((data) => {
        if (data) {
          return {
            total: total,
            items: data,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: 1,
          };
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  });
};
const dictUpdate = (childAdd, childDel, childUpdate, main, userId) => {
  const nowTime = formatTime();
  let mainSql = `select*from tbl_sys_dictionary where id=${main.id}`;
  return exec(mainSql).then((mainData) => {
    if (mainData) {
      let execLen = 1;
      //主表更新
      let updataSql = `update tbl_sys_dictionary set dictname='${main.dictname}',update_time='${nowTime}',update_user='${userId}' where id=${main.id}`;
      let promisExec = [exec(updataSql)];
      //子表更新
      if (childUpdate.length) {
        execLen += childUpdate.length;
        let childUpdateSql,
          stopTime = null;
        childUpdate.forEach((item) => {
          if (item.stop == "0") {
            stopTime = nowTime;
          }
          childUpdateSql = `update tbl_sys_subdictionary set dictchild='${item.dictchild}',dictchildname='${item.dictchildname}',sort='${item.sort}',stop='${item.stop}',update_time='${nowTime}',update_user='${userId}',stop_time='${stopTime}' where dict='${main.dict}' and id=${item.id}`;
          console.log(childUpdateSql);
          promisExec.push(exec(childUpdateSql));
        });
      }

      //子表添加
      if (childAdd.length) {
        execLen += childAdd.length;
        let childAddSql, stopTime;
        childAdd.forEach((item) => {
          childAddSql = `insert into tbl_sys_subdictionary (dict,dictchild,dictchildname,sort,stop,create_time,create_user) values('${main.dict}','${item.dictchild}','${item.dictchildname}','${item.sort}','${item.stop}','${nowTime}','${userId}')`;
          if (item.stop == "0") {
            childAddSql = `insert into tbl_sys_subdictionary (dict,dictchild,dictchildname,sort,stop,create_time,create_user,stop_time) values('${main.dict}','${item.dictchild}','${item.dictchildname}','${item.sort}','${item.stop}','${nowTime}','${userId}','${nowTime}')`;
          }
          promisExec.push(exec(childAddSql));
        });
      }

      //子表删除
      if (childDel.length) {
        execLen += childDel.length;
        const childDelSql = `delete from tbl_sys_subdictionary where id in (${childDel})`;
        console.log(childDelSql);
        promisExec.push(exec(childDelSql));
      }
      let result = Promise.all(promisExec);
      return result.then((res) => {
        if (res && res.length === execLen) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  });
};

module.exports = {
  getAllDict,
  getDictMainList,
  dictMainDelete,
  dictMainSave,
  getDictSubList,
  dictUpdate,
};
