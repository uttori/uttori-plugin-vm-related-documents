[![view on npm](http://img.shields.io/npm/v/uttori-plugin-vm-related-documents.svg)](https://www.npmjs.org/package/uttori-plugin-vm-related-documents)
[![npm module downloads](http://img.shields.io/npm/dt/uttori-plugin-vm-related-documents.svg)](https://www.npmjs.org/package/uttori-plugin-vm-related-documents)
[![Build Status](https://travis-ci.org/uttori/uttori-plugin-vm-related-documents.svg?branch=master)](https://travis-ci.org/uttori/uttori-plugin-vm-related-documents)
[![Dependency Status](https://david-dm.org/uttori/uttori-plugin-vm-related-documents.svg)](https://david-dm.org/uttori/uttori-plugin-vm-related-documents)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-vm-related-documents/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-vm-related-documents?branch=master)

# Uttori View Model Enrichment - Related Documents

A plugin to expose and add related documents with shared tags for a given document to a view-model or other object.

## Install

```bash
npm install --save uttori-plugin-vm-related-documents
```

## Config

```js
{
  // Registration Events
  events: {
    callback: ['view-model-home'],
  },

  // Key to use in the view model
  key: 'relatedDocuments',

  // Number of documents to return.
  limit: 10,

  // A list of slugs to ignore
  ignore_slugs: [],
}
```

* * *

## API Reference

<a name="ViewModelRelatedDocuments"></a>

## ViewModelRelatedDocuments
Uttori View Model Enrichment - Related Documents

**Kind**: global class  

* [ViewModelRelatedDocuments](#ViewModelRelatedDocuments)
    * [.configKey](#ViewModelRelatedDocuments.configKey) ⇒ <code>String</code>
    * [.defaultConfig()](#ViewModelRelatedDocuments.defaultConfig) ⇒ <code>Object</code>
    * [.validateConfig(config, _context)](#ViewModelRelatedDocuments.validateConfig)
    * [.register(context)](#ViewModelRelatedDocuments.register)
    * [.callback(viewModel, context)](#ViewModelRelatedDocuments.callback) ⇒ <code>Object</code>

<a name="ViewModelRelatedDocuments.configKey"></a>

### ViewModelRelatedDocuments.configKey ⇒ <code>String</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>String</code> - The configuration key.  
**Example** *(ViewModelRelatedDocuments.configKey)*  
```js
const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
```
<a name="ViewModelRelatedDocuments.defaultConfig"></a>

### ViewModelRelatedDocuments.defaultConfig() ⇒ <code>Object</code>
The default configuration.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>Object</code> - The configuration.  
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
| config | <code>Object</code> | A configuration object. |
| config[ViewModelRelatedDocuments.configKey | <code>Object</code> | A configuration object specifically for this plugin. |
| config[ViewModelRelatedDocuments.configKey].key | <code>String</code> | The that will be added to the passed in object and returned with the related documents. |
| config[ViewModelRelatedDocuments.configKey].limit | <code>String</code> | The maximum number of documents to be returned. |
| _context | <code>Object</code> | A Uttori-like context (unused). |

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
| context | <code>Object</code> | A Uttori-like context. |
| context.hooks | <code>Object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>Object</code> | A provided configuration to use. |
| context.config.events | <code>Object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

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

### ViewModelRelatedDocuments.callback(viewModel, context) ⇒ <code>Object</code>
Queries for related documents based on similar tags and searches the storage provider.

**Kind**: static method of [<code>ViewModelRelatedDocuments</code>](#ViewModelRelatedDocuments)  
**Returns**: <code>Object</code> - The provided view-model document.  

| Param | Type | Description |
| --- | --- | --- |
| viewModel | <code>Object</code> | A Uttori view-model object. |
| viewModel.document | <code>Object</code> | A Uttori document object. |
| viewModel.document.tags | <code>Array.&lt;String&gt;</code> | An array of tags to compare against. |
| context | <code>Object</code> | A Uttori-like context. |
| context.config | <code>Object</code> | A provided configuration to use. |
| context.config.key | <code>String</code> | The key to add the array of documents to on the view-model. |
| context.config.limit | <code>Number</code> | The maximum number of documents to return. |
| context.config.ignore_slugs | <code>Array.&lt;String&gt;</code> | A list of slugs to not consider when fetching related documents. |
| context.storageProvider | <code>Object</code> | A provided Uttori StorageProvider instance. |
| context.storageProvider.getQuery | <code>function</code> | Access method for getting documents. |
| context.storageProvider | <code>Object</code> | A provided Uttori StorageProvider instance. |

**Example** *(ViewModelRelatedDocuments.callback(viewModel, context))*  
```js
const context = {
  config: {
    [ViewModelRelatedDocuments.configKey]: {
      ...,
    },
  },
  storageProvider: {
    getQuery: (query) => { ... }
  },
};
ViewModelRelatedDocuments.callback(viewModel, context);
```

* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
