const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

class TemplateParser {
    constructor() {
        this.clearCache();
    }

    clearCache() {
        this.componentData = new Map();
        this.templateCache = new Map();
        this.aliases = new Map();
        this.componentIndexes = new Map();
    }

    setComponentData(name, data) {
        this.componentData.set(name, data);
    }

    async getTemplate(templatePath) {
        const fullPath = path.resolve(__dirname, '..', 'templates', templatePath);
        if (this.templateCache.has(fullPath)) return this.templateCache.get(fullPath);
        const content = await fs.readFile(fullPath, 'utf8');
        this.templateCache.set(fullPath, content);
        return content;
    }

    async processTemplate(templatePath) {
        const templateContent = await this.getTemplate(templatePath);

        // Dispatch based on template syntax
        if (templateContent.includes('data-v-component-')) {
            return this._processDataVTemplate(templateContent, templatePath);
        } else {
            return this._processLegacyTemplate(templateContent);
        }
    }

    _processDataVTemplate(templateContent, templatePath) {
        const isXml = path.extname(templatePath) === '.xml';
        const options = { decodeEntities: false, xmlMode: isXml };
        const $ = cheerio.load(templateContent, options);
    
        $('*').filter((i, el) => Object.keys(el.attribs).some(attr => attr.startsWith('data-v-component-')))
            .each((i, componentNode) => {
                const $componentNode = $(componentNode);
                const componentData = $componentNode.data();
                
                const componentTypeKey = Object.keys(componentData).find(k => k.startsWith('vComponent'));
                if (!componentTypeKey) return;
    
                const componentType = componentTypeKey.substring('vComponent'.length).toLowerCase();
                const componentName = componentData[componentTypeKey];
                const singularType = componentType.endsWith('s') ? componentType.slice(0, -1) : componentType;
    
                const $loopItemTemplates = $componentNode.find(`[data-v-${singularType}]`);
                if (!$loopItemTemplates.length) return;
                
                const loopItemHtml = $.html($loopItemTemplates.first());
                const data = this.componentData.get(componentName) || this.componentData.get(componentType) || [];
                
                $loopItemTemplates.remove();
    
                data.forEach(item => {
                    const $newItem = $(loopItemHtml);
    
                    $newItem.find('*').addBack($newItem).each((j, subEl) => {
                        const $subEl = $(subEl);
                        const subElData = $subEl.data();
                        
                        for (const key in subElData) {
                            const prefix = `v${singularType}`.toLowerCase();
                            if (key.toLowerCase().startsWith(prefix)) {
                                const dataKey = subElData[key];
                                if (item[dataKey] !== undefined) {
                                    $subEl.text(item[dataKey]);
                                    if ($subEl.data('filter-cdata') !== undefined) {
                                         $subEl.html(`<![CDATA[${$subEl.text()}]]>`);
                                    }
                                }
                            }
                        }
                    });
                    $componentNode.append($newItem);
                });
            });
    
        return isXml ? $.xml() : $.html();
    }

    _processLegacyTemplate(templateContent) {
        const lines = templateContent.split('\n');
        
        this.parseAliases(lines);

        const htmlContent = templateContent.substring(templateContent.indexOf('<'));
        const $ = cheerio.load(htmlContent, { decodeEntities: false });
        
        const mainLoopRule = lines.find(l => l.includes('|before') && l.includes('foreach'));
        if (mainLoopRule) {
            this.executeLoop($, mainLoopRule, lines);
        }

        return $.html();
    }

    parseAliases(lines) {
        this.aliases.clear();
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('@') && trimmed.includes('=')) {
                const [alias, selector] = trimmed.split('=').map(s => s.trim());
                if (alias && selector && !alias.includes('|')) {
                    this.aliases.set(alias, selector);
                }
            }
        });
    }

    resolveSelector(selector) {
        const alias = selector.trim();
        return this.aliases.get(alias) || alias;
    }

    executeLoop($, mainLoopRule, lines) {
        const [selectorPart] = mainLoopRule.split('|');
        const selector = this.resolveSelector(selectorPart);
        
        const $templateNode = $(selector).first().clone();
        const $container = $(selector).parent();
        $container.empty();

        const loopDefMatch = mainLoopRule.match(/foreach\s*\(\s*\$(.*?)\s*as\s*\$(.*?)\s*\)/);
        if (!loopDefMatch) return;
        const [, listVar, itemVar] = loopDefMatch;

        const contextDef = lines.find(l => l.includes('$this->_component'));
        const compMatch = contextDef.match(/\$(\w+)\s*=\s*\$this->_component\['(.*?)'\]/);
        if (!compMatch) return;
        const [, , compName] = compMatch;
        const componentDataContext = (this.componentData.get(compName) || [])[0] || {};
        
        const loopData = componentDataContext[listVar];
        if (!Array.isArray(loopData)) return;
        
        const loopStartLine = lines.indexOf(mainLoopRule);
        const loopEndLine = lines.findIndex(l => l.trim().startsWith('@') && l.includes('|after'));
        const loopBodyRules = lines.slice(loopStartLine + 1, loopEndLine);
        
        loopData.forEach(item => {
            const $newNode = $templateNode.clone();
            loopBodyRules.forEach(ruleText => {
                const [left, right] = ruleText.trim().split('=').map(s => s.trim());
                const [ruleSelectorPart, action = 'innerText'] = left.split('|');
                
                const valueExpr = right.replace(`$${itemVar}`, 'item');
                const value = this.evaluate(valueExpr, item);

                const ruleSelector = this.resolveSelector(ruleSelectorPart);
                const $el = $newNode.find(ruleSelector).addBack(ruleSelector);
                
                if (action === 'innerText') $el.text(value);
                else $el.attr(action, value);
            });
            $container.append($newNode);
        });
    }

    evaluate(expression, item) {
        const [obj, key] = expression.split("['").map(s => s.replace("']", ""));
        if (obj === 'item' && item[key]) {
            return item[key];
        }
        return expression;
    }
}

module.exports = TemplateParser; 