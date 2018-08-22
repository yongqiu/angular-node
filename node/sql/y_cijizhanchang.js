var y_cijizhanchang = {
    insert: 'INSERT INTO y_cijizhanchang(data,status,createdAt) VALUES(?,?,?)',
    queryAll: 'SELECT * FROM y_cijizhanchang ORDER BY createdAt DESC LIMIT ?',
    // 删除最老的n条数据
    deletetenLines: 'DELETE FROM y_cijizhanchang ORDER BY id ASC LIMIT 1'
};
module.exports = y_cijizhanchang;