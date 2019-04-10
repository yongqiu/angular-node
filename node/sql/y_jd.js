var y_jd = {
  insert: 'INSERT INTO `ycydata`.`r_jd` (`userId`, `value`, `createdAt`,`userName`) VALUES (?, ?, ?,?)',
  queryAll: 'SELECT * FROM r_jd ORDER BY createdAt DESC LIMIT ?',
  getDataById: 'SELECT * FROM r_jd WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
  // 删除最老的n条数据
  deletetenLines: 'DELETE FROM r_jd ORDER BY id ASC LIMIT ?'
};
module.exports = y_jd;