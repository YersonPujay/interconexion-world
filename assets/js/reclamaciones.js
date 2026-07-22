// ============================================================
// MENÚ RESPONSIVE
// ============================================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        menuToggle.innerHTML = open
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
// ELEMENTOS DEL FORMULARIO
// ============================================================

const claimsForm = document.getElementById("claimsForm");
const formSteps = Array.from(document.querySelectorAll(".form-step"));
const progressSteps = Array.from(document.querySelectorAll(".progress-step"));

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");

const documentType = document.getElementById("documentType");
const documentNumber = document.getElementById("documentNumber");
const documentHelp = document.getElementById("documentHelp");

const firstNames = document.getElementById("firstNames");
const lastNames = document.getElementById("lastNames");
const phone = document.getElementById("phone");
const claimAmount = document.getElementById("claimAmount");
const incidentDate = document.getElementById("incidentDate");
const attachment = document.getElementById("attachment");

const claimDetail = document.getElementById("claimDetail");
const requestedSolution = document.getElementById("requestedSolution");
const detailCount = document.getElementById("detailCount");
const solutionCount = document.getElementById("solutionCount");

const summaryCard = document.getElementById("summaryCard");
const privacyAccept = document.getElementById("privacyAccept");

const successModal = document.getElementById("successModal");
const trackingCode = document.getElementById("trackingCode");
const closeSuccess = document.getElementById("closeSuccess");

let currentStep = 1;


// No permitir fechas futuras.
if (incidentDate) {
    incidentDate.max = new Date().toISOString().split("T")[0];
}


// ============================================================
// FILTROS DE ESCRITURA
// ============================================================

// Nombres y apellidos: solo letras, espacios, tildes y guiones.
function filterNameInput(input) {
    input.value = input.value.replace(
        /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]/g,
        ""
    );
}

if (firstNames) {
    firstNames.addEventListener("input", () => filterNameInput(firstNames));
}

if (lastNames) {
    lastNames.addEventListener("input", () => filterNameInput(lastNames));
}


// Celular: solo números.
if (phone) {
    phone.addEventListener("input", () => {
        phone.value = phone.value.replace(/\D/g, "").slice(0, 9);
    });
}


// Documento: solo números.
if (documentNumber) {
    documentNumber.addEventListener("input", () => {
        documentNumber.value = documentNumber.value.replace(/\D/g, "");

        const type = documentType ? documentType.value : "";

        if (type === "dni") {
            documentNumber.value = documentNumber.value.slice(0, 8);
        }

        if (type === "ruc") {
            documentNumber.value = documentNumber.value.slice(0, 11);
        }

        if (type === "ce") {
            documentNumber.value = documentNumber.value.slice(0, 12);
        }
    });
}


// Monto: números y máximo dos decimales.
if (claimAmount) {
    claimAmount.addEventListener("input", () => {
        let value = claimAmount.value.replace(/[^0-9.]/g, "");

        const parts = value.split(".");

        if (parts.length > 2) {
            value = `${parts[0]}.${parts.slice(1).join("")}`;
        }

        if (value.includes(".")) {
            const [whole, decimals] = value.split(".");
            value = `${whole}.${decimals.slice(0, 2)}`;
        }

        claimAmount.value = value;
    });
}


// Cambiar longitud del documento según el tipo.
if (documentType && documentNumber && documentHelp) {
    documentType.addEventListener("change", () => {
        documentNumber.value = "";

        if (documentType.value === "dni") {
            documentNumber.maxLength = 8;
            documentNumber.placeholder = "8 dígitos";
            documentHelp.textContent = "El DNI debe tener exactamente 8 dígitos.";
        } else if (documentType.value === "ruc") {
            documentNumber.maxLength = 11;
            documentNumber.placeholder = "11 dígitos";
            documentHelp.textContent = "El RUC debe tener exactamente 11 dígitos.";
        } else if (documentType.value === "ce") {
            documentNumber.maxLength = 12;
            documentNumber.placeholder = "Hasta 12 dígitos";
            documentHelp.textContent = "Ingresa entre 9 y 12 dígitos.";
        } else {
            documentNumber.removeAttribute("maxlength");
            documentNumber.placeholder = "Ingresa tu documento";
            documentHelp.textContent = "Selecciona primero el tipo de documento.";
        }
    });
}


// Contadores.
if (claimDetail && detailCount) {
    claimDetail.addEventListener("input", () => {
        detailCount.textContent = claimDetail.value.length;
    });
}

if (requestedSolution && solutionCount) {
    requestedSolution.addEventListener("input", () => {
        solutionCount.textContent = requestedSolution.value.length;
    });
}


// ============================================================
// VALIDACIÓN
// ============================================================

function setError(field, message) {
    const group = field.closest(".field-group");

    if (!group) return;

    group.classList.add("invalid");

    const error = group.querySelector(".error-message");

    if (error) {
        error.textContent = message;
    }
}


function clearError(field) {
    const group = field.closest(".field-group");

    if (!group) return;

    group.classList.remove("invalid");

    const error = group.querySelector(".error-message");

    if (error) {
        error.textContent = "";
    }
}


function validateField(field) {
    clearError(field);

    const value = field.value.trim();

    if (field.required && !value) {
        setError(field, "Este campo es obligatorio.");
        return false;
    }

    if (!value && !field.required) {
        return true;
    }

    if (field.id === "firstNames" || field.id === "lastNames") {
        const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,60}$/;

        if (!namePattern.test(value)) {
            setError(field, "Ingresa únicamente letras.");
            return false;
        }
    }

    if (field.id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(value)) {
            setError(field, "Ingresa un correo electrónico válido.");
            return false;
        }
    }

    if (field.id === "phone") {
        if (!/^9\d{8}$/.test(value)) {
            setError(field, "El celular debe comenzar con 9 y tener 9 dígitos.");
            return false;
        }
    }

    if (field.id === "documentNumber") {
        const type = documentType ? documentType.value : "";

        if (type === "dni" && !/^\d{8}$/.test(value)) {
            setError(field, "El DNI debe tener exactamente 8 números.");
            return false;
        }

        if (type === "ruc" && !/^\d{11}$/.test(value)) {
            setError(field, "El RUC debe tener exactamente 11 números.");
            return false;
        }

        if (type === "ce" && !/^\d{9,12}$/.test(value)) {
            setError(field, "El carné debe tener entre 9 y 12 números.");
            return false;
        }
    }

    if (field.id === "incidentDate") {
        const selectedDate = new Date(`${value}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            setError(field, "La fecha no puede ser futura.");
            return false;
        }
    }

    if (field.id === "claimAmount") {
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setError(field, "Ingresa un monto válido, por ejemplo 99.90.");
            return false;
        }
    }

    if (field.id === "claimDetail" && value.length < 20) {
        setError(field, "Describe el caso con al menos 20 caracteres.");
        return false;
    }

    if (field.id === "requestedSolution" && value.length < 10) {
        setError(field, "Indica la solución con al menos 10 caracteres.");
        return false;
    }

    if (field.id === "address" && value.length < 5) {
        setError(field, "Ingresa una dirección válida.");
        return false;
    }

    if (field.id === "serviceDescription" && value.length < 3) {
        setError(field, "Describe el servicio contratado.");
        return false;
    }

    return true;
}


// Archivo máximo 5 MB.
function validateAttachment() {
    if (!attachment || !attachment.files.length) {
        return true;
    }

    clearError(attachment);

    const file = attachment.files[0];
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        setError(attachment, "El archivo debe ser PDF, JPG o PNG.");
        return false;
    }

    if (file.size > 5 * 1024 * 1024) {
        setError(attachment, "El archivo no debe superar los 5 MB.");
        return false;
    }

    return true;
}


function validateCurrentStep() {
    const currentSection = document.querySelector(
        `.form-step[data-step="${currentStep}"]`
    );

    if (!currentSection) return false;

    const fields = Array.from(
        currentSection.querySelectorAll(
            "input:not([type='checkbox']), select, textarea"
        )
    );

    let isValid = true;

    fields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (currentStep === 3 && !validateAttachment()) {
        isValid = false;
    }

    if (currentStep === 4 && privacyAccept && !privacyAccept.checked) {
        const privacyError = document.querySelector(".privacy-error");

        if (privacyError) {
            privacyError.textContent =
                "Debes aceptar la declaración para enviar la solicitud.";
        }

        isValid = false;
    }

    return isValid;
}


// Limpiar error mientras se corrige.
document.querySelectorAll(
    ".field-group input, .field-group select, .field-group textarea"
).forEach((field) => {
    field.addEventListener("input", () => clearError(field));
    field.addEventListener("change", () => clearError(field));
});

if (privacyAccept) {
    privacyAccept.addEventListener("change", () => {
        const privacyError = document.querySelector(".privacy-error");

        if (privacyError) {
            privacyError.textContent = "";
        }
    });
}


// ============================================================
// CAMBIO DE PASOS
// ============================================================

function showStep(step) {
    currentStep = step;

    formSteps.forEach((section) => {
        section.classList.toggle(
            "active",
            Number(section.dataset.step) === step
        );
    });

    progressSteps.forEach((button) => {
        const stepNumber = Number(button.dataset.step);

        button.classList.toggle("active", stepNumber === step);
        button.classList.toggle("completed", stepNumber < step);
    });

    previousButton.hidden = step === 1;
    nextButton.hidden = step === 4;
    submitButton.hidden = step !== 4;

    if (step === 4) {
        buildSummary();
    }

    window.scrollTo({
        top: document.querySelector(".claims-section").offsetTop - 75,
        behavior: "smooth"
    });
}


if (nextButton) {
    nextButton.addEventListener("click", () => {
        if (!validateCurrentStep()) return;

        if (currentStep < 4) {
            showStep(currentStep + 1);
        }
    });
}


if (previousButton) {
    previousButton.addEventListener("click", () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
}


// ============================================================
// RESUMEN
// ============================================================

function getFieldLabel(fieldId) {
    const field = document.getElementById(fieldId);

    if (!field) return "";

    if (field.tagName === "SELECT") {
        return field.options[field.selectedIndex]?.text || "";
    }

    return field.value.trim();
}


function buildSummary() {
    if (!summaryCard) return;

    const summaryItems = [
        ["Nombre", `${getFieldLabel("firstNames")} ${getFieldLabel("lastNames")}`],
        ["Documento", getFieldLabel("documentNumber")],
        ["Correo", getFieldLabel("email")],
        ["Celular", getFieldLabel("phone")],
        ["Distrito", getFieldLabel("district")],
        ["Tipo de solicitud", getFieldLabel("requestType")],
        ["Área relacionada", getFieldLabel("issueArea")],
        ["Servicio", getFieldLabel("serviceDescription")],
        ["Detalle", getFieldLabel("claimDetail")],
        ["Solución solicitada", getFieldLabel("requestedSolution")]
    ];

    summaryCard.innerHTML = `
        <div class="summary-grid">
            ${summaryItems.map(([label, value]) => `
                <div class="summary-item">
                    <small>${label}</small>
                    <strong>${value || "No especificado"}</strong>
                </div>
            `).join("")}
        </div>
    `;
}


// ============================================================
// ENVÍO DEMOSTRATIVO
// ============================================================

function generateTrackingCode() {
    const year = new Date().getFullYear();
    const number = Math.floor(100000 + Math.random() * 900000);

    return `IW-${year}-${number}`;
}


if (claimsForm) {
    claimsForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateCurrentStep()) return;

        const code = generateTrackingCode();

        if (trackingCode) {
            trackingCode.textContent = code;
        }

        if (successModal) {
            successModal.classList.add("open");
            successModal.setAttribute("aria-hidden", "false");
        }
    });
}


if (closeSuccess) {
    closeSuccess.addEventListener("click", () => {
        if (successModal) {
            successModal.classList.remove("open");
            successModal.setAttribute("aria-hidden", "true");
        }

        claimsForm.reset();

        if (detailCount) detailCount.textContent = "0";
        if (solutionCount) solutionCount.textContent = "0";

        showStep(1);
    });
}
