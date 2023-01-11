window.addEventListener('load', carregado);

var db = openDatabase("myDB", "1.0", "TiPS Database Example", 2 * 1024 * 1024);



function carregado(){    
    
    document.getElementById('btn-salvar').addEventListener('click', salvar);
    document.getElementById('btn-deletar').addEventListener('click', deletar);
    
    db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE myTable" );
        tx.executeSql("CREATE TABLE IF NOT EXISTS myTable ( id INTEGER PRIMARY KEY,tamanho TEXT,pedacos NUMBER, sabores NUMBER, price TEXT, desc TEXT)" );
//        tx.executeSql('INSERT INTO myTable ( nome,senha,email) VALUES ("a", "b", "c")');
    });
    
    mostrar();
    
}   

function salvar(){
    var id = document.getElementById('field-id').value;
    var tamanho = document.getElementById('field-tamanho').value;
    var pedacos = document.getElementById('field-pedacos').value;
    var sabores = document.getElementById('field-sabores').value;
    var price = document.getElementById('field-valor').value;
    var desc = document.getElementById('field-descricao').value;

    db.transaction(function(tx) {
        if(id){
            tx.executeSql('UPDATE myTable SET tamanho=?, pedacos=?, sabores=? , price=? , desc=? WHERE id=?', [tamanho,pedacos,sabores,price,desc,id],null);
        }else{
            tx.executeSql('INSERT INTO myTable ( tamanho,pedacos,sabores,price,desc ) VALUES (?, ?, ? ,?, ?)', [tamanho,pedacos,sabores,price,desc]);
        }
    });

    mostrar();
    limpaCampo();
    inputSHOW(false);
}

function mostrar(){        
    var table = document.getElementById('tbody-register');

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM myTable', [], function (tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                    tr += '<tr>';
                    tr += '<td onClick="atualizar(' + rows[i].id + ')">' + rows[i].tamanho + '</td>';
                    tr += '<td>' + rows[i].pedacos + '</td>';
                    tr += '<td>' + rows[i].sabores + '</td>';
                    tr += '<td>' + rows[i].price + '</td>';
                    tr += '<td>' + rows[i].desc + '</td>';
                    tr += '</tr>';                   
            }
                table.innerHTML = tr; 

        }, null);
    });
}

function atualizar(_id){   
    
    var id = document.getElementById('field-id').value;
    var tamanho = document.getElementById('field-tamanho').value;
    var pedacos = document.getElementById('field-pedacos').value;
    var sabores = document.getElementById('field-sabores').value;
    var price = document.getElementById('field-valor').value;
    var desc = document.getElementById('field-descricao').value;
    
    id.value = _id;
    
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM myTable WHERE id=?', [_id], function (tx, resultado) {
            var rows = resultado.rows[0];

            tamanho.value = rows.tamanho ;
            pedacos.value = rows.pedacos ;
            sabores.value = rows.sabores ;
            price.value = rows.price;
            desc.value = rows.desc;
        });
    });
    inputSHOW(true);
}

function deletar(){
    
    var id = document.getElementById('field-id').value;
    
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM myTable WHERE id=?", [id]);
    });
    
    mostrar();
    limpaCampo();
    inputSHOW(false);
}