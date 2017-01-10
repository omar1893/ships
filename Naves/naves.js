var canvas = document.getElementById('micanvas');
var ctx = canvas.getContext('2d');

var teclado = {};

var fondo;

var nave = {
    x:100,
    y:canvas.height - 100,
    width: 50,
    height: 50
}

function loadMedia(){
    fondo = new Image();
    fondo.src = "img/space.jpg";
    fondo.onload = function(){
        var intervalo = window.setInterval(frameloop, 1000/55);
    }
}

function drawBackground(){
    ctx.drawImage(fondo,0,0);
}

function drawSpaceship(){
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
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

}

function frameloop(){
    moveShip();
    drawBackground();
    drawSpaceship();
}

loadMedia();
addEvents();