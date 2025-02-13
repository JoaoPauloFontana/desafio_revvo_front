import { createCourse } from "./api.js";
import { state } from "./state.js";

export function setupCourseModal() {
    if (document.getElementById("course-modal")) {
        document.getElementById("course-modal").classList.add("modal-show");
        return;
    }

    fetch("components/courseModal.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            initCourseModal();
        })
        .catch(error => console.error("❌ Erro ao carregar o modal:", error));
}

function initCourseModal() {
    const modalContainer = document.getElementById("course-modal");
    const closeModalBtn = modalContainer.querySelector(".modal-close");
    const fileInput = document.getElementById("course-image");
    const previewContainer = document.getElementById("preview-images");

    closeModalBtn.addEventListener("click", () => {
        modalContainer.classList.remove("modal-show");
    });

    fileInput.addEventListener("change", (event) => {
        previewContainer.innerHTML = "";

        const files = event.target.files;
        if (files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("preview-img");
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    document.getElementById("save-course").addEventListener("click", async () => {
        const title = document.getElementById("course-title").value.trim();
        const description = document.getElementById("course-description").value.trim();
        const link = document.getElementById("course-link").value.trim();
        const files = fileInput.files;

        if (!title || !description || !link || files.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos!",
                text: "Preencha todos os campos e envie pelo menos uma imagem!",
                confirmButtonColor: "#007bff",
            });
            return;
        }

        const imagePromises = Array.from(files).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(async base64Images => {
            const newCourse = {
                title,
                description,
                link,
                images: base64Images
            };

            console.log("Enviando curso para API:", newCourse);

            try {
                const response = await createCourse(newCourse);

                console.log(response);
                if (response?.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Curso criado com sucesso!",
                        text: "Seu curso foi adicionado à lista.",
                        confirmButtonColor: "#007bff",
                    });

                    const newCourseWithId = {
                        id: response.id,
                        title,
                        description,
                        link,
                        first_image: base64Images[0]
                    };

                    state.setCourses([...state.courses, newCourseWithId]);

                    modalContainer.classList.remove("modal-show");
                } else {
                    if (response?.errors) {
                        const errorMessages = Object.values(response.errors)
                            .flat()
                            .join("\n");

                        Swal.fire({
                            icon: "error",
                            title: "Erro de validação",
                            text: errorMessages,
                            confirmButtonColor: "#d33",
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Erro ao criar curso",
                            text: response.message || "Tente novamente.",
                            confirmButtonColor: "#d33",
                        });
                    }
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Erro ao conectar com o servidor",
                    text: "Tente novamente mais tarde.",
                    confirmButtonColor: "#d33",
                });
            }
        });
    });
}
