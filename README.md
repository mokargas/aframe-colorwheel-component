## aframe-colorwheel-component

[![Version](http://img.shields.io/npm/v/aframe-colorwheel-component.svg?style=flat-square)](https://npmjs.org/package/aframe-colorwheel-component)
[![License](http://img.shields.io/npm/l/aframe-colorwheel-component.svg?style=flat-square)](https://npmjs.org/package/aframe-colorwheel-component)

A-Frame Color Wheel component, designed to be used with A-Frame Material

***NOTE: A-Frame Material is not required to use this component***

For [A-Frame](https://aframe.io).

![Example of Colorwheel](https://raw.githubusercontent.com/mokargas/aframe-colorwheel-component/master/examples/acwc.gif "Example of Colorwheel")

### Examples

* [Basic](https://mokargas.github.io/aframe-colorwheel-component/examples/basic)

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| disabled         | Wether the color wheel responds to clicks or taps            |  false              |
| backgroundcolor         | Background color of the UI        |  #fff              |
| wheelSize         | Size (m)  if the color wheel element     |  0.4 (40cm)             |
| showSelection         | Show the color-selected circle (top left corner of UI)    |  true              |
| selectionSize         | Size (m) of the selection circle, if enabled    |  0.10 (10cm)              |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-colorwheel-component/dist/aframe-colorwheel-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity colorwheel></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-colorwheel-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-colorwheel-component
```

Then require and use.

```js
require('aframe');
require('aframe-colorwheel-component');
```

#### TODO / Roadmap

* Deeper customisation (padding, background colors, shader style)
* Interop testing
