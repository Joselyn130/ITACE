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
// 2. MENÚ FLOTANTE DESPLEGABLE ITACE
// =========================================

const menuDesplegable = document.querySelector(
    ".menu-flotante .menu-desplegable"
);

if (menuDesplegable) {

    const enlacesMenu = menuDesplegable.querySelector(".menu-enlaces");

    if (enlacesMenu) {

        // Cerrar al seleccionar un apartado
        enlacesMenu.querySelectorAll("a").forEach(function (enlace) {

            enlace.addEventListener("click", function () {
                menuDesplegable.removeAttribute("open");
            });

        });

        // Cerrar al presionar Escape
        document.addEventListener("keydown", function (evento) {

            if (evento.key === "Escape") {
                menuDesplegable.removeAttribute("open");
            }

        });

        // Cerrar al hacer clic fuera
        document.addEventListener("click", function (evento) {

            if (!menuDesplegable.contains(evento.target)) {
                menuDesplegable.removeAttribute("open");
            }

        });

    }
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

    function convertirLista(valor) {
        if (Array.isArray(valor)) {
            return valor;
        }

        if (valor === undefined || valor === null || valor === "") {
            return [];
        }

        return [valor];
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
        const valores = convertirLista(valor)
            .filter(function (dato) {
                return dato !== undefined &&
                    dato !== null &&
                    String(dato).trim() !== "";
            });

        if (valores.length === 0) {
            return;
        }

        const parrafo = crearElemento("p", "", "");
        const negrita = crearElemento("strong", "", etiqueta + ": ");

        parrafo.appendChild(negrita);
        parrafo.appendChild(
            document.createTextNode(valores.join(", "))
        );

        tarjeta.appendChild(parrafo);
    }

    function obtenerFoto(docente) {
        return docente.foto || docente.imagen || "";
    }

    function obtenerAcademia(docente) {
        return docente.academia || docente.area || "";
    }

    function obtenerMaterias(docente) {
        return convertirLista(
            docente.materiasAcademicas || docente.materias
        );
    }

    // Permite que un docente pertenezca a UNA O VARIAS categorías.
    function obtenerCategorias(docente) {
        const categorias = [];

        const tipos = convertirLista(
            docente.tipo || docente.categoria
        );

        tipos.forEach(function (tipo) {
            const texto = normalizarTexto(tipo);

            if (
                texto === "modulos" ||
                texto.includes("modulo")
            ) {
                categorias.push("modulos");
            } else if (
                texto === "clubes" ||
                texto.includes("club")
            ) {
                categorias.push("clubes");
            } else if (
                texto === "materias" ||
                texto.includes("materia")
            ) {
                categorias.push("materias");
            }
        });

        // También reconoce las categorías a partir de los datos.
        if (convertirLista(docente.modulos).length > 0) {
            categorias.push("modulos");
        }

        if (convertirLista(docente.clubes).length > 0) {
            categorias.push("clubes");
        }

        if (obtenerMaterias(docente).length > 0) {
            categorias.push("materias");
        }

        // Compatibilidad con registros antiguos.
        const academia = normalizarTexto(obtenerAcademia(docente));

        if (academia.includes("club")) {
            categorias.push("clubes");
        } else if (academia.includes("modulo")) {
            categorias.push("modulos");
        } else if (
            academia.includes("materia") ||
            academia.includes("academica")
        ) {
            categorias.push("materias");
        }

        // Elimina categorías repetidas.
        return [...new Set(categorias)];
    }

    function crearTarjetaDocente(docente) {
        const tarjeta = crearElemento("article", "tarjeta");

        // Fotografía.
        const rutaFoto = obtenerFoto(docente);

        if (rutaFoto) {
            const imagen = document.createElement("img");

            imagen.src = rutaFoto;
            imagen.alt = "Fotografía de " + docente.nombre;
            imagen.loading = "lazy";

            imagen.addEventListener("error", function () {
                imagen.style.display = "none";
            });

            tarjeta.appendChild(imagen);
        } else {
            tarjeta.appendChild(
                crearElemento(
                    "div",
                    "espacio-foto-docente",
                    "📷 Fotografía no disponible"
                )
            );
        }

        // Nombre.
        tarjeta.appendChild(
            crearElemento("h3", "", docente.nombre || "Docente")
        );

        // Información.
        agregarDato(tarjeta, "Academia", obtenerAcademia(docente));
        agregarDato(tarjeta, "Módulos", docente.modulos);
        agregarDato(tarjeta, "Clubes", docente.clubes);
        agregarDato(tarjeta, "Materias que imparte", obtenerMaterias(docente));
        agregarDato(tarjeta, "Semestres", docente.semestres);
        agregarDato(
            tarjeta,
            "Perfil profesional",
            docente.perfil || docente.descripcion
        );

        // Correo opcional.
        if (docente.correo) {
            const correo = crearElemento(
                "a",
                "boton-secundario",
                "Contactar por correo"
            );

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

            // El docente puede aparecer en varias categorías.
            const coincideCategoria =
                obtenerCategorias(docente).includes(categoriaActual);

            const nombreDocente = normalizarTexto(docente.nombre);

            const informacionDocente = normalizarTexto([
                obtenerAcademia(docente),
                docente.perfil,
                docente.descripcion,
                ...convertirLista(docente.modulos),
                ...convertirLista(docente.clubes),
                ...obtenerMaterias(docente),
                ...convertirLista(docente.semestres)
            ].join(" "));

            const coincideNombre =
                nombreDocente.includes(textoNombre);

            const coincideMateria =
                informacionDocente.includes(textoMateria);

            return coincideCategoria &&
                coincideNombre &&
                coincideMateria;
        });

        if (tituloCategoria) {
            tituloCategoria.textContent =
                nombresCategorias[categoriaActual] ||
                "Directorio docente";
        }

        if (docentesFiltrados.length === 0) {
            if (resultadoBusqueda) {
                if (docentes.length === 0) {
                    resultadoBusqueda.textContent =
                        "No hay docentes registrados en docentes.json.";
                } else {
                    resultadoBusqueda.textContent =
                        "No se encontraron docentes en esta categoría con esos criterios.";
                }
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
                    : "Se encontraron " +
                      docentesFiltrados.length +
                      " docentes.";
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

    // Botones de las tres categorías.
    botonesCategoria.forEach(function (boton) {
        boton.addEventListener("click", function () {
            seleccionarCategoria(
                boton.dataset.categoriaDocente
            );
        });
    });

    // Buscadores.
    if (buscarNombre) {
        buscarNombre.addEventListener("input", mostrarDocentes);
    }

    if (buscarMateria) {
        buscarMateria.addEventListener("input", mostrarDocentes);
    }

    // Limpiar ambos campos.
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

    // Cargar docentes desde el archivo JSON.
    async function cargarDocentes() {
        if (!listaDocentes) {
            return;
        }

        if (resultadoBusqueda) {
            resultadoBusqueda.textContent =
                "Cargando directorio docente...";
        }

        try {
            const respuesta = await fetch("datos/docentes.json", {
                cache: "no-store"
            });

            if (!respuesta.ok) {
                throw new Error(
                    "Error HTTP " + respuesta.status
                );
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error(
                    "docentes.json debe contener una lista."
                );
            }

            docentes = datos.filter(function (docente) {
                return docente &&
                    typeof docente === "object" &&
                    typeof docente.nombre === "string" &&
                    docente.nombre.trim() !== "";
            });

            // Respetar la categoría activa del HTML.
            const botonActivo = document.querySelector(
                "[data-categoria-docente].activo"
            );

            if (
                botonActivo &&
                nombresCategorias[botonActivo.dataset.categoriaDocente]
            ) {
                categoriaActual =
                    botonActivo.dataset.categoriaDocente;
            }

            mostrarDocentes();

        } catch (error) {
            console.error(
                "Error al cargar docentes.json:",
                error
            );

            listaDocentes.replaceChildren();

            if (resultadoBusqueda) {
                resultadoBusqueda.textContent =
                    "No se pudo cargar docentes.json. Comprueba que esté junto a index.html y abre la página con Live Server.";
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