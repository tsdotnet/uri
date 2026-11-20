![@tsdotnet/uri: URLs, in parts. Parse, inspect and rebuild a Uri.](https://cdn.jsdelivr.net/gh/tsdotnet/uri@master/assets/banner.svg)

[![npm version](https://img.shields.io/npm/v/@tsdotnet/uri.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/uri)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/uri/blob/master/LICENSE)

`Uri` parses and builds URIs into frozen, typed parts, like .NET's `Uri`.

## Install

```sh
npm install @tsdotnet/uri
```

## Usage

```ts
import { Uri } from '@tsdotnet/uri';

const uri = Uri.from('https://example.com:8080/docs/intro?page=2#top');
uri.host; // "example.com"
uri.port; // 8080
const next = uri.updateQuery({ page: 3 }); // a new Uri; the original is frozen
```

`QueryBuilder` builds and edits query strings.

## Use it from

ESM (`import { Uri } from '@tsdotnet/uri';`) or CommonJS (`const { Uri } = require('@tsdotnet/uri');`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/exceptions@1/dist/umd/exceptions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/type@1/dist/umd/type.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/key-value-pair@1/dist/umd/key-value-pair.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/compare@1/dist/umd/compare.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/collection-base@2/dist/umd/collection-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/linked-node-list@1/dist/umd/linked-node-list.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/ordered-registry@1/dist/umd/ordered-registry.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/serialization@1/dist/umd/serialization.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/text-utility@1/dist/umd/text-utility.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/uri@2/dist/umd/uri.min.js"></script>
<script>
  const { Uri } = tsdotnet.uri;
</script>
```

</details>

## Docs

[tsdotnet.github.io/uri](https://tsdotnet.github.io/uri/)
