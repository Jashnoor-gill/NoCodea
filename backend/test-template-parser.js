const TemplateParser = require('./services/templateParser');

// Create a new instance of the template parser
const parser = new TemplateParser();

// Test data for different components
const testData = {
  // Content categories data
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
            },
            {
              taxonomy_item_id: 3,
              name: 'Laptops',
              url: '/category/electronics/laptops',
              images: ['/images/laptops.jpg'],
              parent_id: 1,
              active: true
            }
          ]
        },
        {
          taxonomy_item_id: 4,
          name: 'Clothing',
          url: '/category/clothing',
          images: ['/images/clothing.jpg'],
          parent_id: 0,
          active: false
        }
      ]
    }
  },

  // Product categories data
  product_categories: {
    0: {
      count: 3,
      limit: 5,
      categories: [
        {
          taxonomy_item_id: 1,
          name: 'Digital Products',
          url: '/products/digital',
          images: ['/images/digital.jpg'],
          parent_id: 0,
          active: true
        },
        {
          taxonomy_item_id: 2,
          name: 'Physical Products',
          url: '/products/physical',
          images: ['/images/physical.jpg'],
          parent_id: 0,
          active: false
        }
      ]
    }
  },

  // Product manufacturers data
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
        },
        {
          manufacturer_id: 2,
          name: 'Samsung Electronics',
          content: 'Global electronics manufacturer',
          image: '/images/samsung.jpg',
          active: false
        }
      ]
    }
  },

  // Product options data
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
            },
            {
              product_option_value_id: 2,
              name: 'Blue',
              price: '+$15.00',
              image: '/images/blue.jpg',
              checked: false
            }
          ]
        },
        {
          product_option_id: 2,
          option_id: 2,
          name: 'Size',
          type: 'select',
          required: false,
          values: [
            {
              product_option_value_id: 3,
              name: 'Small',
              price: '+$5.00',
              checked: false
            },
            {
              product_option_value_id: 4,
              name: 'Large',
              price: '+$20.00',
              checked: true
            }
          ]
        }
      ]
    }
  }
};

// Set component data for the parser
parser.setComponentData('content_categories', testData.content_categories);
parser.setComponentData('product_categories', testData.product_categories);
parser.setComponentData('product_manufacturers', testData.product_manufacturers);
parser.setComponentData('product_options', testData.product_options);

// Test template 1: Content Categories
const contentCategoriesTemplate = `
@categories = [data-v-component-content-categories] [data-v-cats]
@category   = [data-v-component-content-categories] [data-v-cats] [data-v-cat]

@categories|deleteAllButFirstChild
@category|deleteAllButFirstChild

[data-v-component-content-categories]|prepend = <?php
//make sure that the instance is unique even if the component is added into a loop inside a compomonent like data-v-posts
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
$generate_menu($_categories[key($_categories)]['parent_id'] ?? 0, $_categories); }
}
?>

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
`;

// Test template 2: Product Manufacturers
const manufacturersTemplate = `
@manufacturers =  [data-v-component-product-manufacturers]
@manufacturer  = [data-v-component-product-manufacturers] [data-v-manufacturer]

@manufacturer|deleteAllButFirstChild

@manufacturers|prepend = <?php
$vvveb_is_page_edit = Vvveb\isEditor();
if (isset($_manufacturers_idx)) $_manufacturers_idx++; else $_manufacturers_idx = 0;
$previous_component = isset($current_component)?$current_component:null;
$manufacturers = $current_component = $this->_component['product_manufacturers'][$_manufacturers_idx] ?? [];

$_pagination_count = $manufacturers['count'] ?? 0;
$_pagination_limit = isset($manufacturers['limit']) ? $manufacturers['limit'] : 5;	
?>

@manufacturer|before = <?php
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => []] : false;
$manufacturers['manufacturer'] = empty($manufacturers['manufacturer']) ? $_default : $manufacturers['manufacturer'];

if($manufacturers && is_array($manufacturers['manufacturer'])) {
	foreach ($manufacturers['manufacturer'] as $index => $manufacturer) {?>
		
		@manufacturer|data-manufacturer_id = $manufacturer['manufacturer_id']
		
		@manufacturer|id = <?php echo 'manufacturer-' . $manufacturer['manufacturer_id'];?>
		
		@manufacturer [data-v-manufacturer-content] = <?php echo($manufacturer['content']);?>
		
		@manufacturer img[data-v-manufacturer-*]|src = $manufacturer['@@__data-v-manufacturer-(*)__@@']
		
		@manufacturer [data-v-manufacturer-*]|innerText = $manufacturer['@@__data-v-manufacturer-(*)__@@']
		
		@manufacturer a[data-v-manufacturer-*]|href = $manufacturer['@@__data-v-manufacturer-(*)__@@']
		@manufacturer input[data-v-manufacturer-manufacturer_id]|addNewAttribute = <?php 
			if (isset($manufacturer['active']) && $manufacturer['active']) {
				echo 'checked';
			}
		?>
	
	@manufacturer|after = <?php 
	} 
}
?>

<div data-v-component-product-manufacturers>
    <div data-v-manufacturer>
        <h3 data-v-manufacturer-name>Manufacturer Name</h3>
        <div data-v-manufacturer-content>Manufacturer Description</div>
        <img data-v-manufacturer-image src="#" alt="">
        <input type="checkbox" data-manufacturer-manufacturer_id="">
    </div>
</div>
`;

// Test template 3: Product Options
const optionsTemplate = `
@options = [data-v-component-product-options]
@option  = [data-v-component-product-options] [data-v-option]
@value   = [data-v-component-product-options] [data-v-option] [data-v-value]

@option|deleteAllButFirstChild
@value|deleteAllButFirstChild

@options|prepend = <?php
$vvveb_is_page_edit = Vvveb\isEditor();
if (isset($_options_idx)) $_options_idx++; else $_options_idx = 0;
$previous_component = isset($current_component)?$current_component:null;
$product_options = $current_component = $this->_component['product_options'][$_options_idx] ?? [];

$options = $product_options['product_option'] ?? [];

$_pagination_count = $count = $product_options['count'] ?? 0;
$_pagination_limit = isset($options['limit']) ? $options['limit'] : 5;	
?>

@option|before = <?php
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [
  1 =>  [
    'product_option_id' => 1,
    'option_id' => 1,
	'required' => 1,
    'type' => 'radio',
    'values' => [ 0 => 
       [
        'product_option_value_id' => 1,
        'product_option_id' => 1,
        'product_id' => 1,
        'option_id' => 1,
        'option_value_id' => 1,
		'price' => 1,
		'image' => 'img',
		]
	]
  ] 
] : false;

$options = empty($options) ? $_default : $options;

if($options && is_array($options)) {
	foreach ($options as $index => $option) {?>
		
		@option|data-option_id = $option['option_id']
		
		@option|id = <?php echo 'option-' . ($option['product_option_id'] ?? 0);?>
		
		@option [data-v-option-content] = <?php echo($option['content'] ?? '');?>
		
		@option img[data-v-option-*]|src = $option['@@__data-v-option-(*)__@@']
		
		@option [data-v-option-*]|innerText = $option['@@__data-v-option-(*)__@@']
		
		@option [data-v-option-input]|value = $option['value']
		@option [data-v-option-input]|name = <?php echo 'option[' . $option['product_option_id'] . ']';?>
		
		@option a[data-v-option-*]|href = $option['@@__data-v-option-(*)__@@']
		
		@value|before = <?php
			if(isset($option['values']) && is_array($option['values'])) {
				foreach ($option['values'] as $vindex => $value) {?>

			@option option[data-v-value] = $value['name']
			@option option[data-v-value]|value = $value['product_option_value_id']

			@value [data-v-value-*]|innerText = $value['@@__data-v-value-(*)__@@']
			
			@value [data-v-value-input]|name = <?php echo 'option[' . $option['product_option_id'] . ']';?>
			@value [data-v-value-input]|addNewAttribute = <?php if ($option['required']) echo 'required';?>
			@value [data-v-value-input]|addNewAttribute = <?php if (isset($value['checked']) && $value['checked']) echo 'checked';?>
			@value [data-v-value-input]|value = $value['product_option_value_id']
			
			@value [data-v-value-price_formatted]|if_exists = $value['price']
						
			@value img[data-v-value-*]|src = $value['@@__data-v-value-(*)__@@']
	
		@value|after = <?php 
			} 
		} 
		?>
		
	@option|after = <?php 
	} 
}
?>

<div data-v-component-product-options>
    <div data-v-option>
        <label data-v-option-name>Option Name</label>
        <input data-v-option-input type="radio" name="" value="">
        <div data-v-values>
            <div data-v-value>
                <input data-v-value-input type="radio" name="" value="">
                <label data-v-value-name>Value Name</label>
                <span data-v-value-price>Price</span>
                <img data-v-value-image src="#" alt="">
            </div>
        </div>
    </div>
</div>
`;

// Test the templates
async function testTemplates() {
  console.log('=== Testing Enhanced Template Parser ===\n');

  try {
    // Test 1: Content Categories
    console.log('1. Testing Content Categories Template:');
    console.log('Input template length:', contentCategoriesTemplate.length);
    
    const processedCategories = await parser.processTemplate('content-categories.tpl', testData);
    console.log('Processed template length:', processedCategories.length);
    console.log('Categories processed successfully!\n');

    // Test 2: Product Manufacturers
    console.log('2. Testing Product Manufacturers Template:');
    console.log('Input template length:', manufacturersTemplate.length);
    
    const processedManufacturers = await parser.processTemplate('manufacturers.tpl', testData);
    console.log('Processed template length:', processedManufacturers.length);
    console.log('Manufacturers processed successfully!\n');

    // Test 3: Product Options
    console.log('3. Testing Product Options Template:');
    console.log('Input template length:', optionsTemplate.length);
    
    const processedOptions = await parser.processTemplate('options.tpl', testData);
    console.log('Processed template length:', processedOptions.length);
    console.log('Options processed successfully!\n');

    // Show cache statistics
    const cacheStats = parser.getCacheSize();
    console.log('Cache Statistics:');
    console.log('- Templates cached:', cacheStats.templates);
    console.log('- Component indexes:', cacheStats.components);
    console.log('- Component data:', cacheStats.componentData);

    // Test component data retrieval
    console.log('\nComponent Data Test:');
    const categoriesData = parser.componentData.get('content_categories');
    console.log('Content categories data:', categoriesData ? 'Available' : 'Not found');
    
    const manufacturersData = parser.componentData.get('product_manufacturers');
    console.log('Product manufacturers data:', manufacturersData ? 'Available' : 'Not found');

  } catch (error) {
    console.error('Error testing templates:', error);
  }
}

// Run the tests
testTemplates(); 