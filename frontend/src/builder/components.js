// Modernized component registry for the builder

class ComponentsRegistry {
    constructor() {
        this._components = {};
        this._nodesLookup = {};
        this._attributesLookup = {};
        this._classesLookup = {};
        this._classesRegexLookup = {};
    }

    add(type, data) {
        data.type = type;
        this._components[type] = data;
        if (data.nodes) {
            for (let node of data.nodes) {
                this._nodesLookup[node] = data;
            }
        }
        if (data.attributes) {
            if (Array.isArray(data.attributes)) {
                for (let attr of data.attributes) {
                    this._attributesLookup[attr] = data;
                }
            } else {
                for (let key in data.attributes) {
                    if (!this._attributesLookup[key]) this._attributesLookup[key] = {};
                    this._attributesLookup[key][data.attributes[key]] = data;
                }
            }
        }
        if (data.classes) {
            for (let cls of data.classes) {
                this._classesLookup[cls] = data;
            }
        }
        if (data.classesRegex) {
            for (let regex of data.classesRegex) {
                this._classesRegexLookup[regex] = data;
            }
        }
    }

    get(type) {
        return this._components[type];
    }

    getAll() {
        return Object.values(this._components);
    }

    matchNode(node) {
        if (!node || !node.tagName) return false;
        // Attribute lookup
        if (node.attributes && node.attributes.length) {
            for (let attrObj of node.attributes) {
                const attr = attrObj.name;
                const value = attrObj.value;
                if (attr in this._attributesLookup) {
                    const component = this._attributesLookup[attr];
                    if (typeof component.name === 'undefined') {
                        if (value in component) {
                            return component[value];
                        }
                    } else {
                        return component;
                    }
                }
            }
            for (let attrObj of node.attributes) {
                const attr = attrObj.name;
                const value = attrObj.value;
                if (attr === 'class') {
                    const classes = value.split(' ');
                    for (let cls of classes) {
                        if (cls in this._classesLookup) return this._classesLookup[cls];
                    }
                    for (let regex in this._classesRegexLookup) {
                        const regexObj = new RegExp(regex);
                        if (regexObj.exec(value)) {
                            return this._classesRegexLookup[regex];
                        }
                    }
                }
            }
        }
        const tagName = node.tagName.toLowerCase();
        if (tagName in this._nodesLookup) return this._nodesLookup[tagName];
        return false;
    }

    extend(inheritType, type, data) {
        let newData = data;
        const inheritData = this._components[inheritType];
        if (inheritData) {
            newData = { ...inheritData, ...data };
            newData.properties = (data.properties ? data.properties : []).concat(inheritData.properties ? inheritData.properties : []);
            // Optionally deduplicate and sort properties here
        }
        this.add(type, newData);
    }
}

const Components = new ComponentsRegistry();

// Example demo components for sidebar
Components.add('text', {
    name: 'Text',
    html: (props) => `<div class="p-4 text-gray-700">${props.text || 'Sample Text'}</div>`,
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: 'Sample Text' },
    ],
});
Components.add('button', {
    name: 'Button',
    html: (props) => `<button class="px-4 py-2 bg-blue-500 text-white rounded">${props.label || 'Click Me'}</button>`,
    properties: [
        { label: 'Label', key: 'label', type: 'text', default: 'Click Me' },
    ],
});
Components.add('image', {
    name: 'Image',
    html: (props) => `<img src="${props.src || 'https://placehold.co/100x100'}" alt="Demo" class="rounded" />`,
    properties: [
        { label: 'Image URL', key: 'src', type: 'text', default: 'https://placehold.co/100x100' },
    ],
});
// Heading component
Components.add('heading', {
    name: 'Heading',
    html: (props) => {
        const level = props.level || 'h2';
        const safeLevel = ['h1','h2','h3','h4','h5','h6'].includes(level) ? level : 'h2';
        return `<${safeLevel} class="font-bold text-xl my-2">${props.text || 'Heading'}</${safeLevel}>`;
    },
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: 'Heading' },
        { label: 'Level', key: 'level', type: 'select', default: 'h2', options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' },
        ] },
    ],
});
// Divider component
Components.add('divider', {
    name: 'Divider',
    html: (props) => `<hr style="border-color: ${props.color || '#e5e7eb'}; margin: 1.5rem 0;" />`,
    properties: [
        { label: 'Color', key: 'color', type: 'color', default: '#e5e7eb' },
    ],
});
// Paragraph component
Components.add('paragraph', {
    name: 'Paragraph',
    html: (props) => `<p class="p-2 text-gray-600">${props.text || 'Lorem ipsum dolor sit amet.'}</p>`,
    properties: [
        { label: 'Text', key: 'text', type: 'textarea', default: 'Lorem ipsum dolor sit amet.' },
    ],
});

// --- Bootstrap 5 Components ---

// Container
Components.add('bs-container', {
    name: 'Container',
    html: (props) =>
        `<div class="${props.type || 'container'}" style="min-height:150px;${props['background-color'] ? `background-color:${props['background-color']};` : ''}${props.color ? `color:${props.color};` : ''}"><div class="m-5">Container</div></div>`,
    properties: [
        {
            label: 'Type',
            key: 'type',
            type: 'select',
            default: 'container',
            options: [
                { value: 'container', label: 'Default' },
                { value: 'container-fluid', label: 'Fluid' }
            ]
        },
        {
            label: 'Background Color',
            key: 'background-color',
            type: 'color',
            default: ''
        },
        {
            label: 'Text Color',
            key: 'color',
            type: 'color',
            default: ''
        }
    ]
});

// Button
Components.add('bs-button', {
    name: 'Button',
    html: (props) => `<a class="btn ${props.background || 'btn-primary'} ${props.size || ''} ${props.disabled ? 'disabled' : ''}" ${props.autofocus ? 'autofocus' : ''}>${props.label || 'Primary'}</a>`,
    properties: [
        {
            label: 'Label', key: 'label', type: 'text', default: 'Primary'
        },
        {
            label: 'Background', key: 'background', type: 'select', default: 'btn-primary', options: [
                { value: 'btn-default', label: 'Default' },
                { value: 'btn-primary', label: 'Primary' },
                { value: 'btn-info', label: 'Info' },
                { value: 'btn-success', label: 'Success' },
                { value: 'btn-warning', label: 'Warning' },
                { value: 'btn-light', label: 'Light' },
                { value: 'btn-dark', label: 'Dark' },
                { value: 'btn-outline-primary', label: 'Primary outline' },
                { value: 'btn-outline-info', label: 'Info outline' },
                { value: 'btn-outline-success', label: 'Success outline' },
                { value: 'btn-outline-warning', label: 'Warning outline' },
                { value: 'btn-outline-light', label: 'Light outline' },
                { value: 'btn-outline-dark', label: 'Dark outline' },
                { value: 'btn-link', label: 'Link' }
            ]
        },
        {
            label: 'Size', key: 'size', type: 'select', default: '', options: [
                { value: '', label: 'Default' },
                { value: 'btn-lg', label: 'Large' },
                { value: 'btn-sm', label: 'Small' }
            ]
        },
        {
            label: 'Autofocus', key: 'autofocus', type: 'toggle', default: false
        },
        {
            label: 'Disabled', key: 'disabled', type: 'toggle', default: false
        }
    ]
});

// Button Group
Components.add('bs-buttongroup', {
    name: 'Button Group',
    html: (props) => `<div class="btn-group ${props.size || ''} ${props.alignment || ''}" role="group" aria-label="Basic example"><button type="button" class="btn btn-secondary">Left</button><button type="button" class="btn btn-secondary">Middle</button> <button type="button" class="btn btn-secondary">Right</button></div>`,
    properties: [
        {
            label: 'Size', key: 'size', type: 'select', default: '', options: [
                { value: '', label: 'Default' },
                { value: 'btn-group-lg', label: 'Large' },
                { value: 'btn-group-sm', label: 'Small' }
            ]
        },
        {
            label: 'Alignment', key: 'alignment', type: 'select', default: '', options: [
                { value: '', label: 'Default' },
                { value: 'btn-group', label: 'Horizontal' },
                { value: 'btn-group-vertical', label: 'Vertical' }
            ]
        }
    ]
});

// Alert
Components.add('bs-alert', {
    name: 'Alert',
    html: (props) => `<div class="alert ${props.type || 'alert-warning'} alert-dismissible fade show" role="alert"><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button><strong>Holy guacamole!</strong> ${props.text || 'You should check in on some of those fields below.'}</div>`,
    properties: [
        {
            label: 'Type', key: 'type', type: 'select', default: 'alert-warning', options: [
                { value: 'alert-primary', label: 'Primary' },
                { value: 'alert-secondary', label: 'Secondary' },
                { value: 'alert-success', label: 'Success' },
                { value: 'alert-danger', label: 'Danger' },
                { value: 'alert-warning', label: 'Warning' },
                { value: 'alert-info', label: 'Info' },
                { value: 'alert-light', label: 'Light' },
                { value: 'alert-dark', label: 'Dark' }
            ]
        },
        {
            label: 'Text', key: 'text', type: 'text', default: 'You should check in on some of those fields below.'
        }
    ]
});

// Card
Components.add('bs-card', {
    name: 'Card',
    html: (props) => `<div class="card"><img class="card-img-top bg-body-secondary" src="https://placehold.co/300x100" alt="Card image cap"><div class="card-body"><h4 class="card-title">${props.title || 'Card title'}</h4><p class="card-text">${props.text || 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'}</p><a href="#" class="btn btn-primary">${props.button || 'Go somewhere'}</a></div></div>`,
    properties: [
        { label: 'Title', key: 'title', type: 'text', default: 'Card title' },
        { label: 'Text', key: 'text', type: 'textarea', default: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.' },
        { label: 'Button Label', key: 'button', type: 'text', default: 'Go somewhere' }
    ]
});

// List Group
Components.add('bs-listgroup', {
    name: 'List Group',
    html: (props) => `<ul class="list-group"><li class="list-group-item"><span class="badge bg-success">14</span> Cras justo odio</li><li class="list-group-item"><span class="badge bg-primary">2</span> Dapibus ac facilisis in</li><li class="list-group-item"><span class="badge bg-danger">1</span> Morbi leo risus</li></ul>`,
    properties: [
        { label: 'Flush', key: 'flush', type: 'toggle', default: false },
        { label: 'Numbered', key: 'numbered', type: 'toggle', default: false },
        { label: 'Horizontal', key: 'horizontal', type: 'toggle', default: false }
    ]
});

// Badge
Components.add('bs-badge', {
    name: 'Badge',
    html: (props) => `<span class="badge ${props.color || 'bg-primary'}">${props.text || 'Primary badge'}</span>`,
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: 'Primary badge' },
        { label: 'Color', key: 'color', type: 'select', default: 'bg-primary', options: [
            { value: 'bg-primary', label: 'Primary' },
            { value: 'bg-secondary', label: 'Secondary' },
            { value: 'bg-success', label: 'Success' },
            { value: 'bg-danger', label: 'Danger' },
            { value: 'bg-warning', label: 'Warning' },
            { value: 'bg-info', label: 'Info' },
            { value: 'bg-body-secondary', label: 'Light' },
            { value: 'bg-dark', label: 'Dark' }
        ] }
    ]
});

// Progress
Components.add('bs-progress', {
    name: 'Progress Bar',
    html: (props) => `<div class="progress"><div class="progress-bar ${props.progress || 'w-25'} ${props.bgcolor || ''} ${props.striped ? 'progress-bar-striped' : ''} ${props.animated ? 'progress-bar-animated' : ''}"></div></div>`,
    properties: [
        { label: 'Progress', key: 'progress', type: 'select', default: 'w-25', options: [
            { value: 'w-25', label: '25%' },
            { value: 'w-50', label: '50%' },
            { value: 'w-75', label: '75%' },
            { value: 'w-100', label: '100%' }
        ] },
        { label: 'Background', key: 'bgcolor', type: 'select', default: '', options: [
            { value: '', label: 'None' },
            { value: 'bg-primary', label: 'Primary' },
            { value: 'bg-success', label: 'Success' },
            { value: 'bg-info', label: 'Info' },
            { value: 'bg-warning', label: 'Warning' },
            { value: 'bg-danger', label: 'Danger' },
            { value: 'bg-dark', label: 'Dark' }
        ] },
        { label: 'Striped', key: 'striped', type: 'toggle', default: false },
        { label: 'Animated', key: 'animated', type: 'toggle', default: false }
    ]
});

// Navbar
Components.add('bs-navbar', {
    name: 'Navbar',
    html: (props) => `<nav class="navbar navbar-expand-lg ${props.color || ''} ${props.background || ''} ${props.placement || ''}"><div class="container-fluid"><a class="navbar-brand" href="#">Navbar</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarTogglerDemo02"><ul class="navbar-nav me-auto mb-2 mb-lg-0"><li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Home</a></li><li class="nav-item"><a class="nav-link" href="#">Link</a></li><li class="nav-item"><a class="nav-link disabled">Disabled</a></li></ul><form class="d-flex" role="search"><input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"><button class="btn btn-outline-success" type="submit">Search</button></form></div></div></nav>`,
    properties: [
        { label: 'Color theme', key: 'color', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'navbar-light', label: 'Light' },
            { value: 'navbar-dark', label: 'Dark' }
        ] },
        { label: 'Background color', key: 'background', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'bg-primary', label: 'Primary' },
            { value: 'bg-success', label: 'Success' },
            { value: 'bg-info', label: 'Info' },
            { value: 'bg-warning', label: 'Warning' },
            { value: 'bg-danger', label: 'Danger' },
            { value: 'bg-dark', label: 'Dark' }
        ] },
        { label: 'Placement', key: 'placement', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'fixed-top', label: 'Fixed Top' },
            { value: 'fixed-bottom', label: 'Fixed Bottom' },
            { value: 'sticky-top', label: 'Sticky top' }
        ] }
    ]
});

// Breadcrumbs
Components.add('bs-breadcrumbs', {
    name: 'Breadcrumbs',
    html: (props) => `<ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Home</a></li><li class="breadcrumb-item"><a href="#">Library</a></li><li class="breadcrumb-item active" aria-current="page"><a href="#">Book</a></li></ol>`,
    properties: [
        { label: 'Divider', key: 'divider', type: 'text', default: '/' }
    ]
});

// Pagination
Components.add('bs-pagination', {
    name: 'Pagination',
    html: (props) => `<nav aria-label="Page navigation example"><ul class="pagination ${props.size || ''} ${props.alignment || ''}"><li class="page-item"><a class="page-link" href="#">Previous</a></li><li class="page-item"><a class="page-link" href="#">1</a></li><li class="page-item"><a class="page-link" href="#">2</a></li><li class="page-item"><a class="page-link" href="#">3</a></li><li class="page-item"><a class="page-link" href="#">Next</a></li></ul></nav>`,
    properties: [
        { label: 'Size', key: 'size', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'pagination-lg', label: 'Large' },
            { value: 'pagination-sm', label: 'Small' }
        ] },
        { label: 'Alignment', key: 'alignment', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'justify-content-center', label: 'Center' },
            { value: 'justify-content-end', label: 'Right' }
        ] }
    ]
});

// Grid Row
Components.add('bs-row', {
    name: 'Grid Row',
    html: (props) => `<div class="row${props.gutters ? ' g-3' : ''}">${props.content || '<div class=\'col\'>Column</div>'}</div>`,
    properties: [
        { label: 'Gutters', key: 'gutters', type: 'toggle', default: false },
        { label: 'Content', key: 'content', type: 'textarea', default: '<div class=\'col\'>Column</div>' }
    ]
});

// Grid Column
Components.add('bs-col', {
    name: 'Grid Column',
    html: (props) => `<div class="col${props.size ? '-' + props.size : ''}">${props.content || 'Column'}</div>`,
    properties: [
        { label: 'Size', key: 'size', type: 'select', default: '', options: [
            { value: '', label: 'Auto' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10' },
            { value: '11', label: '11' },
            { value: '12', label: '12' }
        ] },
        { label: 'Content', key: 'content', type: 'textarea', default: 'Column' }
    ]
});

// Collapse
Components.add('bs-collapse', {
    name: 'Collapse',
    html: (props) => `<div><button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${props.target || 'collapseExample'}" aria-expanded="false" aria-controls="${props.target || 'collapseExample'}">${props.button || 'Toggle'}</button><div class="collapse mt-2" id="${props.target || 'collapseExample'}"><div class="card card-body">${props.content || 'Collapsed content.'}</div></div></div>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'collapseExample' },
        { label: 'Button Label', key: 'button', type: 'text', default: 'Toggle' },
        { label: 'Content', key: 'content', type: 'textarea', default: 'Collapsed content.' }
    ]
});

// Modal
Components.add('bs-modal', {
    name: 'Modal',
    html: (props) => `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${props.target || 'exampleModal'}">${props.button || 'Launch modal'}</button><div class="modal fade" id="${props.target || 'exampleModal'}" tabindex="-1" aria-labelledby="${props.target || 'exampleModalLabel'}" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="${props.target || 'exampleModalLabel'}">${props.title || 'Modal title'}</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${props.content || 'Modal body text goes here.'}</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div></div></div></div>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'exampleModal' },
        { label: 'Button Label', key: 'button', type: 'text', default: 'Launch modal' },
        { label: 'Title', key: 'title', type: 'text', default: 'Modal title' },
        { label: 'Content', key: 'content', type: 'textarea', default: 'Modal body text goes here.' }
    ]
});

// Tabs
Components.add('bs-tabs', {
    name: 'Tabs',
    html: (props) => `<ul class="nav nav-tabs" id="myTab" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button></li></ul><div class="tab-content mt-2" id="myTabContent"><div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">${props.home || 'Home tab content.'}</div><div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">${props.profile || 'Profile tab content.'}</div></div>`,
    properties: [
        { label: 'Home Tab Content', key: 'home', type: 'textarea', default: 'Home tab content.' },
        { label: 'Profile Tab Content', key: 'profile', type: 'textarea', default: 'Profile tab content.' }
    ]
});

// Accordion
Components.add('bs-accordion', {
    name: 'Accordion',
    html: (props) => `<div class="accordion" id="${props.target || 'accordionExample'}"><div class="accordion-item"><h2 class="accordion-header" id="headingOne"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">${props.title1 || 'Accordion Item #1'}</button></h2><div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#${props.target || 'accordionExample'}"><div class="accordion-body">${props.body1 || 'Accordion body 1.'}</div></div></div><div class="accordion-item"><h2 class="accordion-header" id="headingTwo"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">${props.title2 || 'Accordion Item #2'}</button></h2><div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#${props.target || 'accordionExample'}"><div class="accordion-body">${props.body2 || 'Accordion body 2.'}</div></div></div></div>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'accordionExample' },
        { label: 'Title 1', key: 'title1', type: 'text', default: 'Accordion Item #1' },
        { label: 'Body 1', key: 'body1', type: 'textarea', default: 'Accordion body 1.' },
        { label: 'Title 2', key: 'title2', type: 'text', default: 'Accordion Item #2' },
        { label: 'Body 2', key: 'body2', type: 'textarea', default: 'Accordion body 2.' }
    ]
});

// Carousel
Components.add('bs-carousel', {
    name: 'Carousel',
    html: (props) => `<div id="${props.target || 'carouselExample'}" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner"><div class="carousel-item active"><img src="https://placehold.co/800x200" class="d-block w-100" alt="..."></div><div class="carousel-item"><img src="https://placehold.co/800x200/eee/333" class="d-block w-100" alt="..."></div></div><button class="carousel-control-prev" type="button" data-bs-target="#${props.target || 'carouselExample'}" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#${props.target || 'carouselExample'}" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'carouselExample' }
    ]
});

// Dropdown
Components.add('bs-dropdown', {
    name: 'Dropdown',
    html: (props) => `<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">${props.label || 'Dropdown button'}</button><ul class="dropdown-menu"><li><a class="dropdown-item" href="#">Action</a></li><li><a class="dropdown-item" href="#">Another action</a></li><li><a class="dropdown-item" href="#">Something else here</a></li></ul></div>`,
    properties: [
        { label: 'Label', key: 'label', type: 'text', default: 'Dropdown button' }
    ]
});

// List Group Item
Components.add('bs-listgroupitem', {
    name: 'List Group Item',
    html: (props) => `<li class="list-group-item ${props.active ? 'active' : ''} ${props.disabled ? 'disabled' : ''}">${props.text || 'List item'}</li>`,
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: 'List item' },
        { label: 'Active', key: 'active', type: 'toggle', default: false },
        { label: 'Disabled', key: 'disabled', type: 'toggle', default: false }
    ]
});

// Breadcrumb Item
Components.add('bs-breadcrumbitem', {
    name: 'Breadcrumb Item',
    html: (props) => `<li class="breadcrumb-item ${props.active ? 'active' : ''}"><a href="#">${props.text || 'Item'}</a></li>`,
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: 'Item' },
        { label: 'Active', key: 'active', type: 'toggle', default: false }
    ]
});

// Page Item
Components.add('bs-pageitem', {
    name: 'Page Item',
    html: (props) => `<li class="page-item ${props.active ? 'active' : ''} ${props.disabled ? 'disabled' : ''}"><a class="page-link" href="#">${props.text || '1'}</a></li>`,
    properties: [
        { label: 'Text', key: 'text', type: 'text', default: '1' },
        { label: 'Active', key: 'active', type: 'toggle', default: false },
        { label: 'Disabled', key: 'disabled', type: 'toggle', default: false }
    ]
});

// Form
Components.add('bs-form', {
    name: 'Form',
    html: (props) => `<form>${props.content || '<div class=\'mb-3\'><label class=\'form-label\'>Email address</label><input type=\'email\' class=\'form-control\'></div>'}</form>`,
    properties: [
        { label: 'Content', key: 'content', type: 'textarea', default: '<div class=\'mb-3\'><label class=\'form-label\'>Email address</label><input type=\'email\' class=\'form-control\'></div>' }
    ]
});

// Form Group
Components.add('bs-formgroup', {
    name: 'Form Group',
    html: (props) => `<div class="mb-3">${props.content || '<label class=\'form-label\'>Label</label><input type=\'text\' class=\'form-control\'>'}</div>`,
    properties: [
        { label: 'Content', key: 'content', type: 'textarea', default: '<label class=\'form-label\'>Label</label><input type=\'text\' class=\'form-control\'>' }
    ]
});

// Form Control (Input)
Components.add('bs-input', {
    name: 'Input',
    html: (props) => `<input type="${props.type || 'text'}" class="form-control" placeholder="${props.placeholder || ''}" value="${props.value || ''}" ${props.disabled ? 'disabled' : ''}>`,
    properties: [
        { label: 'Type', key: 'type', type: 'select', default: 'text', options: [
            { value: 'text', label: 'Text' },
            { value: 'email', label: 'Email' },
            { value: 'password', label: 'Password' },
            { value: 'number', label: 'Number' },
            { value: 'date', label: 'Date' },
            { value: 'file', label: 'File' }
        ] },
        { label: 'Placeholder', key: 'placeholder', type: 'text', default: '' },
        { label: 'Value', key: 'value', type: 'text', default: '' },
        { label: 'Disabled', key: 'disabled', type: 'toggle', default: false }
    ]
});

// Checkbox
Components.add('bs-checkbox', {
    name: 'Checkbox',
    html: (props) => `<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="${props.id || 'flexCheckDefault'}" ${props.checked ? 'checked' : ''}><label class="form-check-label" for="${props.id || 'flexCheckDefault'}">${props.label || 'Default checkbox'}</label></div>`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'flexCheckDefault' },
        { label: 'Label', key: 'label', type: 'text', default: 'Default checkbox' },
        { label: 'Checked', key: 'checked', type: 'toggle', default: false }
    ]
});

// Radio
Components.add('bs-radio', {
    name: 'Radio',
    html: (props) => `<div class="form-check"><input class="form-check-input" type="radio" name="${props.name || 'flexRadioDefault'}" id="${props.id || 'flexRadioDefault1'}" ${props.checked ? 'checked' : ''}><label class="form-check-label" for="${props.id || 'flexRadioDefault1'}">${props.label || 'Default radio'}</label></div>`,
    properties: [
        { label: 'Name', key: 'name', type: 'text', default: 'flexRadioDefault' },
        { label: 'ID', key: 'id', type: 'text', default: 'flexRadioDefault1' },
        { label: 'Label', key: 'label', type: 'text', default: 'Default radio' },
        { label: 'Checked', key: 'checked', type: 'toggle', default: false }
    ]
});

// Switch
Components.add('bs-switch', {
    name: 'Switch',
    html: (props) => `<div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="${props.id || 'flexSwitchCheckDefault'}" ${props.checked ? 'checked' : ''}><label class="form-check-label" for="${props.id || 'flexSwitchCheckDefault'}">${props.label || 'Default switch'}</label></div>`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'flexSwitchCheckDefault' },
        { label: 'Label', key: 'label', type: 'text', default: 'Default switch' },
        { label: 'Checked', key: 'checked', type: 'toggle', default: false }
    ]
});

// Range
Components.add('bs-range', {
    name: 'Range',
    html: (props) => `<label for="${props.id || 'customRange1'}" class="form-label">${props.label || 'Example range'}</label><input type="range" class="form-range" id="${props.id || 'customRange1'}">`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'customRange1' },
        { label: 'Label', key: 'label', type: 'text', default: 'Example range' }
    ]
});

// Select
Components.add('bs-select', {
    name: 'Select',
    html: (props) => `<label for="${props.id || 'select1'}" class="form-label">${props.label || 'Example select'}</label><select class="form-select" id="${props.id || 'select1'}"><option selected>Open this select menu</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select>`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'select1' },
        { label: 'Label', key: 'label', type: 'text', default: 'Example select' }
    ]
});

// Textarea
Components.add('bs-textarea', {
    name: 'Textarea',
    html: (props) => `<label for="${props.id || 'textarea1'}" class="form-label">${props.label || 'Example textarea'}</label><textarea class="form-control" id="${props.id || 'textarea1'}" rows="3"></textarea>`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'textarea1' },
        { label: 'Label', key: 'label', type: 'text', default: 'Example textarea' }
    ]
});

// Input Group
Components.add('bs-inputgroup', {
    name: 'Input Group',
    html: (props) => `<div class="input-group mb-3"><span class="input-group-text" id="basic-addon1">${props.prepend || '@'}</span><input type="text" class="form-control" placeholder="${props.placeholder || 'Username'}" aria-label="Username" aria-describedby="basic-addon1"></div>`,
    properties: [
        { label: 'Prepend', key: 'prepend', type: 'text', default: '@' },
        { label: 'Placeholder', key: 'placeholder', type: 'text', default: 'Username' }
    ]
});

// Floating Label
Components.add('bs-floatinglabel', {
    name: 'Floating Label',
    html: (props) => `<div class="form-floating mb-3"><input type="email" class="form-control" id="${props.id || 'floatingInput'}" placeholder="${props.placeholder || 'name@example.com'}"><label for="${props.id || 'floatingInput'}">${props.label || 'Email address'}</label></div>`,
    properties: [
        { label: 'ID', key: 'id', type: 'text', default: 'floatingInput' },
        { label: 'Label', key: 'label', type: 'text', default: 'Email address' },
        { label: 'Placeholder', key: 'placeholder', type: 'text', default: 'name@example.com' }
    ]
});

// Table
Components.add('bs-table', {
    name: 'Table',
    html: (props) => `<table class="table${props.striped ? ' table-striped' : ''}${props.bordered ? ' table-bordered' : ''}${props.hover ? ' table-hover' : ''}${props.small ? ' table-sm' : ''}"><thead><tr><th scope="col">#</th><th scope="col">First</th><th scope="col">Last</th><th scope="col">Handle</th></tr></thead><tbody><tr><th scope="row">1</th><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr><th scope="row">2</th><td>Jacob</td><td>Thornton</td><td>@fat</td></tr></tbody></table>`,
    properties: [
        { label: 'Striped', key: 'striped', type: 'toggle', default: false },
        { label: 'Bordered', key: 'bordered', type: 'toggle', default: false },
        { label: 'Hover', key: 'hover', type: 'toggle', default: false },
        { label: 'Small', key: 'small', type: 'toggle', default: false }
    ]
});

// Image
Components.add('bs-image', {
    name: 'Image',
    html: (props) => `<img src="${props.src || 'https://placehold.co/200x100'}" class="img${props.fluid ? '-fluid' : ''}${props.thumbnail ? ' img-thumbnail' : ''}" alt="${props.alt || ''}">`,
    properties: [
        { label: 'Source', key: 'src', type: 'text', default: 'https://placehold.co/200x100' },
        { label: 'Alt', key: 'alt', type: 'text', default: '' },
        { label: 'Fluid', key: 'fluid', type: 'toggle', default: false },
        { label: 'Thumbnail', key: 'thumbnail', type: 'toggle', default: false }
    ]
});

// Figure
Components.add('bs-figure', {
    name: 'Figure',
    html: (props) => `<figure class="figure"><img src="${props.src || 'https://placehold.co/200x100'}" class="figure-img img-fluid rounded" alt="${props.alt || ''}"><figcaption class="figure-caption">${props.caption || 'A caption for the above image.'}</figcaption></figure>`,
    properties: [
        { label: 'Source', key: 'src', type: 'text', default: 'https://placehold.co/200x100' },
        { label: 'Alt', key: 'alt', type: 'text', default: '' },
        { label: 'Caption', key: 'caption', type: 'text', default: 'A caption for the above image.' }
    ]
});

// Spinner
Components.add('bs-spinner', {
    name: 'Spinner',
    html: (props) => `<div class="spinner-border${props.size ? ' spinner-border-' + props.size : ''} ${props.color || ''}" role="status"><span class="visually-hidden">Loading...</span></div>`,
    properties: [
        { label: 'Size', key: 'size', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'sm', label: 'Small' }
        ] },
        { label: 'Color', key: 'color', type: 'select', default: '', options: [
            { value: '', label: 'Default' },
            { value: 'text-primary', label: 'Primary' },
            { value: 'text-success', label: 'Success' },
            { value: 'text-info', label: 'Info' },
            { value: 'text-warning', label: 'Warning' },
            { value: 'text-danger', label: 'Danger' },
            { value: 'text-dark', label: 'Dark' }
        ] }
    ]
});

// Toast
Components.add('bs-toast', {
    name: 'Toast',
    html: (props) => `<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><strong class="me-auto">${props.title || 'Bootstrap'}</strong><small>${props.time || '11 mins ago'}</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">${props.body || 'Hello, world! This is a toast message.'}</div></div>`,
    properties: [
        { label: 'Title', key: 'title', type: 'text', default: 'Bootstrap' },
        { label: 'Time', key: 'time', type: 'text', default: '11 mins ago' },
        { label: 'Body', key: 'body', type: 'textarea', default: 'Hello, world! This is a toast message.' }
    ]
});

// Tooltip
Components.add('bs-tooltip', {
    name: 'Tooltip',
    html: (props) => `<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="${props.placement || 'top'}" title="${props.text || 'Tooltip on top'}">${props.label || 'Tooltip button'}</button>`,
    properties: [
        { label: 'Label', key: 'label', type: 'text', default: 'Tooltip button' },
        { label: 'Text', key: 'text', type: 'text', default: 'Tooltip on top' },
        { label: 'Placement', key: 'placement', type: 'select', default: 'top', options: [
            { value: 'top', label: 'Top' },
            { value: 'right', label: 'Right' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left', label: 'Left' }
        ] }
    ]
});

// Popover
Components.add('bs-popover', {
    name: 'Popover',
    html: (props) => `<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" title="${props.title || 'Popover title'}" data-bs-content="${props.content || 'And here\'s some amazing content. It\'s very engaging. Right?'}">${props.label || 'Click to toggle popover'}</button>`,
    properties: [
        { label: 'Label', key: 'label', type: 'text', default: 'Click to toggle popover' },
        { label: 'Title', key: 'title', type: 'text', default: 'Popover title' },
        { label: 'Content', key: 'content', type: 'textarea', default: 'And here\'s some amazing content. It\'s very engaging. Right?' }
    ]
});

// Close Button
Components.add('bs-close', {
    name: 'Close Button',
    html: (props) => `<button type="button" class="btn-close" aria-label="Close"></button>`,
    properties: []
});

// Collapse Button
Components.add('bs-collapsebutton', {
    name: 'Collapse Button',
    html: (props) => `<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${props.target || 'collapseExample'}" aria-expanded="false" aria-controls="${props.target || 'collapseExample'}">${props.label || 'Toggle'}</button>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'collapseExample' },
        { label: 'Label', key: 'label', type: 'text', default: 'Toggle' }
    ]
});

// Collapse Content
Components.add('bs-collapsecontent', {
    name: 'Collapse Content',
    html: (props) => `<div class="collapse" id="${props.target || 'collapseExample'}"><div class="card card-body">${props.content || 'Collapsed content.'}</div></div>`,
    properties: [
        { label: 'Target ID', key: 'target', type: 'text', default: 'collapseExample' },
        { label: 'Content', key: 'content', type: 'textarea', default: 'Collapsed content.' }
    ]
});

export default Components; 