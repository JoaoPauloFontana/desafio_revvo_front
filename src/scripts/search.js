export function setupSearch() {
    const searchInput = document.querySelector(".search-input");
    const courseListContainer = document.querySelector(".course-list");

    if (!searchInput || !courseListContainer) {
        console.error("Elementos de busca ou lista de cursos não encontrados.");
        return;
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const courses = document.querySelectorAll(".course:not(.add-course)");

        courses.forEach(course => {
            const title = course.querySelector("h3").textContent.toLowerCase();
            course.style.display = title.includes(query) ? "flex" : "none";
        });

        const hasResults = [...courses].some(course => course.style.display === "flex");
        const addCourseBtn = document.querySelector(".add-course");

        if (addCourseBtn) {
            addCourseBtn.style.display = hasResults || query === "" ? "flex" : "none";
        }
    });
}
