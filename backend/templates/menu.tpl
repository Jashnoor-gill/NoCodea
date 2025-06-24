@categories = [data-v-component-menu] [data-v-menu-items]
@category = [data-v-component-menu] [data-v-menu-item]
@categories|deleteAllButFirstChild
@category|deleteAllButFirstChild

@categories|before = <?php
if (isset($_menu_idx)) $_menu_idx++; else $_menu_idx = 0;
$menuData = $this->_component['menu'][$_menu_idx];
$menuItems = $menuData['menu_item'];
if($menuItems && is_array($menuItems)) {
    foreach ($menuItems as $index => $category) {?>
        @category [data-v-menu-item-name]|innerText = $category['name']
        @category [data-v-menu-item-content]|innerText = $category['content']
        @category [data-v-menu-item-url]|href = $category['url']
        @category [data-v-menu-item-img]|src = $category['images'][0]
        @category [data-v-menu-item-id]|value = $category['menu_item_id']
    @category|after = <?php }
}
?>

<div data-v-component-menu>
    <div data-v-menu-items>
        <div data-v-menu-item>
            <span data-v-menu-item-name>Menu Item</span>
            <span data-v-menu-item-content>Content</span>
            <a data-v-menu-item-url href="#">Link</a>
            <img data-v-menu-item-img src="/default-menu.png">
            <input data-v-menu-item-id type="hidden" value="1">
        </div>
    </div>
</div> 