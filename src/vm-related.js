const debug = require('debug')('Uttori.Plugin.ViewModel.RelatedDocuments');

/**
 * Uttori View Model Enrichment - Related Documents
 *
 * @example <caption>ViewModelRelatedDocuments</caption>
 * const viewModel = ViewModelRelatedDocuments.callback(viewModel, context);
 * @class
 */
class ViewModelRelatedDocuments {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>ViewModelRelatedDocuments.configKey</caption>
   * const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-vm-related-documents';
  }

  /**
   * The default configuration.
   *
   * @returns {object} The configuration.
   * @example <caption>ViewModelRelatedDocuments.defaultConfig()</caption>
   * const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
   * @static
   */
  static defaultConfig() {
    return {
      // Key to use in the view model
      key: 'relatedDocuments',

      // Number of documents to return.
      limit: 10,

      // Slugs to not consider when selecting the related documents.
      ignore_slugs: [],
    };
  }

  /**
   * Validates the provided configuration for required entries.
   *
   * @param {object} config - A configuration object.
   * @param {object} config.configKey - A configuration object specifically for this plugin.
   * @param {string} config.configKey.key - The that will be added to the passed in object and returned with the related documents.
   * @param {string} config.configKey.limit - The maximum number of documents to be returned.
   * @param {object} _context - A Uttori-like context (unused).
   * @example <caption>ViewModelRelatedDocuments.validateConfig(config, _context)</caption>
   * ViewModelRelatedDocuments.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config[ViewModelRelatedDocuments.configKey]) {
      const error = `Config Error: '${ViewModelRelatedDocuments.configKey}' configuration key is missing.`;
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelRelatedDocuments.configKey].key && typeof config[ViewModelRelatedDocuments.configKey].key !== 'string') {
      const error = 'Config Error: `key` should be a valid Object key string.';
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelRelatedDocuments.configKey].limit && typeof config[ViewModelRelatedDocuments.configKey].limit !== 'number') {
      const error = 'Config Error: `limit` should be a number.';
      debug(error);
      throw new Error(error);
    }
    if (config[ViewModelRelatedDocuments.configKey].ignore_slugs && !Array.isArray(config[ViewModelRelatedDocuments.configKey].ignore_slugs)) {
      const error = 'Config Error: `ignore_slugs` is should be an array.';
      debug(error);
      throw new Error(error);
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @example <caption>ViewModelRelatedDocuments.register(context)</caption>
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [ViewModelRelatedDocuments.configKey]: {
   *       ...,
   *       events: {
   *         callback: ['document-save', 'document-delete'],
   *         validateConfig: ['validate-config'],
   *       },
   *     },
   *   },
   * };
   * ViewModelRelatedDocuments.register(context);
   * @static
   */
  static register(context) {
    debug('register');
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => context.hooks.on(event, ViewModelRelatedDocuments[method]));
    });
  }

  /**
   * Queries for related documents based on similar tags and searches the storage provider.
   *
   * @param {object} viewModel - A Uttori view-model object.
   * @param {object} viewModel.document - A Uttori document object.
   * @param {string[]} viewModel.document.tags - An array of tags to compare against.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {string} context.config.key - The key to add the array of documents to on the view-model.
   * @param {number} context.config.limit - The maximum number of documents to return.
   * @param {string[]} context.config.ignore_slugs - A list of slugs to not consider when fetching related documents.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Function} context.hooks.fetch - An event dispatch function that returns an array of results.
   * @returns {Promise<object>} The provided view-model document.
   * @example <caption>ViewModelRelatedDocuments.callback(viewModel, context)</caption>
   * const context = {
   *   config: {
   *     [ViewModelRelatedDocuments.configKey]: {
   *       ...,
   *     },
   *   },
   *   hooks: {
   *     on: (event) => { ... },
   *     fetch: (event, query) => { ... },
   *   },
   * };
   * ViewModelRelatedDocuments.callback(viewModel, context);
   * @static
   */
  static async callback(viewModel, context) {
    debug('callback');
    const { key, limit, ignore_slugs } = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
    debug(`key: "${key}", limit: ${limit}, ignore_slugs: [${ignore_slugs.join(',')}]`);
    if (!viewModel || !viewModel.document || !viewModel.document.tags || !Array.isArray(viewModel.document.tags)) {
      debug('Missing viewModel or document or tags.');
      return viewModel;
    }
    if (limit < 1) {
      viewModel[key] = [];
      return viewModel;
    }
    let results = [];
    const tags = `("${viewModel.document.tags.join('", "')}")`;
    const not_in = `"${ignore_slugs.join('", "')}"`;
    const query = `SELECT 'slug', 'title', 'tags', 'updateDate' FROM documents WHERE slug NOT_IN (${not_in}) AND tags INCLUDES ${tags} ORDER BY title ASC LIMIT ${limit}`;
    try {
      [results] = await context.hooks.fetch('storage-query', query);
    } catch (error) {
      /* istanbul ignore next */
      debug('Error:', error);
    }
    debug('results:', results.length);
    viewModel[key] = results;
    return viewModel;
  }
}

module.exports = ViewModelRelatedDocuments;
