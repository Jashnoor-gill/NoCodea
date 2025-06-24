@language = [data-v-component-language] [data-v-language]
@language|deleteAllButFirstChild

@language|before = <?php
if (isset($_language_idx)) $_language_idx++; else $_language_idx = 0;
$languageData = $this->_component['language'][$_language_idx];
$languages = $languageData['language'];
$active = $languageData['active'];

if($languages && is_array($languages)) {
    foreach ($languages as $index => $lang) {?>
        @language [data-v-language-name]|innerText = $lang['name']
        @language [data-v-language-img]|src = $lang['img']
        @language [data-v-language-url]|href = $lang['url']
        @language [data-v-language-code]|value = $lang['code']
        @language [data-v-language-language_id]|value = $lang['language_id']
    @language|after = <?php }
}
?>

<div data-v-component-language>
    <div data-v-language>
        <img data-v-language-img src="/default-lang.png">
        <span data-v-language-name>English</span>
        <a data-v-language-url href="#">Switch</a>
        <input data-v-language-code type="hidden" value="en">
        <input data-v-language-language_id type="hidden" value="1">
    </div>
</div> 