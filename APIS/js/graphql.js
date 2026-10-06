function iniciarGraphQL() {

    const URL =
        "https://rickandmortyapi.com/graphql";


    const btnCargar =
        document.getElementById("btnCargar");

    const contenedor =
        document.getElementById("personajes");

    const mensaje =
        document.getElementById("mensaje");


    const query = `
        query {
            characters(page: 1) {
                results {
                    name
                    image
                    status
                    species

                    location {
                        name
                    }

                    origin {
                        name
                    }
                }
            }
        }
    `;


    async function cargarPersonajes() {

        mensaje.textContent =
            "Cargando personajes...";

        contenedor.innerHTML = "";


        try {

            const respuesta = await fetch(URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    query: query
                })
            });


            if (!respuesta.ok) {

                throw new Error(
                    "Error HTTP: " +
                    respuesta.status
                );
            }


            const resultado =
                await respuesta.json();


            if (resultado.errors) {

                throw new Error(
                    resultado.errors[0].message
                );
            }


            const personajes =
                resultado.data.characters.results;


            personajes.forEach(personaje => {

                const tarjeta =
                    document.createElement("article");


                tarjeta.classList.add(
                    "tarjeta-personaje"
                );


                const claseEstado =
                    personaje.status
                        ? personaje.status.toLowerCase()
                        : "unknown";


                const origen =
                    personaje.origin?.name ||
                    "Desconocido";


                const ubicacion =
                    personaje.location?.name ||
                    "Desconocida";


                tarjeta.innerHTML = `

                    <img
                        src="${personaje.image}"
                        alt="Imagen de ${personaje.name}"
                    >

                    <div class="informacion">

                        <h2>
                            ${personaje.name}
                        </h2>


                        <div class="estado">

                            <span
                                class="punto ${claseEstado}"
                            ></span>

                            ${personaje.status}
                            -
                            ${personaje.species}

                        </div>


                        <p class="etiqueta">
                            Última ubicación conocida:
                        </p>

                        <p class="dato">
                            ${ubicacion}
                        </p>


                        <p class="etiqueta">
                            Origen:
                        </p>

                        <p class="dato">
                            ${origen}
                        </p>

                    </div>
                `;


                contenedor.appendChild(
                    tarjeta
                );

            });


            mensaje.textContent =
                `Se cargaron ${personajes.length} personajes :).`;


        } catch (error) {

            console.error(error);


            mensaje.innerHTML =
                `<span class="error">
                    No se pudieron cargar los personajes:
                    ${error.message}
                </span>`;
        }
    }


    btnCargar.addEventListener(
        "click",
        cargarPersonajes
    );
}