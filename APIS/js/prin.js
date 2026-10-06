
function mostrarSeccion(seccion) {

    const contenido = document.getElementById("contenido");

    if (seccion === "inicio") {

        contenido.innerHTML = `
            <section class="inicio">

                <h2>Bienvenido al Centro de Control</h2>

                <div class="tarjetas">

                    <div class="tarjeta">
                        <span>✉️</span>
                        <h3>Notificaciones</h3>
                        <p>
                            Envío de mensajes mediante una API.
                        </p>
                    </div>

                    <div class="tarjeta">
                        <span>🛒</span>
                        <h3>E-Commerce</h3>
                        <p>
                            Consulta de productos y carrito de compras.
                        </p>
                    </div>

                    <div class="tarjeta">
                        <span>🎬</span>
                        <h3>Multimedia</h3>
                        <p>
                            Reproducción y consulta de contenido multimedia.
                        </p>
                    </div>

                    <div class="tarjeta">
                        <span>⚡</span>
                        <h3>GraphQL</h3>
                        <p>
                            Consulta de información mediante GraphQL.
                        </p>
                    </div>

                </div>

            </section>
        `;

    }

    else if (seccion === "correo") {

    contenido.innerHTML = `

        <section class="correo-container">

            <h2>✉️ Notificaciones y Correo</h2>

            <p>
                Envía un correo electrónico utilizando EmailJS.
            </p>

            <form id="form-correo">

                <div class="campo-correo">

                    <label for="to_email">
                        Correo destinatario
                    </label>

                    <input
                        type="email"
                        id="to_email"
                        placeholder="ejemplo@gmail.com"
                    >

                </div>


                <div class="campo-correo">

                    <label for="subject">
                        Asunto
                    </label>

                    <input
                        type="text"
                        id="subject"
                        placeholder="Asunto del correo"
                    >

                </div>


                <div class="campo-correo">

                    <label for="message">
                        Mensaje
                    </label>

                    <textarea
                        id="message"
                        rows="6"
                        placeholder="Escribe tu mensaje..."
                    ></textarea>

                </div>


                <button type="submit">
                    Enviar correo
                </button>

            </form>


            <div id="respuesta-correo"></div>

        </section>

    `;

    // Iniciar correo
    iniciarCorreo();

}

   else if (seccion === "ecommerce") {

    contenido.innerHTML = `

        <section class="ecommerce-container">

            <header class="ecommerce-header">

                <h2>
                    E-Commerce
                </h2>

                <p>
                    Productos obtenidos mediante una API REST
                </p>

            </header>


            <section>

                <h2>
                    Productos
                </h2>


                <div class="filtro-categoria">

                    <label for="categoria">
                        Filtrar por categoría:
                    </label>

                    <select id="categoria">

                        <option value="todas">
                            Todas las categorías
                        </option>

                    </select>

                </div>


                <br>


                <div id="productos">

                    <p>
                        Cargando productos...
                    </p>

                </div>

            </section>


            <section id="carrito-section">

                <h2>
                    🛒 Carrito de compras
                </h2>


                <div id="carrito">

                    <p>
                        El carrito está vacío.
                    </p>

                </div>


                <div class="total-carrito">

                    Total: $

                    <span id="total">
                        0.00
                    </span>

                </div>

            </section>

        </section>

    `;


    // Iniciar E-Commerce
    iniciarEcommerce();

}
    else if (seccion === "multimedia") {

    contenido.innerHTML = `

        <section class="player-container">

            <header class="player-header">
                <h2>Reproductor Multimedia</h2>
            </header>


            <section class="api-search-panel">

                <div class="search-box">

                    <input
                        type="text"
                        id="search-input"
                        placeholder="Buscar videos..."
                        value="nature"
                    >

                    <button id="search-btn">
                        Buscar en API
                    </button>

                </div>


                <div class="select-box">

                    <label for="video-select">
                        Resultados devueltos por la API:
                    </label>

                    <select id="video-select" disabled>

                        <option value="">
                            Realiza una búsqueda...
                        </option>

                    </select>

                </div>

            </section>


            <div class="video-wrapper">

                <video
                    id="main-video"
                    controls
                ></video>

            </div>


            <section class="metadata-panel">

                <h3>
                    Metadatos y Estadísticas en Tiempo Real
                </h3>


                <div class="grid-stats">

                    <div class="stat-card">

                        <span class="label">
                            Estado:
                        </span>

                        <span id="stat-status" class="value">
                            Inactivo
                        </span>

                    </div>


                    <div class="stat-card">

                        <span class="label">
                            Autor/Fotógrafo:
                        </span>

                        <span id="stat-author" class="value">
                            N/A
                        </span>

                    </div>


                    <div class="stat-card">

                        <span class="label">
                            Duración Total:
                        </span>

                        <span id="stat-duration" class="value">
                            00:00
                        </span>

                    </div>


                    <div class="stat-card">

                        <span class="label">
                            Tiempo Actual:
                        </span>

                        <span id="stat-current-time" class="value">
                            00:00
                        </span>

                    </div>


                    <div class="stat-card">

                        <span class="label">
                            Resolución Nativa:
                        </span>

                        <span id="stat-resolution" class="value">
                            0 x 0
                        </span>

                    </div>


                    <div class="stat-card">

                        <span class="label">
                            Calidad / Render:
                        </span>

                        <span id="stat-quality" class="value">
                            N/A
                        </span>

                    </div>

                </div>

            </section>

        </section>

    `;


    // Iniciar reproductor
    iniciarMultimedia();

}

  else if (seccion === "graphql") {

    contenido.innerHTML = `
        <section class="graphql-container">

            <div class="graphql-header">
                <h2>RICK AND MORTY</h2>
                
            </div>

            <div class="graphql-controls">

                <button id="btnCargar">
                    Cargar personajes
                </button>

                <p id="mensaje">
                    Presiona el botón para consultar la API.
                </p>

            </div>

            <div id="personajes" class="personajes">

            </div>

        </section>
    `;

    iniciarGraphQL();
}
}

