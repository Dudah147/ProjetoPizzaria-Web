const endCadas = document.getElementById("endCadas")
const id_finalPedido = document.getElementById("finalPedido")
const container_finalPedido = document.getElementById("container_finalPedido")

var enderecos = JSON.parse(localStorage.getItem('enderecosU'))
var clientes = JSON.parse(localStorage.getItem('clientes'))
var clienteLogado = descobrirCliente()

var carrinho = JSON.parse(localStorage.getItem('carrinho'))

var pedidos = JSON.parse(localStorage.getItem('carrinho'))

if(!pedidos){
    pedidos = []
}


var dadosFinal = {
    cliente: clienteLogado,
    endereco: {},
    itens: carrinho,
    pagamento: {},
    status: "Aguardando pagamento",
    total: 0
}

var flagPgt = 0

if(clienteLogado == false){

    container_finalPedido.innerHTML = 
    `
        <div id="logar_finalizar" style="cursor: pointer;font-size: 1.5rem;color: white;display: flex; padding: 2rem; background-color: orange; margin: 7rem auto 7rem auto; align-itens: center; justify-content: center;">
            Faça LOGIN ou CADASTRE-SE para continuar!
        </div>
    `

    document.getElementById("logar_finalizar").addEventListener("click", ()=>{
        window.location.href = "Login.html";
    })
}

//VERIFICAR ENDEREÇOS CADASTRADOS
endCadas.addEventListener("click", modalEndCadastrados)

document.getElementById("CadastrarEnd").addEventListener("click", ()=>{
    window.location.href = "CadastrarEnd.html"
})


/* ---- ADDRESS ---- */
function modalEndCadastrados(){
    let feedback = document.createElement("div")
    feedback.setAttribute("id", "feedback")

    if(enderecos){
        for(end of enderecos){
            if(end.cpf == clienteLogado.cpf){
                
                //possui endereço pro cpf
                addEnderecos()
                return
            }
        }
    }
    //nao possui endereço pro cpf

    body.appendChild(feedback)
    feedback.innerHTML = 
        `<span>Você não possui endereços cadastrados, cadastre um endereço para continuar!</span>
        <div style="background-color: red"></div>`

}

function addEnderecos(){
    let i =0
    let end = document.getElementById("end")

    end.innerHTML = ""

    for(el of enderecos){
        if(el.cpf == clienteLogado.cpf){
            end.innerHTML += 
            `
            <div style="width: 80%">
                <label class="rad-label" name="${i}">
                    <input type="radio" class="rad-input" name="rad">
                    <div class="rad-design"></div>
                    <div class="rad-text">
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
                    </div>
                </label>
            </div>
            
            `
        }
        i++
    }

    let btn_selecEnd = document.createElement("button")
    btn_selecEnd.setAttribute("type", "button")
    btn_selecEnd.setAttribute("id", "btn_selecEnd")
    btn_selecEnd.textContent = "Selecionar Endereço"
    end.appendChild(btn_selecEnd)

    let flag = 0
    let rad_label = document.querySelectorAll(".rad-label")

    for(el of rad_label){
        el.addEventListener("click", function(){
            if(flag== 1){
                setStorage("endereco",enderecos[this.getAttribute("name")])
                flag = 0
            }
            else{
                flag = 1
            }

            //BOTAO SELECIONA ENDERECO

            if(dadosFinal.endereco.cep){
                btn_selecEnd.addEventListener("click", modalFinalizarPedido)
            }
        })
    }

    
    
    

}

function setStorage(tipo, dado){
    switch(tipo){
        case "endereco":
            dadosFinal.endereco = dado; break;
    }

    console.log(dadosFinal)
}

function descobrirCliente(){
    if(!clientes){
        return false
    }
    for(el of clientes){
        if(el.login == true){
            return el
        }
    }
    return false
}

// FINALIZAÇÃO

function modalFinalizarPedido(){
    let totalPedido = 0

    if(!dadosFinal.pagamento.formaPgt){
        dadosFinal.pagamento.formaPgt = "Não aplicado"
    }

    document.getElementById("text_finalPedido").textContent = "Finalização do Pedido"


    id_finalPedido.style = "width: 100%; background-color: black; margin: 0; padding: 0;"

    id_finalPedido.innerHTML = 
    `
    <div id="modalFinal">
        <div class="cont_final" id="info_pedido">
            <span><strong>Status:</strong> ${dadosFinal.status}</span>
            <span><strong>Forma de pagamento: ${dadosFinal.pagamento.formaPgt}</strong> </span>
            <hr>
            <strong>PRODUTOS</strong>
        </div>

        <div class="cont_final" id="info_total">
            <div class="row">
                <span>Frete</span>
                <h3>R$12.00</h3>
            </div>
            <hr>
            <span>Endereço de entrega: </span>
            <span>Rua ${dadosFinal.endereco.rua}, N° ${dadosFinal.endereco.numero}, CEP ${dadosFinal.endereco.cep}</span>
            <hr>
            <div class="row" style="font-size: 1.3rem">
                <span>VALOR TOTAL:</span>
                <strong id="finalTotal">R$</strong>
            </div>
            <button id="btn_pagamento">Forma de pagamento</button>
        </div>
    </div>
    `
    for(el of carrinho){
        var newDiv = document.createElement("div")

        newDiv.innerHTML =
        `
        <div class= "row">
            <h3>${el.quantidade} un - Pizza ${el.tamanho.tamanho}</h3>
            <h2>${(el.quantidade*el.total)}</h2>
            
        </div>
        `

        for(sabor of el.sabores){
            newDiv.innerHTML += 
            `
            <h4>${sabor.sabor}</h4>
            `
        }

        newDiv.innerHTML +=
        `
            <span>Massa ${el.massa.massa}</span>
            <span>Borda ${el.borda.borda}</span>

            <hr>
        `
        document.getElementById("info_pedido").appendChild(newDiv)

        totalPedido += (el.quantidade*el.total)
    }

    document.getElementById("info_pedido").innerHTML += 
    `
    <div class="row">
        <h2>Total Pedido:</h2>
        <h2 style="color: ligthgreen">R$${totalPedido.toFixed(2)}</h2>
    </div>
    `
    dadosFinal.total = (totalPedido+12)
    document.getElementById("finalTotal").innerHTML =`R$${dadosFinal.total.toFixed(2)}`

    document.getElementById("btn_pagamento").addEventListener("click", modalPagamento)

    if(dadosFinal.pagamento.formaPgt != "Não aplicado"){

        document.getElementById("btn_pagamento").style.backgroundColor = "gray"

        let novoBtn = document.createElement("button")
        novoBtn.setAttribute("type","button")
        novoBtn.textContent = "Finalizar pedido"
        novoBtn.setAttribute("id", "btn_finalizarPedido")
        let total_info = document.getElementById("info_total")
        total_info.appendChild(novoBtn)

        novoBtn.addEventListener("click", pedidoFinalizado)
    }
}

function modalPagamento(){
    document.getElementById("text_finalPedido").textContent = "Forma de pagamento"
    
    id_finalPedido.style = "width: 100%; margin: 0; padding: 0; justify-content: left;"

    id_finalPedido.innerHTML = 
    `
    <button id="voltarFinalizacao">Voltar</button>
    <div class="column" id="formasPgt">
        <h2 style="width: 90%; text-align:center; margin-top:2rem;">Formas de pagamento</h2>
        <label class="rad-label" name="dinheiro">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">Pagar na entrega</div>
        </label>
        <label class="rad-label" name="cartaoDeCredito">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">Cartão de crédito</div>
        </label>
        <label class="rad-label" name="cartaoDeDebito">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">Cartão de debito</div>
        </label>
        <label class="rad-label" name="pix">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">PIX</div>
        </label>
    </div>

    <div class="column" id="formaEscolhida">
        <strong>ESCOLHA UMA FORMA DE PAGAMENTO</strong>
    </div>
    `

    document.getElementById("voltarFinalizacao").addEventListener("click", modalFinalizarPedido)

    let label = document.querySelectorAll(".rad-label")

    for(el of label){
        el.addEventListener("click", escolhePagamento)
    }

    console.log(dadosFinal)
}

function escolhePagamento(){
    if(flagPgt != 0){
        switch(this.getAttribute("name")){
            case "dinheiro": auxPgt = modalPagarEntrega(); break;
            case "cartaoDeCredito": console.log("credito"); break;
            case "cartaoDeDebito": console.log("debito"); break;
            case "pix": console.log("pix"); break;
        }
    }
    else{
        flagPgt = 1
    }
}

function modalPagarEntrega(){
    let pai = document.getElementById("formaEscolhida")
    pai.innerHTML = 
    `
        <h2>Selecione a forma de pagamento</h2>
        <label class="rad-label" name="cartao">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">Maquininha</div>
        </label>
        <label class="rad-label" name="dinheiro">
            <input type="radio" class="rad-input" name="rad">
            <div class="rad-design"></div>
            <div class="rad-text">Dinheiro</div>
        </label>
        <button id="finalizarPagamento" type="button">Finalizar Pagamento</button>
    `

    let escolheu = document.querySelectorAll(".rad-label")

    for(el of escolheu){
        el.addEventListener("click", function (){
            if(flagPgt == 1){
                if(this.getAttribute("name")=="dinheiro"){
                    modalDinheiro()
                    return
                }

                document.getElementById("finalizarPagamento").addEventListener("click", ()=>{
                    dadosFinal.pagamento.formaPgt = "Maquininha na entrega"
                    dadosFinal.pagamento.troco = null
                    dadosFinal.status = "Pagamento escolhido"

                    modalFinalizarPedido()
                })

                flagPgt = 0
            }
            else{
                flagPgt = 1
            }
        })
    }
}

function modalDinheiro(){
    let pai = document.getElementById("formaEscolhida")
    pai.innerHTML = 
    `
    <button id="voltarPagarEnt">Voltar</button>
        <h2>Pagar em dinheiro na hora da entrega</h2>
        <div class="row">
            <label>Precisa de troco? Se sim, informe:</label>
            <input type=number step=any id="input_troco" name="troco">
        </div>
        <button id="finalizarPagamento" type="button">Finalizar Pagamento</button>
    `

    document.getElementById("voltarPagarEnt").addEventListener("click", modalPagarEntrega)

    dadosFinal.status = "Pagamento escolhido"


    document.getElementById("finalizarPagamento").addEventListener("click", ()=>{
        dadosFinal.pagamento.formaPgt = "Dinheiro"
        let troco = document.getElementById("input_troco").value
        if(troco){
            dadosFinal.pagamento.troco = `Troco para R$${document.getElementById("input_troco").value}`
        }
        else{
            dadosFinal.pagamento.troco = null
        }

        modalFinalizarPedido()

    })
}

function pedidoFinalizado(){
    id_finalPedido.style = "display: flex; flex-direction: column;background-color: white; align-items:center;"

    id_finalPedido.innerHTML =
    `
        <h1>Pedido finalizado com Sucesso!</h1>
        <hr>
        <a href="PedidosRealizados.html" style="color:black">Acesse seus pedidos</a>

    `

    pedidos.push(dadosFinal)

    localStorage.setItem('pedidos', JSON.stringify(pedidos))
}






const carrinho_icone = document.getElementById("carrinho")
const user = document.getElementById("user")
const user_container = document.getElementById("user_container")
const container_pedido = document.getElementById("container_finalPedido")

var carrinho = JSON.parse(localStorage.getItem('carrinho'))
var clientes = JSON.parse(localStorage.getItem('clientes'))

carrinho_icone.addEventListener("click", abrirCarrinho)

user.addEventListener("click", abrirUsuario)

container_pedido.addEventListener("click", fecharUsuario)

mudaQuantCar()

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

