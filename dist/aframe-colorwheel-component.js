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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Colorwheel for A-FRAME Material
	 * @author Mo Kargas (DEVLAD) mo@devlad.com
	 */
	
	var Event = __webpack_require__(4);
	
	
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
	    }
	  },
	  //Util to animate between positions. Item represents a mesh or object containing a position
	  setPositionTween: function setPositionTween(item, fromPosition, toPosition) {
	    this.tween = new TWEEN.Tween(fromPosition).to(toPosition, this.tweenDuration).onUpdate(function () {
	      item.position.x = this.x;
	      item.position.y = this.y;
	      item.position.z = this.z;
	    }).easing(this.tweenEasing).start();
	  },
	  //Util to animate between colors. Item represents a mesh or object's material
	  setColorTween: function setColorTween(item, fromColor, toColor) {
	    this.tween = new TWEEN.Tween(new THREE.Color(fromColor)).to(toColor, this.tweenDuration).onUpdate(function () {
	      item.color.r = this.r;
	      item.color.g = this.g;
	      item.color.b = this.b;
	    }).easing(this.tweenEasing).start();
	  },
	  init: function init() {
	    var that = this,
	        padding = this.padding,
	        defaultMaterial = {
	      color: '#ffffff',
	      flatShading: true,
	      transparent: true,
	      fog: false,
	      side: 'double'
	
	      //Background color of this interface
	      //TODO: Expose sizing for deeper customisation?
	    };this.backgroundWidth = this.backgroundHeight = this.data.wheelSize * 2;
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
	
	    //Show hex value display
	    if (this.data.showHexValue) {
	      var hexValueHeight = 0.1;
	      var hexValueWidth = 2 * (this.data.wheelSize + padding);
	
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
	      this.hexValueText.addEventListener('click', function () {
	        var textEl = that.hexValueText.getAttribute('text');
	        (0, _copyToClipboard2.default)(textEl.value);
	      });
	
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
	
	    setTimeout(function () {
	
	      that.el.initColorWheel();
	      that.el.initBrightnessSlider();
	      that.el.refreshRaycaster();
	
	      that.colorWheel.addEventListener('click', function (evt) {
	        if (that.data.disabled) return;
	        that.el.onHueDown(evt.detail.intersection.point);
	      });
	
	      that.brightnessSlider.addEventListener('click', function (evt) {
	        if (that.data.disabled) return;
	        that.el.onBrightnessDown(evt.detail.intersection.point);
	      });
	    }, 5);
	  },
	
	  bindMethods: function bindMethods() {
	    this.el.initColorWheel = this.initColorWheel.bind(this);
	    this.el.initBrightnessSlider = this.initBrightnessSlider.bind(this);
	    this.el.updateColor = this.updateColor.bind(this);
	    this.el.onHueDown = this.onHueDown.bind(this);
	    this.el.onBrightnessDown = this.onBrightnessDown.bind(this);
	    this.el.refreshRaycaster = this.refreshRaycaster.bind(this);
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
	     * Here we generate it using glsl here and add it to our plane material
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
	  onBrightnessDown: function onBrightnessDown(position) {
	    var brightnessSlider = this.brightnessSlider.getObject3D('mesh');
	    var brightnessCursor = this.brightnessCursor.getObject3D('mesh');
	    var colorWheel = this.colorWheel.getObject3D('mesh');
	
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
	    var rgb = this.hsvToRgb(this.hsv);
	    var color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
	    var hex = '#' + new THREE.Color(color).getHexString();
	
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
	
	    //If we have showHexValue set to true, update text
	    if (this.data.showHexValue) {
	      this.hexValueText.setAttribute('text', 'value', hex);
	    }
	
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
	    this.background.setAttribute('color', this.data.backgroundColor);
	  },
	  tick: function tick() {},
	  remove: function remove() {},
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
	    showhexvalue: 'colorwheel.showHexValue'
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

	"use strict";
	
	module.exports = {
	  emit: function emit(el, name, data) {
	    el.dispatchEvent(new CustomEvent(name, { detail: data }));
	  }
	};

/***/ })
/******/ ]);
//# sourceMappingURL=aframe-colorwheel-component.js.map