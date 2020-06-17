const test = require('ava');
const { ViewModelRelatedDocuments } = require('../src');

const config = {
  [ViewModelRelatedDocuments.configKey]: {
    ...ViewModelRelatedDocuments.defaultConfig(),
    events: [],
    key: 'relatedDocs',
    limit: 1,
  },
};
const hooks = {
  on: () => {},
  fetch: () => [
    {
      updateDate: null,
      createDate: new Date('2019-04-20').toISOString(),
      slug: 'good-title',
      tags: ['cool', 'blue'],
    },
    {
      updateDate: new Date('2019-04-21').toISOString(),
      createDate: new Date('2019-04-21').toISOString(),
      slug: 'fake-title',
      tags: ['cool', 'red'],
    },
  ],
};

test('ViewModelRelatedDocuments.register(context): can register', (t) => {
  t.notThrows(() => {
    ViewModelRelatedDocuments.register({ hooks: { on: () => {} }, config: { [ViewModelRelatedDocuments.configKey]: { events: { callback: [] } } } });
  });
});

test('ViewModelRelatedDocuments.register(context): errors without event dispatcher', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.register({ hooks: {} });
  }, { message: 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.' });
});

test('ViewModelRelatedDocuments.register(context): errors without events', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.register({ hooks: { on: () => {} }, config: { [ViewModelRelatedDocuments.configKey]: { } } });
  }, { message: 'Missing events to listen to for in \'config.events\'.' });
});

test('ViewModelRelatedDocuments.defaultConfig(): can return a default config', (t) => {
  t.notThrows(ViewModelRelatedDocuments.defaultConfig);
});

test('ViewModelRelatedDocuments.validateConfig(config, _context): throws when configuration key is missing', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.validateConfig({});
  }, { message: 'Config Error: \'uttori-plugin-vm-related-documents\' configuration key is missing.' });
});

test('ViewModelRelatedDocuments.validateConfig(config, _context): throws when ignore_slugs is not an array', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.validateConfig({
      [ViewModelRelatedDocuments.configKey]: {
        ignore_slugs: {},
      },
    });
  }, { message: 'Config Error: `ignore_slugs` is should be an array.' });
});

test('ViewModelRelatedDocuments.validateConfig(config, _context): throws when limit is not a number', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.validateConfig({
      [ViewModelRelatedDocuments.configKey]: {
        limit: '10',
      },
    });
  }, { message: 'Config Error: `limit` should be a number.' });
});

test('ViewModelRelatedDocuments.validateConfig(config, _context): throws when key is not a string', (t) => {
  t.throws(() => {
    ViewModelRelatedDocuments.validateConfig({
      [ViewModelRelatedDocuments.configKey]: {
        key: 10,
      },
    });
  }, { message: 'Config Error: `key` should be a valid Object key string.' });
});

test('ViewModelRelatedDocuments.validateConfig(config, _context): can validate', (t) => {
  t.notThrows(() => {
    ViewModelRelatedDocuments.validateConfig({
      [ViewModelRelatedDocuments.configKey]: {
        key: 'popularDocuments',
        limit: 10,
        ignore_slugs: ['home-page'],
      },
    });
  });
});

test('ViewModelRelatedDocuments.callback(viewModel, context): returns the input when an invalid structure is provided', async (t) => {
  t.plan(4);
  let viewModel = {};
  let output = await ViewModelRelatedDocuments.callback(null, { config: { ...config, [ViewModelRelatedDocuments.configKey]: { key: 'relatedDocs', limit: 0 } }, hooks });
  t.is(output, null);

  viewModel = {};
  output = await ViewModelRelatedDocuments.callback(viewModel, { config: { ...config, [ViewModelRelatedDocuments.configKey]: { key: 'relatedDocs', limit: 0 } }, hooks });
  t.deepEqual(output, viewModel);

  viewModel = { document: {} };
  output = await ViewModelRelatedDocuments.callback(viewModel, { config: { ...config, [ViewModelRelatedDocuments.configKey]: { key: 'relatedDocs', limit: 0 } }, hooks });
  t.deepEqual(output, viewModel);

  viewModel = { document: { tags: {} } };
  output = await ViewModelRelatedDocuments.callback(viewModel, { config: { ...config, [ViewModelRelatedDocuments.configKey]: { key: 'relatedDocs', limit: 0 } }, hooks });
  t.deepEqual(output, viewModel);
});

test('ViewModelRelatedDocuments.callback(viewModel, context): adds an empty array when limit is less than 1', async (t) => {
  t.plan(1);
  const viewModel = {
    document: {
      tags: ['cool'],
    },
  };
  const output = await ViewModelRelatedDocuments.callback(viewModel, { config: { ...config, [ViewModelRelatedDocuments.configKey]: { key: 'relatedDocs', limit: 0 } }, hooks });
  t.deepEqual(output, {
    document: {
      tags: ['cool'],
    },
    relatedDocs: [],
  });
});

test('ViewModelRelatedDocuments.callback(viewModel, context): can return related documents', async (t) => {
  t.plan(1);
  const viewModel = {
    document: {
      tags: ['cool'],
    },
  };
  const output = await ViewModelRelatedDocuments.callback(viewModel, { config, hooks });
  t.deepEqual(output, {
    document: {
      tags: ['cool'],
    },
    relatedDocs: [
      {
        updateDate: null,
        createDate: new Date('2019-04-20').toISOString(),
        slug: 'good-title',
        tags: ['cool', 'blue'],
      },
      {
        updateDate: new Date('2019-04-21').toISOString(),
        createDate: new Date('2019-04-21').toISOString(),
        slug: 'fake-title',
        tags: ['cool', 'red'],
      },
    ],
  });
});
