# Enhanced Template Parser Guide

This guide explains how to use the enhanced template parser that supports Vvveb-style template syntax with PHP-like preprocessing blocks.

## Overview

The enhanced template parser supports:
- Vvveb-style component definitions (`@component = selector`)
- PHP-like preprocessing blocks (`@component|prepend = <?php ... ?>`)
- Component loops with recursive menu generation
- Dynamic data binding with `[data-v-*]` attributes
- Component instance management for unique handling
- Template caching for performance

## Basic Usage

```javascript
const TemplateParser = require('./services/templateParser');

// Create a new parser instance
const parser = new TemplateParser();

// Set global data
parser.setGlobalData({
  site_name: 'My Website',
  base_url: 'https://example.com'
});

// Set component-specific data
parser.setComponentData('content_categories', {
  0: {
    count: 5,
    categories: [
      {
        taxonomy_item_id: 1,
        name: 'Electronics',
        url: '/category/electronics',
        active: true
      }
    ]
  }
});

// Process a template
const result = await parser.processTemplate('template.tpl', additionalData);
```

## Template Syntax

### 1. Component Definitions

Define components using the `@component = selector` syntax:

```tpl
@categories = [data-v-component-content-categories] [data-v-cats]
@category   = [data-v-component-content-categories] [data-v-cats] [data-v-cat]
@manufacturers = [data-v-component-product-manufacturers]
@manufacturer  = [data-v-component-product-manufacturers] [data-v-manufacturer]
```

### 2. PHP-like Preprocessing

Use PHP-like blocks for component initialization:

```tpl
[data-v-component-content-categories]|prepend = <?php
$line = __LINE__;
if (isset($_content_categories_idx)){
    if (!isset($_content_categories[$line])) {
        $_content_categories_idx++;
        $_content_categories[$line] = $_content_categories_idx;
    }
} else {
    $_content_categories_idx = 0;
    $_content_categories[$line] = $_content_categories_idx;
}

$_categories = [];

if (isset($this->_component['content_categories'][$_content_categories_idx])) {
    $_pagination_count = $count = $this->_component['content_categories'][$_content_categories_idx]['count'] ?? 0;
    $_categories = $this->_component['content_categories'][$_content_categories_idx]['categories'] ?? [];
}

$previous_component = isset($current_component)?$current_component:null;
$categories = $current_component = $this->_component['content_categories'][$_content_categories_idx] ?? [];
$_categories = $categories['categories'] ?? [];

$_pagination_count = $categories['count'] ?? 0;
$_pagination_limit = isset($categories['limit']) ? $categories['limit'] : 5;	
?>
```

### 3. Component Loops

Define loops using `@component|before` and `@component|after`:

```tpl
@categories|before = <?php
if ($_categories) {
$generate_menu = function ($parent) use (&$_categories, &$generate_menu) {
?>
    @category|before = <?php 
    foreach($_categories as $id => $category) {
        if ($category['parent_id'] == $parent)  { 
    ?>

        //catch all data attributes
        @category [data-v-cat-*]|innerText = $category['@@__data-v-cat-(*)__@@']
        
        @category [data-v-cat-url]|href = $category['url']
        @category [data-v-cat-img]|src  = $category['images'][0]
        
        @category input|id = <?php echo 'm' . $category['taxonomy_item_id'];?>
        @category input|addNewAttribute = <?php if (isset($category['active']) && $category['active']) echo 'checked';?>
        @category label|for = <?php echo 'm' . $category['taxonomy_item_id'];?>

        @category|addClass = <?php if (isset($category['active']) && $category['active']) echo 'active';?>
        
        @category|append = <?php 
         $generate_menu($category['taxonomy_item_id'], $_categories);
        } 
    }
    ?>

    @categories|after = <?php 
}; 

if ($_categories) {
    reset($_categories);
    $generate_menu($_categories[key($_categories)]['parent_id'] ?? 0, $_categories); 
}
}
?>
```

### 4. HTML Structure

Define the HTML structure with data attributes:

```html
<div data-v-component-content-categories>
    <div data-v-cats>
        <div data-v-cat>
            <a data-v-cat-url href="#">Category Name</a>
            <img data-v-cat-img src="#" alt="">
            <input type="checkbox" id="">
            <label for="">Category Name</label>
        </div>
    </div>
</div>
```

## Supported Components

### 1. Content Categories

Handles hierarchical category structures with parent-child relationships.

**Data Structure:**
```javascript
{
  content_categories: {
    0: {
      count: 5,
      limit: 10,
      categories: [
        {
          taxonomy_item_id: 1,
          name: 'Electronics',
          url: '/category/electronics',
          images: ['/images/electronics.jpg'],
          parent_id: 0,
          active: true,
          children: [
            {
              taxonomy_item_id: 2,
              name: 'Smartphones',
              url: '/category/electronics/smartphones',
              images: ['/images/smartphones.jpg'],
              parent_id: 1,
              active: false
            }
          ]
        }
      ]
    }
  }
}
```

### 2. Product Categories

Similar to content categories but for product taxonomy.

### 3. Product Manufacturers

Handles manufacturer information with images and content.

**Data Structure:**
```javascript
{
  product_manufacturers: {
    0: {
      count: 2,
      limit: 5,
      manufacturer: [
        {
          manufacturer_id: 1,
          name: 'Apple Inc.',
          content: 'Leading technology company',
          image: '/images/apple.jpg',
          active: true
        }
      ]
    }
  }
}
```

### 4. Product Options

Handles product options with values, prices, and images.

**Data Structure:**
```javascript
{
  product_options: {
    0: {
      count: 2,
      product_option: [
        {
          product_option_id: 1,
          option_id: 1,
          name: 'Color',
          type: 'radio',
          required: true,
          values: [
            {
              product_option_value_id: 1,
              name: 'Red',
              price: '+$10.00',
              image: '/images/red.jpg',
              checked: true
            }
          ]
        }
      ]
    }
  }
}
```

## Advanced Features

### 1. Component Instance Management

The parser automatically manages component instances to ensure uniqueness:

```javascript
// Each component gets a unique index
const indexVar = '_' + componentName + '_idx';
if (!this.componentIndexes.has(indexVar)) {
    this.componentIndexes.set(indexVar, 0);
} else {
    this.componentIndexes.set(indexVar, this.componentIndexes.get(indexVar) + 1);
}
```

### 2. Recursive Menu Generation

Supports recursive menu generation for hierarchical structures:

```javascript
generateCategoryItem(category) {
    let content = '<li class="category-item">';
    
    // Add category content...
    
    // Add children if they exist
    if (category.children && category.children.length > 0) {
        content += '<ul class="subcategories">';
        category.children.forEach(child => {
            content += this.generateCategoryItem(child);
        });
        content += '</ul>';
    }
    
    content += '</li>';
    return content;
}
```

### 3. Dynamic Attribute Binding

Supports dynamic attribute binding with wildcards:

```tpl
@category [data-v-cat-*]|innerText = $category['@@__data-v-cat-(*)__@@']
@manufacturer [data-v-manufacturer-*]|innerText = $manufacturer['@@__data-v-manufacturer-(*)__@@']
```

### 4. Conditional Rendering

Supports conditional rendering based on data:

```tpl
@category|addClass = <?php if (isset($category['active']) && $category['active']) echo 'active';?>
@manufacturer input|addNewAttribute = <?php 
    if (isset($manufacturer['active']) && $manufacturer['active']) {
        echo 'checked';
    }
?>
```

## Performance Features

### 1. Template Caching

Templates are cached for improved performance:

```javascript
async getTemplate(templatePath) {
    if (this.templateCache.has(templatePath)) {
        return this.templateCache.get(templatePath);
    }

    const fullPath = path.join(process.cwd(), 'templates', templatePath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    this.templateCache.set(templatePath, content);
    return content;
}
```

### 2. Cache Management

```javascript
// Clear all caches
parser.clearCache();

// Get cache statistics
const stats = parser.getCacheSize();
console.log('Templates cached:', stats.templates);
console.log('Component indexes:', stats.components);
console.log('Component data:', stats.componentData);
```

## Error Handling

The parser includes comprehensive error handling:

```javascript
try {
    const result = await parser.processTemplate('template.tpl', data);
    console.log('Template processed successfully');
} catch (error) {
    console.error('Template processing error:', error);
    // Handle error appropriately
}
```

## Testing

Use the provided test file to verify functionality:

```bash
node backend/test-template-parser.js
```

This will test all major features including:
- Component definitions
- PHP-like preprocessing
- Loop generation
- Data binding
- Cache management

## Best Practices

1. **Component Naming**: Use descriptive names for components
2. **Data Structure**: Maintain consistent data structures across components
3. **Error Handling**: Always wrap template processing in try-catch blocks
4. **Performance**: Use caching for frequently accessed templates
5. **Maintenance**: Clear caches when data structures change

## Migration from Vvveb

If migrating from Vvveb, the parser maintains compatibility with:
- Component definition syntax
- PHP-like preprocessing blocks
- Data attribute patterns
- Loop structures

The main difference is that the parser converts PHP logic to JavaScript for Node.js execution. 