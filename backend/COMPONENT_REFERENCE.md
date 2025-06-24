# Component Reference Guide

This document provides a comprehensive reference for all supported template components, their required data structures, and the expected HTML output.

## Overview

The template parser supports 10 main component types, each with specific data structures and rendering capabilities:

1. **Content Categories** - Hierarchical category structures
2. **Product Categories** - Product taxonomy management
3. **Product Manufacturers** - Manufacturer information
4. **Product Options** - Product configuration options
5. **Product Subscriptions** - Subscription-based products
6. **Product Variants** - Product variations
7. **Product Vendors** - Vendor management
8. **User Addresses** - User address management
9. **User Wishlist** - User wishlist with products
10. **Generic Components** - Fallback for unknown types

## 1. Content Categories (`content-categories.tpl`)

-   **Component Name**: `categories`
-   **Description**: Renders a nested list of content categories.
-   **Data Structure**: An array of category objects. Each object can contain a `children` array for nesting.
    ```json
    [
        {
            "name": "Category 1",
            "url": "/cat1",
            "images": ["/img1.jpg"],
            "active": true,
            "children": [
                { "name": "Sub-category 1.1", "url": "/sub1" }
            ]
        }
    ]
    ```
-   **HTML Output**: Generates a `<ul>` with nested `<li>` elements for each category and sub-category.

## 2. Product Categories (`categories.tpl`)

-   **Component Name**: `category`
-   **Description**: Renders a list of product categories, typically for filtering.
-   **Data Structure**: An array of category objects, similar to content categories, but with `taxonomy_item_id`.
    ```json
    [
        {
            "name": "Product Category A",
            "taxonomy_item_id": "123",
            "active": false
        }
    ]
    ```
-   **HTML Output**: A list of categories with checkboxes.

## 3. Manufacturers (`manufacturers.tpl`)

-   **Component Name**: `manufacturers`
-   **Description**: Renders a list of product manufacturers.
-   **Data Structure**: An array of manufacturer objects.
    ```json
    [
        {
            "manufacturer_id": "mfg1",
            "name": "Super Brand",
            "image": "/mfg1.png",
            "content": "Description of brand.",
            "active": true
        }
    ]
    ```
-   **HTML Output**: A grid of manufacturer items, each with an image, name, and description.

## 4. Product Options (`options.tpl`)

-   **Component Name**: `options`
-   **Description**: Displays product options (e.g., color, size) with radio buttons or selects.
-   **Data Structure**: An array of option objects, each containing an array of `values`.
    ```json
    [
        {
            "product_option_id": "opt1",
            "name": "Color",
            "type": "radio",
            "required": true,
            "values": [
                { "product_option_value_id": "val1", "name": "Red", "price": "+$2.00", "image": "/red.jpg", "checked": true }
            ]
        }
    ]
    ```
-   **HTML Output**: A set of inputs for each product option.

## 5. Subscriptions (`subscriptions.tpl`)

-   **Component Name**: `subscriptions`
-   **Description**: Displays available subscription plans.
-   **Data Structure**: An array of subscription plan objects.
    ```json
    [
        {
            "subscription_id": "sub1",
            "name": "Basic Plan",
            "description": "Monthly access.",
            "price": "$9.99/month",
            "duration": "30 days"
        }
    ]
    ```
-   **HTML Output**: A list of subscription plan details.

## 6. Product Variants (`variants.tpl`)

-   **Component Name**: `variants`
-   **Description**: Similar to options, but for product variants that might have their own SKU.
-   **Data Structure**: An array of variant objects, each with an array of `values`.
    ```json
    [
        {
            "product_variant_id": "var1",
            "name": "Size",
            "type": "select",
            "required": true,
            "values": [
                { "product_variant_value_id": "vval1", "name": "Large", "checked": false }
            ]
        }
    ]
    ```
-   **HTML Output**: A set of inputs for each product variant.

## 7. Vendors (`vendors.tpl`)

-   **Component Name**: `vendors`
-   **Description**: Renders a list of vendors or sellers.
-   **Data Structure**: An array of vendor objects.
    ```json
    [
        {
            "vendor_id": "ven1",
            "name": "Awesome Seller",
            "image": "/seller.png",
            "content": "Top-rated seller.",
            "active": false
        }
    ]
    ```
-   **HTML Output**: A grid of vendor items.

## 8. User Addresses (`address.tpl`)

-   **Component Name**: `address`
-   **Description**: Displays a user's saved addresses in a form-like structure.
-   **Data Structure**: An array of address objects.
    ```json
    [
        {
            "user_address_id": "addr1",
            "first_name": "John",
            "last_name": "Doe",
            "address": "123 Main St",
            "city": "Anytown",
            "postcode": "12345",
            "phone": "555-1234"
        }
    ]
    ```
-   **HTML Output**: A list of address blocks with input fields pre-filled.

## 9. User Wishlist (`wishlist.tpl`)

-   **Component Name**: `wishlist`
-   **Description**: Displays products from a user's wishlist.
-   **Data Structure**: An array of product objects.
    ```json
    [
        {
            "product_id": "prod1",
            "name": "Cool Gadget",
            "url": "/gadget",
            "image": "/gadget.jpg",
            "content": "A really cool gadget."
        }
    ]
    ```
-   **HTML Output**: A grid of product items from the wishlist.

## 10. Admin Info (`admin.tpl`)

- **Component Name**: `admin`
- **Description**: Displays basic information about the logged-in administrator.
- **Data Structure**: A single admin object.
  ```json
  {
    "name": "John Doe",
    "dashboard_url": "/admin/dashboard",
    "avatar": "/images/avatars/john-doe.png"
  }
  ```
- **HTML Output**: A simple block with the admin's name, a link to their dashboard, and their avatar.

## 11. Breadcrumb (`breadcrumb.tpl`)

- **Component Name**: `breadcrumb`
- **Description**: Renders a breadcrumb navigation trail.
- **Data Structure**: An object containing an array of breadcrumb items.
  ```json
  {
    "breadcrumb": [
      { "name": "Home", "url": "/" },
      { "name": "Products", "url": "/products" }
    ]
  }
  ```
- **HTML Output**: An ordered list (`<ol>`) of breadcrumb links.

## 12. Shopping Cart (`cart.tpl`)

- **Component Name**: `cart`
- **Description**: A comprehensive component that renders the entire shopping cart, including products, options, totals, and coupons.
- **Data Structure**: A single cart object with nested arrays for products, totals, and coupons.
  ```json
  {
    "total_items": 1,
    "total_formatted": "$105.99",
    "products": [
      {
        "product_id": 1,
        "name": "Laptop Pro",
        "image": "/laptop.jpg",
        "quantity": 1,
        "price_formatted": "$99.99",
        "total_formatted": "$99.99",
        "option_value": [
          { "name": "Color", "value": "Silver" }
        ]
      }
    ],
    "totals": [
      { "title": "Sub-Total", "amount": "$99.99" }
    ],
    "coupons": [
      { "name": "DISCOUNT10", "info": "10% off" }
    ]
  }
  ```
- **HTML Output**: A complete HTML structure for the shopping cart, with nested divs for products, options, totals, and coupons, all populated with the provided data.

## 13. Advanced Categories (`categories.tpl`)

-   **Component Name**: `categories`
-   **Description**: Renders a multi-level list of product categories with checkboxes, images, and links, built recursively from a flat array of category objects.
-   **Data Structure**: An object containing a `categories` object, where each key is the category ID. The recursion is driven by the `parent_id` of each category.
    ```json
    {
      "count": 5,
      "categories": {
        "1": { "taxonomy_item_id": 1, "parent_id": 0, "name": "Electronics", "url": "/electronics", "images": ["/img/electronics.jpg"], "active": true },
        "2": { "taxonomy_item_id": 2, "parent_id": 1, "name": "Phones", "url": "/phones", "images": ["/img/phones.jpg"], "active": false },
        "3": { "taxonomy_item_id": 3, "parent_id": 1, "name": "Laptops", "url": "/laptops", "images": ["/img/laptops.jpg"], "active": true }
      }
    }
    ```
-   **HTML Output**: A recursively generated, flat list of category items, each with a checkbox, label, link, and image. The nesting is logical, not structural in the final HTML.

## 14. Recursive Categories (`categories_recursive.tpl`)

-   **Component Name**: `categories`
-   **Description**: Renders a true nested HTML `<ul>` list of categories, built recursively. This is ideal for sidebar menus.
-   **Data Structure**: An object where each key is the category ID. The recursion is driven by the `parent` key.
    ```json
    {
      "1": { "id": 1, "parent": 0, "name": "Electronics" },
      "2": { "id": 2, "parent": 1, "name": "Phones" },
      "3": { "id": 3, "parent": 1, "name": "Laptops" }
    }
    ```
-   **HTML Output**: A nested `<ul>` and `<li>` structure that visually represents the category hierarchy.

## Common Features

### Component Instance Management
All components support automatic instance management to prevent conflicts when multiple instances exist on the same page.

### Data Binding
All components support dynamic data binding with `[data-v-*]` attributes and wildcard patterns.

### Conditional Rendering
Components support conditional rendering based on data properties like `active`, `required`, `checked`, etc.

### Image Support
Most components support image handling with proper alt text and responsive sizing.

### Form Integration
Components that generate form elements include proper name attributes, validation, and accessibility features.

## Usage Examples

### Basic Usage
```javascript
const TemplateParser = require('./services/templateParser');
const parser = new TemplateParser();

// Set component data
parser.setComponentData('product_manufacturers', manufacturersData);
parser.setComponentData('user_wishlist', wishlistData);

// Process template
const result = await parser.processTemplate('template.tpl', additionalData);
```

### Advanced Usage
```javascript
// Set global data
parser.setGlobalData({
  site_name: 'My Store',
  base_url: 'https://example.com'
});

// Process multiple components
const categoriesResult = await parser.processTemplate('categories.tpl', data);
const wishlistResult = await parser.processTemplate('wishlist.tpl', data);

// Get cache statistics
const stats = parser.getCacheSize();
console.log('Templates cached:', stats.templates);
```

## Best Practices

1. **Data Structure Consistency**: Maintain consistent data structures across components
2. **Component Naming**: Use descriptive names for components
3. **Error Handling**: Always wrap template processing in try-catch blocks
4. **Performance**: Use caching for frequently accessed templates
5. **Accessibility**: Ensure generated HTML includes proper ARIA attributes and semantic markup
6. **Responsive Design**: Use CSS classes that support responsive layouts
7. **SEO**: Include proper meta tags and structured data where applicable

## Migration Guide

When migrating from Vvveb or other template systems:

1. **Component Definitions**: Keep the same `@component = selector` syntax
2. **PHP Blocks**: Convert PHP logic to JavaScript equivalents
3. **Data Attributes**: Maintain `[data-v-*]` attribute patterns
4. **Loop Structures**: Preserve `@component|before` and `@component|after` patterns
5. **Conditional Logic**: Convert PHP conditionals to JavaScript

The enhanced template parser maintains full compatibility while providing improved performance and Node.js integration.

### 11. Subscriptions Component

-   **Component Name**: `subscriptions`
-   **Template File**: `subscriptions.tpl`
-   **Description**: Renders a list of subscription plans available to the user.
-   **Data Structure**: An array of subscription objects, each containing `subscription_plan_id`, `name`, `price_formatted`, and `description`.

### 12. Variants Component

-   **Component Name**: `variants`
-   **Template File**: `variants.tpl`
-   **Description**: Displays product variants (e.g., based on color or size).
-   **Data Structure**: An array of variant objects, each with `product_id`, `name`, and an array of `option_value` objects.

### 13. Category (Single)

-   **Component Name**: `category`
-   **Template File**: `category.tpl`
-   **Description**: Displays detailed information for a single category.
-   **Data Structure**: A single category object with `name` and `description`.
-   **Syntax**:
    ```
    [data-v-component-category]|before = <?php
    if (isset($_category_idx)) $_category_idx++; else $_category_idx = 0;
    $_category = $this->_component['category'][$_category_idx];
    ?>
    [data-v-component-category] [data-v-category-name] = $_category['name']
    ```

### 14. Comments

-   **Component Name**: `comments`
-   **Template File**: `comments.tpl`
-   **Description**: Renders a list of comments.
-   **Data Structure**: An object containing a `comment` array. Each item has `content`, `author`, `avatar`, and `reply-url`.
-   **Syntax**:
    ```
    @comment [data-v-comment-content]|innerText = $comment['content']
    @comment [data-v-comment-author]|innerText = $comment['author']
    @comment [data-v-comment-avatar]|src = $comment['avatar']
    @comment [data-v-comment-reply-url]|href = $comment['reply-url']
    ```

### 15. Currency

-   **Component Name**: `currency`
-   **Template File**: `currency.tpl`
-   **Description**: Renders a list of available currencies.
-   **Data Structure**: An object containing a `currency` array. Each item has `name` and `code`.
-   **Syntax**:
    ```
    @currency [data-v-currency-name]|innerText = $currency['name']
    @currency [data-v-currency-code]|value = $currency['code']
    ```

### 16. Digital Assets

-   **Component Name**: `digital_assets`
-   **Template File**: `digital_assets.tpl`
-   **Description**: Renders a list of downloadable digital assets.
-   **Data Structure**: An object containing a `digital_asset` array. Each item has `name`, `thumbnail` (URL), and `download_url`.
-   **Syntax**:
    ```
    @digital_asset [data-v-digital_asset-name]|innerText = $asset['name']
    @digital_asset [data-v-digital_asset-thumbnail]|src = $asset['thumbnail']
    @digital_asset [data-v-digital_asset-download_url]|href = $asset['download_url']
    ```
    
### 17. Categories (Simple Loop)

-   **Component Name**: `categories`
-   **Template File**: `categories_simple.tpl`
-   **Description**: Renders a simple, non-nested list of product categories.
-   **Data Structure**: An object containing a `count` and a `categories` array. Each item in the array has `name`, `url`, and `images`.
-   **Syntax**:
    ```
    [data-v-component-categories]  [data-v-cat]|before = <?php 
    foreach ($this->categories[$_categories_idx]['categories'] as $index => $category) 
    {
    ?>
    [data-v-component-categories] [data-v-cat] [data-v-cat-url]|href = <?php echo htmlspecialchars(Vvveb\url('product/category/index', $category));?>
    [data-v-component-categories] [data-v-cat] [data-v-cat-img]|src = $category['images'][0]
    ```

### 18. Checkout

-   **Component Name**: `checkout`
-   **Template File**: `checkout.tpl`
-   **Description**: Provides user data to a checkout form. This component typically sets a context variable (`$user`) that can be used by other elements in the template.
-   **Data Structure**: A single user object containing checkout-related fields like `first_name`, `last_name`, `email`, etc.
-   **Syntax**:
    ```
    [data-v-component-checkout]|prepend = <?php 
	if (isset($_user_idx)) $_user_idx++; else $_user_idx = 0;
	$user = $component = $this->_component['checkout'][$_user_idx];
    ?>
    ``` 