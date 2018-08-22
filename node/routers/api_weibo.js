/**
 * Created by Wu Yongqiu on 2017/6/29.
 */

var express = require('express');
var router = express.Router();

var request = require('request');

var dbConfig = require('../config/dbconfig');
var userSQL = require('../sql/usersql');
var mysql = require('mysql');

router.get('/data', function (req, res, next) {
  // console.log(req.query)
  let weekFliter = req.query.weekFliter;
  let userNum = req.query.userNum;
  var e = request({
    url: `https://api.laimeiyun.cn/v1/day/${weekFliter}/${userNum}`,
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

router.get('/info', function (req, res, next) {
  // console.log(req.query)
  let userNum = req.query.userNum;
  var e = request({
    url: `https://api.laimeiyun.cn/v1/hour/month/${userNum}`,
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



module.exports = router;