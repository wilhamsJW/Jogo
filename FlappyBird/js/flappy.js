// Vale lembrar que aqui estamos construindo todo o html via JS, mas antes criamos o html e css para saber como iria se estruturar
// as tags, olhe o html do jogo comentado no index.html

// Responsável por criar todos os elementos com document.createElement, os parãmetrso são uma
// tag hmtl e uma class CSS
// document.createElement cria uma tag no seu html via JS
// elem.className = className --> Estou adicionando uma class para a tag q acabei de criar
function novoElemento (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

// Responsável por criar a barreira - esta é uma função construtora
// appendChild - acrescenta um html como um filho ou seja appendChild coloca como filho algo ou uam tag dentro de uma div existente
// No exemplo abaixo appendChild está adicionando uma diva com className borda e corpo, eles serão filhos da minha div chamada barreira
// por isso q coloco this.elemento.appendChild - isso informa que no elemento q já contém a div barreira irá receber como filho
// as div borda e corpo q estão armazenadas em constante abaixo 

// Estrutura HTMl coorrespondente a Barreira
        {/* <div class="barreira">
                <div class="corpo"></div>
                <div class="borda"></div>
            </div> */}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')

    // validação para acrescentar os dois canos no jogo em que o passáro passa no meio, os canos são compostos por corpo e borda
    // mas no primeiro cano vem primeiro o corpo e depois a borda, no segundo cano vem primeiro a borda e depois o cano
    // por isso duas validações abaixo, pq temos dois canos
    // Então fica assim, se o parãmetro enviado a reversa for false mesmo (note que o parámetro recebido em barreira vem da função
    // ParDeBarreiras() - exatamente em:
    //              this.superior = new Barreira(true)
    //              this.inferior = new Barreira(false) 
    // caso seja false, caíra no segundo if, adicionando borda e corpo, caso seja true cairá no primeiro if adicionando corpo e borda )
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    // Função que define a altura superior e inferior do corpo do cano, essa 
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// Abaixo temos um teste para ver só como ficou as barreiras
// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[tp-flappy]').appendChild(b.elemento)

// Responsável por receber os parãmetros para criar barreiras
function ParDeBarreiras (altura, abertura, x) { /** 
    X = posição ou seja aonde os canos irão aparecer na tela, eles não podem aparecer
    no inicio pq no inicio é o local q o passáro irá começar para adentrar nos canos, então deve haver um espaço para manobragem inicial do passáro 

    altura = cooresponde a altura do cano superior e inferior que é feito mediante um cálculo
    
    abertura = é abertura de um cano para o outro q tbm na sua maior parte é definida com CSS, com justify-content: space-between; 
    */
    
    this.elemento = novoElemento('div', 'par-de-barreiras') /** Olhe no Html esta div, se trata da div que engloba as bordas superiores e inferiores
    por isso estamos adicionado elas aqui */

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    // Acrescentando as duas barreiras na div 'par-de-barreiras', as duas barreiras estão sendo construidas pela função construtora 
    // Barreira() q está acima
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        // Math.random() - Fica gerando números abaixo de zero aleatŕorios a cada refresh, dessa forma 0,987534539
        // A cada número diferente gerado e multiplicado por altura - abertura irá dá uma localização diferente aos canos
        // fazendo com que os canos se mecham constantemente se a página for recarregada
        const alturaSuperior = Math.random() * (altura - abertura)

        const alturaInferior = altura - abertura - alturaSuperior

        // Enviando altura para a função q irá setar a altura do corpo do meu cano
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px'))

    // Aqui está setando um margin left para que os canos não apareçam no inicio demais da tela ou no fim demais da tela
    this.setX = x => this.elemento.style.left = `${x}px`

    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

// Teste para testar ParDeBarreiras e Barreira
// const b = new ParDeBarreiras(700, 400, 800)
// document.querySelector('[tp-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    // Responsável tbm pela velocidade do jogo, o setIntervall se alterado tbm aceleta o jogo
    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            
            // par.setX() é apenas a função que está em ParDeBarreiras acima e par.getX() também
            par.setX(par.getX() - deslocamento)

            // Fazendo com que as colunas sejam reaproveitas e passem uma após a outra
            if (par.getX() < par.getLargura() ) {
                par.setX(par.getX() + espaco * this.pares.length )
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
             && par.getX() < meio
            // if (cruzouOMeio) notificarPonto()
        })
    }
}

// *** Testes para o que foi feito até agora  

// Armazenando as Barreiras construídas nessa const barreiras abaixo, vale lembar que aqui eu tenho tudo sobre a barreira inclusive o HTML
// const barreiras = new Barreiras(700, 1200, 200, 400)
// console.log('barreiras antes do for each', barreiras.pares)
// Selecionando o seletor [tp-flappy] do html para inserir as barreiras na tela
// const areaDoJogo = document.querySelector('[tp-flappy]')
// Preciso da um forEach para percorrer todos os campos do meu array e dentro do forEach eu adicionei cada barreira construída
// da const barreiras
// barreiras.pares.forEach(par => {
//     areaDoJogo.appendChild(par.elemento)
//     console.log('par.elemento', par.elemento)
// })

// setInterval Serve para executar uma função várias vezes a cada tempo especificado, no nosso caso usamos 20 que representa 20% de 1000 milésimos
// 1 segundo equivale a 1000 milésimos de segundos
// setInterval( () => {
//     barreiras.animar()
// }, 20)

// *** Fim dos testes para o que foi feito até agora  


// Function Contrutora do passáro

function Passaro(alturaJogo) {
    // Flag q valida o voou do passsáro
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = "./FlappyBird/imagens/passaro.png"

    // A função parseInt() converte para string
    // this.getY está aqui para pegar o style.bottom, ou seja pegar os pixels dele, mas se simplesmente tentar pegar dessa forma:
    // this.elemento.style.bottom - Não irei conseguir, dê um console e veja se o log retorna algo para verificação
    // então parseInt() me retorna a string e com uma string eu consigo pegar os valores e usar funções nativas para strings como o split por exemplo
    // Sem o parseInt eu não conseguiria acessar esses valores, foi preciso converter para uma string
    // O código original já veio com esse split('x')[0] e não vi a necessidade dele aí, retirei e o código até aqui funcionou normalmente, resolvi deixalo mesmo assim
    this.getY = () => parseInt(this.elemento.style.bottom.split('x')[0])

    // Função criada para atribuir um bottom ao elemento passáro
    this.setY = y => this.elemento.style.bottom = `${y}px`

    // Capturando eventos de teclas
    // onkeydown -> detecta quando o usuário pressiona qq tecla do teclado
    // onkeyup -> detecta quando o usuário solta qq tecla do teclado
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {

        // Define a velocidade que o passáro voa e a velocidade que o passáro cai
        // Estou somando this.getY() que representa a o botom do passáro ou seja a distançia dele para o fim da tela
        // estou somando com 8 e depois com -5
        const novoY = this.getY() + (voando ? 8 : -5 )

        // this.elemento.clientHeight me retorna a altura q o passaro se encontra, sem pegar o clienteHeight do elemento o elemento passáro
        // iria sumir da minha tela na parte de cima, então pegar a alturaJogo q é altura definida - this.elemento.clientHeight faz com o que
        // o passáro não passe da altura que eu definir da tela
        const alturMaxima = alturaJogo - this.elemento.clientHeight

        // Essas validações manipula toda a ação do passáro
        if (novoY <= 0) { /** novoY é a posição do passaro se for igual ou menor q 0, quer dizer que
            não foi setado ainda, então colocamos ele para 0, ou seja no momento que o passáro está parado nós estamos setando ele para 0 
            para que ele não cai até o fim da tela como se estivesse sumido*/
            this.setY(0)
            console.log('if - 01', novoY)
        } 
        else if (novoY >= alturMaxima) { /** 
            Lembrete: Chegamos a definição abaixo pq novoY armazena this.getY() e this.getY() obtém o bottom do passáro ou seja
            obtém a distancia do passáro para o fim da tela

            Se o passáro estiver numa altura maior que a altura máxima permitida, a gente seta
            de novo para a altura maxima permitida para que ele não passe da altura especificada, dessa forma ele fica travado lá em cima da tela mas nã passa
            da altura definida */
            this.setY(alturMaxima)
            console.log('if - 02',novoY)
            console.log('if - 02 alturMaxima',alturMaxima)

        } 
        else { /** e se ele não viola nehuma das opções acima aí sim setamos o novoY 
            ou seja se ele estiver subindo ou caindo sem ou com a tecla pressionada irá cair aqui
            e se a tecla não tiver pressionada siginida q flag voando é false, estão estou resetando o passaro para novoY
            que significa -5 de acordo com o valor acima de novoY
            */
            this.setY(novoY)
            console.log('if - 03',novoY)
        }

    }

    // definindo a altura do passáro em PX
    // No código originalestá dessa forma abaixo, mas coloquei qq altura aí e o código funcionou, 
    // esperar pra terminar o código até o fim para ver se isso vai impactar em algo
    this.setY(alturaJogo / 2)
}

// Armazenando as Barreiras construídas nessa const barreiras abaixo, vale lembar que aqui eu tenho tudo sobre a barreira inclusive o HTML
const barreiras = new Barreiras(700, 1200, 200, 400)

// Criando passaro e passando a altura do jogo com parãmetro
const passaro = new Passaro(700)

// Selecionando o seletor [tp-flappy] do html para inserir as barreiras na tela
const areaDoJogo = document.querySelector('[tp-flappy]')

// Adicionando com appendChild o passaro na tela
areaDoJogo.appendChild(passaro.elemento)

// Preciso da um forEach para percorrer todos os campos do meu array e dentro do forEach eu adicionei cada barreira construída
// da const barreiras
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

// setInterval Serve para executar uma função várias vezes a cada tempo especificado, no nosso caso usamos 20 que representa 20% de 1000 milésimos
// 1 segundo equivale a 1000 milésimos de segundos
setInterval( () =>{
    barreiras.animar()
    passaro.animar()
}, 20 )