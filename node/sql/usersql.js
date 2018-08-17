var UserSQL = {
    insert: 'INSERT INTO y_musicdata(singerid,singer_call_num,fans_nick,fans_call_num,status,createdAt) VALUES(?,?,?,?,?,?)',
    queryAll: 'SELECT * FROM y_musicdata ORDER BY createdAt DESC LIMIT 80',
    getDataById: 'SELECT * FROM y_musicdata WHERE singerid = ? ORDER BY createdAt DESC LIMIT 10',
};
module.exports = UserSQL;