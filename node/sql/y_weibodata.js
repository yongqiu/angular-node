var y_weibodata = {
    insert: 'INSERT INTO y_weibodata(userId,userName,totalVal,weibo_interact,weibo_social,weibo_read,weibo_love,createdAt) VALUES(?,?,?,?,?,?,?,?)',
    queryAll: 'SELECT * FROM y_weibodata ORDER BY createdAt DESC LIMIT ?',
    queryAllUser: "SELECT * FROM y_weibodata where userId = ? ORDER BY createdAt DESC LIMIT 12",
    // 删除最老的n条数据
    deletetenLines: 'DELETE FROM y_weibodata ORDER BY id ASC LIMIT 1'
};
module.exports = y_weibodata;