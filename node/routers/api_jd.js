/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// 表
var y_maoyan = require('../sql/y_maoyan');
// 数据库
var dbConfig = require('../config/dbconfig');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);

var USERCONFIG = {
  '杨超越': 2854373,
  '吴宣仪': 2825632
}

function scheduleCronstyle() {
  let hourRule = '00 00 * * * *' // 每小时的00分00秒
  let minuteRule = '00 * * * * *'
  schedule.scheduleJob(hourRule, function () {
    console.log('scheduleCronstyle:' + new Date());
    updateMusicRank();
  });
}

function getMusicDatabyMinute() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  schedule.scheduleJob(rule, function () {
    console.log("getJDdataMinute" + new Date());
    // 猫眼数据
    updatejdData()
    deleteLines()
  });
}


// updatejdData()
// scheduleCronstyle();
getMusicDatabyMinute()

// 所有路径的api请求，都默认返回的参数
/*
* test
* */

function deleteLines() {
  pool.getConnection(function (err, connection) {
    connection.query(y_maoyan.deletetenLines, [2], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      // res.json(result)
      connection.release();
    });
  })
}


function updatejdData() {
  var e = request({
    url: `https://m.maoyan.com/sns/assist/assemble/activity/rank.json?offset=0&limit=500&assembleActivityId=217`,
    method: 'GET',
    // headers: { 'Content-Type': 'text/json' }
  }, function (error, response, body) {
    JSON.parse(body).data.celebrityList.forEach(element => {
      if (USERCONFIG[element.celebrityName]) {
        pool.getConnection(function (err, connection) {
          var param = [
            element.celebrityName,
            element.popValue,
            element.celebrityId,
            element.celebrityAvatar,
            Date.parse(new Date()) / 1000,
          ];
          connection.query(y_maoyan.insert, param, function (err, result) {
            // 以json形式，把操作结果返回给前台页面
            // 释放连接
            console.log(err)
            connection.release();
          });
        });
      }

    });

  });
};

function deleteChijiLines() {
  pool.getConnection(function (err, connection) {
    connection.query(y_cijizhanchang.deletetenLines, [], function (err, result) {
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      // res.json(result)
      connection.release();
    });
  })
}

// 查询全部
router.get('/getAll', function (req, res) {
  pool.getConnection(function (err, connection) {
    connection.query(y_maoyan.queryAll, [], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      console.log(err)
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
})

// 获取实时数据
router.get('/getCurrentData', function (req, res) {
  // var id = req.query.id;
  var e = request({
    url: `https://m.maoyan.com/sns/assist/assemble/activity/rank.json?offset=0&limit=500&assembleActivityId=217`,
    method: 'GET',
    // headers: { 'Content-Type': 'text/json' }
  }, function (error, response, body) {
    var responseData = {
      code: 200,
      data: JSON.parse(body),
    }

    res.json(responseData)
    // res.send(JSON.parse(body));
    // if (!error && response.statusCode == 200) {
    //     res.render('task', { 'data': JSON.parse(body) });
    // }
  });
});

router.get('/getDataById', function (req, res) {
  var celebrityId = req.query.celebrityId;
  pool.getConnection(function (err, connection) {
    connection.query(y_maoyan.getDataById, [celebrityId], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      console.log(err)
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
})


module.exports = router