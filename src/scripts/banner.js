import { fetchCourses } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const bannerImagesContainer = document.querySelector(".banner-images");
    const indicatorsContainer = document.querySelector(".banner-indicators");
    const titleElement = document.querySelector(".banner-title");
    const descElement = document.querySelector(".banner-description");
    const courseButton = document.querySelector(".banner-btn-view");
    const leftBtn = document.querySelector(".banner-btn.left");
    const rightBtn = document.querySelector(".banner-btn.right");

    let currentIndex = 0;
    let courses = [];

    try {
        courses = await fetchCourses();
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
    }

    function renderBanner() {
        bannerImagesContainer.innerHTML = "";
        indicatorsContainer.innerHTML = "";

        if (courses.length === 0) {
            const defaultImage = document.createElement("img");
            defaultImage.src = "https://via.placeholder.com/1200x500?text=Nenhum+Curso+Disponível";
            defaultImage.alt = "Nenhum curso disponível";
            defaultImage.classList.add("active");

            bannerImagesContainer.appendChild(defaultImage);
            titleElement.textContent = "Nenhum curso disponível";
            descElement.textContent = "Volte mais tarde para conferir novos cursos.";
            courseButton.style.display = "none";
            return;
        }

        courses.forEach((course, index) => {
            const img = document.createElement("img");

            img.src = course.first_image;
            img.alt = course.title;
            img.dataset.title = course.title;
            img.dataset.description = course.description;
            img.dataset.link = course.link;

            if (index === 0) img.classList.add("active");
            bannerImagesContainer.appendChild(img);

            const indicator = document.createElement("span");
            indicator.dataset.index = index;
            if (index === 0) indicator.classList.add("active");
            indicatorsContainer.appendChild(indicator);
        });

        updateBanner(currentIndex);
    }

    function updateBanner(index) {
        const images = document.querySelectorAll(".banner-images img");
        const indicators = document.querySelectorAll(".banner-indicators span");

        images.forEach(img => img.classList.remove("active"));
        indicators.forEach(dot => dot.classList.remove("active"));

        images[index].classList.add("active");
        indicators[index].classList.add("active");

        titleElement.textContent = images[index].dataset.title;
        descElement.textContent = images[index].dataset.description;
        courseButton.href = images[index].dataset.link;
        courseButton.style.display = "inline-block";

        currentIndex = index;
    }

    leftBtn.addEventListener("click", () => {
        if (courses.length === 0) return;
        currentIndex = (currentIndex === 0) ? courses.length - 1 : currentIndex - 1;
        updateBanner(currentIndex);
    });

    rightBtn.addEventListener("click", () => {
        if (courses.length === 0) return;
        currentIndex = (currentIndex + 1) % courses.length;
        updateBanner(currentIndex);
    });

    indicatorsContainer.addEventListener("click", (e) => {
        if (e.target.dataset.index !== undefined) {
            updateBanner(parseInt(e.target.dataset.index));
        }
    });

    renderBanner();
});
