 function updateTimer() {
        const now = new Date();
        const christmas = new Date(now.getFullYear(), 11, 25, 0, 0, 0); // 25 diciembre

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
        contenedor.innerHTML = "";

                    let diaSimulado = 6; // null 
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
            img.src = imagenes[dia - 1];
        } else {
            img.src = "asset/img/imagenFueraDeDiciembre.png";
        }

        contenedor.appendChild(img);
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