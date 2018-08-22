var y_musicdata_minute = {
  insert: 'INSERT INTO y_musicdata_minute(singerid,singer_call_num,fans_nick,fans_call_num,status,createdAt) VALUES(?,?,?,?,?,?)',
  queryAll: 'SELECT * FROM y_musicdata_minute ORDER BY createdAt DESC LIMIT ?',
  getDataById: 'SELECT * FROM y_musicdata_minute WHERE singerid = ? ORDER BY createdAt DESC LIMIT 10',
  // 删除最老的n条数据
  deletetenLines: 'DELETE FROM y_musicdata_minute ORDER BY id ASC LIMIT ?'
};
module.exports = y_musicdata_minute;