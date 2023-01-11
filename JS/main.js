window.addEventListener('load',carrega);

function carrega(){
    document.getElementById('field-tamanho').addEventListener('blur', leave);
    document.getElementById('field-pedacos').addEventListener('blur', leave);
    document.getElementById('field-sabores').addEventListener('blur', leave); 
    document.getElementById('field-valor').addEventListener('blur', leave);   
    document.getElementById('field-descricao').addEventListener('blur', leave);     
}
function leave(){
    if(this.value != ''){
        this.offsetParent.className += " ativo";
    }else{
        this.offsetParent.className = 'box';
    }
}

function inputSHOW(_show){
    if(_show){
        document.getElementById('field-tamanho').offsetParent.className += " ativo";
        document.getElementById('field-pedacos').offsetParent.className += " ativo";
        document.getElementById('field-sabores').offsetParent.className += " ativo";
        document.getElementById('field-valor').offsetParent.className += " ativo";
        document.getElementById('field-descricao').offsetParent.className += " ativo";
        document.getElementById('btn-deletar').style.display = 'block';
    }else{
        
        document.getElementById('field-tamanho').offsetParent.className = 'box';
        document.getElementById('field-pedacos').offsetParent.className = 'box';
        document.getElementById('field-sabores').offsetParent.className = 'box';
        document.getElementById('field-valor').offsetParent.className = 'box';
        document.getElementById('field-descricao').offsetParent.className = 'box';
        //document.getElementById('btn-deletar').style.display = 'none';
    }
}

function limpaCampo(){
    
    document.getElementById('field-id').value = '';
    document.getElementById('field-tamanho').value = '';
    document.getElementById('field-pedacos').value = '';
    document.getElementById('field-sabores').value = '';
    document.getElementById('field-valor').value = '';
    document.getElementById('field-descricao').value = '';
}