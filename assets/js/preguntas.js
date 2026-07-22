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


// ============================================================
// PREGUNTAS DESPLEGABLES
// ============================================================

const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const faqQuestions = Array.from(
    document.querySelectorAll(".faq-question")
);

function closeFaqItem(item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    item.classList.remove("open");
    button?.setAttribute("aria-expanded", "false");

    if (answer) {
        answer.style.maxHeight = "0px";
    }
}

function openFaqItem(item) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    item.classList.add("open");
    button?.setAttribute("aria-expanded", "true");

    if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
}

faqQuestions.forEach((button) => {
    button.addEventListener("click", () => {
        const currentItem = button.closest(".faq-item");
        if (!currentItem) return;

        const wasOpen = currentItem.classList.contains("open");

        faqItems.forEach(closeFaqItem);

        if (!wasOpen) {
            openFaqItem(currentItem);
        }
    });
});


// ============================================================
// FILTRO Y BUSCADOR
// ============================================================

const categoryButtons = Array.from(
    document.querySelectorAll(".faq-category")
);
const faqSearch = document.getElementById("faqSearch");
const clearSearch = document.getElementById("clearSearch");
const noResults = document.getElementById("noResults");

let activeCategory = "all";

function normalizeText(text) {
    return text
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function filterQuestions() {
    const searchValue = faqSearch
        ? normalizeText(faqSearch.value.trim())
        : "";

    let visibleCount = 0;

    faqItems.forEach((item) => {
        const itemCategory = item.dataset.category ?? "";
        const itemText = normalizeText(item.textContent ?? "");

        const matchesCategory =
            activeCategory === "all" ||
            itemCategory === activeCategory;

        const matchesSearch =
            searchValue === "" ||
            itemText.includes(searchValue);

        const shouldShow = matchesCategory && matchesSearch;

        item.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount += 1;
        } else {
            closeFaqItem(item);
        }
    });

    if (noResults) {
        noResults.hidden = visibleCount > 0;
    }

    if (clearSearch && faqSearch) {
        clearSearch.hidden = faqSearch.value.length === 0;
    }
}

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category ?? "all";

        categoryButtons.forEach((item) => {
            const isActive = item === button;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", String(isActive));
        });

        filterQuestions();
    });
});

faqSearch?.addEventListener("input", filterQuestions);

clearSearch?.addEventListener("click", () => {
    if (!faqSearch) return;

    faqSearch.value = "";
    faqSearch.focus();
    filterQuestions();
});

window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
        if (!item.classList.contains("open")) return;

        const answer = item.querySelector(".faq-answer");

        if (answer) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});

filterQuestions();
