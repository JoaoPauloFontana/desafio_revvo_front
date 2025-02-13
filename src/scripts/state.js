const state = {
    courses: [],
    setCourses(newCourses) {
        this.courses = newCourses;
        document.dispatchEvent(new CustomEvent("stateUpdated"));
    }
};

export { state };
