/**
 * A-FRAME Material
 * @author Etienne Pinchon epinchon@student.42.us.org
 *
 * Colorwheel for A-FRAME Material
 * @author Mo Kargas (DEVLAD) mo@devlad.com
 */

const Event = require('./src/utils')

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
    value: {
      type: 'string',
      default: ''
    },
    name: {
      type: 'string',
      default: ''
    },
    disabled: {
      type: 'boolean',
      default: false
    },
    color: {
      type: 'color',
      default: '#000'
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
    }
  },
  //Util to animate between positions. Item represents a mesh or object containing a position
  setPositionTween: function(item, fromPosition, toPosition) {
    this.tween = new TWEEN.Tween(fromPosition).to(toPosition, this.tweenDuration).onUpdate(function() {
      item.position.x = this.x
      item.position.y = this.y
      item.position.z = this.z
    }).easing(this.tweenEasing).start()
  },
  //Util to animate between colors. Item represents a mesh or object's material
  setColorTween: function(item, fromColor, toColor) {
    this.tween = new TWEEN.Tween(new THREE.Color(fromColor)).to(toColor, this.tweenDuration).onUpdate(function() {
      item.color.r = this.r
      item.color.g = this.g
      item.color.b = this.b
    }).easing(this.tweenEasing).start()
  },
  init: function() {
    const that = this,
      padding = this.padding,
      defaultMaterial = {
        color: '#ffffff',
        flatShading: true,
        transparent: true,
        fog: false,
        side: 'double'
      }

    //Background color of this interface
    //TODO: Expose sizing for deeper customisation?
    this.backgroundWidth = this.backgroundHeight = this.data.wheelSize * 2

    //Check if we have the a-rounded component
    if(AFRAME.components.hasOwnProperty('rounded')){
      this.background = document.createElement('a-rounded')
      this.background.setAttribute('radius', 0.02)
      this.background.setAttribute('position', {
        x: -(this.data.wheelSize + padding),
        y: -(this.data.wheelSize + padding),
        z: -0.001
      })
    } else {
      this.background = document.createElement('a-plane')
      this.background.setAttribute('position', {
        x: 0,
        y: 0,
        z: -0.001
      })
    }
    console.debug(this.background)
    this.background.setAttribute('width', this.backgroundWidth + 2 * padding)
    this.background.setAttribute('height', this.backgroundHeight + 2 * padding)

    this.background.setAttribute('side', 'double')
    this.el.appendChild(this.background)

    //Circle for colorwheel
    this.colorWheel = document.createElement('a-circle')
    this.colorWheel.setAttribute('radius', this.data.wheelSize)
    this.colorWheel.setAttribute('material', defaultMaterial)
    this.colorWheel.setAttribute('position', {
      x: 0,
      y: 0,
      z: 0
    })
    this.el.appendChild(this.colorWheel)

    //Plane for the brightness slider
    //TODO: Expose height and width for customisation?
    this.brightnessSliderHeight = (this.data.wheelSize + padding) * 2
    this.brightnessSliderWidth = 0.10

    this.brightnessSlider = document.createElement('a-plane')
    this.brightnessSlider.setAttribute('width', this.brightnessSliderWidth)
    this.brightnessSlider.setAttribute('height', this.brightnessSliderHeight)
    this.brightnessSlider.setAttribute('material', defaultMaterial)
    this.brightnessSlider.setAttribute('position', {
      x: this.data.wheelSize + this.brightnessSliderWidth,
      y: 0,
      z: 0
    })
    this.el.appendChild(this.brightnessSlider)

    //Plane the color selection element will inhabit
    if (this.data.showSelection) {
      this.selectionEl = document.createElement('a-circle')
      this.selectionEl.setAttribute('radius', this.data.selectionSize)
      this.selectionEl.setAttribute('material', defaultMaterial)

      //Place in top left, lift slightly
      this.selectionEl.setAttribute('position', {
        x: -this.data.wheelSize,
        y: this.data.wheelSize,
        z: 0.001
      })
      this.el.appendChild(this.selectionEl)
    }

    //Color 'cursor'. We'll use this to indicate a rough color selection
    this.colorCursorOptions = {
      cursorRadius: 0.025,
      cursorSegments: 32,
      cursorColor: new THREE.Color(0x000000)
    }
    this.colorCursorOptions.cursorMaterial = new THREE.MeshBasicMaterial({
      color: this.colorCursorOptions.cursorColor,
      transparent: true
    });

    this.colorCursor = document.createElement('a-entity')
    this.brightnessCursor = document.createElement('a-entity')

    let geometry = new THREE.TorusBufferGeometry(this.colorCursorOptions.cursorRadius, this.colorCursorOptions.cursorRadius - 0.02, this.colorCursorOptions.cursorSegments, this.colorCursorOptions.cursorSegments / 4)
    this.colorCursor.setObject3D('mesh', new THREE.Mesh(geometry, this.colorCursorOptions.cursorMaterial))
    this.brightnessCursor.setObject3D('mesh', new THREE.Mesh(geometry, this.colorCursorOptions.cursorMaterial))

    this.el.appendChild(this.colorCursor)
    this.brightnessSlider.appendChild(this.brightnessCursor)
    this.brightnessCursor.setAttribute('position', {
      x: 0,
      y: this.brightnessSliderHeight / 2,
      z: 0
    })

    //Handlers
    this.bindMethods()

    setTimeout(() => {

      that.el.initColorWheel()
      that.el.initBrightnessSlider()
      that.el.refreshRaycaster()

      that.colorWheel.addEventListener('click', function(evt) {
        if (that.data.disabled) return;
        that.el.onHueDown(evt.detail.intersection.point)
      });

      that.brightnessSlider.addEventListener('click', function(evt) {
        if (that.data.disabled) return;
        that.el.onBrightnessDown(evt.detail.intersection.point)
      });

    }, 5)
  },

  bindMethods: function() {
    this.el.initColorWheel = this.initColorWheel.bind(this)
    this.el.initBrightnessSlider = this.initBrightnessSlider.bind(this)
    this.el.updateColor = this.updateColor.bind(this)
    this.el.onHueDown = this.onHueDown.bind(this)
    this.el.onBrightnessDown = this.onBrightnessDown.bind(this)
    this.el.refreshRaycaster = this.refreshRaycaster.bind(this)
  },

  refreshRaycaster: function() {
    const raycasterEl = AFRAME.scenes[0].querySelector('[raycaster]')
    raycasterEl.components.raycaster.refreshObjects()
  },

  initBrightnessSlider: function() {
    /*
     * NOTE:
     *
     * In A-Painter, the brightness slider is actually a model submesh / element.
     * Here we generate it using glsl here and add it to our plane material
     */

    const vertexShader = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;

      void main(){
        vec4 c1 = vec4(color1, 1.0);
  	    vec4 c2 = vec4(color2, 1.0);

        vec4 color = mix(c2, c1, smoothstep(0.0, 1.0, vUv.y));
        gl_FragColor = color;
      }
    `

    let material = new THREE.ShaderMaterial({
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
    })

    this.brightnessSlider.getObject3D('mesh').material = material;
    this.brightnessSlider.getObject3D('mesh').material.needsUpdate = true;

  },
  initColorWheel: function() {
    let colorWheel = this.colorWheel.getObject3D('mesh')
    const vertexShader = `

      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      #define M_PI2 6.28318530718
      uniform float brightness;
      varying vec2 vUv;
      vec3 hsb2rgb(in vec3 c){
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0 );
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);
          return c.z * mix( vec3(1.0), rgb, c.y);
      }

      void main() {
        vec2 toCenter = vec2(0.5) - vUv;
        float angle = atan(toCenter.y, toCenter.x);
        float radius = length(toCenter) * 2.0;
        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));
        gl_FragColor = vec4(color, 1.0);
      }
      `;

    let material = new THREE.ShaderMaterial({
      uniforms: {
        brightness: {
          type: 'f',
          value: this.hsv.v
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    colorWheel.material = material
    colorWheel.material.needsUpdate = true
  },
  onBrightnessDown: function(position) {
    const brightnessSlider = this.brightnessSlider.getObject3D('mesh')
    const brightnessCursor = this.brightnessCursor.getObject3D('mesh')
    const colorWheel = this.colorWheel.getObject3D('mesh')

    brightnessSlider.updateMatrixWorld()
    brightnessSlider.worldToLocal(position)

    //Brightness is a value between 0 and 1. The parent plane is centre registered, hence offset
    let cursorOffset = position.y + this.brightnessSliderHeight / 2
    let brightness = cursorOffset / this.brightnessSliderHeight
    let updatedPosition = {
      x: 0,
      y: position.y - this.brightnessSliderHeight / 2,
      z: 0
    }

    //Set brightness cursor position to offset position
    // Uncomment to remove anims: brightnessCursor.position.copy(updatedPosition)
    this.setPositionTween(brightnessCursor, brightnessCursor.position, updatedPosition)

    //Update material brightness
    colorWheel.material.uniforms['brightness'].value = brightness
    this.hsv.v = brightness
    this.el.updateColor()
  },
  onHueDown: function(position) {
    const colorWheel = this.colorWheel.getObject3D('mesh'),
      colorCursor = this.colorCursor.getObject3D('mesh'),
      radius = this.data.wheelSize

    colorWheel.updateMatrixWorld()
    colorWheel.worldToLocal(position)

    // Uncomment to remove anims: this.colorCursor.getObject3D('mesh').position.copy(position)
    this.setPositionTween(colorCursor, colorCursor.position, position)

    //Determine Hue and Saturation value from polar co-ordinates
    let polarPosition = {
      r: Math.sqrt(position.x * position.x + position.y * position.y),
      theta: Math.PI + Math.atan2(position.y, position.x)
    }

    let angle = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360
    this.hsv.h = angle / 360
    this.hsv.s = polarPosition.r / radius

    this.el.updateColor()
  },

  updateColor: function() {
    let rgb = this.hsvToRgb(this.hsv)
    let color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

    const selectionEl = this.selectionEl.getObject3D('mesh'),
      colorCursor = this.colorCursor.getObject3D('mesh'),
      brightnessCursor = this.brightnessCursor.getObject3D('mesh')


    //Update indicator element of selected color
    if (this.data.showSelection) {
      //Uncomment for no tweens: selectionEl.material.color.set(color)
      this.setColorTween(selectionEl.material, selectionEl.material.color, new THREE.Color(color))
      selectionEl.material.needsUpdate = true
    }

    //Change cursor colors based on brightness
    if(this.hsv.v >= 0.5){
      this.setColorTween(colorCursor.material, colorCursor.material.color, new THREE.Color(0x000000))
      this.setColorTween(brightnessCursor.material, brightnessCursor.material.color, new THREE.Color(0x000000))
    } else {
      this.setColorTween(colorCursor.material, colorCursor.material.color, new THREE.Color(0xFFFFFF))
      this.setColorTween(brightnessCursor.material, brightnessCursor.material.color, new THREE.Color(0xFFFFFF))

    }

    //Notify listeners the color has changed.
    Event.emit(this.el, 'changecolor', {
      style: color,
      rgb: rgb,
      hsv: this.hsv
    })
    Event.emit(document.body, 'didchangecolor', {
      style: color,
      rgb: rgb,
      hsv: this.hsv
    })

  },
  hsvToRgb: function(hsv) {
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
  update: function(oldData) {
    this.background.setAttribute('color', this.data.backgroundColor)
  },
  tick: function() {},
  remove: function() {},
  pause: function() {},
  play: function() {}
});

AFRAME.registerPrimitive('a-colorwheel', {
  defaultComponents: {
    colorwheel: {}
  },
  mappings: {
    value: 'colorwheel.value',
    name: 'colorwheel.name',
    disabled: 'colorwheel.disabled',
    color: 'colorwheel.color',
    backgroundcolor: 'colorwheel.backgroundColor',
    showselection: 'colorwheel.showSelection',
    wheelsize: 'colorwheel.wheelSize',
    selectionsize: 'colorwheel.selectionSize'
  }
});
