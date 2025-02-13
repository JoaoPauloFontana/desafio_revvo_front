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

            const courseLink = normalizeLink(course.link);

            courseCard.innerHTML = `
                <div class="course-image-container">
                    <img src="${course.first_image}" alt="${course.title}">
                    ${isNew ? '<div class="new-course-ribbon">NOVO</div>' : ""}
                </div>
                <h3 class="course-title">
                    <a href="${courseLink}" target="_blank" class="course-link">
                        ${course.title}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="external-icon">
                            <path fill="currentColor" d="M14 3h7v7h-2V5.41L9.41 15 8 13.59 17.59 4H14V3ZM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7H5V5Z"/>
                        </svg>
                    </a>
                </h3>
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

function normalizeLink(link) {
    if (!link.startsWith("http://") && !link.startsWith("https://")) {
        return "https://" + link;
    }
    return link;
}

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
