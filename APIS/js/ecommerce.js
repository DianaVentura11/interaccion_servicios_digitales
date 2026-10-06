function iniciarEcommerce() {

    const API_URL = "https://dummyjson.com/products?limit=0";
    const JWT_TOKEN = "";

    const productosContainer =
        document.getElementById("productos");

    const carritoContainer =
        document.getElementById("carrito");

    const totalElement =
        document.getElementById("total");

    const categoriaSelect =
        document.getElementById("categoria");

    let productosDisponibles = [];
    let carrito = [];


   

    async function obtenerProductos() {

        try {

            productosContainer.innerHTML =
                "<p>Cargando productos...</p>";

            const respuesta = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${JWT_TOKEN}`
                }
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            productosDisponibles = datos.products;

            mostrarProductos(productosDisponibles);

            cargarCategorias(productosDisponibles);

        } catch (error) {

            console.error(
                "Error al obtener los productos:",
                error
            );

            productosContainer.innerHTML =
                "<p>No se pudieron cargar los productos.</p>";
        }
    }


    // ==========================================
    // CARGAR CATEGORÍAS
    // ==========================================

    function cargarCategorias(productos) {

        const categorias = [
            ...new Set(
                productos.map(
                    producto => producto.category
                )
            )
        ].sort();

        categoriaSelect.innerHTML =
            '<option value="todas">Todas las categorías</option>';

        categorias.forEach(categoria => {

            const option =
                document.createElement("option");

            option.value = categoria;
            option.textContent = categoria;

            categoriaSelect.appendChild(option);
        });
    }


 

    async function filtrarPorCategoria(categoria) {

        try {

            if (categoria === "todas") {

                mostrarProductos(
                    productosDisponibles
                );

                return;
            }

            const respuesta = await fetch(
                `https://dummyjson.com/products/category/${encodeURIComponent(categoria)}`
            );

            if (!respuesta.ok) {
                throw new Error(`HTTP ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            mostrarProductos(datos.products);

        } catch (error) {

            console.error(
                "Error al filtrar por categoría:",
                error
            );

            productosContainer.innerHTML =
                "<p>No se pudieron cargar los productos de esta categoría.</p>";
        }
    }


    

    categoriaSelect.addEventListener(
        "change",
        () => {

            filtrarPorCategoria(
                categoriaSelect.value
            );

        }
    );


    

    function mostrarProductos(productos) {

        productosContainer.innerHTML = "";

        productos.forEach(producto => {

            const div =
                document.createElement("div");

            div.classList.add("producto");

            div.innerHTML = `
                <img
                    src="${producto.thumbnail}"
                    alt="${producto.title}"
                >

                <h3>${producto.title}</h3>

                <p class="precio">
                    $${producto.price}
                </p>

                <p class="categoria">
                    ${producto.category}
                </p>

                <button class="btn-carrito">
                    Agregar al carrito
                </button>
            `;

            const boton =
                div.querySelector(".btn-carrito");

            boton.addEventListener(
                "click",
                () => {

                    agregarAlCarrito(
                        producto.id
                    );

                }
            );

            productosContainer.appendChild(div);
        });
    }


    

    function agregarAlCarrito(id) {

        const producto =
            productosDisponibles.find(
                producto => producto.id === id
            );

        if (!producto) {
            return;
        }

        const productoExistente =
            carrito.find(
                producto => producto.id === id
            );

        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        mostrarCarrito();
    }


  

    function mostrarCarrito() {

        carritoContainer.innerHTML = "";

        if (carrito.length === 0) {

            carritoContainer.innerHTML =
                "<p>El carrito está vacío.</p>";

            totalElement.textContent =
                "0.00";

            return;
        }

        let total = 0;


        carrito.forEach(producto => {

            total +=
                producto.price *
                producto.cantidad;


            const div =
                document.createElement("div");

            div.classList.add(
                "producto-carrito"
            );


            div.innerHTML = `
                <h3>
                    ${producto.title}
                </h3>

                <p>
                    Precio:
                    $${producto.price}
                </p>

                <p>
                    Cantidad:
                    ${producto.cantidad}
                </p>

                <button
                    class="btn-cantidad"
                    data-accion="aumentar"
                >
                    +
                </button>

                <button
                    class="btn-cantidad"
                    data-accion="disminuir"
                >
                    -
                </button>

                <button
                    class="btn-eliminar"
                >
                    Eliminar
                </button>
            `;


            // AUMENTAR

            div.querySelector(
                '[data-accion="aumentar"]'
            ).addEventListener(
                "click",
                () => {

                    aumentarCantidad(
                        producto.id
                    );

                }
            );


            // DISMINUIR

            div.querySelector(
                '[data-accion="disminuir"]'
            ).addEventListener(
                "click",
                () => {

                    disminuirCantidad(
                        producto.id
                    );

                }
            );


            // ELIMINAR

            div.querySelector(
                ".btn-eliminar"
            ).addEventListener(
                "click",
                () => {

                    eliminarDelCarrito(
                        producto.id
                    );

                }
            );


            carritoContainer.appendChild(div);

        });



        totalElement.textContent =
            total.toFixed(2);


        

        const botonComprar =
            document.createElement("button");

        botonComprar.id =
            "btn-comprar";

        botonComprar.classList.add(
            "btn-comprar"
        );

        botonComprar.textContent =
            "Comprar ahora";


        botonComprar.addEventListener(
            "click",
            realizarCompra
        );


        carritoContainer.appendChild(
            botonComprar
        );
    }


    

    function aumentarCantidad(id) {

        const producto =
            carrito.find(
                producto => producto.id === id
            );

        if (producto) {

            producto.cantidad++;

            mostrarCarrito();
        }
    }


   

    function disminuirCantidad(id) {

        const producto =
            carrito.find(
                producto => producto.id === id
            );

        if (!producto) {
            return;
        }

        if (producto.cantidad > 1) {

            producto.cantidad--;

        } else {

            eliminarDelCarrito(id);

            return;
        }

        mostrarCarrito();
    }


   

    function eliminarDelCarrito(id) {

        carrito =
            carrito.filter(
                producto => producto.id !== id
            );

        mostrarCarrito();
    }


   

    async function realizarCompra() {

        if (carrito.length === 0) {

            alert(
                "El carrito está vacío."
            );

            return;
        }


        const productosCompra =
            carrito.map(producto => ({
                id: producto.id,
                quantity: producto.cantidad
            }));


        try {

            const botonComprar =
                document.getElementById(
                    "btn-comprar"
                );

            botonComprar.disabled = true;

            botonComprar.textContent =
                "Procesando compra...";


            const respuesta = await fetch(
                "https://dummyjson.com/carts/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId: 1,

                        products:
                            productosCompra
                    })
                }
            );


            if (!respuesta.ok) {

                throw new Error(
                    `HTTP ${respuesta.status}`
                );
            }


            const compra =
                await respuesta.json();


            console.log(
                "Compra realizada:",
                compra
            );


            alert(
                "¡Compra realizada correctamente!"
            );


            // Vaciar carrito

            carrito = [];

            mostrarCarrito();


        } catch (error) {

            console.error(
                "Error al realizar la compra:",
                error
            );


            alert(
                "No se pudo realizar la compra."
            );
        }
    }


   
  

    mostrarCarrito();

    obtenerProductos();
}