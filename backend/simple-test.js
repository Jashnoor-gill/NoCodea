const TemplateParser = require('./services/templateParser');

// Create a new instance of the template parser
const parser = new TemplateParser();

// Test data
const testData = {
  content_categories: {
    0: {
      count: 3,
      categories: [
        {
          taxonomy_item_id: 1,
          name: 'Electronics',
          url: '/category/electronics',
          active: true
        },
        {
          taxonomy_item_id: 2,
          name: 'Clothing',
          url: '/category/clothing',
          active: false
        }
      ]
    }
  }
};

// Set component data
parser.setComponentData('content_categories', testData.content_categories);

// Simple template for testing
const simpleTemplate = `
@categories = [data-v-component-content-categories] [data-v-cats]

<div data-v-component-content-categories>
    <div data-v-cats>
        <div data-v-cat>
            <a data-v-cat-url href="#">Category Name</a>
            <span data-v-cat-name>Category Name</span>
        </div>
    </div>
</div>
`;

// Test the parser
async function testParser() {
  console.log('=== Simple Template Parser Test ===\n');

  try {
    // Test basic template processing
    console.log('1. Testing basic template processing...');
    
    // Create a simple template file
    const fs = require('fs').promises;
    await fs.writeFile('./templates/simple.tpl', simpleTemplate);
    
    const result = await parser.processTemplate('simple.tpl', testData);
    console.log('Template processed successfully!');
    console.log('Result length:', result.length);
    
    // Show cache statistics
    const cacheStats = parser.getCacheSize();
    console.log('\nCache Statistics:');
    console.log('- Templates cached:', cacheStats.templates);
    console.log('- Component indexes:', cacheStats.components);
    console.log('- Component data:', cacheStats.componentData);

    // Test component data retrieval
    console.log('\nComponent Data Test:');
    const categoriesData = parser.componentData.get('content_categories');
    console.log('Content categories data:', categoriesData ? 'Available' : 'Not found');

    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Error testing parser:', error);
  }
}

// Run the test
testParser(); 