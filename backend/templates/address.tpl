@addresscomp = [data-v-component-user-address]
@address  = [data-v-component-user-address] [data-v-user_address]

@address|deleteAllButFirstChild

@addresscomp|prepend = <?php
$vvveb_is_page_edit = Vvveb\isEditor();
if (isset($_addresscomp_idx)) $_addresscomp_idx++; else $_addresscomp_idx = 0;
$previous_component = isset($current_component)?$current_component:null;
$addresscomp = $current_component = $this->_component['user_address'][$_addresscomp_idx] ?? [];

$count = $_pagination_count = $addresscomp['count'] ?? 0;
$_pagination_limit = isset($addresscomp['limit']) ? $addresscomp['limit'] : 5;	
$addresses = $addresscomp['user_address'] ?? [];
?>

@address|before = <?php
$_default = (isset($vvveb_is_page_edit) && $vvveb_is_page_edit ) ? [0 => ['user_address_id' => 1]] : false;
$addresses = empty($addresses) ? $_default : $addresses;

if($addresses) {
	foreach ($addresses as $index => $address) {?>
		
		@address|data-user_address_id = $address['user_address_id']
		
		@address|id = <?php echo 'address-' . $address['user_address_id'];?>
		
		@address [data-v-user_address-label-id]|id = <?php echo 'address_' . $address['user_address_id'];?>
		@address [data-v-user_address-label-for]|for = <?php echo 'address_' . $address['user_address_id'];?>
		
		@address img[data-v-user_address-*]|src = $address['@@__data-v-user_address-(*)__@@']
		
		@address [data-v-user_address-*]|innerText = $address['@@__data-v-user_address-(*)__@@']
		
		@address input[data-v-user_address-*]|value = $address['@@__data-v-user_address-(*)__@@']
		
		@address a[data-v-user_address-*]|href = $address['@@__data-v-user_address-(*)__@@']
	
	@address|after = <?php 
	} 
}
?>

<div data-v-component-user-address>
    <div data-v-user_address>
        <label data-v-user_address-label-id data-v-user_address-label-for>Address Label</label>
        <input data-v-user_address-first_name type="text" value="" placeholder="First Name">
        <input data-v-user_address-last_name type="text" value="" placeholder="Last Name">
        <input data-v-user_address-address type="text" value="" placeholder="Address">
        <input data-v-user_address-city type="text" value="" placeholder="City">
        <input data-v-user_address-postcode type="text" value="" placeholder="Postcode">
        <input data-v-user_address-phone type="tel" value="" placeholder="Phone">
    </div>
</div> 