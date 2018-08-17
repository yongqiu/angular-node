/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();

var request = require('request');


// 所有路径的api请求，都默认返回的参数
/*
* test
* */

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

router.post('/user/test', function (req, res, next) {
    res.json(responseData)
})

router.get('/test', function (req, res) {
    res.send('Hello World!');
});



module.exports = router