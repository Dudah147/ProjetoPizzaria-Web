var flag = 0
var flag2 = 0
var flag3 = 0
var flag4 = 0

const container_pedido = document.getElementById("container_pedido")
const body = document.getElementById("body")
const carrinho_icone = document.getElementById("carrinho")
const user = document.getElementById("user")
const user_container = document.getElementById("user_container")


var novoPedido = {
    tamanho:{},
    borda:"",
    massa:"",
    sabores: [],
    obs:"",
    quantidade: 1
}


//localStorage.removeItem('carrinho')

//resgatar localStorage
var tamanhos = JSON.parse(localStorage.getItem('tamanhos'))
var massa = JSON.parse(localStorage.getItem('massa'))
var bordas = JSON.parse(localStorage.getItem('bordas'))
var sabores = JSON.parse(localStorage.getItem('sabores'))
var carrinho = JSON.parse(localStorage.getItem('carrinho'))
var clientes = JSON.parse(localStorage.getItem('clientes'))

modalTamanhos(document.getElementById("tamanho").children[2])


var label = document.querySelectorAll(".rad-label")

for(el of label){
    el.addEventListener("click", abreModal)
}

carrinho_icone.addEventListener("click", abrirCarrinho)

user.addEventListener("click", abrirUsuario)

var clienteLogado = descobrirCliente()
if(clienteLogado != false){
    mudaUser()
}



mudaQuantCar()


function abreModal(){
    
    if(flag2 == 0){
        
        let txt = this.parentNode.parentNode.parentNode.children[0].children[1].textContent


        //adiciona as informações
        switch(txt){
            case 'TAMANHO': modalBordas(document.getElementById("borda").children[2]); break;
            case 'BORDA': modalMassas(document.getElementById("massa").children[2]); break;
            case 'MASSA': modalSabores(document.getElementById("sabores_id").children[2]); novoPedido.sabores = [];break;
        }

        label = document.querySelectorAll(".rad-label")
        var mais = document.querySelectorAll(".mais")
        var menos = document.querySelectorAll(".menos")

        for(el of mais){
            el.addEventListener("click", armazena)
        }

        for(el of menos){
            el.addEventListener("click", remover)
        }

        for(el of label){
            el.addEventListener("click", abreModal)
            el.addEventListener("click", armazena)
        }

        flag2 =1
    }
    else{
        flag2 = 0
    }
}

function armazena(){
    let check1 = this.parentNode.parentNode.parentNode.children[0].children[1].textContent
    let check2 = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[1].textContent
    let feedback = document.createElement("div")
    feedback.setAttribute("id", "feedback")
    
    

    if(flag == 0){
        console.log(novoPedido)
        if(check1 != 'SABORES' && check2 != 'SABORES'){
            switch(this.parentNode.parentNode.parentNode.children[0].children[1].textContent){
                case 'TAMANHO':
                for(el of tamanhos){
                    if(el.tamanho == this.children[2].textContent){
                        let novoTamanho = {
                            tamanho: this.children[2].textContent,
                            preco:el.preco
                        }
                        novoPedido.tamanho = novoTamanho;
                        
                    }
                }; break;
                case 'BORDA':
                for(el of bordas){
                    if(el.borda == this.children[2].textContent){
                        let novaBorda = {
                            borda: this.children[2].textContent,
                            preco:el.preco
                        }
                        novoPedido.borda = novaBorda;
                        
                    }
                }; break;
                case 'MASSA':
                for(el of massa){
                    if(el.massa == this.children[2].textContent){
                        let novaMassa = {
                            massa: this.children[2].textContent,
                            preco:el.preco
                        }
                        novoPedido.massa = novaMassa;
                        
                    }
                }; break;
            }
        }
        else{
            flag4 += 1
            for(i = 0; i<tamanhos.length; i++){
                if(tamanhos[i].tamanho == novoPedido.tamanho.tamanho){//verifica qual sabor foi escolhido
                    if(novoPedido.sabores.length < tamanhos[i].quantSabor){//quantidade de sabores do tamanho escolhido
                        for(el of sabores){//roda todos os sabores
                            if(el.sabor == this.parentNode.parentNode.children[1].textContent){//identifica qual foi o sabor escolhido
                                let novoSabor = {
                                    sabor: this.parentNode.parentNode.children[1].textContent,
                                    adicional: el.preco//retira o adicional do sabor escolhido
                                }
                                novoPedido.sabores.push(novoSabor)
                                adicionar(this)//incrementa 1 na quantidade
                            }
                        }
                        if(tamanhos[i].quantSabor - novoPedido.sabores.length != 0){
                            feedback.style.backgroundColor = "lightgreen"
                            if(tamanhos[i].quantSabor - novoPedido.sabores.length == 1){
                                body.appendChild(feedback)
                                feedback.innerHTML = 
                                    `<span>Pode adicionar mais ${tamanhos[i].quantSabor - novoPedido.sabores.length} sabor</span>
                                    <div style="background-color: #15a815"></div>`
                            }
                            else{
                                body.appendChild(feedback)
                                feedback.innerHTML = 
                                    `<span>Pode adicionar mais ${tamanhos[i].quantSabor - novoPedido.sabores.length} sabores</span>
                                    <div style="background-color: #15a815"></div>`
                            }
                        }
                    }
                    if(novoPedido.sabores.length == tamanhos[i].quantSabor){ //se for igual a quantidade max
                        if(flag3 == 0){
                            modalFinal() //cria modal final
                            const adicionarPedido = document.getElementById("adicionarPedido")

                            adicionarPedido.addEventListener("click", addStorage)
                            adicionarPedido.addEventListener("click", abrirCarrinho)
                            adicionarPedido.addEventListener("click", mudaQuantCar)

                            window.location.href = "#obs";

                            flag3=1
                        }
                    }
                    if(flag4 > tamanhos[i].quantSabor){
                        
                        console.log(flag4)

                        body.appendChild(feedback)
                            feedback.innerHTML = 
                                `<span>Quantidade máxima de sabores atingido!</span>
                                <div></div>`

                        flag4--
                    }
                }
            }
        }
        flag = 1;
    }
    else{
        flag = 0
    }

}



function remover(){
    
    let index = novoPedido.sabores.indexOf(this.parentNode.parentNode.children[1].textContent)
    novoPedido.sabores.splice(index, 1)

    flag4 -= 1

    subtrair(this)
}

function modalTamanhos(el){
    let img = el.parentNode.children[0].children[0]
    img.src = "img/setaBaixo.png"
    img.name = "setaBaixo"

    

    for(i=0; i<tamanhos.length; i++){
        if(tamanhos[i].quantSabor == 1){
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad">
                        <div class="rad-design"></div>
                        <div class="rad-text">${tamanhos[i].tamanho}</div>
                    </label>
                    <div>
                        <span>a partir de R$ <strong style="color: orange;">${tamanhos[i].preco.toFixed(2)}</strong></span>
                    </div>
                </div>
                <span>Escolha até ${tamanhos[i].quantSabor} sabor - ${tamanhos[i].info}</span>
                <hr>
            `
        }
        else{
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad">
                        <div class="rad-design"></div>
                        <div class="rad-text">${tamanhos[i].tamanho}</div>
                    </label>
                    <div>
                        <span>a partir de R$ <strong style="color: orange;">${tamanhos[i].preco.toFixed(2)}</strong></span>
                    </div>
                </div>
                <span>Escolha até ${tamanhos[i].quantSabor} sabores - ${tamanhos[i].info}</span>
                <hr>
            `
        }
    }

    var label = document.querySelectorAll(".rad-label")

    

    for(el of label){
        el.addEventListener("click", armazena)
    }
}

function modalBordas(el){
    window.location.href = "#borda";
    let img = el.parentNode.children[0].children[0]
    img.src = "img/setaBaixo.png"

    el.innerHTML = ""

    for(i=0; i<bordas.length; i++){
        if(bordas[i].preco > 0){
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad2">
                        <div class="rad-design"></div>
                        <div class="rad-text">${bordas[i].borda}</div>
                    </label>
                    <div>
                        <span>adicional de R$ <strong style="color: orange;">${bordas[i].preco.toFixed(2)}</strong></span>
                    </div>
                </div>
                <hr>
            `
        }
        else{
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad2">
                        <div class="rad-design"></div>
                        <div class="rad-text">${bordas[i].borda}</div>
                    </label>
                </div>
                <hr>
            `
        }
    }
}

function modalMassas(el){
    window.location.href = "#massa";
    let img = el.parentNode.children[0].children[0]
    img.src = "img/setaBaixo.png"

    el.innerHTML = ""

    for(i=0; i<massa.length; i++){
        if(massa[i].preco > 0){
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad3">
                        <div class="rad-design"></div>
                        <div class="rad-text">${massa[i].massa}</div>
                    </label>
                    <div>
                        <span>adicional de R$ <strong style="color: orange;">${massa[i].preco.toFixed(2)}</strong></span>
                    </div>
                </div>
                <hr>
            `
        }
        else{
            el.innerHTML += 
            `
                <div class="row-infos">
                    <label class="rad-label">
                        <input type="radio" class="rad-input" name="rad3">
                        <div class="rad-design"></div>
                        <div class="rad-text">${massa[i].massa}</div>
                    </label>
                </div>
                <hr>
            `
        }
    }
}

function modalSabores(el){
    window.location.href = "#sabores_id";
    let img = el.parentNode.children[0].children[0]
    img.src = "img/setaBaixo.png"

    el.innerHTML = ""

    for(i=0; i<sabores.length; i++){
        if(sabores[i].preco == 0){
            el.innerHTML += 
            `
                <div class="sabor_info" style="margin: .5rem 1rem 0rem 1rem;">
                    <div class="sabor">
                        <div class="sabor">
                            <div class="sabor_quant">
                                <div class="quant_container">
                                    <img src="img/menos.png" class="quantImg menos">
                                    <span style="color: black;margin: 0;">0</span>
                                    <img src="img/mais.png" class="quantImg mais" >
                                </div>
                                <span style="margin: 0 0 0 1rem; color: black;">${sabores[i].sabor}</span>
                            </div>
                        </div>

                        <span style="margin: 1rem 0;">${sabores[i].info}</span>
                    </div>
                    <span style="border-color: red; color: red;">${sabores[i].tipo}</span>
                    <img src="${sabores[i].img}" class="pizza_img">
                </div>
                <hr>
            `
        }
        else{
            el.innerHTML += 
            `
                <div class="sabor_info" style="margin: .5rem 1rem 0rem 1rem;">
                    <div class="sabor">
                        <div class="sabor">
                            <div class="sabor_quant">
                                <div class="quant_container">
                                    <img src="img/menos.png" class="quantImg menos">
                                    <span style="color: black;margin: 0;">0</span>
                                    <img src="img/mais.png" class="quantImg mais" >
                                </div>
                                <span style="margin: 0 0 0 1rem; color: black;">${sabores[i].sabor}</span>
                            </div>
                        </div>

                        <span style="margin: 1rem 0;">${sabores[i].info}</span>
                    </div>
                    <div class="tipo_sabor">
                        <span style="border-color: red; color: red;">${sabores[i].tipo}</span>
                        <span>adicional de R$ <strong style="color: orange;">${sabores[i].preco.toFixed(2)}</strong></span>
                    </div>
                    <img src="${sabores[i].img}" class="pizza_img">
                </div>
                <hr>
            `
        }
    }

    
}

function modalFinal(){
    let info = document.getElementById("obs").children[1]
    let seta = document.getElementById("obs").children[0].children[0]
    let adicionarCar = document.createElement("div")
    let pedido = document.getElementById("pedido")

    adicionarCar.setAttribute("id", "adicionarPedido")
    pedido.appendChild(adicionarCar)

    adicionarCar.innerHTML = `<strong>ADICIONAR PEDIDO AO CARRINHO</strong>`

    seta.src = "img/setaBaixo.png"

    info.innerHTML = 
    `
        <div style="display: flex; flex-direction: column; margin-left: 1rem; margin-right: 1rem; padding-bottom: 1rem;">
            <label style="color: grey; margin-bottom: 1rem;">Observações</label>
            <input type="text" class="obs_input">
        </div>
    `


}

function adicionar(el){

    var valor = el.parentNode.children[1]
    valor.textContent = parseInt(valor.textContent) +1
}

function subtrair(el){
    let valor = el.parentNode.children[1]
    if(valor.textContent != 0){
        valor.textContent -= 1
    }
    
}

function addStorage(){
    let obs = document.getElementById("obs").children[1].children[0].children[1].value
    let aux = 0
    for(el of novoPedido.sabores){
        aux += el.adicional
    }
    novoPedido.total = (novoPedido.tamanho.preco + novoPedido.massa.preco + novoPedido.borda.preco + aux).toFixed(2)

    
    if(!carrinho){
        carrinho = [novoPedido]
    }
    else{
        carrinho.push(novoPedido)
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho))
    console.log(novoPedido)
}

function fechaModal(el){
    let img = el.parentNode.children[0].children[0]

    el.innerHTML = ""
    img.src = "img/setaCima.png"
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
        id_carrinho.style.visibility = "hidden"
        container_pedido.style.filter = "blur(0px)"
        console.log("entrou")
        let infos = document.querySelectorAll(".infos")

        for(el of infos){
            fechaModal(el)    
        }

        let adicionarPedido = document.getElementById("adicionarPedido")
        if(adicionarPedido){
            adicionarPedido.remove()
        }
        

        modalTamanhos(document.getElementById("tamanho").children[2])

        label = document.querySelectorAll(".rad-label")

        for(el of label){
            el.addEventListener("click", abreModal)
        }

        novoPedido = {
            tamanho:{},
            borda:"",
            massa:"",
            sabores: [],
            obs:"",
            quantidade: 1
        }

        flag3 = 0
        flag4 = 0
        
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
    let btn_retirar = document.createElement("button")

    this.remove()

    btn_entregar.setAttribute("type","button")
    btn_entregar.textContent = "Entregar em casa"
    btn_entregar.style = "background-color: orange; margin-bottom: 1rem; width: 60%"    

    pai.appendChild(btn_entregar)

    console.log(btn_entregar);

    btn_entregar.addEventListener("click", ()=>{
        window.location.href = "FinalizarPedido.html";
    })
}

/* --------- USUARIO ------------ */

function abrirUsuario(){
    user_container.style.visibility = "visible"
    container_pedido.style.filter = "blur(5px)"

    container_pedido.addEventListener("click", fecharUsuario)

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