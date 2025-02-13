const API_BASE_URL = "http://localhost:8080";

async function fetchCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Erro ao buscar cursos.");
        }

        return result.data;
    } catch (error) {
        console.error("❌ Erro ao carregar cursos:", error);
        return [];
    }
}

export { fetchCourses };
