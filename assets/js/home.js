// ================= MENÚ RESPONSIVE =================
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });
}


// ============================================================
// DATOS DE LOS PLANES
// Aquí puedes cambiar nombres, precios, velocidades y detalles.
// ============================================================

const plansData = {

    // --------------------------------------------------------
    // PLANES DE FIBRA ÓPTICA
    // --------------------------------------------------------
    fibra: [
        {
            category: "Plan fibra",
            name: "Esencial",
            speed: "100",
            icon: "fa-wifi",
            description: "Ideal para navegación, estudios y uso diario.",
            features: [
                "Hasta 5 dispositivos",
                "Streaming en HD",
                "Navegación y redes sociales",
                "Soporte técnico 24/7"
            ],
            price: "79",
            cents: "90",
            badge: "",
            extra: "Incluye instalación básica y router Wi-Fi."
        },
        {
            category: "Plan fibra",
            name: "Hogar Plus",
            speed: "200",
            icon: "fa-house",
            description: "Perfecto para familias, streaming y videollamadas.",
            features: [
                "Hasta 10 dispositivos",
                "Streaming 4K",
                "Videollamadas estables",
                "Soporte prioritario"
            ],
            price: "109",
            cents: "90",
            badge: "Recomendado",
            extra: "Incluye router Wi-Fi y atención prioritaria."
        },
        {
            category: "Plan fibra",
            name: "Ultra Conexión",
            speed: "300",
            icon: "fa-house-signal",
            description: "Máximo rendimiento para hogares conectados.",
            features: [
                "Hasta 15 dispositivos",
                "Streaming 4K y 8K",
                "Gaming online sin retrasos",
                "Router Wi-Fi 6 incluido"
            ],
            price: "149",
            cents: "90",
            badge: "Más popular",
            extra: "Ideal para trabajo remoto, gaming y hogares exigentes."
        },
        {
            category: "Plan fibra",
            name: "Fibra Max",
            speed: "500",
            icon: "fa-bolt",
            description: "Alta velocidad para múltiples usuarios y dispositivos.",
            features: [
                "Hasta 20 dispositivos",
                "Streaming en máxima calidad",
                "Descargas ultrarrápidas",
                "Soporte premium"
            ],
            price: "179",
            cents: "90",
            badge: "",
            extra: "Incluye router de alto rendimiento."
        },
        {
            category: "Plan fibra",
            name: "Fibra Total",
            speed: "1000",
            icon: "fa-gauge-high",
            description: "La máxima potencia para una experiencia sin límites.",
            features: [
                "Conexión de 1 Gbps",
                "Dispositivos ilimitados",
                "Trabajo remoto avanzado",
                "Soporte VIP"
            ],
            price: "229",
            cents: "90",
            badge: "",
            extra: "Sujeto a disponibilidad y cobertura técnica."
        }
    ],


    // --------------------------------------------------------
    // PLANES GAMER Y STREAMING
    // --------------------------------------------------------
    gamer: [
        {
            category: "Plan gamer",
            name: "Gamer Start",
            speed: "300",
            icon: "fa-gamepad",
            description: "Diseñado para gaming casual y streaming en alta calidad.",
            features: [
                "Baja latencia",
                "Streaming 4K",
                "Hasta 12 dispositivos",
                "Soporte técnico gamer"
            ],
            price: "129",
            cents: "90",
            badge: "",
            extra: "Configuración recomendada para consolas y PC."
        },
        {
            category: "Plan gamer",
            name: "Gamer Pro",
            speed: "500",
            icon: "fa-crosshairs",
            description: "Rendimiento avanzado para jugadores competitivos.",
            features: [
                "Latencia optimizada",
                "Router Wi-Fi 6",
                "Streaming y gaming simultáneo",
                "Atención prioritaria"
            ],
            price: "169",
            cents: "90",
            badge: "Recomendado",
            extra: "Ideal para partidas online, transmisiones y creación de contenido."
        },
        {
            category: "Plan gamer",
            name: "Ultra Gamer",
            speed: "700",
            icon: "fa-headset",
            description: "Velocidad superior para gaming, streaming y múltiples equipos.",
            features: [
                "Conexión de alto rendimiento",
                "Streaming 4K y 8K",
                "Hasta 25 dispositivos",
                "Soporte premium 24/7"
            ],
            price: "199",
            cents: "90",
            badge: "Más popular",
            extra: "Incluye configuración especializada del router."
        },
        {
            category: "Plan gamer",
            name: "Gamer Élite",
            speed: "1000",
            icon: "fa-trophy",
            description: "La experiencia definitiva para jugadores y creadores.",
            features: [
                "Fibra óptica de 1 Gbps",
                "Mínima latencia",
                "Dispositivos ilimitados",
                "Soporte VIP"
            ],
            price: "249",
            cents: "90",
            badge: "",
            extra: "Plan sujeto a cobertura técnica en la zona."
        }
    ]
};


// ============================================================
// ELEMENTOS DEL CARRUSEL
// ============================================================

const plansTrack = document.getElementById("plansTrack");
const prevPlan = document.getElementById("prevPlan");
const nextPlan = document.getElementById("nextPlan");
const sliderDots = document.getElementById("sliderDots");

const planTabs = document.querySelectorAll(".plan-tab");
const slider = document.querySelector(".plans-slider");

let currentCategory = "fibra";
let originalCards = [];
let allCards = [];
let originalCount = 0;
let currentIndex = 0;
let autoplayId = null;
let isAnimating = false;


// ============================================================
// CREAR EL HTML DE UNA TARJETA
// ============================================================

function createPlanCard(plan) {

    const featuredClass = plan.badge ? "featured" : "";

    const badgeHTML = plan.badge
        ? `<div class="badge">${plan.badge}</div>`
        : "";

    const featuresHTML = plan.features
        .map((feature) => `<li>${feature}</li>`)
        .join("");

    return `
        <article class="plan-card ${featuredClass}">
            ${badgeHTML}

            <div class="plan-top">
                <div class="plan-icon">
                    <i class="fa-solid ${plan.icon}"></i>
                </div>

                <div>
                    <span class="plan-category">
                        ${plan.category}
                    </span>

                    <h3>${plan.name}</h3>
                </div>
            </div>

            <div class="plan-speed">
                ${plan.speed}
                <small>Mbps</small>
            </div>

            <p class="plan-description">
                ${plan.description}
            </p>

            <div class="plan-divider"></div>

            <ul>
                ${featuresHTML}
            </ul>

            <div class="plan-price">
                S/
                <strong>${plan.price}</strong>
                <sup>${plan.cents}</sup>
                <small>/mes</small>
            </div>

            <a href="#contacto" class="request-plan">
                Solicitar plan
            </a>

            <button class="plan-details" type="button">
                Ver detalles
                <i class="fa-solid fa-chevron-down"></i>
            </button>

            <div class="plan-extra">
                ${plan.extra}
            </div>
        </article>
    `;
}


// ============================================================
// CARGAR UNA CATEGORÍA
// Esta función cambia los planes cuando se pulsa una pestaña.
// ============================================================

function loadCategory(category) {

    if (!plansTrack || !plansData[category]) return;

    stopAutoplay();

    currentCategory = category;
    currentIndex = 0;
    isAnimating = false;

    plansTrack.style.transition = "none";
    plansTrack.style.transform = "translateX(0)";

    // Crear tarjetas originales
    plansTrack.innerHTML = plansData[category]
        .map(createPlanCard)
        .join("");

    originalCards = Array.from(
        plansTrack.querySelectorAll(".plan-card")
    );

    originalCount = originalCards.length;

    // Duplicar las tarjetas para producir el efecto infinito
    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        plansTrack.appendChild(clone);
    });

    allCards = Array.from(
        plansTrack.querySelectorAll(".plan-card")
    );

    createSliderDots();
    updateSliderDots();
    addDetailsEvents();
    moveSlider(false);
    startAutoplay();
}


// ============================================================
// CALCULAR EL DESPLAZAMIENTO DE UNA TARJETA
// ============================================================

function getCardStep() {

    if (!allCards.length || !plansTrack) return 0;

    const trackStyles = window.getComputedStyle(plansTrack);

    const gap = parseFloat(
        trackStyles.columnGap ||
        trackStyles.gap ||
        "0"
    );

    return allCards[0].getBoundingClientRect().width + gap;
}


// ============================================================
// MOVER EL CARRUSEL
// ============================================================

function moveSlider(withTransition = true) {

    if (!plansTrack || !allCards.length) return;

    plansTrack.style.transition = withTransition
        ? "transform .5s ease"
        : "none";

    plansTrack.style.transform =
        `translateX(-${currentIndex * getCardStep()}px)`;

    updateSliderDots();
}


// ============================================================
// SIGUIENTE PLAN
// ============================================================

function nextSlide() {

    if (isAnimating || originalCount === 0) return;

    isAnimating = true;
    currentIndex += 1;

    moveSlider(true);

    window.setTimeout(() => {

        if (currentIndex >= originalCount) {
            currentIndex = 0;
            moveSlider(false);
        }

        isAnimating = false;

    }, 520);
}


// ============================================================
// PLAN ANTERIOR
// ============================================================

function prevSlide() {

    if (isAnimating || originalCount === 0) return;

    isAnimating = true;

    if (currentIndex === 0) {

        currentIndex = originalCount;
        moveSlider(false);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                currentIndex -= 1;
                moveSlider(true);
            });
        });

    } else {

        currentIndex -= 1;
        moveSlider(true);
    }

    window.setTimeout(() => {
        isAnimating = false;
    }, 520);
}


// ============================================================
// REPRODUCCIÓN AUTOMÁTICA
// ============================================================

function startAutoplay() {

    stopAutoplay();

    if (originalCount <= 1) return;

    autoplayId = window.setInterval(
        nextSlide,
        4500
    );
}


function stopAutoplay() {

    if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
    }
}


// ============================================================
// CREAR PUNTOS DEL CARRUSEL
// ============================================================

function createSliderDots() {

    if (!sliderDots) return;

    sliderDots.innerHTML = "";

    for (let index = 0; index < originalCount; index += 1) {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute(
            "aria-label",
            `Ir al plan ${index + 1}`
        );

        dot.addEventListener("click", () => {

            if (isAnimating) return;

            currentIndex = index;
            moveSlider(true);
            startAutoplay();
        });

        sliderDots.appendChild(dot);
    }
}


// ============================================================
// ACTUALIZAR PUNTO ACTIVO
// ============================================================

function updateSliderDots() {

    if (!sliderDots || originalCount === 0) return;

    const realIndex = currentIndex % originalCount;

    sliderDots
        .querySelectorAll(".slider-dot")
        .forEach((dot, index) => {
            dot.classList.toggle(
                "active",
                index === realIndex
            );
        });
}


// ============================================================
// ABRIR Y CERRAR DETALLES DE CADA PLAN
// ============================================================

function addDetailsEvents() {

    if (!plansTrack) return;

    plansTrack
        .querySelectorAll(".plan-details")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const card = button.closest(".plan-card");

                if (!card) return;

                card.classList.toggle("details-open");

                const isOpen =
                    card.classList.contains("details-open");

                button.firstChild.textContent =
                    isOpen
                        ? "Ocultar detalles "
                        : "Ver detalles ";
            });
        });
}


// ============================================================
// CAMBIAR ENTRE FIBRA Y GAMER
// ============================================================

planTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        const category = tab.dataset.category;

        if (category === currentCategory) return;

        planTabs.forEach((item) => {

            const isSelected = item === tab;

            item.classList.toggle(
                "active",
                isSelected
            );

            item.setAttribute(
                "aria-selected",
                String(isSelected)
            );
        });

        loadCategory(category);
    });
});


// ============================================================
// EVENTOS DE LAS FLECHAS
// ============================================================

if (nextPlan) {

    nextPlan.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });
}


if (prevPlan) {

    prevPlan.addEventListener("click", () => {
        prevSlide();
        startAutoplay();
    });
}


// ============================================================
// PAUSAR EL CARRUSEL CUANDO EL USUARIO INTERACTÚA
// ============================================================

if (slider) {

    slider.addEventListener(
        "mouseenter",
        stopAutoplay
    );

    slider.addEventListener(
        "mouseleave",
        startAutoplay
    );

    slider.addEventListener(
        "focusin",
        stopAutoplay
    );

    slider.addEventListener(
        "focusout",
        startAutoplay
    );
}


// ============================================================
// REAJUSTAR AL CAMBIAR EL TAMAÑO DE LA PANTALLA
// ============================================================

window.addEventListener("resize", () => {

    currentIndex = 0;
    moveSlider(false);
});


// ============================================================
// CARGAR LOS PLANES DE FIBRA AL ABRIR LA PÁGINA
// ============================================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => loadCategory("fibra"));
} else {
    loadCategory("fibra");
}


// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        alert(
            "Mensaje registrado. Nos comunicaremos contigo pronto."
        );

        contactForm.reset();
    });
}

// ============================================================
// VERIFICACIÓN DE COBERTURA
// ============================================================

const coverageForm = document.getElementById("coverageForm");
const coverageDistrict = document.getElementById("coverageDistrict");
const coverageAddress = document.getElementById("coverageAddress");
const coverageResult = document.getElementById("coverageResult");
const coverageMap = document.getElementById("coverageMap");


// Distritos que actualmente cuentan con cobertura.
// Puedes agregar o quitar distritos de esta lista.
const availableDistricts = [
    "Ancón",
    "Carabayllo",
    "Comas",
    "Independencia",
    "Los Olivos",
    "Puente Piedra",
    "San Martín de Porres",
    "Santa Rosa"
];


if (
    coverageForm &&
    coverageDistrict &&
    coverageAddress &&
    coverageResult &&
    coverageMap
) {
    coverageForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const district = coverageDistrict.value.trim();
        const address = coverageAddress.value.trim();

        if (!district || !address) {
            coverageResult.className =
                "coverage-result unavailable show";

            coverageResult.innerHTML = `
                <i class="fa-solid fa-circle-exclamation"></i>

                <div>
                    <strong>Completa la información</strong>
                    Ingresa tu distrito y dirección para verificar
                    la cobertura.
                </div>
            `;

            return;
        }


        // Actualizar Google Maps usando dirección y distrito
        const completeAddress =
            `${address}, ${district}, Lima, Perú`;

        coverageMap.src =
            `https://www.google.com/maps?q=${
                encodeURIComponent(completeAddress)
            }&output=embed`;


        // Comprobar si el distrito se encuentra disponible
        const hasCoverage =
            availableDistricts.includes(district);


        if (hasCoverage) {
            coverageResult.className =
                "coverage-result available show";

            coverageResult.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>

                <div>
                    <strong>
                        ¡Tenemos cobertura en ${district}!
                    </strong>

                    Tu distrito cuenta actualmente con cobertura
                    de Interconexión World. Déjanos tus datos para
                    confirmar la disponibilidad técnica en tu dirección.
                </div>
            `;
        } else {
            coverageResult.className =
                "coverage-result unavailable show";

            coverageResult.innerHTML = `
                <i class="fa-solid fa-person-digging"></i>

                <div>
                    <strong>
                        Aún no contamos con cobertura en ${district}
                    </strong>

                    Lamentablemente, nuestro servicio todavía no se
                    encuentra disponible en este distrito. Estamos
                    trabajando para ampliar nuestra red y llegar cada
                    vez más lejos.
                </div>
            `;
        }
    });
}

// ============================================================
// BOTÓN INICIO DEL FOOTER
// Lleva directamente a la parte más alta de la página.
// ============================================================

const footerHomeLink = document.getElementById("footerHomeLink");

if (footerHomeLink) {
    footerHomeLink.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    });
}