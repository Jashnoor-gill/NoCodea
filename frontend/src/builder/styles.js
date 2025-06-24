// Modernized styles registry for the builder

class StylesRegistry {
    constructor() {
        this._styles = {};
    }

    add(type, data) {
        data.type = type;
        this._styles[type] = data;
    }

    get(type) {
        return this._styles[type];
    }
}

const Styles = new StylesRegistry();
export default Styles; 