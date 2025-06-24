function replacePlaceholders(obj, replacements) {
    if (typeof obj === 'string') {
        return obj.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            return replacements[key.trim()] !== undefined ? replacements[key.trim()] : match;
        });
    } else if (Array.isArray(obj)) {
        return obj.map(item => replacePlaceholders(item, replacements));
    } else if (typeof obj === 'object' && obj !== null) {
        const result = {};
        for (const key in obj) {
            result[key] = replacePlaceholders(obj[key], replacements);
        }
        return result;
    }
    return obj;
}

module.exports = replacePlaceholders; 