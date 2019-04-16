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

function scheduleCronstyle() {
  let hourRule = '00 00 * * * *' // 每小时的00分00秒
  let minuteRule = '00 * * * * *'
  schedule.scheduleJob(hourRule, function () {
    console.log('scheduleCronstyle:' + new Date());
    updatejdData()
  });
}

function getMusicDatabyMinute() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  schedule.scheduleJob(rule, function () {
    console.log("getJDdataMinute" + new Date());
    // 猫眼数据
    // updatejdData()
    // deleteLines()
  });
}


// updatejdData()
// scheduleCronstyle();
scheduleCronstyle()

// 所有路径的api请求，都默认返回的参数
/*
* test
* */

function deleteLines() {
  pool.getConnection(function (err, connection) {
    connection.query(y_maoyan.deletetenLines, [20], function (err, result) {
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
    url: `https://m.ke.qq.com/cgi-proxy/vote_activity/work/ranklist?act_id=1&limit=200&bkn=764306576&_=1554896511586`,
    method: 'GET',
    headers: { 'Referer': 'https://m.ke.qq.com/mcates/ccyy/rank.html?act_id=1' }
  }, function (error, response, body) {
    JSON.parse(body).result.rank_list.forEach((element, i) => {
      if (i < 20) {
        pool.getConnection(function (err, connection) {
          var param = [
            element.work_name,
            element.votes,
            element.work_id,
            element.team_name,
            Date.parse(new Date()) / 1000,
            element.rank
          ];
          connection.query(y_maoyan.insert, param, function (err, result) {
            // 以json形式，把操作结果返回给前台页面
            // 释放连接
            if (err != null) {
              console.log(err)
            }
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
    url: `https://m.ke.qq.com/cgi-proxy/vote_activity/work/ranklist?act_id=1&limit=200&bkn=764306576&_=1554896511586`,
    method: 'GET',
    headers: { 'Referer': 'https://m.ke.qq.com/mcates/ccyy/rank.html?act_id=1' }
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

router.get('/getDataLimit', function (req, res) {
  pool.getConnection(function (err, connection) {
    connection.query(y_maoyan.queryLimit, [240], function (err, result) {
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