/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _copyToClipboard = __webpack_require__(2);
	
	var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);
	
	var _lodash = __webpack_require__(4);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Colorwheel for A-FRAME Material
	 * @author Mo Kargas (DEVLAD) mo@devlad.com
	 */
	
	var Event = __webpack_require__(5);
	
	AFRAME.registerComponent('colorwheel', {
	  dependencies: ['raycaster'],
	  tweenDuration: 280,
	  tweenEasing: TWEEN.Easing.Cubic.Out,
	  padding: 0.15,
	  hsv: {
	    h: 0.0,
	    s: 0.0,
	    v: 1.0
	  },
	  defaultMaterial: {
	    color: '#ffffff',
	    flatShading: true,
	    transparent: true,
	    shader: 'flat',
	    fog: false,
	    side: 'double'
	  },
	  color: '#ffffff',
	  schema: {
	    disabled: {
	      type: 'boolean',
	      default: false
	    },
	    backgroundColor: {
	      type: 'color',
	      default: '#FFF'
	    },
	    //Size of the colorWheel. NOTE: Assumed in metres.
	    wheelSize: {
	      type: 'number',
	      default: 0.4
	    },
	    //Show color choice in an element
	    showSelection: {
	      type: 'boolean',
	      default: true
	    },
	    selectionSize: {
	      type: 'number',
	      default: 0.10
	    },
	    showHexValue: {
	      type: 'boolean',
	      default: false
	    },
	    showSwatches: {
	      type: 'boolean',
	      default: false
	    },
	    swatches: {
	      type: 'array',
	      default: ['#000000', '#FFFFFF', '#ff0045', '#2aa8dc', '#ffed00', '#4c881d', '#b14bff']
	    }
	  },
	
	  init: function init() {
	    var _this = this;
	
	    var that = this,
	        padding = this.padding,
	        defaultMaterial = this.defaultMaterial;
	
	    this.swatchReady = false;
	
	    //Background color of this interface
	    //TODO: Expose sizing for deeper customisation?
	    this.backgroundWidth = this.backgroundHeight = this.data.wheelSize * 2;
	    this.brightnessSliderHeight = (this.data.wheelSize + padding) * 2;
	    this.brightnessSliderWidth = 0.10;
	
	    //Check if we have the a-rounded component
	    if (AFRAME.components.hasOwnProperty('rounded')) {
	      this.background = document.createElement('a-rounded');
	      this.background.setAttribute('radius', 0.02);
	      this.background.setAttribute('position', {
	        x: -(this.data.wheelSize + padding),
	        y: -(this.data.wheelSize + padding),
	        z: -0.001
	      });
	    } else {
	      this.background = document.createElement('a-plane');
	      this.background.setAttribute('position', {
	        x: 0,
	        y: 0,
	        z: -0.001
	      });
	    }
	    this.background.setAttribute('width', this.backgroundWidth + 2 * padding);
	    this.background.setAttribute('height', this.backgroundHeight + 2 * padding);
	    this.background.setAttribute('material', 'shader', 'flat');
	    this.background.setAttribute('side', 'double');
	    this.el.appendChild(this.background);
	
	    //Show Swatches
	    this.swatchContainer = document.createElement('a-plane');
	    this.swatchContainer.setAttribute('class', 'swatch-container');
	    this.swatchContainer.setAttribute('material', this.defaultMaterial);
	    this.swatchContainer.addEventListener('loaded', this.onSwatchReady.bind(this));
	
	    //Give swatch panel a rakish angle
	    this.swatchContainer.setAttribute('rotation', {
	      x: -30,
	      y: 0,
	      z: 0
	    });
	    this.el.appendChild(this.swatchContainer);
	
	    //Show hex value display
	    if (this.data.showHexValue) {
	      var hexValueHeight = 0.1,
	          hexValueWidth = 2 * (this.data.wheelSize + padding);
	
	      this.hexValueText = document.createElement('a-entity');
	
	      //A basic geo is required for interactions
	      this.hexValueText.setAttribute('geometry', {
	        primitive: 'plane',
	        width: hexValueWidth - this.brightnessSliderWidth,
	        height: hexValueHeight
	      });
	
	      this.hexValueText.setAttribute('material', defaultMaterial);
	      this.hexValueText.setAttribute('position', {
	        x: -this.brightnessSliderWidth,
	        y: this.data.wheelSize + hexValueHeight,
	        z: 0.0
	      });
	
	      this.hexValueText.setAttribute('material', 'opacity', 0);
	      this.hexValueText.setAttribute('text', {
	        width: hexValueWidth,
	        height: hexValueHeight,
	        align: 'right',
	        baseline: 'center',
	        wrapCount: 20.4,
	        color: '#666'
	      });
	
	      //Copy value to clipboard on click
	      this.hexValueText.addEventListener('click', this.onHexValueClicked.bind(this));
	      this.el.appendChild(this.hexValueText);
	    }
	
	    //Circle for colorwheel
	    this.colorWheel = document.createElement('a-circle');
	    this.colorWheel.setAttribute('radius', this.data.wheelSize);
	    this.colorWheel.setAttribute('material', defaultMaterial);
	    this.colorWheel.setAttribute('position', {
	      x: 0,
	      y: 0,
	      z: 0.001
	    });
	    this.el.appendChild(this.colorWheel);
	
	    //Plane for the brightness slider
	    this.brightnessSlider = document.createElement('a-plane');
	    this.brightnessSlider.setAttribute('width', this.brightnessSliderWidth);
	    this.brightnessSlider.setAttribute('height', this.brightnessSliderHeight);
	    this.brightnessSlider.setAttribute('material', defaultMaterial);
	    this.brightnessSlider.setAttribute('position', {
	      x: this.data.wheelSize + this.brightnessSliderWidth,
	      y: 0,
	      z: 0.001
	    });
	    this.el.appendChild(this.brightnessSlider);
	
	    //Plane the color selection element will inhabit
	    if (this.data.showSelection) {
	      this.selectionEl = document.createElement('a-circle');
	      this.selectionEl.setAttribute('radius', this.data.selectionSize);
	      this.selectionEl.setAttribute('material', defaultMaterial);
	
	      //Place in top left, lift slightly
	      this.selectionEl.setAttribute('position', {
	        x: -this.data.wheelSize,
	        y: this.data.wheelSize,
	        z: 0.001
	      });
	      this.el.appendChild(this.selectionEl);
	    }
	
	    //Color 'cursor'. We'll use this to indicate a rough color selection
	    this.colorCursorOptions = {
	      cursorRadius: 0.025,
	      cursorSegments: 32,
	      cursorColor: new THREE.Color(0x000000)
	    };
	
	    this.colorCursorOptions.cursorMaterial = new THREE.MeshBasicMaterial({
	      color: this.colorCursorOptions.cursorColor,
	      transparent: true
	    });
	
	    this.colorCursor = document.createElement('a-entity');
	    this.brightnessCursor = document.createElement('a-entity');
	
	    var geometry = new THREE.TorusBufferGeometry(this.colorCursorOptions.cursorRadius, this.colorCursorOptions.cursorRadius - 0.02, this.colorCursorOptions.cursorSegments, this.colorCursorOptions.cursorSegments / 4);
	    this.colorCursor.setObject3D('mesh', new THREE.Mesh(geometry, this.colorCursorOptions.cursorMaterial));
	    this.brightnessCursor.setObject3D('mesh', new THREE.Mesh(geometry, this.colorCursorOptions.cursorMaterial));
	
	    this.el.appendChild(this.colorCursor);
	    this.brightnessSlider.appendChild(this.brightnessCursor);
	    this.brightnessCursor.setAttribute('position', {
	      x: 0,
	      y: this.brightnessSliderHeight / 2,
	      z: 0
	    });
	
	    //Handlers
	    this.bindMethods();
	
	    //TODO: Replace setTimeout as it can be unreliable
	    setTimeout(function () {
	      that.el.initColorWheel();
	      that.el.initBrightnessSlider();
	      that.el.refreshRaycaster();
	      if (that.data.showSwatches) that.el.generateSwatches(that.data.swatches);
	      that.colorWheel.addEventListener('click', _this.onColorWheelClicked.bind(_this));
	      that.brightnessSlider.addEventListener('click', _this.onBrightnessSliderClicked.bind(_this));
	    }, 5);
	  },
	  //Util to animate between positions. Item represents a mesh or object containing a position
	  setPositionTween: function setPositionTween(item, fromPosition, toPosition) {
	    this.tween = new TWEEN.Tween(fromPosition).to(toPosition, this.tweenDuration).onUpdate(function () {
	      item.position.x = this.x;
	      item.position.y = this.y;
	      item.position.z = this.z;
	    }).easing(this.tweenEasing).start();
	
	    return this.tween;
	  },
	  //Util to animate between colors. Item represents a mesh or object's material
	  setColorTween: function setColorTween(item, fromColor, toColor) {
	    this.tween = new TWEEN.Tween(new THREE.Color(fromColor)).to(toColor, this.tweenDuration).onUpdate(function () {
	      item.color.r = this.r;
	      item.color.g = this.g;
	      item.color.b = this.b;
	    }).easing(this.tweenEasing).start();
	
	    return this.tween;
	  },
	  onColorWheelClicked: function onColorWheelClicked(evt) {
	    if (this.data.disabled) return;
	    this.el.onHueDown(evt.detail.intersection.point);
	  },
	  onBrightnessSliderClicked: function onBrightnessSliderClicked(evt) {
	    if (this.data.disabled) return;
	    this.el.onBrightnessDown(evt.detail.intersection.point);
	  },
	  onHexValueClicked: function onHexValueClicked() {
	    (0, _copyToClipboard2.default)(this.hexValueText.getAttribute('text').value);
	  },
	  generateSwatches: function generateSwatches(swatchData) {
	    //Generate clickable swatch elements from a given array
	    if (swatchData === undefined) return;
	
	    var containerWidth = (this.data.wheelSize + this.padding) * 2,
	        containerHeight = 0.15,
	        swatchWidth = containerWidth / swatchData.length;
	
	    this.swatchContainer.setAttribute('width', containerWidth);
	    this.swatchContainer.setAttribute('height', containerHeight);
	    this.swatchContainer.setAttribute('position', {
	      x: 0,
	      y: -this.backgroundHeight + containerHeight,
	      z: 0.03
	    });
	
	    //Loop through swatches and create elements
	    for (var i = 0; i < swatchData.length; i++) {
	      var color = swatchData[i];
	      var swatch = document.createElement('a-plane');
	
	      swatch.setAttribute('material', this.defaultMaterial);
	      swatch.setAttribute('width', swatchWidth);
	      swatch.setAttribute('height', containerHeight);
	      swatch.setAttribute('color', color);
	      swatch.setAttribute('class', 'swatch');
	      swatch.setAttribute('position', {
	        x: -(containerWidth - swatchWidth) / 2 + i * swatchWidth,
	        y: 0,
	        z: 0.001 //prevent z-fighting
	      });
	      swatch.addEventListener('click', this.onSwatchClicked.bind(this, color));
	      this.swatchContainer.appendChild(swatch);
	    }
	    this.el.refreshRaycaster();
	  },
	  bindMethods: function bindMethods() {
	    this.el.generateSwatches = this.generateSwatches.bind(this);
	    this.el.initColorWheel = this.initColorWheel.bind(this);
	    this.el.initBrightnessSlider = this.initBrightnessSlider.bind(this);
	    this.el.updateColor = this.updateColor.bind(this);
	    this.el.onHueDown = this.onHueDown.bind(this);
	    this.el.onBrightnessDown = this.onBrightnessDown.bind(this);
	    this.el.refreshRaycaster = this.refreshRaycaster.bind(this);
	    this.el.clearSwatches = this.clearSwatches.bind(this);
	  },
	  onSwatchReady: function onSwatchReady() {
	    this.swatchReady = true;
	  },
	  clearSwatches: function clearSwatches() {
	    if (this.swatchReady) while (this.swatchContainer.firstChild) {
	      this.swatchContainer.removeChild(this.swatchContainer.firstChild);
	    }
	  },
	  refreshRaycaster: function refreshRaycaster() {
	    var raycasterEl = AFRAME.scenes[0].querySelector('[raycaster]');
	    raycasterEl.components.raycaster.refreshObjects();
	  },
	  initBrightnessSlider: function initBrightnessSlider() {
	    /*
	     * NOTE:
	     *
	     * In A-Painter, the brightness slider is actually a model submesh / element.
	     * Here we generate it using GLSL and add it to our plane material
	     */
	
	    var vertexShader = '\n      varying vec2 vUv;\n      void main(){\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n      }\n    ';
	
	    var fragmentShader = '\n      uniform vec3 color1;\n      uniform vec3 color2;\n      varying vec2 vUv;\n\n      void main(){\n        vec4 c1 = vec4(color1, 1.0);\n  \t    vec4 c2 = vec4(color2, 1.0);\n\n        vec4 color = mix(c2, c1, smoothstep(0.0, 1.0, vUv.y));\n        gl_FragColor = color;\n      }\n    ';
	
	    var material = new THREE.ShaderMaterial({
	      uniforms: {
	        color1: {
	          type: 'c',
	          value: new THREE.Color(0xFFFFFF)
	        },
	        color2: {
	          type: 'c',
	          value: new THREE.Color(0x000000)
	        }
	      },
	      vertexShader: vertexShader,
	      fragmentShader: fragmentShader
	    });
	
	    this.brightnessSlider.getObject3D('mesh').material = material;
	    this.brightnessSlider.getObject3D('mesh').material.needsUpdate = true;
	  },
	  initColorWheel: function initColorWheel() {
	    var colorWheel = this.colorWheel.getObject3D('mesh');
	    var vertexShader = '\n\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n        gl_Position = projectionMatrix * mvPosition;\n      }\n    ';
	
	    var fragmentShader = '\n      #define M_PI2 6.28318530718\n      uniform float brightness;\n      varying vec2 vUv;\n      vec3 hsb2rgb(in vec3 c){\n          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0 );\n          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\n          return c.z * mix( vec3(1.0), rgb, c.y);\n      }\n\n      void main() {\n        vec2 toCenter = vec2(0.5) - vUv;\n        float angle = atan(toCenter.y, toCenter.x);\n        float radius = length(toCenter) * 2.0;\n        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\n        gl_FragColor = vec4(color, 1.0);\n      }\n      ';
	
	    var material = new THREE.ShaderMaterial({
	      uniforms: {
	        brightness: {
	          type: 'f',
	          value: this.hsv.v
	        }
	      },
	      vertexShader: vertexShader,
	      fragmentShader: fragmentShader
	    });
	
	    colorWheel.material = material;
	    colorWheel.material.needsUpdate = true;
	  },
	  onSwatchClicked: function onSwatchClicked(color) {
	    var colorWheel = this.colorWheel.getObject3D('mesh'),
	        brightnessCursor = this.brightnessCursor.getObject3D('mesh'),
	        brightnessSlider = this.brightnessSlider.getObject3D('mesh');
	
	    var rgb = this.hexToRgb(color);
	    this.hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
	
	    var angle = this.hsv.h * 2 * Math.PI,
	        radius = this.hsv.s * this.data.wheelSize;
	
	    var x = radius * Math.cos(angle),
	        y = radius * Math.sin(angle),
	        z = colorWheel.position.z;
	
	    var colorPosition = new THREE.Vector3(x, y, z);
	    colorWheel.localToWorld(colorPosition);
	    //We can reuse hueDown for this
	    this.onHueDown(colorPosition);
	
	    //Need to do the reverse of onbrightnessdown
	    var offset = this.hsv.v * this.brightnessSliderHeight;
	    var bY = offset - this.brightnessSliderHeight;
	    var brightnessPosition = new THREE.Vector3(0, bY, 0);
	    this.setPositionTween(brightnessCursor, brightnessCursor.position, brightnessPosition);
	    colorWheel.material.uniforms['brightness'].value = this.hsv.v;
	  },
	  onBrightnessDown: function onBrightnessDown(position) {
	    var brightnessSlider = this.brightnessSlider.getObject3D('mesh'),
	        brightnessCursor = this.brightnessCursor.getObject3D('mesh'),
	        colorWheel = this.colorWheel.getObject3D('mesh');
	
	    brightnessSlider.updateMatrixWorld();
	    brightnessSlider.worldToLocal(position);
	
	    //Brightness is a value between 0 and 1. The parent plane is centre registered, hence offset
	    var cursorOffset = position.y + this.brightnessSliderHeight / 2;
	    var brightness = cursorOffset / this.brightnessSliderHeight;
	    var updatedPosition = {
	      x: 0,
	      y: position.y - this.brightnessSliderHeight / 2,
	      z: 0
	
	      //Set brightness cursor position to offset position
	      // Uncomment to remove anims: brightnessCursor.position.copy(updatedPosition)
	    };this.setPositionTween(brightnessCursor, brightnessCursor.position, updatedPosition);
	
	    //Update material brightness
	    colorWheel.material.uniforms['brightness'].value = brightness;
	    this.hsv.v = brightness;
	    this.el.updateColor();
	  },
	  onHueDown: function onHueDown(position) {
	    var colorWheel = this.colorWheel.getObject3D('mesh'),
	        colorCursor = this.colorCursor.getObject3D('mesh'),
	        radius = this.data.wheelSize;
	
	    colorWheel.updateMatrixWorld();
	    colorWheel.worldToLocal(position);
	
	    // Uncomment to remove anims: this.colorCursor.getObject3D('mesh').position.copy(position)
	    this.setPositionTween(colorCursor, colorCursor.position, position);
	
	    //Determine Hue and Saturation value from polar co-ordinates
	    var polarPosition = {
	      r: Math.sqrt(position.x * position.x + position.y * position.y),
	      theta: Math.PI + Math.atan2(position.y, position.x)
	    };
	
	    var angle = (polarPosition.theta * (180 / Math.PI) + 180) % 360;
	    this.hsv.h = angle / 360;
	    this.hsv.s = polarPosition.r / radius;
	
	    this.el.updateColor();
	  },
	
	  updateColor: function updateColor() {
	
	    var rgb = this.hsvToRgb(this.hsv),
	        color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')',
	        hex = '#' + new THREE.Color(color).getHexString();
	
	    var selectionEl = this.selectionEl.getObject3D('mesh'),
	        colorCursor = this.colorCursor.getObject3D('mesh'),
	        brightnessCursor = this.brightnessCursor.getObject3D('mesh');
	
	    //Update indicator element of selected color
	    if (this.data.showSelection) {
	      //Uncomment for no tweens: selectionEl.material.color.set(color)
	      this.setColorTween(selectionEl.material, selectionEl.material.color, new THREE.Color(color));
	      selectionEl.material.needsUpdate = true;
	    }
	
	    //Change cursor colors based on brightness
	    if (this.hsv.v >= 0.5) {
	      this.setColorTween(colorCursor.material, colorCursor.material.color, new THREE.Color(0x000000));
	      this.setColorTween(brightnessCursor.material, brightnessCursor.material.color, new THREE.Color(0x000000));
	    } else {
	      this.setColorTween(colorCursor.material, colorCursor.material.color, new THREE.Color(0xFFFFFF));
	      this.setColorTween(brightnessCursor.material, brightnessCursor.material.color, new THREE.Color(0xFFFFFF));
	    }
	
	    //showHexValue set to true, update text
	    if (this.data.showHexValue) this.hexValueText.setAttribute('text', 'value', hex);
	
	    //Notify listeners the color has changed.
	    var eventDetail = {
	      style: color,
	      rgb: rgb,
	      hsv: this.hsv,
	      hex: hex
	    };
	
	    Event.emit(this.el, 'changecolor', eventDetail);
	    Event.emit(document.body, 'didchangecolor', eventDetail);
	  },
	  hexToRgb: function hexToRgb(hex) {
	    var rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
	      return '#' + r + r + g + g + b + b;
	    }).substring(1).match(/.{2}/g).map(function (x) {
	      return parseInt(x, 16);
	    });
	
	    return {
	      r: rgb[0],
	      g: rgb[1],
	      b: rgb[2]
	    };
	  },
	  rgbToHsv: function rgbToHsv(r, g, b) {
	    var max = Math.max(r, g, b);
	    var min = Math.min(r, g, b);
	    var d = max - min;
	    var h;
	    var s = max === 0 ? 0 : d / max;
	    var v = max;
	
	    if (arguments.length === 1) {
	      g = r.g;
	      b = r.b;
	      r = r.r;
	    }
	
	    switch (max) {
	      case min:
	        h = 0;
	        break;
	      case r:
	        h = g - b + d * (g < b ? 6 : 0);
	        h /= 6 * d;
	        break;
	      case g:
	        h = b - r + d * 2;
	        h /= 6 * d;
	        break;
	      case b:
	        h = r - g + d * 4;
	        h /= 6 * d;
	        break;
	    }
	    return {
	      h: h,
	      s: s,
	      v: v / 255
	    };
	  },
	  hsvToRgb: function hsvToRgb(hsv) {
	    var r, g, b, i, f, p, q, t;
	    var h = THREE.Math.clamp(hsv.h, 0, 1);
	    var s = THREE.Math.clamp(hsv.s, 0, 1);
	    var v = hsv.v;
	
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	      case 0:
	        r = v;
	        g = t;
	        b = p;
	        break;
	      case 1:
	        r = q;
	        g = v;
	        b = p;
	        break;
	      case 2:
	        r = p;
	        g = v;
	        b = t;
	        break;
	      case 3:
	        r = p;
	        g = q;
	        b = v;
	        break;
	      case 4:
	        r = t;
	        g = p;
	        b = v;
	        break;
	      case 5:
	        r = v;
	        g = p;
	        b = q;
	        break;
	    }
	    return {
	      r: Math.round(r * 255),
	      g: Math.round(g * 255),
	      b: Math.round(b * 255)
	    };
	  },
	  update: function update(oldData) {
	    if (!oldData) return;
	    if (this.data.backgroundColor !== oldData.backgroundColor) this.background.setAttribute('color', this.data.backgroundColor);
	
	    var swatchesChanged = (0, _lodash2.default)(oldData.swatches, this.data.swatches).length > 0;
	    if (swatchesChanged && this.data.showSwatches && this.data.swatches.filter(function (item) {
	      return item.length === 7;
	    }).length === this.data.swatches.length) {
	      if (this.swatchReady) {
	        this.el.clearSwatches();
	        this.el.generateSwatches(this.data.swatches);
	      }
	    }
	  },
	  tick: function tick() {},
	  remove: function remove() {
	    var that = this;
	    //Kill any listeners
	    this.colorWheel.removeEventListener('click', this.onColorWheelClicked);
	    this.brightnessSlider.removeEventListener('click', this.onBrightnessSliderClicked);
	    this.swatchContainer.removeEventListener('loaded', this.onSwatchReady);
	    this.hexValueText.removeEventListener('click', this.onHexValueClicked);
	
	    if (this.swatchContainer) this.swatchContainer.getObject3D('mesh').children.forEach(function (child) {
	      return child.removeEventListener('click', that);
	    });
	  },
	  pause: function pause() {},
	  play: function play() {}
	});
	
	AFRAME.registerPrimitive('a-colorwheel', {
	  defaultComponents: {
	    colorwheel: {}
	  },
	  mappings: {
	    disabled: 'colorwheel.disabled',
	    backgroundcolor: 'colorwheel.backgroundColor',
	    showselection: 'colorwheel.showSelection',
	    wheelsize: 'colorwheel.wheelSize',
	    selectionsize: 'colorwheel.selectionSize',
	    showhexvalue: 'colorwheel.showHexValue',
	    showswatches: 'colorwheel.showSwatches',
	    swatches: 'colorwheel.swatches'
	  }
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var deselectCurrent = __webpack_require__(3);
	
	var defaultMessage = 'Copy to clipboard: #{key}, Enter';
	
	function format(message) {
	  var copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
	  return message.replace(/#{\s*key\s*}/g, copyKey);
	}
	
	function copy(text, options) {
	  var debug, message, reselectPrevious, range, selection, mark, success = false;
	  if (!options) { options = {}; }
	  debug = options.debug || false;
	  try {
	    reselectPrevious = deselectCurrent();
	
	    range = document.createRange();
	    selection = document.getSelection();
	
	    mark = document.createElement('span');
	    mark.textContent = text;
	    // reset user styles for span element
	    mark.style.all = 'unset';
	    // prevents scrolling to the end of the page
	    mark.style.position = 'fixed';
	    mark.style.top = 0;
	    mark.style.clip = 'rect(0, 0, 0, 0)';
	    // used to preserve spaces and line breaks
	    mark.style.whiteSpace = 'pre';
	    // do not inherit user-select (it may be `none`)
	    mark.style.webkitUserSelect = 'text';
	    mark.style.MozUserSelect = 'text';
	    mark.style.msUserSelect = 'text';
	    mark.style.userSelect = 'text';
	
	    document.body.appendChild(mark);
	
	    range.selectNode(mark);
	    selection.addRange(range);
	
	    var successful = document.execCommand('copy');
	    if (!successful) {
	      throw new Error('copy command was unsuccessful');
	    }
	    success = true;
	  } catch (err) {
	    debug && console.error('unable to copy using execCommand: ', err);
	    debug && console.warn('trying IE specific stuff');
	    try {
	      window.clipboardData.setData('text', text);
	      success = true;
	    } catch (err) {
	      debug && console.error('unable to copy using clipboardData: ', err);
	      debug && console.error('falling back to prompt');
	      message = format('message' in options ? options.message : defaultMessage);
	      window.prompt(message, text);
	    }
	  } finally {
	    if (selection) {
	      if (typeof selection.removeRange == 'function') {
	        selection.removeRange(range);
	      } else {
	        selection.removeAllRanges();
	      }
	    }
	
	    if (mark) {
	      document.body.removeChild(mark);
	    }
	    reselectPrevious();
	  }
	
	  return success;
	}
	
	module.exports = copy;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	
	module.exports = function () {
	  var selection = document.getSelection();
	  if (!selection.rangeCount) {
	    return function () {};
	  }
	  var active = document.activeElement;
	
	  var ranges = [];
	  for (var i = 0; i < selection.rangeCount; i++) {
	    ranges.push(selection.getRangeAt(i));
	  }
	
	  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
	    case 'INPUT':
	    case 'TEXTAREA':
	      active.blur();
	      break;
	
	    default:
	      active = null;
	      break;
	  }
	
	  selection.removeAllRanges();
	  return function () {
	    selection.type === 'Caret' &&
	    selection.removeAllRanges();
	
	    if (!selection.rangeCount) {
	      ranges.forEach(function(range) {
	        selection.addRange(range);
	      });
	    }
	
	    active &&
	    active.focus();
	  };
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array ? array.length : 0;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}
	
	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array ? array.length : 0;
	
	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}
	
	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);
	
	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return baseFindIndex(array, baseIsNaN, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;
	
	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}
	
	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}
	
	/**
	 * Checks if a cache value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}
	
	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];
	
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/** Built-in value references. */
	var Symbol = root.Symbol,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice,
	    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map'),
	    nativeCreate = getNative(Object, 'create');
	
	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}
	
	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}
	
	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}
	
	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	
	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;
	
	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}
	
	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}
	
	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}
	
	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	/**
	 * The base implementation of methods like `_.difference` without support
	 * for excluding multiple arrays or iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values, iteratee, comparator) {
	  var index = -1,
	      includes = arrayIncludes,
	      isCommon = true,
	      length = array.length,
	      result = [],
	      valuesLength = values.length;
	
	  if (!length) {
	    return result;
	  }
	  if (iteratee) {
	    values = arrayMap(values, baseUnary(iteratee));
	  }
	  if (comparator) {
	    includes = arrayIncludesWith;
	    isCommon = false;
	  }
	  else if (values.length >= LARGE_ARRAY_SIZE) {
	    includes = cacheHas;
	    isCommon = false;
	    values = new SetCache(values);
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;
	
	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === computed) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (!includes(values, computed, comparator)) {
	      result.push(value);
	    }
	  }
	  return result;
	}
	
	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;
	
	  predicate || (predicate = isFlattenable);
	  result || (result = []);
	
	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = array;
	    return apply(func, this, otherArgs);
	  };
	}
	
	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}
	
	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}
	
	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	/**
	 * Creates an array of `array` values not included in the other given arrays
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons. The order of result values is determined by the
	 * order they occur in the first array.
	 *
	 * **Note:** Unlike `_.pullAll`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {...Array} [values] The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @see _.without, _.xor
	 * @example
	 *
	 * _.difference([2, 1], [2, 3]);
	 * // => [1]
	 */
	var difference = baseRest(function(array, values) {
	  return isArrayLikeObject(array)
	    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
	    : [];
	});
	
	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = difference;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = {
	  emit: function emit(el, name, data) {
	    el.dispatchEvent(new CustomEvent(name, { detail: data }));
	  }
	};

/***/ })
/******/ ]);
//# sourceMappingURL=aframe-colorwheel-component.js.map