const TemplateParser = require('./services/templateParser');
const fs = require('fs').promises;
const path = require('path');

async function testRecursiveCategories() {
  console.log('=== Testing Recursive Category Components ===\n');
  const parser = new TemplateParser();

  const testData = {
    categories: {
      count: 5,
      categories: {
        1: { taxonomy_item_id: 1, parent_id: 0, name: 'Electronics', url: '/electronics', images: ['/img/electronics.jpg'], active: true },
        2: { taxonomy_item_id: 2, parent_id: 1, name: 'Phones', url: '/phones', images: ['/img/phones.jpg'], active: false },
        3: { taxonomy_item_id: 3, parent_id: 1, name: 'Laptops', url: '/laptops', images: ['/img/laptops.jpg'], active: true },
        4: { taxonomy_item_id: 4, parent_id: 3, name: 'Gaming Laptops', url: '/gaming-laptops', images: ['/img/gaming.jpg'], active: false },
        5: { taxonomy_item_id: 5, parent_id: 0, name: 'Books', url: '/books', images: ['/img/books.jpg'], active: false },
      }
    }
  };
  
  const recursiveTestData = {
      1: { parent: 0, name: 'Electronics', url: '/electronics' },
      2: { parent: 1, name: 'Phones', url: '/phones' },
      3: { parent: 1, name: 'Laptops', url: '/laptops' },
      4: { parent: 3, name: 'Gaming Laptops', url: '/gaming-laptops' },
      5: { parent: 0, name: 'Books', url: '/books' },
  };

  try {
    // Test 1: Advanced Categories (categories.tpl)
    parser.clearCache();
    parser.setComponentData('categories', testData);
    console.log('1. Testing Advanced Categories Component (categories.tpl)...');
    const categoriesResult = await parser.processTemplate('categories.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-advanced-category-output.html'), categoriesResult);
    console.log('✓ Advanced Categories component processed. Output saved to test-advanced-category-output.html\n');

    // Test 2: Recursive Categories (categories_recursive.tpl)
    parser.clearCache();
    // This component expects a different structure
    parser.setComponentData('categories', { categories: recursiveTestData });
    console.log('2. Testing Recursive Categories Component (categories_recursive.tpl)...');
    const recursiveResult = await parser.processTemplate('categories_recursive.tpl');
    await fs.writeFile(path.resolve(__dirname, 'test-recursive-category-output.html'), recursiveResult);
    console.log('✓ Recursive Categories component processed. Output saved to test-recursive-category-output.html\n');
    
    console.log('\n=== All Recursive Category Tests Completed! ===');
  } catch (error) {
    console.error('Error testing recursive category components:', error);
  }
}

testRecursiveCategories(); 