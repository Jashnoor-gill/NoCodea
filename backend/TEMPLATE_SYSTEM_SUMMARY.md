# Enhanced Template Parser System Summary

## Overview

I've enhanced your no-code builder's template parser to handle Vvveb-style template syntax with PHP-like preprocessing blocks. This system supports the complex template patterns you showed in your examples.

## Key Features Implemented

### 1. Vvveb-Style Component Definitions
```tpl
@categories = [data-v-component-content-categories] [data-v-cats]
@category   = [data-v-component-content-categories] [data-v-cats] [data-v-cat]
@manufacturers = [data-v-component-product-manufacturers]
@manufacturer  = [data-v-component-product-manufacturers] [data-v-manufacturer]
```

### 2. PHP-like Preprocessing Blocks
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
// ... more PHP logic
?>
```

### 3. Component Loops with Recursive Generation
```tpl
@categories|before = <?php
if ($_categories) {
$generate_menu = function ($parent) use (&$_categories, &$generate_menu) {
?>
    @category|before = <?php 
    foreach($_categories as $id => $category) {
        if ($category['parent_id'] == $parent)  { 
    ?>
        // Dynamic attribute binding
        @category [data-v-cat-*]|innerText = $category['@@__data-v-cat-(*)__@@']
        @category [data-v-cat-url]|href = $category['url']
        @category [data-v-cat-img]|src  = $category['images'][0]
        
        // Conditional rendering
        @category|addClass = <?php if (isset($category['active']) && $category['active']) echo 'active';?>
        
        // Recursive menu generation
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

## Supported Component Types

### 1. Content Categories
- Hierarchical category structures
- Parent-child relationships
- Active state management
- Image support
- URL generation

### 2. Product Categories
- Similar to content categories
- Product-specific taxonomy
- E-commerce focused

### 3. Product Manufacturers
- Manufacturer information
- Image and content support
- Active state management
- Checkbox selection

### 4. Product Options
- Complex option structures
- Multiple values per option
- Price variations
- Image support for values
- Required/optional handling

## Template Processing Pipeline

1. **Component Definitions**: Extract `@component = selector` patterns
2. **PHP Preprocessing**: Convert PHP-like blocks to JavaScript
3. **Component Instances**: Manage unique component instances
4. **Data Binding**: Replace `[data-v-*]` attributes with actual data
5. **Loop Generation**: Generate HTML for component loops
6. **Conditional Rendering**: Handle conditional logic
7. **Cache Management**: Optimize performance with caching

## Data Structure Examples

### Content Categories
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

### Product Manufacturers
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

### Product Options
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

## Usage Example

```javascript
const TemplateParser = require('./services/templateParser');

// Create parser instance
const parser = new TemplateParser();

// Set component data
parser.setComponentData('content_categories', categoriesData);
parser.setComponentData('product_manufacturers', manufacturersData);
parser.setComponentData('product_options', optionsData);

// Process template
const result = await parser.processTemplate('template.tpl', additionalData);
```

## Advanced Features

### 1. Component Instance Management
- Automatic unique instance handling
- Line-based indexing for nested components
- Prevents conflicts in complex layouts

### 2. Recursive Menu Generation
- Supports unlimited nesting levels
- Maintains parent-child relationships
- Generates proper HTML structure

### 3. Dynamic Attribute Binding
- Wildcard attribute matching
- Flexible data binding patterns
- Supports complex nested data

### 4. Performance Optimization
- Template caching
- Component data caching
- Index management caching

## Migration from Vvveb

The parser maintains full compatibility with Vvveb templates:
- Same component definition syntax
- Same PHP-like preprocessing blocks
- Same data attribute patterns
- Same loop structures

The main difference is PHP logic is converted to JavaScript for Node.js execution.

## Files Created/Modified

1. **`backend/services/templateParser.js`** - Enhanced template parser
2. **`backend/templates/content-categories.tpl`** - Content categories template
3. **`backend/templates/manufacturers.tpl`** - Manufacturers template
4. **`backend/templates/options.tpl`** - Product options template
5. **`backend/TEMPLATE_PARSER_GUIDE.md`** - Comprehensive usage guide
6. **`backend/test-template-parser.js`** - Test suite
7. **`backend/simple-test.js`** - Simple test example

## Next Steps

1. **Test the parser** with your actual template files
2. **Integrate with your routes** to use the parser in your application
3. **Add more component types** as needed
4. **Optimize performance** based on your specific use cases
5. **Add error handling** for edge cases

The enhanced template parser is now ready to handle the complex Vvveb-style templates you showed in your examples, with full support for component definitions, PHP-like preprocessing, recursive loops, and dynamic data binding. 