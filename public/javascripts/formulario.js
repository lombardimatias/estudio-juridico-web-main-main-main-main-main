// Deshabilitar fechas pasadas
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);

document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const reason = document.getElementById('reason').value;
    const message = document.getElementById('message').value;

    const whatsappMessage = `${name} se ha contactado a través de la web solicitando turno para ${reason} en la fecha ${date}. Su email es: ${email} y ha escrito: ${message}`;
    const whatsappUrl = `https://wa.me/5491139011487?text=${encodeURIComponent(whatsappMessage)}`;

    fetch('/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, date, reason, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Solicitud enviada, continuar en WhatsApp la gestión del turno.');
            window.open(whatsappUrl, '_blank');
        } else {
            alert('Hubo un problema al agendar el turno.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud.');
    });
});
