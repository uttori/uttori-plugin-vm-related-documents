/**
 * Uttori View Model Enrichment - Related Documents
 * @example
 * <caption>ViewModelRelatedDocuments</caption>
 * const viewModel = ViewModelRelatedDocuments.callback(viewModel, context);
 */
declare class ViewModelRelatedDocuments {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>ViewModelRelatedDocuments.configKey</caption>
     * const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
     */
    static configKey: string;
    /**
     * The default configuration.
     * @example
     * <caption>ViewModelRelatedDocuments.defaultConfig()</caption>
     * const config = { ...ViewModelRelatedDocuments.defaultConfig(), ...context.config[ViewModelRelatedDocuments.configKey] };
     * @returns The configuration.
     */
    static defaultConfig(): any;
    /**
     * Validates the provided configuration for required entries.
     * @example
     * <caption>ViewModelRelatedDocuments.validateConfig(config, _context)</caption>
     * ViewModelRelatedDocuments.validateConfig({ ... });
     * @param config - A configuration object.
     * @param config.configKey - A configuration object specifically for this plugin.
     * @param config.configKey.key - The that will be added to the passed in object and returned with the related documents.
     * @param config.configKey.limit - The maximum number of documents to be returned.
     * @param _context - A Uttori-like context (unused).
     */
    static validateConfig(config: {
        configKey: {
            key: string;
            limit: string;
        };
    }, _context: any): void;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @example
     * <caption>ViewModelRelatedDocuments.register(context)</caption>
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
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     */
    static register(context: {
        config: {
            events: any;
        };
        hooks: {
            on: (...params: any[]) => any;
        };
    }): void;
    /**
     * Queries for related documents based on similar tags and searches the storage provider.
     * @example
     * <caption>ViewModelRelatedDocuments.callback(viewModel, context)</caption>
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
     * @param viewModel - A Uttori view-model object.
     * @param viewModel.document - A Uttori document object.
     * @param viewModel.document.tags - An array of tags to compare against.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.key - The key to add the array of documents to on the view-model.
     * @param context.config.limit - The maximum number of documents to return.
     * @param context.config.ignore_slugs - A list of slugs to not consider when fetching related documents.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.hooks.fetch - An event dispatch function that returns an array of results.
     * @returns The provided view-model document.
     */
    static callback(viewModel: {
        document: {
            tags: string[];
        };
    }, context: {
        config: {
            key: string;
            limit: number;
            ignore_slugs: string[];
        };
        hooks: {
            on: (...params: any[]) => any;
            fetch: (...params: any[]) => any;
        };
    }): Promise<object>;
}

