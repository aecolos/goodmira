const { algoliasearch, instantsearch } = window;

const algoliaClient = algoliasearch('T83WKFQNOE', '089444be1b8f209e606228d12cdbf3cd');

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }
    return algoliaClient.search(requests);
  },
};

const search = instantsearch({
  indexName: 'odeidx_dev_ext',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: '',
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</h1>
  <a href={{url}} target="_blank">{{#helpers.highlight}}{ "attribute": "url" }{{/helpers.highlight}}</a>
  <p>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</p>
</article>
`,
    },
    transformItems(items) {
      const container = document.querySelector('#pagination');
      container.style.display = items.length === 0 ? 'none' : '';
      return items;
    }
  }),
  instantsearch.widgets.configure({
    facets: ['*'],
    maxValuesPerFacet: 20,
  }),
  instantsearch.widgets.dynamicWidgets({
    container: '#dynamic-widgets',
    fallbackWidget({ container, attribute }) {
      return instantsearch.widgets.refinementList({
        container,
        attribute,
      });
    },
    widgets: [
    ],
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
    totalPages: 0
  }),
]);

search.start();
