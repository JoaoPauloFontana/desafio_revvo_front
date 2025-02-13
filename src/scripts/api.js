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

async function createCourse(courseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(courseData)
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("❌ Erro ao conectar com a API:", error);
        return { success: false, message: "Erro ao conectar com o servidor." };
    }
}

export { fetchCourses, createCourse };
