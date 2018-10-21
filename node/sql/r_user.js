var r_user = {
  insert: 'INSERT INTO `ycydata`.`r_role` (`roleInfo`, `roleName`) VALUES (?, ?);',
  queryAll: 'SELECT * FROM r_role ORDER BY id',
};
module.exports = r_user;