<a name="ViewModelRelatedDocuments"></a>

## ViewModelRelatedDocuments
Uttori View Model Enrichment - Related Documents

**Kind**: global class  

* [ViewModelRelatedDocuments](#ViewModelRelatedDocuments)
    * [.configKey](#ViewModelRelatedDocuments.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#ViewModelRelatedDocuments.defaultConfig) ⇒ <code>object</code>
    * [.validateConfig(config, _context)](#ViewModelRelatedDocuments.validateConfig)
    * [.register(context)](#ViewModelRelatedDocuments.register)
    * [.callback(viewModel, context)](#ViewModelRelatedDocuments.callback) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="ViewModelRelatedDocuments.configKey"></a>

### ViewModelRelatedDocuments.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>string</code> - The configuration key.  
**Example** *(ViewModelRelatedDocuments.configKey)*  
```js
const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
```
<a name="ViewModelRelatedDocuments.defaultConfig"></a>

### ViewModelRelatedDocuments.defaultConfig() ⇒ <code>object</code>
The default configuration.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>object</code> - The configuration.  
**Example** *(ViewModelRelatedDocuments.defaultConfig())*  
```js
const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
```
<a name="ViewModelRelatedDocuments.validateConfig"></a>

### ViewModelRelatedDocuments.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | <code>object</code> | A configuration object specifically for this plugin. |
| config.configKey.key | <code>string</code> | The that will be added to the passed in object and returned with the related documents. |
| config.configKey.limit | <code>string</code> | The maximum number of documents to be returned. |
| _context | <code>object</code> | A Uttori-like context (unused). |

**Example** *(ViewModelRelatedDocuments.validateConfig(config, _context))*  
```js
ViewModelRelatedDocuments.validateConfig({ ... });
```
<a name="ViewModelRelatedDocuments.register"></a>

### ViewModelRelatedDocuments.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

**Example** *(ViewModelRelatedDocuments.register(context))*  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [ViewModelRelatedDocuments.configKey]: {
      ...,
      events: {
        callback: ['document-save', 'document-delete'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
ViewModelRelatedDocuments.register(context);
```
<a name="ViewModelRelatedDocuments.callback"></a>

### ViewModelRelatedDocuments.callback(viewModel, context) ⇒ <code>Promise.&lt;object&gt;</code>
Queries for related documents based on similar tags and searches the storage provider.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>Promise.&lt;object&gt;</code> - The provided view-model document.  

| Param | Type | Description |
| --- | --- | --- |
| viewModel | <code>object</code> | A Uttori view-model object. |
| viewModel.document | <code>object</code> | A Uttori document object. |
| viewModel.document.tags | <code>Array.&lt;string&gt;</code> | An array of tags to compare against. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.key | <code>string</code> | The key to add the array of documents to on the view-model. |
| context.config.limit | <code>number</code> | The maximum number of documents to return. |
| context.config.ignore_slugs | <code>Array.&lt;string&gt;</code> | A list of slugs to not consider when fetching related documents. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.hooks.fetch | <code>function</code> | An event dispatch function that returns an array of results. |

**Example** *(ViewModelRelatedDocuments.callback(viewModel, context))*  
```js
const context = {
  config: {
    [ViewModelRelatedDocuments.configKey]: {
      ...,
    },
  },
  hooks: {
    on: (event) => { ... },
    fetch: (event, query) => { ... },
  },
};
ViewModelRelatedDocuments.callback(viewModel, context);
```
