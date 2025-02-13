import { fetchCourses } from "./api.js";
import { setupSearch } from "./search.js";
import { setupCourseModal } from "./courseModal.js";
import { setupViewCourseModal } from "./viewCourseModal.js";
import { state } from "./state.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Página carregada com sucesso!");

    const courseListContainer = document.querySelector(".course-list");

    try {
        const courses = await fetchCourses();
        state.setCourses(courses);
        setupSearch();
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        state.setCourses([]);
        setupSearch();
    }

    function renderCourses() {
        courseListContainer.innerHTML = "";

        const today = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);

        state.courses.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.classList.add("course");

            const createdAt = new Date(course.created_at);
            const isNew = createdAt >= threeDaysAgo;

            courseCard.innerHTML = `
                <div class="course-image-container">
                    <img src="${course.first_image}" alt="${course.title}">
                    ${isNew ? '<div class="new-course-ribbon">NOVO</div>' : ""}
                </div>
                <img src="${course.first_image}" alt="${course.title}">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <button class="view-course-btn" data-id="${course.id}">VER CURSO</button>
            `;

            courseListContainer.appendChild(courseCard);
        });

        const addCourseBtn = document.createElement("div");
        addCourseBtn.classList.add("course", "add-course");
        addCourseBtn.innerHTML = `<span>+</span><p>ADICIONAR CURSO</p>`;
        addCourseBtn.addEventListener("click", setupCourseModal);
        courseListContainer.appendChild(addCourseBtn);

        document.querySelectorAll(".view-course-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const courseId = event.target.dataset.id;
                console.log(courseId);
                setupViewCourseModal(courseId);
            });
        });
    }

    renderCourses();
    document.addEventListener("stateUpdated", renderCourses);

    loadModal(() => {
        if (typeof modalInit === "function") modalInit();
        if (typeof closeModal === "function") closeModal();
    });

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
