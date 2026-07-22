// ============================================================
// MENÚ RESPONSIVE
// ============================================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

function setMenuState(isOpen) {
    if (!menuToggle || !nav) return;

    nav.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        setMenuState(!nav.classList.contains("active"));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
        const clickedOutside =
            !nav.contains(event.target) &&
            !menuToggle.contains(event.target);

        if (clickedOutside) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            setMenuState(false);
        }
    });
}

// La página muestra el video directamente en un iframe.
// No se necesita código de modal mientras no existan
// #openVideo, #videoModal, #videoFrame y #closeVideo.
