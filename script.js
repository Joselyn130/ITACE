javascript
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. PANTALLA DE ENTRADA
    // =========================================

    const pantallaEntrada = document.getElementById("portada");
    const botonEntrada = document.getElementById("entrar");
    const contenidoPrincipal = document.getElementById("contenido-principal");

    if (pantallaEntrada && botonEntrada && contenidoPrincipal) {

        botonEntrada.addEventListener("click", function () {

            pantallaEntrada.style.display = "none";
            contenidoPrincipal.hidden = false;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =========================================
    // 2. MENÚ RESPONSIVO PARA CELULAR
    // =========================================

    const botonMenu = document.getElementById("menu-toggle");
    const enlacesMenu = document.getElementById("menu-enlaces");

    if (botonMenu && enlacesMenu) {

        botonMenu.addEventListener("click", function () {

            const menuAbierto = enlacesMenu.classList.toggle("abierto");

            botonMenu.setAttribute(
                "aria-expanded",
                String(menuAbierto)
            );

            botonMenu.textContent = menuAbierto
                ? "✕ Cerrar menú"
                : "☰ Menú";

        });

        enlacesMenu.querySelectorAll("a").forEach(function (enlace) {

            enlace.addEventListener("click", function () {

                enlacesMenu.classList.remove("abierto");

                botonMenu.setAttribute("aria-expanded", "false");
                botonMenu.textContent = "☰ Menú";

            });

        });

    }


    // =========================================
    // 3. BOTÓN PARA VOLVER ARRIBA
    // =========================================

    const botonArriba = document.getElementById("arriba");

    function actualizarBotonArriba() {

        if (!botonArriba) {
            return;
        }

        if (window.scrollY > 350) {
            botonArriba.classList.add("visible");
        } else {
            botonArriba.classList.remove("visible");
        }

    }

    window.addEventListener("scroll", actualizarBotonArriba);

    actualizarBotonArriba();

    if (botonArriba) {

        botonArriba.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =========================================
    // 4. VISOR DE IMÁGENES DE LA GALERÍA
    // =========================================

    const visor = document.getElementById("visor");
    const imagenAmpliada = document.getElementById("imagen-ampliada");
    const descripcionImagen = document.getElementById("descripcion-imagen");
    const botonCerrarVisor = document.getElementById("cerrar-visor");

    function abrirVisor(ruta, descripcion) {

        if (!visor || !imagenAmpliada || !descripcionImagen) {
            return;
        }

        imagenAmpliada.src = ruta;
        imagenAmpliada.alt = descripcion || "Imagen ampliada";

        descripcionImagen.textContent = descripcion || "";

        visor.classList.add("activo");
        visor.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        if (botonCerrarVisor) {
            botonCerrarVisor.focus();
        }

    }

    function cerrarVisor() {

        if (!visor) {
            return;
        }

        visor.classList.remove("activo");
        visor.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

    }

    document.querySelectorAll("[data-imagen]").forEach(function (elemento) {

        elemento.addEventListener("click", function () {

            const ruta = elemento.dataset.imagen;
            const descripcion = elemento.dataset.descripcion || "";

            if (ruta) {
                abrirVisor(ruta, descripcion);
            }

        });

    });

    if (botonCerrarVisor) {

        botonCerrarVisor.addEventListener("click", cerrarVisor);

    }

    if (visor) {

        visor.addEventListener("click", function (evento) {

            if (evento.target === visor) {
                cerrarVisor();
            }

        });

    }

    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape" && visor && visor.classList.contains("activo")) {
            cerrarVisor();
        }

    });


    // =========================================
    // 5. DIRECTORIO DOCENTE DESDE JSON
    // =========================================

    const listaDocentes = document.getElementById("lista-docentes");
    const resultadoBusqueda = document.getElementById("resultado-busqueda");
    const tituloCategoria = document.getElementById("titulo-categoria-docente");

    const buscarNombre = document.getElementById("buscar-docente");
    const buscarMateria = document.getElementById("buscar-materia");
    const botonLimpiar = document.getElementById("limpiar-busqueda");

    const botonesCategoria = document.querySelectorAll("[data-categoria-docente]");

    let docentes = [];
    let categoriaActual = "modulos";

    const nombresCategorias = {
        modulos: "Docentes de módulos",
        clubes: "Docentes de clubes",
        materias: "Docentes de materias académicas"
    };

    function normalizarTexto(texto) {

        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    }

    function crearElemento(etiqueta, clase, texto) {

        const elemento = document.createElement(etiqueta);

        if (clase) {
            elemento.className = clase;
        }

        if (texto !== undefined && texto !== null) {
            elemento.textContent = texto;
        }

        return elemento;

    }

    function agregarDato(tarjeta, etiqueta, valor) {

        if (!valor) {
            return;
        }

        const parrafo = crearElemento("p", "", "");

        const negrita = crearElemento("strong", "", etiqueta + ": ");

        parrafo.appendChild(negrita);
        parrafo.appendChild(document.createTextNode(String(valor)));

        tarjeta.appendChild(parrafo);

    }

    function crearTarjetaDocente(docente) {

        const tarjeta = crearElemento("article", "tarjeta");

        // Fotografía del docente, si existe.
        if (docente.imagen) {

            const imagen = document.createElement("img");

            imagen.src = docente.imagen;
            imagen.alt = docente.nombre
                ? "Fotografía de " + docente.nombre
                : "Fotografía del docente";

            imagen.loading = "lazy";

            imagen.addEventListener("error", function () {
                imagen.style.display = "none";
            });

            tarjeta.appendChild(imagen);

        }

        // Nombre.
        tarjeta.appendChild(
            crearElemento(
                "h3",
                "",
                docente.nombre || "Docente"
            )
        );

        // Información del docente.
        agregarDato(tarjeta, "Área", docente.materia || docente.modulo || docente.club);
        agregarDato(tarjeta, "Categoría", docente.categoria);
        agregarDato(tarjeta, "Descripción", docente.descripcion);

        // Correo opcional.
        if (docente.correo) {

            const correo = crearElemento("a", "boton-secundario", "Contactar por correo");

            correo.href = "mailto:" + docente.correo;

            tarjeta.appendChild(correo);

        }

        return tarjeta;

    }

    function mostrarDocentes() {

        if (!listaDocentes) {
            return;
        }

        listaDocentes.replaceChildren();

        const textoNombre = normalizarTexto(
            buscarNombre ? buscarNombre.value : ""
        );

        const textoMateria = normalizarTexto(
            buscarMateria ? buscarMateria.value : ""
        );

        const docentesFiltrados = docentes.filter(function (docente) {

            const categoriaDocente = normalizarTexto(docente.categoria);

            const nombreDocente = normalizarTexto(docente.nombre);

            const materiaDocente = normalizarTexto(
                [
                    docente.materia,
                    docente.modulo,
                    docente.club,
                    docente.descripcion,
                    docente.categoria
                ].filter(Boolean).join(" ")
            );

            const coincideCategoria =
                categoriaDocente === normalizarTexto(categoriaActual);

            const coincideNombre =
                nombreDocente.includes(textoNombre);

            const coincideMateria =
                materiaDocente.includes(textoMateria);

            return coincideCategoria && coincideNombre && coincideMateria;

        });

        if (tituloCategoria) {

            tituloCategoria.textContent =
                nombresCategorias[categoriaActual] || "Directorio docente";

        }

        if (docentesFiltrados.length === 0) {

            if (resultadoBusqueda) {

                resultadoBusqueda.textContent = docentes.length === 0
                    ? "No hay docentes registrados en esta categoría."
                    : "No se encontraron docentes con esos criterios.";

            }

            return;

        }

        const fragmento = document.createDocumentFragment();

        docentesFiltrados.forEach(function (docente) {

            fragmento.appendChild(crearTarjetaDocente(docente));

        });

        listaDocentes.appendChild(fragmento);

        if (resultadoBusqueda) {

            resultadoBusqueda.textContent =
                docentesFiltrados.length === 1
                    ? "Se encontró 1 docente."
                    : "Se encontraron " + docentesFiltrados.length + " docentes.";

        }

    }

    function seleccionarCategoria(categoria) {

        categoriaActual = categoria;

        botonesCategoria.forEach(function (boton) {

            const seleccionado =
                boton.dataset.categoriaDocente === categoriaActual;

            boton.classList.toggle("activo", seleccionado);

            boton.setAttribute(
                "aria-pressed",
                String(seleccionado)
            );

        });

        mostrarDocentes();

    }

    botonesCategoria.forEach(function (boton) {

        boton.addEventListener("click", function () {

            seleccionarCategoria(boton.dataset.categoriaDocente);

        });

    });

    if (buscarNombre) {
        buscarNombre.addEventListener("input", mostrarDocentes);
    }

    if (buscarMateria) {
        buscarMateria.addEventListener("input", mostrarDocentes);
    }

    if (botonLimpiar) {

        botonLimpiar.addEventListener("click", function () {

            if (buscarNombre) {
                buscarNombre.value = "";
            }

            if (buscarMateria) {
                buscarMateria.value = "";
            }

            mostrarDocentes();

        });

    }

    async function cargarDocentes() {

        if (!listaDocentes) {
            return;
        }

        if (resultadoBusqueda) {
            resultadoBusqueda.textContent = "Cargando directorio docente...";
        }

        try {

            const respuesta = await fetch("./docentes.json", {
                cache: "no-store"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo encontrar docentes.json.");
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error("El archivo JSON debe contener una lista de docentes.");
            }

            docentes = datos.filter(function (docente) {

                return docente &&
                    typeof docente === "object" &&
                    typeof docente.nombre === "string" &&
                    typeof docente.categoria === "string";

            });

            mostrarDocentes();

        } catch (error) {

            console.error("Error al cargar el directorio docente:", error);

            listaDocentes.replaceChildren();

            if (resultadoBusqueda) {

                resultadoBusqueda.textContent =
                    "No se pudo cargar el directorio. Verifica que docentes.json " +
                    "exista junto a index.html y abre la página con un servidor local.";

            }

        }

    }

    if (listaDocentes) {
        cargarDocentes();
    }


    // =========================================
    // 6. PREGUNTAS FRECUENTES
    // =========================================

    // Las etiquetas <details> y <summary> del HTML permiten
    // desplegar las respuestas de forma nativa, sin JavaScript.
    // Aquí solo se asegura que las preguntas sean accesibles.

    document.querySelectorAll("#preguntas details").forEach(function (pregunta) {

        const resumen = pregunta.querySelector("summary");

        if (resumen) {
            resumen.setAttribute("role", "button");
        }

    });


    // =========================================
    // 7. ENLACES INTERNOS DEL MENÚ
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {

        enlace.addEventListener("click", function (evento) {

            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const seccion = document.querySelector(destino);

            if (!seccion) {
                return;
            }

            // El enlace continúa funcionando de manera normal.
            // No se cancela el comportamiento predeterminado.

        });

    });


    // =========================================
    // 8. MENSAJE INICIAL EN LA CONSOLA
    // =========================================

    console.log("ITACE DIGITAL 4.0: JavaScript cargado correctamente.");

});

