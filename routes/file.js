/*
 * @Author: wangli
 * @Date: 2020-06-18 12:53:27
 * @Last Modified by: wangli
 * @Last Modified time: 2020-06-18 21:14:25
 */
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");
const request = require("request");
const {
  picUpload,
  picDownload,
  getFileList,
  deleteFile,
} = require("../controller/file");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });
//图片上传
router.post("/picUpload", upload.single("file"), function (req, res, next) {
  const file = req.file;
  fs.readFile(file.path, (err, data) => {
    if (err) {
      res.json(new ErrorModel("图片上传失败！"));
      return;
    }
    let fileName = file.originalname;
    let dateName = Date.now() + parseInt(Math.random() * 999);
    let fileDotName = fileName.lastIndexOf(".");
    let fileSubName = fileName.substring(fileDotName, fileDotName.length);
    let imgName = dateName + fileSubName;
    fs.writeFile(
      path.join(__dirname, "../temp/images/" + imgName),
      data,
      (err) => {
        if (err) {
          res.json(new ErrorModel("图片上传失败！"));
          return;
        }
        const networkInterfaces = os.networkInterfaces();
        let saveUrl = "";
        for (var i in networkInterfaces) {
          saveUrl = networkInterfaces[i];
        }
        // const imgPath = `http://${saveUrl[1].address}:8888/temp/images/${imgName}`;
        const imgPath = `/temp/images/${imgName}`;
        const fileMimetype = file.mimetype;
        const tempPath = file.destination + file.filename;
        const result = picUpload({
          imgPath,
          fileName,
          fileMimetype,
          tempPath,
          ...req.body,
        });
        return result.then((resData) => {
          if (resData) {
            res.json(new SuccessModel(resData));
          } else {
            res.json(new ErrorModel("图片上传失败！"));
          }
        });
      }
    );
  });
});

// 图片浏览
router.get("/picDownload", function (req, res, next) {
  const result = picDownload(req.query);
  return result.then((data) => {
    if (data) {
      const responseData = [];
      const { file_path, file_mimetype } = data[0];
      const filePath = `.${file_path}`;
      res.writeHead(200, { "Content-Type": file_mimetype || "image/png" });
      const stream = fs.createReadStream(filePath);
      stream.on("data", function (chunk) {
        responseData.push(chunk);
      });
      stream.on("end", function () {
        var finalData = Buffer.concat(responseData);
        res.write(finalData);
        res.end();
      });
    } else {
      res.json(new ErrorModel("获取图片失败！"));
    }
  });
});

//图片列表
router.post("/list", async (req, res, next) => {
  const result = await getFileList(req.body);
  if (result) {
    res.json(new SuccessModel(result));
  } else {
    res.json(new ErrorModel("获取文件列表失败！"));
  }
});

//根据文件id删除文件
router.post("/deleteById", async (req, res, next) => {
  const { filePath, fileTempPath } = req.body;
  const result = await deleteFile(req.body);
  if (result) {
    const delFilePath = path.join(__dirname, "..", `${filePath}`);
    const delTempFilePath = path.join(__dirname, "..", `${fileTempPath}`);
    if (fs.existsSync(delFilePath)) {
      fs.unlinkSync(delFilePath, function (err) {
        if (err) throw err;
      });
    }
    if (fs.existsSync(delTempFilePath)) {
      fs.unlinkSync(delTempFilePath, function (err) {
        if (err) throw err;
      });
    }
    res.json(new SuccessModel(result, "文件删除成功！"));
  } else {
    res.json(new ErrorModel("文件删除失败！"));
  }
});

module.exports = router;
