[data-v-component-category]|before = <?php
if (isset($_category_idx)) $_category_idx++; else $_category_idx = 0;
$_category = $this->_component['category'][$_category_idx];
?>

[data-v-component-category] [data-v-category-name] = $_category['name']

//catch all data attributes
//[data-v-component-category] [data-v-category-*] = $_category['@@__data-v-category-(*)__@@']

<div data-v-component-category>
  <h1 data-v-category-name>Category Name</h1>
  <div data-v-category-description>Category description goes here.</div>
</div> 