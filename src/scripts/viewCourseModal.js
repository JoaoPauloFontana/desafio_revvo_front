import { fetchCourseById, deleteCourse } from "./api.js";

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

        console.log(course)
        // Preenche os campos do formulário
        modalContainer.querySelector("#course-title").value = course.data.title;
        modalContainer.querySelector("#course-description").value = course.data.description;
        modalContainer.querySelector("#course-link").value = course.data.link;

        const bannerImagesContainer = modalContainer.querySelector(".banner-images");
        const indicatorsContainer = modalContainer.querySelector(".banner-indicators");
        bannerImagesContainer.innerHTML = "";
        indicatorsContainer.innerHTML = "";

        let currentIndex = 0;

        // Adiciona as imagens ao modal
        course.images.forEach((img, index) => {
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

        initViewCourseModal(modalContainer, courseId, course.images.length);
    } catch (error) {
        console.error("❌ Erro ao carregar curso:", error);
    }
}

function initViewCourseModal(modalContainer, courseId, totalImages) {
    const closeModalBtn = modalContainer.querySelector(".modal-close");
    const leftBtn = modalContainer.querySelector(".banner-btn.left");
    const rightBtn = modalContainer.querySelector(".banner-btn.right");
    const deleteBtn = modalContainer.querySelector("#delete-course");
    const indicators = modalContainer.querySelectorAll(".banner-indicators span");
    const images = modalContainer.querySelectorAll(".banner-images img");
    let currentIndex = 0;

    closeModalBtn.addEventListener("click", () => {
        modalContainer.remove();
    });

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

    modalContainer.classList.add("modal-show");

    deleteBtn.addEventListener("click", () => {
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
                        Swal.fire(
                            "Excluído!",
                            "O curso foi removido com sucesso.",
                            "success"
                        ).then(() => {
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
    });
}
