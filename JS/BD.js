var db = openDataBase('dbTiops', '1.0' , 'BDTeste', 2 * 1024 * 1024 );

db.trasaction(function(tx){
 tx.executeSql(' CREATE TABLE tips(ID PRIMARY KEY, name TEXT)');
});
