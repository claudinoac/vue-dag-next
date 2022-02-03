# 🏗Vue DAG Buildr (VueJS 3+)

> Data-driven directed acyclic graph (DAG) visual builder for Vue.js

 [![GitHub Actions](https://github.com/aleximb/vue-dag/workflows/run-tests/badge.svg)](https://github.com/aleximb/vue-dag/actions) [![Netlify Status](https://api.netlify.com/api/v1/badges/377debe3-712c-40c8-a4a8-2909fff31db4/deploy-status)](https://app.netlify.com/sites/vue-dag/deploys)
[![npm](https://img.shields.io/npm/v/vue-dag.svg) ![npm](https://img.shields.io/npm/dm/vue-dag.svg)](https://www.npmjs.com/package/vue-dag)
[![vue3](https://img.shields.io/badge/vue-3+-brightgreen.svg)](https://v3.vuejs.org/)
![GitHub](https://img.shields.io/github/license/aleximb/vue-dag.svg)

## Examples

[vue-dag-example.netlify.app](https://vue-dag-example.netlify.app/)

![Screenshot](docs/.vuepress/public/screenshot.png)

[eddy-analytics.org](https://eddy-analytics.org)

![Screenshot Eddy](docs/.vuepress/public/screenshot-eddy.png)


## Installation

```bash
npm install --save vue-dag-next
```
or 
```bash
yarn add vue-dag-next
```

Import and register the component
```js
import VueDag from 'vue-dag-next';
```

```js
components: {
    VueDag
}
```

Define the graph data
```js
data() {
    return {
        graphData: {
            config: {
                scale: 1,
                width: '100%',
                height: '100vh',
            },
            nodes: [
                {
                    id: 0,
                    x: 500 * Math.random(),
                    y: 500 * Math.random(),
                    component: <<custom component>>,
                    props: { exampleProp: '✨' },
                },
                {
                    id: 1,
                    x: 500 * Math.random(),
                    y: 500 * Math.random(),
                    content: 'Example content',
                },
                { id: 2, x: 500 * Math.random(), y: 500 * Math.random() },
            ],
            edges: [
                {
                    id: 0, from: 0, to: 1, edgeColor: 'red', arrowColor: 'red',
                },
                { id: 1, from: 1, to: 2 },
            ],
        },
    }
}
```

Use it in templates
```html
<vue-dag v-model="graphData"></vue-dag>
```

The component does not include any CSS. You'll need to import it separately:
```js
import 'vue-dag-next/dist/vue-dag-next.css';
```

Alternatively, you can import the SCSS version and overrite variables and styles
 ```scss
@import 'vue-dag-next/src/scss/vue-dag.scss';
```

Full documentation: [https://vue-dag-next.netlify.com/](https://vue-dag-next.netlify.com/)



## Project development setup


### Installs dependencies
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Lints and fixes files
```
yarn run lint
```

### Runs unit tests
```
yarn run test:unit
```

### Builds as library
```
yarn run build:library
```
