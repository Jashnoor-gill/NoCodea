@currencies = [data-v-component-currency]
@currency = [data-v-component-currency] [data-v-currency]

@currency|deleteAllButFirstChild

@currency|before = <?php
if (isset($_currency_idx)) $_currency_idx++; else $_currency_idx = 0;
$currencyData = $this->_component['currency'][$_currency_idx];
$currencies = $currencyData['currency'];

if($currencies)  {
	foreach ( $currencies as $index => $currency) { 
?>
	
	@currency [data-v-currency-name]|innerText = $currency['name']
	@currency [data-v-currency-code]|value = $currency['code']
	
	@currency|after = <?php 
	} 
}
?>

<div data-v-component-currency>
    <span data-v-currency-info-name>US Dollar</span>
    <div data-v-currency>
        <button class="dropdown-item" data-v-currency-code value="USD">
            <span data-v-currency-name>USD</span>
        </button>
    </div>
</div> 