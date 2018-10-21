/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// 表
var r_user = require('../sql/r_user');

// 数据库
var dbConfig = require('../config/dbconfig');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);



router.post('/authorData', function (req, res, next) {
    var roleInfo = req.body.roleInfo;
    var roleName = req.body.roleName;
    if (!roleInfo || !roleName) {
        return;
    }
    pool.getConnection(function (err, connection) {
        connection.query(r_user.insert, [roleInfo, roleName], function (err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: result
                };
            }else{
                result = {
                    code: 200,
                    msg: err
                };
            }
            // 以json形式，把操作结果返回给前台页面
            // 释放连接  
            res.json(result)
            connection.release();
        });
    })
});

router.get('/authorData', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(r_user.queryAll, [], function (err, result) {
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



module.exports = router