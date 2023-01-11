const carrinho_icone = document.getElementById("carrinho")
const user = document.getElementById("user")
const user_container = document.getElementById("user_container")
const container_pedido = document.getElementById("container_login")

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

const entrar = document.getElementById('entrar');
const principal = document.querySelector('.cadastro');
const alternado = document.querySelector('.logado');
const form = document.getElementById('form');
const email = document.getElementById('email');
const senha = document.getElementById('senha');


let certo = false;

entrar.addEventListener('click', e => {
    fazerLogin(e);

    if (certo == true) {
        if(email.value == clientes[0].email){
            form.setAttribute("action","Caixa.html")
            form.submit();
        }
        else{
            form.submit();
        }
    }

});
//Procurando cliente.login==true para trocar o html e colocar o nome do cliente que está logado
if(clientes){
    for (cliente of clientes) {
        if (cliente.login == true) {
            document.getElementById('boas-vindas').innerHTML += " " + cliente.nome;
            principal.style.display = 'none';
            alternado.style.display = 'block';
            break;
        } else {
            principal.style.display = 'block';
            alternado.style.display = 'none';
        }
    }
}

//Ao pressionar botão sair atribui todos os cliente.login como false
document.getElementById('sair').addEventListener('click', evt => {
    if(clientes){
        for (cliente of clientes) {
            cliente.login = false;
            localStorage.setItem('clientes', JSON.stringify(clientes));
            location.reload();
        }
    }
    localStorage.removeItem("carrinho")
});
function fazerLogin(evento) {
    if (clientes != null) {
        const emailValue = email.value;
        const senhaValue = senha.value;
        //Aqui dá tanto para usar clientes.forEach() como for (cliente of clientes), eu prefiro o for normal
        for (cliente of clientes) {
            //Criando as varáveis do Storage todas vazias para não ter erro
            let clienteStorage = '';
            let emailStorage = '';
            let senhaStorage = '';
            //Atribuindo valor para elas
            clienteStorage = cliente.nome;
            emailStorage = cliente.email;
            senhaStorage = cliente.senha;
            //Se email e senha for igual do cliente que está armazenado...Entra
            //Se não da ERRO
            if (emailValue == emailStorage && senhaValue == senhaStorage) {
                cliente.login = true;
                setSuccessFor(email);
                setSuccessFor(senha);
                certo = true;
                localStorage.setItem('clientes', JSON.stringify(clientes));
                break;
            } else {
                setErrorFor(email, "E-mail e/ou senha inválidos!");
                setErrorFor(senha, "Senha ou/e e-mail inválidos!");
            }
        }
    } else {
        evento.preventDefault();
        setErrorFor(email, "E-mail e/ou senha inválidos!");
        setErrorFor(senha, "Senha e/ou e-mail inválidos!");
    }
}
//Atribuir erro
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
