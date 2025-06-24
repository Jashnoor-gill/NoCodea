// Modernized section registry for the builder

class SectionsRegistry {
    constructor() {
        this._sections = {};
    }

    add(type, data) {
        data.type = type;
        this._sections[type] = data;
    }

    get(type) {
        return this._sections[type];
    }
}

const Sections = new SectionsRegistry();
export default Sections; 