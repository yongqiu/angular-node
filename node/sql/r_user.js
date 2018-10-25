var r_role = {
  insert: 'INSERT INTO `ycydata`.`r_role` (`roleInfo`, `roleName`, `createdAt`) VALUES (?, ?, ?);',
  queryAll: 'SELECT * FROM r_role ORDER BY createdAt DESC',
  getRolePointsById: 'SELECT * FROM r_role WHERE id = ? ORDER BY createdAt DESC LIMIT 1',
  updateRole: 'UPDATE `ycydata`.`r_role` SET `roleInfo`=?, `roleName`=? WHERE `id`=?',
  deleteRole: 'DELETE FROM `ycydata`.`r_role` WHERE `id`=?'
};
var r_user = {
  insert: 'INSERT INTO `ycydata`.`r_user` (`userName`, `password`, `role`, `createdAt`) VALUES (?, ?, ?, ?);',
  // queryAll: 'SELECT * FROM r_user ORDER BY createdAt DESC',
  queryAll: 'SELECT r_user.*,r_role.roleName FROM r_user INNER JOIN r_role ON r_user.role = r_role.id',
  getUserById: 'SELECT r_user.*,r_role.roleName FROM r_user INNER JOIN r_role ON r_user.role = r_role.id WHERE r_user.id = ? ORDER BY createdAt DESC LIMIT 1',
  updateRole: 'UPDATE `ycydata`.`r_user` SET `userName`=?, `password`=?, `role`=? WHERE `id`=?',
  deleteRole: 'DELETE FROM `ycydata`.`r_user` WHERE `id`=?'
};
module.exports = { r_user, r_role };