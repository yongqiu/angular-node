/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();

var request = require('request');

var dbConfig = require('../config/dbconfig');
var userSQL = require('../sql/usersql');
var mysql = require('mysql');

var schedule = require('node-schedule');
function scheduleCronstyle() {
    let hourRule = '00 00 * * * *' // 每小时的00分00秒
    let minuteRule = '00 * * * * *'
    schedule.scheduleJob(hourRule, function () {
        console.log('scheduleCronstyle:' + new Date());
        updateMusicRank();
    });
}

scheduleCronstyle();

// 所有路径的api请求，都默认返回的参数
/*
* test
* */

var pool = mysql.createPool(dbConfig.mysql);

function updateMusicRank(res) {
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
                    element.fans_nick,
                    //fans_call_num: 
                    element.fans_call_num,
                    //status:
                    0,
                    //createdAt:
                    Date.parse(new Date()) / 1000
                ]
                // 建立连接 增加一个用户信息 
                connection.query(userSQL.insert, param, function (err, result) {
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


router.get('/getHotSearch', function (req, res, next) {
    // console.log(req.query)
    var e = request({
        url: `https://www.enlightent.com/research/top/getWeiboRankSearch?keyword=${req.query.name}&from=${req.query.page}`,
        method: 'GET',
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

router.get('/getMusicInfo', function (req, res, next) {
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
        connection.query(userSQL.queryAll, [], function (err, result) {
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
        connection.query(userSQL.getDataById, [id], function (err, result) {
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