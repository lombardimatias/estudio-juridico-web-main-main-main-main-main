/* instancia elementos necesarios */

const txtNombre = document.getElementById('nombre');
const txtApellido = document.getElementById('apellido');
const txtEmail = document.getElementById('email');
const txtTel = document.getElementById('tel');
const txtMensaje = document.getElementById('mensaje');
const txtEnviado = document.getElementById('enviado');
const txtErrCarga = document.getElementById('error-carga');
const btn_enviar = document.querySelector('#btn-enviar');
const tipo_consulta = document.getElementById("tipo_consulta");
const archivo = document.getElementById('archivo');
const div_pdf = document.getElementById('div_pdf');
const id_contacto = document.getElementById('id_contacto');
let lEnvio = false;


 // Validar en tiempo real la entrada del teléfono
 txtTel.addEventListener('input', function() {
    let expValTel = /^\d*$/; // Permite solo números
    if (!expValTel.test(txtTel.value)) {
        txtTel.value = txtTel.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    }
});



/* Asignacion de eventos al inicio de carga de la pagina */
window.addEventListener('load', e => {
    btn_enviar.addEventListener('click', e => {
        do_enviar();
    });
});



/* valida los campos */
function do_enviar() {
    let expValEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    let expValTel = /^\d{7,14}$/; // 7 a 14 numeros.
    hide_mensajes();

    let cConsulta = tipo_consulta.value;
    let cMensaje = "";

    if (txtNombre.value.length <= 0) {
        cMensaje = `Ingrese su Nombre por favor...`;
    }
    if (cMensaje.length == 0 && txtApellido.value.length <= 0) {
        cMensaje = `Ingrese su Apellido por favor...`;
    }
   
    if (cMensaje.length == 0 && !expValEmail.test(txtEmail.value)) {
        cMensaje = `El e-mail ingresado NO es válido!`;
    }

    if (cMensaje.length == 0 && !expValTel.test(txtTel.value)) {
        cMensaje = `Ingrese su Numero de telefono por favor...`;
    }
   
    if (cMensaje.length == 0 && txtMensaje.value.length <= 0) {
        cMensaje = `Dejenos un mensaje...`;
    }
    if (cMensaje.length == 0 && cConsulta == "3" && archivo.files.length <= 0) {
        cMensaje = `Por favor, cargue un archivo`;
    }
    if (cMensaje.length > 0) {
        txtErrCarga.innerText = cMensaje;
        txtErrCarga.style.display = 'block';
        txtErrCarga.style.color = "black";
        return;
    }
   

    lEnvio = ProcesarEnvio();
    setTimeout(MensajeFinal, 3000);
}

function validarYEnviarFormulario() {
    var form = document.getElementById('btn_enviar');
    if (form.checkValidity()) {
        form.submit();
    } else {
        form.reportValidity();
    }
}
 

function mostrarInputFile() {
    if (tipo_consulta.value === "3") {
        div_pdf.style.display = "block";
        div_pdf.style.color = "black";
    } else {
        div_pdf.style.display = "none";
    }
}

function ProcesarEnvio() {
    txtEnviado.innerText = `Enviando Mensaje... espere...`;
    txtEnviado.style.display = 'block';
    return true;
}

function MensajeFinal() {
    if (lEnvio) {
        txtEnviado.innerText = `¡Mensaje Enviado! ¡Muchas gracias ${txtNombre.value} ${txtApellido.value} por su contacto!`;
        txtEnviado.style.display = 'block';

        // Ajustar el estilo del mensaje
        txtEnviado.style.padding = '10px';
        txtEnviado.style.borderRadius = '5px';
        txtEnviado.style.width = 'fit-content';
        txtEnviado.style.margin = '20px auto';
        txtEnviado.style.textAlign = 'center';
        txtEnviado.style.color = '#1B1A1A';
        txtEnviado.style.backgroundColor = '#6CB806';

        setTimeout(go_inicio, 5000)
    } else {
        txtEnviado.innerText = `ERROR! No se envió el mensaje! Vuelva a intentar por favor`;
        txtEnviado.style.display = 'block';
    }
}

function hide_mensajes() {
    txtErrCarga.style.display = 'none';
    txtEnviado.style.display = 'none';
}

function go_inicio() {
    window.location.href = "/";
}

function validarArchivo() {
    let input = document.getElementById('archivo');
    let archivo = input.files[0];
    let txtErrCarga = document.getElementById('txtErrCarga');
    txtErrCarga.style.display = 'none';

    if (archivo) {
        var nombreArchivo = archivo.name;
        var extension = nombreArchivo.split('.').pop().toLowerCase();

        if (extension !== 'pdf') {
            txtErrCarga.innerText = 'Archivo inválido. Solo se permiten archivos con extensión .pdf';
            txtErrCarga.style.display = 'block';
            input.value = '';
            document.getElementById('archivo').value = ''; // Limpiar el input file
        }
    }
}
