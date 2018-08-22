/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// 表
var y_musicdata = require('../sql/usersql');
var y_musicdata_minute = require('../sql/y_musicdata_minute');
var y_cijizhanchang = require('../sql/y_cijizhanchang');
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
        updateMusicRank();
    });
}

function getMusicDatabyMinute() {
    var rule = new schedule.RecurrenceRule();
    rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    let minuteRule = '00 * * * * *'
    schedule.scheduleJob(rule, function () {
        console.log("getMusicDatabyMinute" + new Date());
        // 专辑销量
        updateMusicRankAndDelete();
        deleteLines()
        // 吃鸡
        updateChijiData();
        deleteChijiLines();
    });
}

// scheduleCronstyle();
// getMusicDatabyMinute()

// 所有路径的api请求，都默认返回的参数
/*
* test
* */

function updateMusicRank() {
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
        var ranklist = JSON.parse(body).requestSingerCallList.data.ranklist;
        ranklist.forEach(element => {
            pool.getConnection(function (err, connection) {
                // 获取前台页面传过来的参数  
                var param = [
                    //singerid: 
                    element.singerid,
                    //singer_call_num: 
                    element.singer_call_num,
                    //fans_nick:
                    'nick_name',
                    //fans_call_num: 
                    element.fans_call_num,
                    //status:
                    0,
                    //createdAt:
                    Date.parse(new Date()) / 1000
                ]
                // 建立连接 增加一个用户信息 
                connection.query(y_musicdata.insert, param, function (err, result) {
                    if (result) {
                        result = {
                            code: 200,
                            msg: '增加成功'
                        };
                    }
                    // 以json形式，把操作结果返回给前台页面

                    // 释放连接  
                    connection.release();
                });
            });
        });

        // res.send(JSON.parse(body));
        // if (!error && response.statusCode == 200) {
        //     res.render('task', { 'data': JSON.parse(body) });
        // }
    });
}

function updateMusicRankAndDelete() {
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
        var ranklist = JSON.parse(body).requestSingerCallList.data.ranklist;
        ranklist.forEach(element => {
            pool.getConnection(function (err, connection) {
                // 获取前台页面传过来的参数  
                var param = [
                    //singerid: 
                    element.singerid,
                    //singer_call_num: 
                    element.singer_call_num,
                    //fans_nick:
                    'nick_name',
                    //fans_call_num: 
                    element.fans_call_num,
                    //status:
                    0,
                    //createdAt:
                    Date.parse(new Date()) / 1000
                ]
                // 建立连接 增加一个用户信息 
                connection.query(y_musicdata_minute.insert, param, function (err, result) {
                    if (result) {
                        result = {
                            code: 200,
                            msg: '增加成功'
                        };
                    }
                    // 以json形式，把操作结果返回给前台页
                    // 释放连接  
                    connection.release();
                });
            });
        });

        // res.send(JSON.parse(body));
        // if (!error && response.statusCode == 200) {
        //     res.render('task', { 'data': JSON.parse(body) });
        // }
    });
}

function deleteLines() {
    pool.getConnection(function (err, connection) {
        connection.query(y_musicdata_minute.deletetenLines, [8], function (err, result) {
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

function updateChijiData() {
    var e = request({
        url: `https://vip.video.qq.com/fcgi-bin/comm_cgi?name=test_rank&cmd=1&_=1534856123160&callback=Zepto1534856122838`,
        method: 'GET',
        // headers: { 'Content-Type': 'text/json' }
    }, function (error, response, body) {
        var regex = "\\((.+?)\\)";
        var arr = body.match(regex);
        pool.getConnection(function (err, connection) {
            var param = [
                //data,
                arr[1],
                //status:
                0,
                //createdAt:
                Date.parse(new Date()) / 1000
            ];
            connection.query(y_cijizhanchang.insert, param, function (err, result) {
                // 以json形式，把操作结果返回给前台页面
                // 释放连接
                connection.release();
            });
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