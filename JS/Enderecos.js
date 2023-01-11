const carrinho_icone = document.getElementById("carrinho")
const user = document.getElementById("user")
const user_container = document.getElementById("user_container")
const container_endereco = document.getElementById("container_endereco")
const container_pedido = document.getElementById("container_endereco")

var carrinho = JSON.parse(localStorage.getItem('carrinho'))

carrinho_icone.addEventListener("click", abrirCarrinho)

user.addEventListener("click", abrirUsuario)

container_endereco.addEventListener("click", fecharUsuario)

mudaQuantCar()

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


/* -------- Endereço ------- */

var enderecoStorage = JSON.parse(localStorage.getItem('enderecosU'))
var clientes = JSON.parse(localStorage.getItem('clientes'))

var continuar = false

const nao_possui = document.getElementById("nao_possui")
const infos_enderecos = document.getElementById("infos_enderecos")
const btn_cadastrarEnd = document.getElementById("btn_cadastrarEnd")


btn_cadastrarEnd.addEventListener("click", ()=>{
    window.location.href = "CadastrarEnd.html";
})

var clienteLogado = descobrirCliente()

continuar = verifica()

if(continuar == true){
    
    infos_enderecos.style = "visibility: visible; display: block;"
    
    addEnd()

}


function verifica(){

    if(clientes){
        for (el of clientes) {
            if (el.login == true) {
                if(enderecoStorage){
                    for(end of enderecoStorage){
                        if(end.cpf == clienteLogado.cpf){
                            
                            nao_possui.style = "visibility: hidden; display: none;"
                            return true;
                        }
                    }
                }
                nao_possui.textContent = "Você não possui endereços cadastrado!"
                return false;
            }
        }
        nao_possui.parentNode.innerHTML = `<a href="Login.html" style="font-size: 2rem;color: black; padding: 0; margin: 4rem;">Faça login</a>`
    }
}

function addEnd(){
    let i = 0

    infos_enderecos.innerHTML = ""

    for(el of enderecoStorage){

        if(el.cpf == clienteLogado.cpf){
            infos_enderecos.innerHTML +=
            `
            <div class="novoEnd" name="${i}">
                <div class="row">
                    <div class="column">
                        <div class="row">
                            <span>CEP: ${el.cep}</span>
                            <span>Bairro: ${el.bairro}</span>
                        </div>
                        <div class="row">
                            <span>Rua: ${el.rua}</span>
                            <span>N°: ${el.numero}</span>
                        </div>
                        <div class="row">
                            <span>Cidade: ${el.cidade}</span>
                            <span>Estado: ${el.estado}</span>
                        </div>
                    </div>
                    <img src="img/lixeira.png" class="lixeira">
                </div>
            </div>
            `
        }

        i++
    }

    const lixeira = document.querySelectorAll(".lixeira")

    for(el of lixeira){
        el.addEventListener("click", removeEnd)
    }
}

function removeEnd(){
    

    let attStorage = []

    for(i = 0; i<enderecoStorage.length; i++){
        if(i != this.parentNode.parentNode.getAttribute("name")){
            attStorage.push(enderecoStorage[i])
        }
    }

    enderecoStorage = attStorage

    localStorage.setItem('enderecosU', JSON.stringify(enderecoStorage))

    addEnd()

    for(end of enderecoStorage){
        if(end.cpf == clienteLogado.cpf){
            return
        }
    }
    
    nao_possui.style = "visibility: visible; display: block;"
    nao_possui.textContent = "Você não possui endereços cadastrado!"
    
}

function descobrirCliente(){
    if(!clientes){
        nao_possui.parentNode.innerHTML = `<a href="Login.html" style="font-size: 2rem;color: black; padding: 0; margin: 4rem;">Faça login</a>`
        return
    }
    for(el of clientes){
        if(el.login == true){
            console.log(el)
            return el
        }
    }
}