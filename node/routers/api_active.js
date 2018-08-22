var express = require('express');
var router = express.Router();

var request = require('request');

var dbConfig = require('../config/dbconfig');
var y_cijizhanchang = require('../sql/y_cijizhanchang');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);

function getChijiDataTimer() {
    var rule = new schedule.RecurrenceRule();
    rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    schedule.scheduleJob(rule, function () {
        console.log('getChijiDataTimer:' + new Date());
        updateChijiData();
        deleteLines();
    });
}
getChijiDataTimer();

function updateChijiData() {
    var e = request({
        url: `https://vip.video.qq.com/fcgi-bin/comm_cgi?name=test_rank&cmd=1&_=1534856123160&callback=Zepto1534856122838`,
        method: 'GET',
        // headers: { 'Content-Type': 'text/json' }
    }, function (error, response, body) {
        var regex = "\\((.+?)\\)";
        var arr = body.match(regex);
        console.log(arr[1])
        pool.getConnection(function (err, connection) {
            var param = [
                //data,
                JSON.stringify(arr[1]),
                //status:
                0,
                //createdAt:
                Date.parse(new Date()) / 1000
            ];
            connection.query(y_cijizhanchang.insert, param, function (err, result) {
                if (result) {
                    result = {
                        code: 200,
                        msg: '增加成功'
                    };
                }
                // 以json形式，把操作结果返回给前台页面
                console.log(err);

                // 释放连接  
                connection.release();
            });
        });
    });
};

function deleteChijiLines() {
    pool.getConnection(function (err, connection) {
        connection.query(y_cijizhanchang.deletetenLines, [8], function (err, result) {
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

module.exports = router;