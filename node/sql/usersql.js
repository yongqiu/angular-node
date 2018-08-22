var y_musicdata = {
    insert: 'INSERT INTO y_musicdata(singerid,singer_call_num,fans_nick,fans_call_num,status,createdAt) VALUES(?,?,?,?,?,?)',
    queryAll: 'SELECT * FROM y_musicdata ORDER BY createdAt DESC LIMIT ?',
    getDataById: 'SELECT * FROM y_musicdata WHERE singerid = ? ORDER BY createdAt DESC LIMIT 10',
    // 删除最老的十条数据
    deletetenLines: 'DELETE FROM y_musicdata ORDER BY id ASC LIMIT ?'
};
module.exports = y_musicdata;