@digital_asset_comp = [data-v-component-digital_assets]
@digital_asset      = [data-v-component-digital_assets] [data-v-digital_asset]

@digital_asset|deleteAllButFirstChild

@digital_asset|before = <?php
if (isset($_digital_assets_idx)) $_digital_assets_idx++; else $_digital_assets_idx = 0;
$assetsData = $this->_component['digital_assets'][$_digital_assets_idx];
$assets = $assetsData['digital_asset'];

if($assets && is_array($assets)) {
	foreach ($assets as $index => $asset) {?>
		
		@digital_asset [data-v-digital_asset-name]|innerText = $asset['name']
		@digital_asset [data-v-digital_asset-thumbnail]|src = $asset['thumbnail']
		@digital_asset [data-v-digital_asset-download_url]|href = $asset['download_url']
	
	@digital_asset|after = <?php 
	} 
}
?>

<div data-v-component-digital_assets>
    <div data-v-digital_asset>
        <img data-v-digital_asset-thumbnail src="/placeholder.png">
        <span data-v-digital_asset-name>Asset Name</span>
        <a data-v-digital_asset-download_url href="#">Download</a>
    </div>
</div> 