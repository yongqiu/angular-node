/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// 表
var y_jd = require('../sql/y_jd');
// 数据库
var dbConfig = require('../config/dbconfig');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);

var USERCONFIG = {
  '孟美岐': 1,
  '杨超越': 2,
  '吴宣仪': 3
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
    // 专辑销量
    updatejdData()
  });
}



// scheduleCronstyle();
getMusicDatabyMinute()

// 所有路径的api请求，都默认返回的参数
/*
* test
* */

function deleteLines() {
  pool.getConnection(function (err, connection) {
    connection.query(y_jd.deletetenLines, [3], function (err, result) {
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
    url: `http://223.252.210.60:18888/data`,
    method: 'GET',
    // headers: { 'Content-Type': 'text/json' }
  }, function (error, response, body) {
    console.log(body)
    JSON.parse(body).forEach(element => {
      let userId = USERCONFIG[element.name];
      if (userId) {
        pool.getConnection(function (err, connection) {
          var param = [
            USERCONFIG[element.name],
            element.num,
            Date.parse(new Date()) / 1000,
            element.name
          ];
          connection.query(y_jd.insert, param, function (err, result) {
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

router.get('/getData', function (req, res) {
  // var id = req.query.id;
  pool.getConnection(function (err, connection) {
    connection.query(y_jd.queryAll, [24], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      // console.log(result)
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
});

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



router.get('/qqmusic/getNowData', function (req, res, next) {
  // console.log(req.query)
  let param = { "comm": { "g_tk": 5381, "uin": 0, "format": "json", "inCharset": "utf-8", "outCharset": "utf-8", "notice": 0, "platform": "h5", "needNewCode": 1 }, "requestSingerCallList": { "method": "AlbumSingerRankList", "param": { "actid": 279 }, "module": "mall.AlbumCallSvr" }, "requestUserInfo": { "method": "UsrCallInfo", "param": { "actid": 279 }, "module": "mall.AlbumCallSvr" } }
  var e = request({
    url: `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1534440516152`,
    method: 'POST',
    body: JSON.stringify(param)
    // headers: { 'Content-Type': 'text/json' }
  }, function (error, response, body) {
    var responseData = {
      code: 200,
      data: body,
    }

    res.json(responseData)
    // res.send(JSON.parse(body));
    // if (!error && response.statusCode == 200) {
    //     res.render('task', { 'data': JSON.parse(body) });
    // }
  });
})

// router.post('/test', function (req, res, next) {
//     res.json(responseData)
// })

router.get('/qqmusic/getAlluserNum', function (req, res) {
  // var id = req.query.id;
  pool.getConnection(function (err, connection) {
    connection.query(y_musicdata.queryAll, [104], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
});

router.get('/qqmusic/getUserNumByMinute', function (req, res) {
  // var id = req.query.id;
  pool.getConnection(function (err, connection) {
    connection.query(y_musicdata_minute.queryAll, [104], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
});

router.get('/qqmusic/getNumbyId', function (req, res) {
  var id = req.query.id;
  pool.getConnection(function (err, connection) {
    connection.query(y_musicdata.getDataById, [id], function (err, result) {
      if (result) {
        result = {
          code: 200,
          msg: result
        };
      }
      // 以json形式，把操作结果返回给前台页面
      // 释放连接  
      res.json(result)
      connection.release();
    });
  })
})


module.exports = router