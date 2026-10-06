function iniciarCorreo() {

    // ==========================================
    // 1. CONFIGURACIÓN DE EMAILJS
    // ==========================================

    const PUBLIC_KEY = "DnI8IkdajsqOMAf02";
    const SERVICE_ID = "service_f22ax78";
    const TEMPLATE_ID = "template_3etv5cb";

    emailjs.init(PUBLIC_KEY);


    // ==========================================
    // 2. ELEMENTOS DEL DOM
    // ==========================================

    const formCorreo = document.getElementById("form-correo");
    const respuestaDiv = document.getElementById("respuesta-correo");


    // ==========================================
    // 3. MOSTRAR MENSAJES
    // ==========================================

    function mostrarMensaje(tipo, texto) {

        respuestaDiv.className = "";
        respuestaDiv.textContent = texto;
        respuestaDiv.classList.add(tipo);

    }


   

    function validarFormulario(payload) {

        if (!payload.to_email.trim()) {

            return {
                valido: false,
                mensaje: "Error 400: El destinatario es obligatorio."
            };

        }


        // Validar correo

        const regexEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!regexEmail.test(payload.to_email)) {

            return {
                valido: false,
                mensaje: "Error 400: El formato del correo no es válido."
            };

        }


        // Validar asunto

        if (!payload.subject.trim()) {

            return {
                valido: false,
                mensaje: "Error 400: El asunto es obligatorio."
            };

        }


        // Validar mensaje

        if (!payload.message.trim()) {

            return {
                valido: false,
                mensaje: "Error 400: El mensaje no puede estar vacío."
            };

        }


        return {
            valido: true
        };

    }
    // 5. EVENTO DEL FORMULARIO
    formCorreo.addEventListener("submit", async (evento) => {

        evento.preventDefault();
        // OBTENER DATOS DEL FORMULARIO
     

        const payload = {

            to_email:
                document.getElementById("to_email").value,

            subject:
                document.getElementById("subject").value,

            message:
                document.getElementById("message").value

        };
 
        // VALIDAR DATOS
    
        const validacion =
            validarFormulario(payload);


        if (!validacion.valido) {

            mostrarMensaje(
                "error-datos",
                validacion.mensaje
            );

            return;

        }

        // MOSTRAR CARGANDO
        mostrarMensaje(
            "cargando",
            "Enviando correo..."
        );


       // ENVIAR CORREO
      

        try {

            const response =
                await emailjs.send(
                    SERVICE_ID,
                    TEMPLATE_ID,
                    payload
                );

         
            // CORREO ENVIADO
            
            if (response.status === 200) {

                mostrarMensaje(
                    "exito",
                    "¡Correo enviado con éxito! (200 OK)"
                );

                formCorreo.reset();

            }

        } catch (error) {

            console.error(
                "Error detectado:",
                error
            );


         

            if (
                error.status === 400 ||
                error.text?.includes("Bad Request")
            ) {

                mostrarMensaje(
                    "error-datos",
                    "Error 400: La API rechazó los datos."
                );

            }


          

            else if (
                error.status === 401 ||
                error.text?.includes("Unauthorized")
            ) {

                mostrarMensaje(
                    "error-auth",
                    "Error 401: Credenciales inválidas. Revisa tus claves."
                );

            }


           

            else {

                mostrarMensaje(
                    "error-auth",
                    `Error ${
                        error.status || "desconocido"
                    }: ${
                        error.text || "Fallo en el envío"
                    }`
                );

            }

        }

    });

}