var canvas = document.getElementById('micanvas');
var ctx = canvas.getContext('2d');

var teclado = {};
var disparos = [];
var disparosEnemigos = [];

var fondo;

var nave = {
    x:100,
    y:canvas.height - 100,
    width: 70,
    height: 70
}

var textoRespuesta = {
    counter: -1,
    title: '',
    subtitle: ''
}

var enemies = [];

var juego = {
    estado: 'iniciando',
};

function loadMedia(){
    fondo = new Image();
    fondo.src = "img/space.jpg";
    fondo.onload = function(){
        var intervalo = window.setInterval(frameloop, 1000/55);
    }
}

function drawEnemies(){
    alien = new Image();
    alien.src = "img/aliensprite.png";
    for(var i in enemies){
        var enemigo = enemies[i];
        ctx.save();
        if(enemigo.estado == 'vivo') ctx.drawImage(alien, enemigo.x, enemigo.y,enemigo.height, enemigo.width);
        if(enemigo.estado == 'muerto') ctx.fillStyle = 'black';
        
    }
}

function drawBackground(){
    ctx.drawImage(fondo,0,0);
}

function drawSpaceship(){
    ctx.save();
    ship = new Image();
    ship.src = "img/blueship.png"
    ctx.drawImage(ship, nave.x, nave.y, nave.width, nave.height);
    ctx.restore();
}

function addEvents(){
    agregarEventos(document,"keydown", function(e){
        teclado[e.keyCode] = true;
    });

    agregarEventos(document,"keyup", function(e){
        teclado[e.keyCode] = false;
    });


    function agregarEventos(elemento, nombreEvento, funcion){
        if(elemento.addEventListener)
        {
            elemento.addEventListener(nombreEvento, funcion, false);
        }
        else if(elemento.attachEvent){
            elemento.attachEvent(nombreEvento, funcion);
        }
    }
}

function moveShip(){
    if(teclado[37]){
        nave.x -= 6;
        if(nave.x < 0){
            nave.x = 0;
        }
    }

if(teclado[39]){
    var limite = canvas.width - nave.width;
        nave.x += 6;
        if(nave.x > limite){
            nave.x = limite;
        }
    }

    if(teclado[32]){
        if(!teclado.fire){
        fire();
        teclado.fire = true;
        }
        
    }
    else teclado.fire = false;

}

function dibujarDisparosEnemigos(){
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        ctx.save();
        ctx.fillStyle = 'yellow';
        ctx.restore();
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
    }
}

function moveEnemiesShooting() {
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        disparo.y += 3;
    }
    disparosEnemigos = disparosEnemigos.filter(function(disparo){
        return disparo.y < canvas.height;
    })
}

function updateEnemies(){
    function agregarDisparosEnemigos(enemigo){
       return{
        x: enemigo.x,
        y: enemigo.y,
        width: 10,
        height: 33,
        contador: 0
        }
    }

    if(juego.estado == 'iniciando'){
        for(var i = 0; i < 10 ; i++){
            enemies.push({
                x:10 + (i*50),
                y: 10,
                height:40,
                width: 40,
                estado: 'vivo',
                contador: 0
            })
        }
        juego.estado = 'jugando';
    }
    for(var i in enemies){
            var enemigo = enemies[i];
            if(!enemigo) continue;
            if(enemigo && enemigo.estado == 'vivo'){
                enemigo.contador++;
                enemigo.x += Math.sin(enemigo.contador * Math.PI /150)*5;
                if(aleatorio(0, enemies.length * 10) == 4 ){

                    disparosEnemigos.push(agregarDisparosEnemigos(enemigo));

                }
        
    }
            if(enemigo && enemigo.estado == "hit"){
                enemigo.contador++;
                if(enemigo.contador >= 20){
                    enemigo.estado = 'muerto';
                    enemigo.contador = 0;
                }
            }

        }

        enemies = enemies.filter(function(enemigo){
            if(enemigo && enemigo.estado != 'muerto') return true;
            return false;
        });
}

function moveShooting(){
    for(var i in disparos){
        var disparo = disparos[i];
        disparo.y -= 2;
    }
    disparos = disparos.filter(function(disparo){
        return disparo.y > 0;
    });
}

function aleatorio(inferior, superior){
    var posibilidades = superior - inferior;
    var a = Math.random() * posibilidades;
    a = Math.floor(a);
    return parseInt(inferior) + a;
}

function fire(){
    disparos.push({
        x: nave.x + 30,
        y: nave.y -10,
        width: 10,
        height: 30
    })
}

function drawFire(){
    ctx.save();
    beam = new Image();
    beam.src = "img/beam.png";
    for(var i in disparos){
        var disparo = disparos[i];
        ctx.drawImage(beam, disparo.x, disparo.y, disparo.width, disparo.height);
    }
    ctx.restore();
}

function drawText(){
    if(textoRespuesta.contador == -1)return;
    var alpha = textoRespuesta.contador/50.0;
    if(alpha>1){
        for(var i in enemies){
            delete enemies[i];
        }
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if(juego.estado == 'perdido'){
        ctx.fillStyle = 'white';
        ctx.font = 'Bold 40pt Arial';
        ctx.fillText(textoRespuesta.titulo, 140, 200);
        ctx.font = '14pt Arial';
        ctx.fillText(textoRespuesta.subtitle, 190, 250);
    }
        if(juego.estado == 'victoria'){
        ctx.fillStyle = 'white';
        ctx.font = 'Bold 40pt Arial';
        ctx.fillText(textoRespuesta.titulo, 140, 200);
        ctx.font = '14pt Arial';
        ctx.fillText(textoRespuesta.subtitle, 190, 250);
    }
}

function updateGame(){
    if(juego.estado == 'jugando' && enemies.length == 0){
        juego.estado = 'victoria';
        textoRespuesta.titulo = 'Derrotaste a los enemigos';
        textoRespuesta.subtitle = 'Presiona la tecla R para reiniciar';
        textoRespuesta.counter = 0;
    }

    if(textoRespuesta.contador >=0){
        textoRespuesta.contador++;
    }

}

function hit(a,b){
    var hit = false;

    if(b.x + b.width >= a.x && b.x < a.x + a.width){
        if(b.y + b.height >= a.y && b.y < a.y + a.height){
            hit = true;
        }
    }
    if(b.x <= a.x && b.x + b.width >= a.x + a.width){
      if(b.y <= a.y && b.y + b.height >= a.y + a.height){
          hit = true;
      }  

    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width){
        if(a.y <= b.y && a.y + a.height >= b.y + b.height){
            hit = true;        }        
    }

    return hit;
}

function contact(){
    for(var i in disparos){
        var disparo = disparos[i];
        for(j in enemies){
            var enemigo = enemies[j];
            if(hit(disparo, enemigo)){
                enemigo.estado = 'hit';
                enemigo.contador = 0;
            }
        }
    }

    if(nave.estado == 'hit' || nave.estado == 'muerto') return;
    for(var i in disparosEnemigos){
        var disparo = disparosEnemigos[i];
        if(hit(disparo, nave)){
            nave.estado = 'hit';
            console.log("contacto")
        }
    }
}

function frameloop(){
    updateGame()
    moveShip();
    updateEnemies();
    moveShooting();
    moveEnemiesShooting();
    drawBackground();
    contact();
    drawEnemies();
    dibujarDisparosEnemigos();
    drawFire();
    drawText();
    drawSpaceship();
}

loadMedia();
addEvents();