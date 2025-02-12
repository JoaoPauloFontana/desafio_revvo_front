document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Página carregada com sucesso!");

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