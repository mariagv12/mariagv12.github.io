 function updateTimer() {
        const now = new Date();
        const christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0); 

        const diff = christmas - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        document.getElementById("timer").innerHTML =
            `${days} : ${hours} : ${minutes}`;
    }

    setInterval(updateTimer, 1000);
    updateTimer();


function mostrarImagenDelDia() {
    const contenedor = document.getElementById("imagenes");
    const extra = document.getElementById("extra");

    contenedor.innerHTML = "";
    extra.innerHTML = "";

    let diaSimulado = null; // null
    let hoy;

    if (diaSimulado) {
        hoy = new Date(new Date().getFullYear(), 11, diaSimulado, 12, 0, 0);
    } else {
        hoy = new Date();
    }

    const dia = hoy.getDate();
    const mes = hoy.getMonth();

    const imagenes = [];
    for (let i = 1; i <= 25; i++) {
        imagenes.push(`asset/img/imagen${i}.png`);
    }

    
    const img = document.createElement("img");

   if (mes === 11 && dia >= 1 && dia <= 25) {


    if (dia === 25) {
        img.src = "asset/img/imagen25.gif";
    } 
   
    else {
        img.src = `asset/img/imagen${dia}.png`;
    }

} else {
    img.src = "asset/img/imagenFueraDeDiciembre.png";
}

    contenedor.appendChild(img);

    // gif  //
    if (dia >= 7) {
        const gif = document.createElement("img");
        gif.src = "asset/img/imagen7.gif"; 
        gif.style.position = "absolute";
        gif.style.top = "0";
        gif.style.left = "0";
        gif.style.width = "100%";
        gif.style.pointerEvents = "none";

        extra.appendChild(gif);
    }
}


    mostrarImagenDelDia();

    document.getElementById("exportPDF").addEventListener("click", function() {
        window.print();
    });



    
let mostrarPrimera = true;

setInterval(() => {
    if (mostrarPrimera) {
        document.body.style.backgroundImage = 'url("asset/img/fondo.png")';
    } else {
        document.body.style.backgroundImage = 'url("asset/img/fondo1.png")';
    }
    mostrarPrimera = !mostrarPrimera;
}, 2000);





const diaActual = mostrarImagenDelDia(); 

if (diaActual >= 7) {
    const contenedorExtra = document.getElementById("extra");

    const imgExtra = document.createElement("img");
    imgExtra.id = "imagenExtra";
    imgExtra.style.position = "absolute";
    imgExtra.style.top = "0";
    imgExtra.style.left = "0";
    imgExtra.style.width = "100%";   
    imgExtra.style.pointerEvents = "none"; 
    imgExtra.style.transition = "opacity 0.5s ease";

    contenedorExtra.appendChild(imgExtra);

    let mostrarPrimera = true;

    setInterval(() => {
        if (mostrarPrimera) {
            imgExtra.src = "asset/img/extra1.png";
        } else {
            imgExtra.src = "asset/img/extra2.png";
        }
        mostrarPrimera = !mostrarPrimera;
    }, 2000);
}
