export function isValidURL(url) {
    const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    return pattern.test(url);
}
