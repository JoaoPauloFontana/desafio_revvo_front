document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Página carregada com sucesso!");

    loadModal(() => {
        if (typeof modalInit === "function") modalInit();
        if (typeof closeModal === "function") closeModal();
    });

    const addCourseBtn = document.querySelector(".add-course");
    if (addCourseBtn) {
        addCourseBtn.addEventListener("click", () => {
            alert("Adicionar novo curso em breve!");
        });
    }

    const searchInput = document.querySelector("input[type='text']");
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            console.log("Pesquisando curso:", event.target.value);
        });
    }
});

function loadModal(callback) {
    fetch("components/modal.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            console.log("✅ Modal carregado com sucesso!");
            if (callback) callback();
        })
        .catch(error => console.error("❌ Erro ao carregar o modal:", error));
}