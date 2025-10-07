let toggle1 = document.querySelector(".toggle");
let text1 = toggle1.querySelector(".text");

let container2 = document.querySelector(".container2");
let toggle2 = document.querySelector(".toggle2");

function Animatedtoggle(){
    toggle1.classList.toggle("active");

    if(toggle1.classList.contains("active")){
        text1.innerHTML = "RISD";
        container2.style.display = "flex"; 
    } else {
        text1.innerHTML = "Rhode Island School of Design";
        container2.style.display = "none"; 
        toggle2.classList.remove("active"); 
        document.body.style.background = "white";

        toggle1.style.background = "rgba(36,84,255,1)"; 
        toggle1.querySelector(".toggle-button").style.background = "white";
        text1.style.color = "rgba(36,84,255,1)";
    }
}

function AnimatedToggle2(){
    toggle2.classList.toggle("active");

    if(toggle2.classList.contains("active")){
        document.body.style.background = "rgba(36,84,255,1)"; 

        toggle1.style.background = "white";
        toggle1.querySelector(".toggle-button").style.background = "rgba(36,84,255,1)"; 
        text1.style.color = "white"; 
                 text1.innerHTML = "By Maria";

    } else {
        document.body.style.background = "white"; 
         text1.innerHTML = "RISD";

        toggle1.style.background = "rgba(36,84,255,1)"; 
        toggle1.querySelector(".toggle-button").style.background = "white"; 
        text1.style.color = "rgba(36,84,255,1)"; 
    }
}
