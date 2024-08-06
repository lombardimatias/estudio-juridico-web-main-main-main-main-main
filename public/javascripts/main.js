let menuVisible = false;
//Función que oculta o muestra el menu responsive
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}

 
//Script para pausar los videos cuando el modal se cierra
$(document).ready(function() {
    $('.modal').on('hidden.bs.modal', function () {
        $(this).find('video').each(function() {
            this.pause();
            this.currentTime = 0; // Reinicia el video al inicio si es necesario
        });
    });
});


