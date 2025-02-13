document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const images = document.querySelectorAll(".banner-images img");
    const indicatorsContainer = document.querySelector(".banner-indicators");
    const leftBtn = document.querySelector(".banner-btn.left");
    const rightBtn = document.querySelector(".banner-btn.right");
    const titleElement = document.querySelector(".banner-title");
    const descElement = document.querySelector(".banner-description");

    if (!images.length || !indicatorsContainer || !leftBtn || !rightBtn) {
        console.warn("⚠️ Elementos do banner não encontrados. Verifique o HTML.");
        return;
    }

    images.forEach((_, index) => {
        const indicator = document.createElement("span");
        indicator.dataset.index = index;
        if (index === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll(".banner-indicators span");

    function updateBanner(index) {
        images.forEach(img => img.classList.remove("active"));
        indicators.forEach(dot => dot.classList.remove("active"));

        images[index].classList.add("active");
        indicators[index].classList.add("active");

        titleElement.textContent = images[index].dataset.title;
        descElement.textContent = images[index].dataset.description;

        currentIndex = index;
    }

    leftBtn.addEventListener("click", () => {
        let newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateBanner(newIndex);
    });

    rightBtn.addEventListener("click", () => {
        let newIndex = (currentIndex + 1) % images.length;
        updateBanner(newIndex);
    });

    indicators.forEach(indicator => {
        indicator.addEventListener("click", (e) => {
            let newIndex = parseInt(e.target.dataset.index);
            updateBanner(newIndex);
        });
    });

    updateBanner(currentIndex);
});
