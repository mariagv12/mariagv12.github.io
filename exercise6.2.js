let toggle1 = document.querySelector(".toggle");
let text1 = toggle1.querySelector(".text");

let container2 = document.querySelector(".container2");
let toggle2 = document.querySelector(".toggle2");

function Animatedtoggle(){
    toggle1.classList.toggle("active");

    if(toggle1.classList.contains("active")){
        text1.innerHTML = "RISD";
        container2.style.display = "flex"; // mostramos el segundo toggle
    } else {
        text1.innerHTML = "Rhode Island School of Design";
        container2.style.display = "none"; // ocultamos el segundo toggle
        toggle2.classList.remove("active"); // reiniciamos toggle2 si estaba activo
        document.body.style.background = "white"; // restauramos fondo al ocultar toggle2

        // Restaurar estilos del primer toggle
        toggle1.style.background = "rgba(36,84,255,1)"; 
        toggle1.querySelector(".toggle-button").style.background = "white";
        text1.style.color = "rgba(36,84,255,1)"; // restaurar color original del texto
    }
}

function AnimatedToggle2(){
    toggle2.classList.toggle("active");

    if(toggle2.classList.contains("active")){
        // Cambiar el fondo de la página
        document.body.style.background = "rgba(36,84,255,1)"; 

        // Cambiar estilos del primer toggle
        toggle1.style.background = "white"; // fondo blanco
        toggle1.querySelector(".toggle-button").style.background = "rgba(36,84,255,1)"; // botón azul
        text1.style.color = "white"; // texto en blanco
                 text1.innerHTML = "By Maria";

    } else {
        // Restaurar fondo de la página
        document.body.style.background = "white"; 
         text1.innerHTML = "RISD";
    

        // Restaurar estilos del primer toggle
        toggle1.style.background = "rgba(36,84,255,1)"; 
        toggle1.querySelector(".toggle-button").style.background = "white"; 
        text1.style.color = "rgba(36,84,255,1)"; // texto original
    }
}
