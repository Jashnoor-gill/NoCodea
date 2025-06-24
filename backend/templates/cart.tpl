@cart-product = [data-v-component-cart] [data-v-cart-product]
@cart-product|deleteAllButFirstChild

[data-v-component-cart]|prepend = <?php
$vvveb_is_page_edit = Vvveb\isEditor();
if (isset($_cart_idx)) $_cart_idx++; else $_cart_idx = 0;

$previous_component = isset($current_component)?$current_component:null;
$cart = $current_component = $this->_component['cart'][$_cart_idx] ?? [];

$_pagination_count = $cart['count'] ?? 0;
$_pagination_limit = isset($cart['limit']) ? $cart['limit'] : 5;

$products = $cart['products'] ?? [];
?>

[data-v-component-cart] [data-v-total_items] = $cart['total_items']
[data-v-component-cart] [data-v-grand-total] = $cart['total']
[data-v-component-cart] [data-v-grand-total_formatted] = $cart['total_formatted']
[data-v-component-cart] [data-v-cart-cart-*]|innerText = $cart['@@__data-v-cart-cart-(*)__@@']

@cart-product|before = <?php
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => ['product_id' => 1, 'image' => '#']] : false;
$products = empty($products) ? $_default : $products;

if($products) {
	foreach ($products as $key => $product) { ?>

	//catch all data attributes
	@cart-product [data-v-cart-product-*]|innerText  = $product['@@__data-v-cart-product-(*)__@@']
	@cart-product a[data-v-cart-product-*]|href      = $product['@@__data-v-cart-product-(*)__@@']
	@cart-product img[data-v-cart-product-*]|src     = $product['@@__data-v-cart-product-(*)__@@']
	@cart-product input[data-v-cart-product-*]|value = $product['@@__data-v-cart-product-(*)__@@']
	@cart-product|data-product_id = $product['product_id']

	@cart-product|data-product_id = $product['product_id']		
	@cart-product|data-key = $key	

	@cart-product [data-v-cart-product-image]|src = $product['image']


@cart-product|after = <?php } 
}
?>


@cart-option = [data-v-component-cart] [data-v-cart-product] [data-v-product-option]
@cart-option|deleteAllButFirstChild


@cart-option|before = <?php
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => 'product_option_value_id'] : false;
$option_value = empty($product['option_value']) ? $_default : $product['option_value'];

if($option_value) {
	foreach ($option_value as $product_option_value_id => $value) { ?>

	@cart-option [data-v-product-option-*]|innerText = $value['@@__data-v-product-option-(*)__@@']


@cart-option|after = <?php } 
}
?>


@total = [data-v-component-cart] [data-v-cart-totals] [data-v-cart-total]

@total|deleteAllButFirstChild
@total|before = <?php

$totals  = $cart['totals'] ?? [];
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => []] : false;
$totals = empty($totals) ? $_default : $totals;

if(is_array($totals)) foreach ($totals as $index => $total) {
?>

	//catch all data attributes
	@total [data-v-cart-total-*]|innerText  = $total['@@__data-v-cart-total-(*)__@@']
	@total a[data-v-cart-total-*]|href      = $total['@@__data-v-cart-total-(*)__@@']
	@total input[data-v-cart-total-*]|value = $total['@@__data-v-cart-total-(*)__@@']

@total|after = <?php }?>


@coupon = [data-v-component-cart] [data-v-cart-coupons] [data-v-cart-coupon]

@coupon|deleteAllButFirstChild
@coupon|before = <?php

$coupons  = $cart['coupons'] ?? [];
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => []] : false;
$coupons = empty($coupons) ? $_default : $coupons;

if(is_array($coupons)) foreach ($coupons as $index => $coupon) {
?>

	//catch all data attributes
	@coupon [data-v-cart-coupon-*]|innerText =  $coupon['@@__data-v-cart-coupon-(*)__@@']
	@coupon a[data-v-cart-coupon-*]|href = $coupon['@@__data-v-cart-coupon-(*)__@@']
	@coupon input[data-v-cart-coupon-*]|value = $coupon['@@__data-v-cart-coupon-(*)__@@']

@coupon|after = <?php }?>

<div data-v-component-cart>
    <h2>Shopping Cart</h2>
    <div data-v-cart-products>
        <div data-v-cart-product>
            <img data-v-cart-product-image src="#" alt="">
            <h4 data-v-cart-product-name>Product Name</h4>
            <div data-v-cart-product-options>
                <div data-v-product-option>
                    <span data-v-product-option-name>Option</span>: <span data-v-product-option-value>Value</span>
                </div>
            </div>
            <input data-v-cart-product-quantity type="number" value="1">
            <div data-v-cart-product-price>Price</div>
            <div data-v-cart-product-total>Total</div>
        </div>
    </div>
    <div data-v-cart-totals>
        <div data-v-cart-total>
            <span data-v-cart-total-title>Sub-Total</span>
            <span data-v-cart-total-amount>0.00</span>
        </div>
        <div data-v-cart-total>
            <span data-v-cart-total-title>Grand Total</span>
            <span data-v-cart-total-amount data-v-grand-total_formatted>0.00</span>
        </div>
    </div>
    <div data-v-cart-coupons>
        <div data-v-cart-coupon>
            <span data-v-cart-coupon-name>Coupon Name</span>
            <span data-v-cart-coupon-info>Coupon Info</span>
        </div>
    </div>
    <div>Total items: <span data-v-total_items>0</span></div>
</div> 