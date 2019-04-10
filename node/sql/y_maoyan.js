var y_maoyan = {
  insert: 'INSERT INTO `ycydata`.`y_maoyan`(`celebrityName`, `popValue`, `celebrityId`, `celebrityAvatar`, `createAt`) VALUES (?, ?, ?, ?, ?)',
  queryAll: 'SELECT * FROM `ycydata`.`y_maoyan` ORDER BY createAt DESC',
  getDataById: 'SELECT * FROM `ycydata`.`y_maoyan` WHERE `celebrityId` = ? ORDER BY createAt DESC LIMIT 50',
  // 删除最老的n条数据
  deletetenLines: 'DELETE FROM `ycydata`.`y_maoyan` ORDER BY id ASC LIMIT ?'
};
module.exports = y_maoyan;