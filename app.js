const CONFIG_URL = "config.json";

const check = document.getElementById("check");
const btn = document.getElementById("btn");

check.addEventListener("change", () => {
    btn.disabled = !check.checked;
});

btn.addEventListener("click", () => {

    localStorage.setItem("accepted", Date.now());

    // 🔥 Avisar a la extensión
    window.postMessage({ type: "ACCEPTED" }, "*");

    window.location.href = "https://www.google.com";
});

// Cargar contenido dinámico
fetch(CONFIG_URL)
.then(res => res.json())
.then(data => {

    document.getElementById("texto").innerHTML = data.warning;
    document.getElementById("noticias").innerHTML = data.news;

    controlarVersion(data.version);
    controlarExpiracion(data.expiration_hours);

});

// 🔁 Forzar re-aceptación si cambian normas
function controlarVersion(version) {
    if (localStorage.getItem("version") != version) {
        localStorage.removeItem("accepted");
        localStorage.setItem("version", version);
    }
}

// ⏱️ Expiración
function controlarExpiracion(horas) {
    const accepted = localStorage.getItem("accepted");

    if (!accepted) return;

    const diff = (Date.now() - accepted) / (1000 * 60 * 60);

    if (diff > horas) {
        localStorage.removeItem("accepted");
    }
}