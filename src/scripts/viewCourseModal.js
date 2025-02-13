import { fetchCourseById, deleteCourse, updateCourse } from "./api.js";

export function setupViewCourseModal(courseId) {
    const existingModal = document.getElementById("view-course-modal");
    if (existingModal) {
        existingModal.remove();
    }

    fetch("components/viewCourseModal.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            loadCourseDetails(courseId);
        })
        .catch(error => console.error("❌ Erro ao carregar o modal:", error));
}

async function loadCourseDetails(courseId) {
    try {
        const course = await fetchCourseById(courseId);
        if (!course) {
            Swal.fire("Erro!", "Erro ao carregar curso!", "error");
            return;
        }

        const modalContainer = document.getElementById("view-course-modal");

        modalContainer.querySelector("#course-title").value = course.data.title;
        modalContainer.querySelector("#course-description").value = course.data.description;
        modalContainer.querySelector("#course-link").value = course.data.link;

        setupBannerImages(modalContainer, course.images);
        initModalActions(modalContainer, courseId);
    } catch (error) {
        console.error("❌ Erro ao carregar curso:", error);
    }
}

function setupBannerImages(modalContainer, images) {
    const bannerImagesContainer = modalContainer.querySelector(".banner-images");
    const indicatorsContainer = modalContainer.querySelector(".banner-indicators");
    bannerImagesContainer.innerHTML = "";
    indicatorsContainer.innerHTML = "";

    images.forEach((img, index) => {
        const imgElement = document.createElement("img");
        imgElement.src = img;
        imgElement.alt = `Imagem ${index + 1}`;
        if (index === 0) imgElement.classList.add("active");
        bannerImagesContainer.appendChild(imgElement);

        const indicator = document.createElement("span");
        indicator.dataset.index = index;
        if (index === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
    });

    setupImageNavigation(modalContainer, images.length);
}

function setupImageNavigation(modalContainer, totalImages) {
    const leftBtn = modalContainer.querySelector(".banner-btn.left");
    const rightBtn = modalContainer.querySelector(".banner-btn.right");
    const indicators = modalContainer.querySelectorAll(".banner-indicators span");
    const images = modalContainer.querySelectorAll(".banner-images img");
    let currentIndex = 0;

    function updateImage(index) {
        images.forEach(img => img.classList.remove("active"));
        indicators.forEach(dot => dot.classList.remove("active"));
        images[index].classList.add("active");
        indicators[index].classList.add("active");
    }

    leftBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === 0) ? totalImages - 1 : currentIndex - 1;
        updateImage(currentIndex);
    });

    rightBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateImage(currentIndex);
    });

    indicators.forEach(indicator => {
        indicator.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            updateImage(currentIndex);
        });
    });
}

function initModalActions(modalContainer, courseId) {
    modalContainer.classList.add("modal-show");

    modalContainer.querySelector(".modal-close").addEventListener("click", () => {
        modalContainer.remove();
    });

    modalContainer.querySelector("#edit-course").addEventListener("click", () => {
        handleEditCourse(modalContainer, courseId);
    });

    modalContainer.querySelector("#delete-course").addEventListener("click", () => {
        handleDeleteCourse(modalContainer, courseId);
    });
}

async function handleEditCourse(modalContainer, courseId) {
    Swal.fire({
        title: "Tem certeza?",
        text: "As informações do curso serão atualizadas!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, atualizar!",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const title = modalContainer.querySelector("#course-title").value.trim();
            const description = modalContainer.querySelector("#course-description").value.trim();
            const link = modalContainer.querySelector("#course-link").value.trim();
            const files = modalContainer.querySelector("#course-image").files;

            if (!title || !description || !link) {
                Swal.fire("Erro!", "Preencha todos os campos obrigatórios.", "error");
                return;
            }

            const imagePromises = Array.from(files).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            });

            const base64Images = await Promise.all(imagePromises);

            const updatedCourse = {
                title,
                description,
                link,
                images: base64Images.length > 0 ? base64Images : undefined
            };

            try {
                const response = await updateCourse(courseId, updatedCourse);
                if (response.success) {
                    Swal.fire("Excluído!", "O curso foi atualizado com sucesso.", "success").then(() => {
                        modalContainer.remove();
                        window.location.reload();
                    });
                } else {
                    Swal.fire("Erro!", response.message || "Erro ao atualizar curso.", "error");
                }
            } catch (error) {
                Swal.fire("Erro!", "Erro ao conectar com o servidor.", "error");
            }
        }
    });
}

async function handleDeleteCourse(modalContainer, courseId) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Essa ação não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await deleteCourse(courseId);
                if (response.success) {
                    Swal.fire("Excluído!", "O curso foi removido com sucesso.", "success").then(() => {
                        modalContainer.remove();
                        window.location.reload();
                    });
                } else {
                    Swal.fire("Erro!", response.message || "Erro ao excluir curso.", "error");
                }
            } catch (error) {
                Swal.fire("Erro!", "Não foi possível remover o curso.", "error");
            }
        }
    });
}
