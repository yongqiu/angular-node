/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
// 表
var { r_role, r_user } = require('../sql/r_user');

// 数据库
var dbConfig = require('../config/dbconfig');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);



router.post('/roleData', function (req, res, next) {
    var roleInfo = req.body.roleInfo;
    var roleName = req.body.roleName;
    var id = req.body.id;
    if (!roleInfo || !roleName) {
        return;
    }
    let sql;
    let param = [];
    let createAt = Date.parse(new Date()) / 1000;
    if(!id){
        sql = r_role.insert
        param = [roleInfo, roleName, createAt]
    }else{
        sql = r_role.updateRole
        param = [roleInfo, roleName, id]
    }
    pool.getConnection(function (err, connection) {
        
        connection.query(sql, param, function (err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: result
                };
            } else {
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

router.post('/userData', function (req, res, next) {
    var roleId = req.body.roleId;
    var userName = req.body.userName;
    var password = req.body.password;
    var id = req.body.id;
    if (!userName || !password) {
        return;
    }
    let sql;
    let param = [];
    let createAt = Date.parse(new Date()) / 1000;
    if (!id) {
        sql = r_user.insert
        param = [userName, password, roleId, createAt]
    } else {
        sql = r_user.updateRole
        param = [userName, password, roleId ,id]
    }
    pool.getConnection(function (err, connection) {
        connection.query(sql, param, function (err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: result
                };
            } else {
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



router.get('/roleData', function (req, res, next) {
    let id = req.query.id;
    let sql;
    if (id) {
        sql = r_role.getRolePointsById
    } else {
        sql = r_role.queryAll
    }
    pool.getConnection(function (err, connection) {
        connection.query(sql, [id], function (err, result) {
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

router.get('/userData', function (req, res, next) {
    let id = req.query.id;
    let sql;
    if (id) {
        sql = r_user.getUserById
    } else {
        sql = r_user.queryAll
    }
    pool.getConnection(function (err, connection) {
        connection.query(sql, [id], function (err, result) {
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
router.delete('/roleData', function (req, res, next) {
    let id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query(r_role.deleteRole, [id], function (err, result) {
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

router.delete('/userData', function (req, res, next) {
    let id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query(r_user.deleteRole, [id], function (err, result) {
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