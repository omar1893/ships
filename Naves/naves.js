var canvas = document.getElementById('micanvas');
var ctx = canvas.getContext('2d');

var teclado = {};
var disparos = [];

var fondo;

var nave = {
    x:100,
    y:canvas.height - 100,
    width: 70,
    height: 70
}

var enemies= [];

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

function updateEnemies(){
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
}

function frameloop(){
    moveShip();
    updateEnemies();
    moveShooting();
    drawBackground();
    contact();
    drawEnemies();
    drawFire();
    drawSpaceship();
}

loadMedia();
addEvents();