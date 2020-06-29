
# @julpy/swag-wrap

[![GitHub license](https://img.shields.io/github/license/co-demos/swag-wrap)](https://github.com/co-demos/swag-wrap/blob/master/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap)

Simple swagger.json wrapper with Axios

## Install

```terminal
npm install @julpy/swag-wrap
```

## Usage

```js
import APILib from '@julpy/swag-wrap'

const options = {
  protocol: 'https', // optional - default: 'https'
  swaggerUrl: 'https://www.data.gouv.fr/api/1/swagger.json', // mandatory
  apiDomain: 'https://www.data.gouv.fr', // mandatory
  apiVersion: '', // optional - default: '' - example : '/api/1'
}
const MyAPI = new APILib( options )

let response = MyAPI.getDatasets()

```
