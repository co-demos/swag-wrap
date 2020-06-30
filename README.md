
# @julpy/swag-wrap

[![GitHub license](https://img.shields.io/github/license/co-demos/swag-wrap)](https://github.com/co-demos/swag-wrap/blob/master/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap)

Simple swagger.json wrapper with Axios

## Install

```terminal
npm install @julpy/swag-wrap
```

## Usage

#### in your vue's `.env` file
```bash
VUE_APP_SWAGGER_URL=https://www.data.gouv.fr/api/1/swagger.json
```

#### in your vue's `main.js` file
```js
import APIcli from '@julpy/swag-wrap'

const options = {
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL
}

Vue.use(APIcli, options)

...

```

#### in any of your vue components
```vue
<template>
  <div>
    <div v-if="datasets">
      <b-table striped hover :items="datasets.data"></b-table>
    </div>
    <div v-else>
      ... loading Datasets
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      datasets: undefined
    }
  },
  created () {
    // get your client instance
    const API = this.$APIcli

    // define your path relative to your swagger
    const pathTags = ['datasets', 'list_datasets']

    // request data from this path
    API._request(pathTags).then(
      results => {
        // do something with the result
        this.datasets = results.body
      },
      reason => console.error('failed on api call: ' + reason)
    )
  }
}
</script>
```
