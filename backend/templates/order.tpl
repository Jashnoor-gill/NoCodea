@order-product = [data-v-component-order] [data-v-cart] [data-v-order-product]
@order-product|deleteAllButFirstChild
@order-product|before = <?php
if (isset($order_idx)) $order_idx++; else $order_idx = 0;
$order = $this->_component['order'][$order_idx];
$products = $order['products'];
if($products && is_array($products)) foreach ($products as $index => $product) {?>
    @order-product [data-v-order-product-name]|innerText = $product['name']
    @order-product [data-v-order-product-price]|innerText = $product['price']
    @order-product [data-v-order-product-qty]|innerText = $product['qty']
    @order-product [data-v-order-product-image]|src = $product['image']
@order-product|after = <?php }?>

@total = [data-v-component-order] [data-v-order-totals-total]
@total|deleteAllButFirstChild
@total|before = <?php
$totals = $order['total'];
if($totals && is_array($totals)) foreach ($totals as $index => $total) {?>
    @total [data-v-order-total-title]|innerText = $total['title']
    @total [data-v-order-total-value]|innerText = $total['value']
@total|after = <?php }?>

@history = [data-v-component-order] [data-v-order-history]
@history|deleteAllButFirstChild
@history|before = <?php
$histories = $order['history'];
if($histories && is_array($histories)) foreach ($histories as $index => $history) {?>
    @history [data-v-order-history-status]|innerText = $history['status']
    @history [data-v-order-history-date]|innerText = $history['date']
    @history [data-v-order-history-comment]|innerText = $history['comment']
@history|after = <?php }?>

<div data-v-component-order>
    <div data-v-cart>
        <div data-v-order-product>
            <span data-v-order-product-name>Product Name</span>
            <span data-v-order-product-price>Price</span>
            <span data-v-order-product-qty>Qty</span>
            <img data-v-order-product-image src="/default-product.png">
        </div>
    </div>
    <div data-v-order-totals-total>
        <span data-v-order-total-title>Total</span>
        <span data-v-order-total-value>0.00</span>
    </div>
    <div data-v-order-history>
        <span data-v-order-history-status>Status</span>
        <span data-v-order-history-date>Date</span>
        <span data-v-order-history-comment>Comment</span>
    </div>
</div> 