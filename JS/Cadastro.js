const container_cadastro = document.getElementById("container_cadastro")
const carrinho_icone = document.getElementById("carrinho")
const user = document.getElementById("user")
const user_container = document.getElementById("user_container")
const container_pedido = document.getElementById("container_cadastro")

var carrinho = JSON.parse(localStorage.getItem('carrinho'))
var clientes = JSON.parse(localStorage.getItem('clientes'))

carrinho_icone.addEventListener("click", abrirCarrinho)

user.addEventListener("click", abrirUsuario)

container_pedido.addEventListener("click", fecharUsuario)

mudaQuantCar()

var clienteLogado = descobrirCliente()
if(clienteLogado != false){
    mudaUser()
}

/* ------------ CARRINHO ------------- */

function abrirCarrinho(){
    
    let id_carrinho = document.getElementById("carrinho_container")
    
    id_carrinho.style.visibility = "visible"
    container_pedido.style.filter = "blur(5px)"

    console.log(container_pedido)

    if(!carrinho || !carrinho[0]){
        id_carrinho.style.padding = 0;
        id_carrinho.innerHTML = 
        `
            <div style="font-size: 2rem;display: flex; flex-direction: column; align-items:center;margin: auto">
                <span>Carrinho Vazio</span>
                <a href="Pedido.html" style="color:black; padding: 0; margin-top: 5rem">Fazer um pedido</a>
            </div>
        `

        container_pedido.addEventListener("click", ()=>{
            id_carrinho.style.visibility = "hidden"
            container_pedido.style.filter = "blur(0px)"
            mudaQuantCar()
        })

        return
    }

    itensCarrinho()

    const close = document.getElementById("close")
    const adicionarMais = document.getElementById("adicionarMais")
    const maisCar = document.querySelectorAll(".maisCar")
    const menosCar = document.querySelectorAll(".menosCar")
    const finalizar_pedido_btn = document.getElementById("finalizar_pedido_btn")

    adicionarMais.addEventListener("click",()=>{
        window.location.href = "Pedido.html";
    })

    close.addEventListener("click", ()=>{
        id_carrinho.style.visibility = "hidden"
        container_pedido.style.filter = "blur(0px)"
        mudaQuantCar()
    })

    for(el of maisCar){
        el.addEventListener("click", aumentarQuantCar)
    }
    
    for(el of menosCar){
        el.addEventListener("click", diminuirQuantCar)
    }
    
    finalizar_pedido_btn.addEventListener("click", finalizarPedido)
}

function itensCarrinho(){
    let itens_carrinho = document.getElementById("itens_carrinho")
    let totalPedido_id = document.getElementById("totalPedido")
    let totalPedido = 0
    itens_carrinho.innerHTML = ""

    if(carrinho){
        for(i=0; i<carrinho.length; i++){
            let sec = document.createElement("section")
            itens_carrinho.appendChild(sec)
            sec.innerHTML += 
            `
                <div class="carrinho-row" id="pizzas" name="${i}">
                    <strong>${carrinho[i].tamanho.tamanho}</strong>
                    <div class="quant_container">
                        <img src="img/menos.png" class="quantImg menosCar">
                        <span style="color: black;margin: 0;">${carrinho[i].quantidade}</span>
                        <img src="img/mais.png" class="quantImg maisCar" >
                    </div>
                </div>

                <div class="carrinho-row" style="flex-direction: column; justify-content: normal; align-items: normal; font-size: 10px;">
                    <div class="carrinho-row" style="width: 60%">
                        <span style="margin: 0;">Massa ${carrinho[i].massa.massa}</span>
                        <span color: orange;">adicional de R$${carrinho[i].massa.preco}</span>
                    </div>
                    <div class="carrinho-row" style="width: 60%">
                        <span style="margin: 0;">Borda ${carrinho[i].borda.borda}</span>
                        <span color: orange;">adicional de R$${carrinho[i].borda.preco}</span>
                    </div>
                    <span style="display: flex; font-size: 10px";>--Sabores--</span>
                </div>
            `

            let totalSabor = 0
            for(el of carrinho[i].sabores){
                sec.innerHTML +=
                `
                <div class="carrinho-row" style="width: 97%; font-size: 10px;">
                    <div class="carrinho-row" style="width: 60%">
                        <span style="margin: 0;">${el.sabor}</span>
                        <span>adicional de R$${el.adicional}</span>
                    </div>
                </div>
                `

            }
            
            sec.innerHTML += 
            `
                <h2 name="total" style="margin-top: 1rem; color: #03e703; display: flex; justify-content: center;">R$${(carrinho[i].total * carrinho[i].quantidade).toFixed(2)}</h2>
                <hr>
            `
            totalPedido += (carrinho[i].total * carrinho[i].quantidade)

        }
    }

    totalPedido_id.children[0].children[0].innerHTML = `R$${(totalPedido).toFixed(2)}`
}

function mudaQuantCar(){
    if(carrinho){
        let quant_carrinho = carrinho_icone.parentNode.children[1]
        if(carrinho.length != 0){
            quant_carrinho.style.visibility = "visible"
            quant_carrinho.textContent = carrinho.length
        }
    }
}

function aumentarQuantCar(){
    carrinho[this.parentNode.parentNode.getAttribute("name")].quantidade += 1

    localStorage.setItem('carrinho', JSON.stringify(carrinho)) //att nova quantidade

    let pai = this.parentNode.parentNode.parentNode

    for(el of pai.children){
        if(el.getAttribute("name") == "total"){
            let novoPreco = carrinho[this.parentNode.parentNode.getAttribute("name")].total * carrinho[this.parentNode.parentNode.getAttribute("name")].quantidade
            
            
            this.parentNode.children[1].textContent = parseInt(this.parentNode.children[1].textContent) + 1 //att quantidade

            el.innerHTML = `R$${novoPreco.toFixed(2)}` //att total pizza

        }
    }
    
    

    atualizarTotal()
}

function diminuirQuantCar(){
    let aux = carrinho[this.parentNode.parentNode.getAttribute("name")].quantidade
    let diminui = carrinho[this.parentNode.parentNode.getAttribute("name")].quantidade - 1
    let pai = this.parentNode.parentNode.parentNode

    if(diminui != 0){
        carrinho[this.parentNode.parentNode.getAttribute("name")].quantidade = diminui

        localStorage.setItem('carrinho', JSON.stringify(carrinho))

        for(el of pai.children){
            if(el.getAttribute("name") == "total"){

                let novoPreco = carrinho[this.parentNode.parentNode.getAttribute("name")].total * aux
                novoPreco = novoPreco - carrinho[this.parentNode.parentNode.getAttribute("name")].total
                this.parentNode.children[1].textContent = parseInt(this.parentNode.children[1].textContent) -1

                el.innerHTML = `R$${novoPreco.toFixed(2)}`
            }
        }
    }
    else{
        carrinho.splice(this.parentNode.parentNode.getAttribute("name"))
        localStorage.setItem('carrinho', JSON.stringify(carrinho))
        if(carrinho.length != 0){
            pai.remove()
        }
        else{
            document.getElementById("carrinho_container").innerHTML = 
            `
            <div style="font-size: 2rem;display: flex; flex-direction: column; align-items:center;margin: auto">
                <span>Carrinho Vazio</span>
                <a href="Pedido.html" style="color:black; padding: 0; margin-top: 5rem">Fazer um pedido</a>
            </div>`

            container_pedido.addEventListener("click", ()=>{
                document.getElementById("carrinho_container").style.visibility = "hidden"
                container_pedido.style.filter = "blur(0px)"
                mudaQuantCar()
                window.location.reload()
            })

            return
        }
    }
    atualizarTotal()
   
}

function atualizarTotal(){
    let totalPedido_id = document.getElementById("totalPedido")
    let aux = 0
    for(el of carrinho){
        aux += el.total*el.quantidade
    }

    
    totalPedido_id.children[0].innerHTML = `Total Pedido: <strong>R${aux.toFixed(2)}</strong>` 
}


function finalizarPedido(){
    let pai = this.parentNode
    let btn_entregar = document.createElement("button")

    this.remove()

    btn_entregar.setAttribute("type","button")
    btn_entregar.textContent = "Entregar em casa"
    btn_entregar.style = "background-color: orange; margin-bottom: 1rem; width: 60%"

    pai.appendChild(btn_entregar)


    btn_entregar.addEventListener("click", ()=>{
        window.location.href = "FinalizarPedido.html";
    })
}

/* --------- USUARIO ------------ */

function abrirUsuario(){
    user_container.style.visibility = "visible"
    container_pedido.style.filter = "blur(5px)"
}

function fecharUsuario(){
    user_container.style.visibility = "hidden"
    container_pedido.style.filter = "blur(0)"
}

function mudaUser(){
    let pai = document.getElementById("header_user")
    pai.children[0].textContent = `Olá ${clienteLogado.nome}`
    pai.children[1].textContent = `Deseja sair? Clique aqui`
}

function descobrirCliente(){
    if(!clientes){
        return false
    }
    for(el of clientes){
        if(el.login == true){
            console.log(el)
            return el
        }
    }
    return false
}


const btnEnviar = document.getElementById('btnEnviar');
let inputs = document.querySelectorAll('input');
const form = document.getElementById('form');
const nome = document.getElementById('name')
const cpf = document.getElementById('cpf');
const nasc = document.getElementById('nascimento')
const email = document.getElementById('email');
const senha = document.getElementById('passwords');
let cont = 0;

btnEnviar.addEventListener("click", (e) => {
    //Chama a função e passa o formulário como parâmetro e o evento de click no botão enviar
    checkInputs("form", e);

    //Atribui o local Storage para variável clientes
    let clientes = JSON.parse(localStorage.getItem('clientes'));
    //Se caso clientes for diferente criar um vetor de clientes
    if (!clientes) {
        clientes = [];
    }

    //Verifica se tem nome, e-mail e senha no local Storage
    if (cont == 5) {
        if (nome.value && email.value && senha.value) {
            const cliente = {
                login: false,
                cpf: cpf.value,
                nome: nome.value,
                email: email.value,
                senha: senha.value
            }
            clientes.push(cliente);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            form.submit();
        }
    }
});

//Valida a cada click ou tab
inputs.forEach(element => {
    element.addEventListener("blur", (event) => {
        checkInputs(event.target.id);
    });
});

//Formata a data com " / "
nasc.addEventListener("keypress", formataData);

//Fortmata o CPF com " . " + " - "
cpf.addEventListener("keypress", formataCPF);

function checkInputs(id, e) {

    cont = 0;
    const userNameValue = nome.value;
    const cpfValue = cpf.value;
    const nascValue = nasc.value;
    const emailValue = email.value;
    const senhaValue = senha.value;

    // Verificando nome
    if (id == 'name' || id == 'form') {
        if (userNameValue === "") {
            setErrorFor(nome, 'O nome é obrigatório!');
            cont --;
        } else {
            setSuccessFor(nome);
            cont ++;
        }
    }

    // Verificando CPF
    if (id == 'cpf' || id == 'form') {
        if (cpfValue === "") {
            setErrorFor(cpf, 'O CPF é obrigatório!');
            cont --;
        } else if (!validarCPF(cpfValue)) {
            setErrorFor(cpf, 'CPF inválido!');
            cont --;
        } else {
            setSuccessFor(cpf);
            cont ++;
        }
    }

    // Verificando Data Nascimento
    if (id == 'nascimento' || id == 'form') {
        const dataAtual = new Date().getFullYear();
        const anoNasc = nascValue.split('/');
        const result = (dataAtual - anoNasc[2]) > 18 ? false : true;
        if (nascValue === "") {
            setErrorFor(nasc, 'A data de nascimento é obrigatória!');
            cont --;
        } else if (!checkNasc(nascValue)) {
            setErrorFor(nasc, 'A data deve ser dividida por "/" "Ex:dd/mm/yyyy"');
            cont --;
        } else if (result) {
            setErrorFor(nasc, 'O usuário deve ser maior de 18 anos!');
            cont --;
        } else {
            setSuccessFor(nasc);
            cont ++;
        }
    }

    // Verificando e-mail
    if (id == 'email' || id == 'form') {
        if (emailValue === "") {
            setErrorFor(email, 'O e-mail é obrigatório!');
            cont --;
        } else if (!checkEmail(emailValue)) {
            setErrorFor(email, 'Informe um e-mail válido!');
            cont --;
        } else {
            setSuccessFor(email);
            cont ++;
        }
    }

    // Verificando Senha
    if (id == 'passwords' || id == 'form') {
        if (senhaValue === "") {
            setErrorFor(senha, 'Senha é obrigatório!');
            cont --;
        } else if (senhaValue.length < 8) {
            setErrorFor(senha, 'É nessário pelo menos 8 caracteres!');
            cont --;
        } else {
            setSuccessFor(senha);
            cont ++;
        }
    }
}

//Formata data
function formataData() {
    if (nasc.value.length == 2) {
        nasc.value += "/";
    }
    if (nasc.value.length == 5) {
        nasc.value += "/";
    }
}

//Formata CPF
function formataCPF() {
    if (cpf.value.length == 3 || cpf.value.length == 7) {
        cpf.value += ".";
    }
    if (cpf.value.length == 11) {
        cpf.value += "-";
    }

}

//Atribuir Erro
function setErrorFor(input, message) {
    const formcontrol = input.parentElement;
    const small = formcontrol.querySelector("small");
    //Adiciona a menssagem de erro.
    small.innerText = message;
    //Adiciona a classe de erro.
    formcontrol.className = 'input-box error';
}

//Atribuir Sucesso
function setSuccessFor(input) {
    const formcontrol = input.parentElement;
    //Adiciona a classe de sucesso.
    formcontrol.className = 'input-box success';
}

//Verifica formato do CPF
function checkCpf(cpfValue) {

    return /(\d{3})\.(\d{3})\.(\d{3})\-(\d{2})/g.test(cpfValue);
}
//Verifica formato da Data
function checkNasc(nascValue) {
    return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/g.test(
        nascValue);
}
//Verifica formato do E-mail
function checkEmail(emailValue) {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/g.test(
        emailValue);
}

//Valida o CPF
function validarCPF(cpfValue) {
    // Chama a função para verificar se está do formato certo         
    if (!checkCpf(cpfValue)) {
        return false
    } else {
        let cpfTemp = cpfValue.replace(/\./g, "").replace("-", "");
        console.log(cpfTemp);
        // Elimina CPFs invalidos conhecidos	
        if (cpfTemp.length != 11 ||
            cpfTemp == "00000000000" ||
            cpfTemp == "11111111111" ||
            cpfTemp == "22222222222" ||
            cpfTemp == "33333333333" ||
            cpfTemp == "44444444444" ||
            cpfTemp == "55555555555" ||
            cpfTemp == "66666666666" ||
            cpfTemp == "77777777777" ||
            cpfTemp == "88888888888" ||
            cpfTemp == "99999999999")
            return false;
        // Valida 1o digito	
        add = 0;
        for (i = 0; i < 9; i++)
            add += parseInt(cpfTemp.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpfTemp.charAt(9)))
            return false;
        // Valida 2o digito	
        add = 0;
        for (i = 0; i < 10; i++)
            add += parseInt(cpfTemp.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpfTemp.charAt(10)))
            return false;
        return true;
    }
}

