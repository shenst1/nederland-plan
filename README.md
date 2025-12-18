# Documentation Site

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator with Algolia search integration.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

## Algolia Search Setup

The site is configured with Algolia DocSearch. To enable search functionality, you'll need to:

1. Sign up for an Algolia account at https://www.algolia.com/
2. Create a new application
3. Create a search index
4. Update the following values in `docusaurus.config.ts`:
   - `appId`: Your Algolia Application ID
   - `apiKey`: Your Search-Only API Key (safe to commit)
   - `indexName`: Your index name

For more details, see the [Docusaurus Algolia documentation](https://docusaurus.io/docs/search#using-algolia-docsearch).

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
