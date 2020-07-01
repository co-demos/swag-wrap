
# @julpy/swag-wrap

[![GitHub license](https://img.shields.io/github/license/co-demos/swag-wrap)](https://github.com/co-demos/swag-wrap/blob/master/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap)

Simple swagger.json wrapper for Vue

---------

## Install

```terminal
npm install @julpy/swag-wrap
```

-------
## Usage

#### in your vue app's `.env` file
```env
VUE_APP_SWAGGER_URL=https://www.data.gouv.fr/api/1/swagger.json
```

#### in your vue app's `main.js` file
```js
import APIcli from '@julpy/swag-wrap'

...

const options = {
  // get back your swagger json url and other options here
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL
}
// inject your API client plugin into your vue app
Vue.use(APIcli, options)

...

```

#### in any of your vue app's components

```vue
<template>
  <!-- my vue component -->
  <div>

    <div v-if="datasets">
      <!-- the data will be loaded, here as a boostrap table -->
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
      // the data you want to load and then display
      datasets: undefined
    }
  },
  created () {
    // get your swag-wrap client instance
    const API = this.$APIcli

    // define the path of your endpoint
    // this part is relative to your swagger specs.
    // note the order is important
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
