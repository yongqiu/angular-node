/**
 * Created by Wu Yongqiu on 2017/6/29.
 */
var express = require('express');
var router = express.Router();
var request = require('request');

const superagent = require("superagent");

const cheerio = require("cheerio");
// 表
var y_weibodata = require('../sql/y_weibodata');
// 数据库
var dbConfig = require('../config/dbconfig');
var mysql = require('mysql');
var schedule = require('node-schedule');
var pool = mysql.createPool(dbConfig.mysql);

function scheduleCronstyle() {
  let hourRule = '00 05 02 * * *'
  let minuteRule = '00 * * * * *'
  schedule.scheduleJob(hourRule, function () {
    console.log('scheduleCronstyle:' + new Date());
    this.loopUser()
  });
}

scheduleCronstyle()


var banjiaUser = [{
  userName: '杨超越',
  key: 3
}, {
  userName: '赖美云',
  key: 6
}, {
  userName: '紫宁',
  key: 7
}, {
  userName: 'sunnee',
  key: 8
}]

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

router.get('/getAllUserDayData', function (req, res) {
  // var id = req.query.id;
  pool.getConnection(function (err, connection) {
    connection.query(y_weibodata.queryAll, [5], function (err, result) {
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
});

function loopUser() {
  let sids = [{ name: '杨超越', sid: '5644764907' }, { name: '紫宁', sid: '2335410541' }, { name: '赖美云', sid: '5541182601' }, { name: '杨芸晴', sid: '2485664410' }, { name: '摩登兄弟', sid: '5456865382' }]
  sids.forEach(user => {
    getUserInfo(user)
  })
}

// loopUser()


function getUserInfo(user) {
  // cy，zn，lmy，yyq
  superagent.get(`http://club.starvip.weibo.cn/rank/chart?sid=${user.sid}&rank_type=6&sendflower=1&luicode=10000011&lfid=231343_5644764907_6`)
    .set('Cookie', '___rl__test__cookies=1535901082510; _T_WM=81689d7e82112e6cb1082e0e7e401e05; WEIBOCN_FROM=1110006030; OUTFOX_SEARCH_USER_ID_NCOO=292589876.21827877; STAR-G0=2d34e5446abb94853dcdfe8a6e3f5845; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WF.joEWAo9.vDGjGFSwiC2n5JpX5K-hUgL.Foz4SonXe0eXS0-2dJLoIf2LxKqLBonLBK.LxKqL1-qL1KBLxKBLBonL12BLxK-L12qL1K2LxKnL1hBLB.-LxKqLBo5L1KBLxK-LBo5L12qLxKMLBKML12zLxKMLBKML12zt; SCF=Avw0rlalnQtk0zqRNe2mI3I3l2rPvHC69dQAoLlK54QxakxMpk_Rnitxo-Es5iDAz5489pXgF7wgWJTH07oUscE.; TMPTOKEN=6idMbxF207ekaMMTnaPPGaWgwxS1d2PSh8whgWTyvqE7PVSksP2NXoBL6qUQkfMW; SUB=_2A252iHSaDeRhGeRH7VoV8y3IzDmIHXVScxzSrDV6PUJbkdANLUWjkW1NTYOCpy5KhEq0KYjvHt7p2g0AX5wuu2CK; SUHB=0TPl3sizMnrc69; SSOLoginState=1535902922; MLOGIN=1; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D100103type%253D1%2526q%253D%25E6%259D%25A8%25E8%25B6%2585%25E8%25B6%258A%26fid%3D231343_5644764907_6%26uicode%3D10000011')
    .end(function (err, obj) {
      if (err) {
        return;
      }
      //获取页面文档数据
      var content = obj.text;
      //cheerio也就是nodejs下的jQuery  将整个文档包装成一个集合，定义一个变量$接收
      var $ = cheerio.load(content);
      var script = '123';
      $('script').each(function () {
        script = $(this).html();
      })
      // console.log(script)
      var tempData = {
        value: obj.text,
      };
      // let array = script.split("\n");
      // let finder = array.findIndex(item => {
      //   return item.indexOf('昨日互动数') != -1
      // })
      // console.log(finder)
      // str = str.match(/aaa(\S*)fff/)[1];
      // script = script.replace(/\n/g, '');
      // script = script.replace(/\"/g, '');
      // var str = "aaabbbcccdddeefff";
      // str = aaa.match(/aaa(\S*)fff/)[1];
      // 微博互动数
      var interact_repost = script.match(/'7日互动数',\nrepost: (\S*),\ncomment/)[1];
      // 评论互动数
      var interact_comment = script.match(/,\ncomment: (\S*),\nstory/)[1];
      // 故事互动数
      var interact_story = script.match(/,\nstory: (\S*),\ninteract/)[1];
      // 互动总数
      var interact_total = script.match(/,\ninteract: (\S*),\n};\n\ndata.mention_search/)[1];

      // 社会影响力
      // 搜索
      var social_search = script.match(/,\nsearch: (\S*),\nmentio/)[1];
      // 提及
      var social_mention = script.match(/,\nmention: (\S*),\nmention/)[1];
      // 总数
      var social_total = script.match(/,\nmention_search: (\S*),\n};\ndata.blog/)[1];

      // 阅读
      // 发博数
      var read_blog = script.match(/,\nsend_blog_count:(\S*),\nblog_read_count:/)[1];
      // 阅读数
      var read_total = script.match(/,\nblog_read_count:(\S*),\n};\ndata.close/)[1];

      // 爱慕值
      // 送花人数
      var love_person = script.match(/,\ngive_flower_person_count: (\S*),\ngive_flower/)[1];
      // 送花次数
      var love_times = script.match(/,\ngive_flower_time: (\S*),\nclose/)[1];
      // 爱慕值
      var love_total = script.match(/,\nclose: (\S*),\n};/)[1];

      var interact = {
        interact_repost: JSON.parse(interact_repost)[6],
        interact_comment: JSON.parse(interact_comment)[6],
        interact_story: JSON.parse(interact_story)[6],
        interact_total: JSON.parse(interact_total)[6]
      }
      var social = {
        social_search: JSON.parse(social_search)[6],
        social_mention: JSON.parse(social_mention)[6],
        social_total: JSON.parse(social_total)[6]
      }

      var read = {
        read_blog: JSON.parse(read_blog)[6],
        read_total: JSON.parse(read_total)[6]
      }

      var love = {
        love_person: JSON.parse(love_person)[6],
        love_times: JSON.parse(love_times)[6],
        love_total: JSON.parse(love_total)[6]
      }

      var e = request({
        url: `https://m.weibo.cn/api/container/getIndex?containerid=231343_${user.sid}_6`,
        method: 'GET',
        // headers: { 'Content-Type': 'text/json' }
      }, function (error, response, body) {

        let totalVal = JSON.parse(body).data.cards[2].card_group[1].group[0].item_title;
        let readVal = JSON.parse(body).data.cards[2].card_group[2].group[0].title_sub.match(/阅读数：(\S*)分/)[1];
        let interactVal = JSON.parse(body).data.cards[2].card_group[2].group[1].title_sub.match(/互动数：(\S*)分/)[1];
        let socialVal = JSON.parse(body).data.cards[2].card_group[2].group[2].title_sub.match(/社会影响力：(\S*)分/)[1];
        let loveVal = JSON.parse(body).data.cards[2].card_group[2].group[3].title_sub.match(/爱慕值：(\S*)分/)[1];

        read.readVal = parseFloat(readVal)
        interact.interactVal = parseFloat(interactVal)
        social.socialVal = parseFloat(socialVal)
        love.loveVal = parseFloat(loveVal)

        var param = [
          user.sid,
          user.name,
          parseFloat(totalVal),
          JSON.stringify(interact),
          JSON.stringify(social),
          JSON.stringify(read),
          JSON.stringify(love),
          Date.parse(new Date()) / 1000
        ]
        pool.getConnection(function (err, connection) {
          connection.query(y_weibodata.insert, param, function (err, result) {
            console.log(err)
            // 以json形式，把操作结果返回给前台页面
            // 释放连接  
            connection.release();
          });
        })
      });
    })

}



// init();





module.exports = router;