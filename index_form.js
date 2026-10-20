
const frmEmail = document.getElementById('frm-email');
const btnEnviar = document.getElementById('btnEnviar');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

frmEmail.addEventListener('submit', sendEmail);

const serviceId = 'service_agpwavf';
const templateId = 'template_1vlttpj';
const apiKey = 'VFUzPQIsz68DRA7za';

function sendEmail(event) {
    event.preventDefault();

    const errorMsg = document.getElementById("errorMsg");

    // Obtener respuesta del CAPTCHA
    const captchaResponse = grecaptcha.getResponse();

    // Verificar CAPTCHA
    if (!captchaResponse) {
        errorMsg.hidden = false;
        errorMsg.innerHTML = "✖ Por favor, completa el CAPTCHA.";
        return;
    }

    errorMsg.hidden = true;

    // Mostrar loader SOLO dentro del botón
    btnText.hidden = true;
    btnLoader.hidden = false;
    btnEnviar.disabled = true;

    const templateParams = {
        name: document.getElementById('name').value,
        message: document.getElementById('message').value,
        tel: document.getElementById('tel').value,
        email: document.getElementById('email').value,
        'g-recaptcha-response': captchaResponse
    };

    emailjs.send(serviceId, templateId, templateParams, apiKey)
        .then(
            (response) => {

                // Restaurar botón
                btnText.hidden = false;
                btnLoader.hidden = true;
                btnEnviar.disabled = false;

                // Limpiar formulario
                document.getElementById('name').value = "";
                document.getElementById('message').value = "";
                document.getElementById('tel').value = "";
                document.getElementById('email').value = "";

                // Reiniciar CAPTCHA
                grecaptcha.reset();

                const successMsg = document.getElementById("successMsg");

                let sec = 5;

                successMsg.hidden = false;
                successMsg.innerHTML =
                    `✔ Correo enviado. El mensaje se ocultará en: ${sec}s`;

                const timer = setInterval(() => {
                    sec--;

                    if (sec > 0) {
                        successMsg.innerHTML =
                            `✔ Correo enviado. El mensaje se ocultará en: ${sec}s`;
                    } else {
                        clearInterval(timer);
                        successMsg.hidden = true;
                    }
                }, 1000);
            },

            (error) => {

                // Restaurar botón
                btnText.hidden = false;
                btnLoader.hidden = true;
                btnEnviar.disabled = false;

                const errorMsg = document.getElementById("errorMsg");

                let sec = 5;

                errorMsg.hidden = false;

                console.log(error);

                errorMsg.innerHTML =
                    `✖ Ha ocurrido un error. Por favor, verifica los datos e inténtalo de nuevo. (${sec}s)`;

                const timer = setInterval(() => {
                    sec--;

                    if (sec > 0) {
                        errorMsg.innerHTML =
                            `✖ Ha ocurrido un error. Por favor, verifica los datos e inténtalo de nuevo. (${sec}s)`;
                    } else {
                        clearInterval(timer);
                        errorMsg.hidden = true;
                    }
                }, 1000);
            }
        );
}

