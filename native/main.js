// @todo scene add loop

var imgSrc = "images/a.png";
var imgSrcArr = [
  {
    src: 'images/a.png',
  },
  {
    src: 'images/b.png',
  },
  {
    src: 'images/cover.png',
  },
]
var imageIndex = 0;
var image, objLoader, bunnyGeo, particle, clock;
var camera, scene, renderer;
var texture;
var datas = [];
var imagePositions = [];
var MAX = 30000;
let attributes = {
  positions: [],
  endPositions: [],
  alphas: [],
  colors: [],
  times: [],
};


const domIsReady = () => {
  const ua = getDevice();
  if (ua === 'sp') {
    MAX = 15000;
  }
  imagesInit();
}
/**
 * ua
 */
const getDevice = () => {
  const ua = navigator.userAgent;
  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
    return 'sp';
  }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
      return 'tablet';
  }else{
      return 'pc';
  }
}

document.addEventListener('DOMContentLoaded', domIsReady);




/**
 * 画像初期設定
 */
async function imagesInit() {
  const canvas = document.createElement("canvas");
  imagePositions = await createImagePositions(canvas);
  attributes = await createAttributes(imagePositions);
  init();
}

function createAttributes(imagePositions) {
  let attr = attributes;
  return new Promise((resolve) => {
    const count = 3;
    let imageLen = imagePositions.length;
    
    for (var i = 0; imageLen > i; i++) {
      attr.positions[i] = new Float32Array(MAX * count);
      attr.endPositions[i] =  new Float32Array(MAX * count);
      attr.alphas[i] = new Float32Array(MAX);
      attr.colors[i] = new Float32Array(MAX * count);
      attr.times[i] = new Float32Array(MAX);
      const datas = imagePositions[i];
      const datasLen = datas.length;
      for (var n = 0; n < MAX; n++) {
        var data = datas[parseInt(datasLen * Math.random())];
        attr.positions[i][n * count] = data.x;
        attr.positions[i][n * count + 1] = 0;
        attr.positions[i][n * count + 2] = data.y;
        
        attr.endPositions[i][n * count] = range(0, 20);
        attr.endPositions[i][n * count + 1] = range(0, 0);
        attr.endPositions[i][n * count + 2] = range(0, 0);

        attr.times[i][n] = count * Math.random();
        attr.alphas[i][n] = Math.random();
        attr.colors[i][n * count] = data.color.r;
        attr.colors[i][n * count + 1] = data.color.g;
        attr.colors[i][n * count + 2] = data.color.b;
      }
    }
    resolve(attr);
  });
}

function  init(){
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = -30;
  camera.position.y = 100;
  camera.lookAt(new THREE.Vector3())

  scene = new THREE.Scene();

  particle = new THREE.Points(new CustomParticle(), new CustomMat());
  scene.add(particle);
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  clock = new THREE.Clock();
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  TweenMax.ticker.addEventListener("tick", loop);
}


class CustomParticle extends THREE.BufferGeometry {
  constructor(){
    super()
    // this.count = MAX;

    this.addAttribute("position", new THREE.BufferAttribute(attributes.positions[imageIndex], 3));
    this.addAttribute("aTarget", new THREE.BufferAttribute(attributes.endPositions[imageIndex], 3));
    this.addAttribute("aTime", new THREE.BufferAttribute(attributes.times[imageIndex], 1));
    this.addAttribute("aAlpha", new THREE.BufferAttribute(attributes.alphas[imageIndex], 1));
    this.addAttribute("aColor", new THREE.BufferAttribute(attributes.colors[imageIndex], 3));
  }
}

class CustomMat extends THREE.ShaderMaterial {
  constructor(){
    var uniforms = {
        uTime : {type : "f", value : 0},
        uMousePosition: {type: 'v2', value: new THREE.Vector2( 0.5, 0.5 ) },
    };
    super({
        uniforms: uniforms,
        vertexShader: document.getElementById("vertex").textContent,
        fragmentShader: document.getElementById("fragment").textContent
    });

    this.transparent = true;
    this.depthWrite = false;
    // this.blending = THREE.AdditiveBlending;
  }
}


/**
 * createImgPosition
 * @param {*} canvas
 */
function createImagePositions(canvas) {
  return new Promise(async (resolve) => {
    let positions = [];
    var len = imgSrcArr.length;
    var scale = 10;
    for (var i = 0; len > i; i++) {
      let pos = [];
      await loadImage(imgSrcArr[i].src)
        .then(image => {
          canvas.width = image.width;
          canvas.height = image.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          var data = ctx.getImageData(0, 0, image.width, image.height);
          var imageData = data.data;
          for (var y = 0; y < image.height; y++) {
            for (var x = 0; x < image.width; x++) {
              var num = 4 * (image.width * y + x) + 3;
              var alpha = imageData[num];
              if (alpha !== 0) {
                var rRate = x / image.width * .9;
                var gRate = y / image.height * .2;
                var color = new THREE.Color();
                color.setRGB(rRate, gRate, 1);
                var data = {
                  x: (x - image.width / 2 + 9 * Math.random()) / scale,
                  y: (y - image.height / 2) / scale,
                  alpha: alpha / 255,
                  color,
                }
                pos.push(data)
              }
            }
          }
          positions.push(pos);
        })
    }
    resolve(positions);
  })
}

/**
 * loadImage
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = e => reject();
    img.src = src;
  });
}

function range(min, max){
  return min + (max - min) * Math.random();
}


var theta = 0;
var deltaX = 0;
var deltaY = 0;
var time = 0;
var mouse = new THREE.Vector2();
// add mouse
let mousePos = { x: 0, y: 0, px:0, py:0, tx:0, ty:0 };
let targetMousePos = { x: 0, y: 0 };

function loop(){
    // console.log(attributes.positions[imageIndex]);
    var delta = clock.getDelta();
    time += delta;
    theta += (mouse.x /3 - theta)/10;
    deltaX += (Math.cos(mousePos.tx) - Math.sin(time))/220;
    deltaY += (Math.cos(mousePos.ty))/220;
    camera.position.z = 15 * Math.cos(theta);
    camera.position.x = 20 * Math.sin(theta);
    console.log(camera.position);
    camera.lookAt(new THREE.Vector3())
    // add mouse
    mousePos.x += (targetMousePos.x - mousePos.x) * .1;
    mousePos.y += (targetMousePos.y - mousePos.y) * .1;
    particle.material.uniforms.uMousePosition.value = new THREE.Vector2(mousePos.x, mousePos.y);
    particle.material.uniforms.uTime.value = time;
    // console.log(attributes.endPositions[0]);
    updatePositin(mousePos, imageIndex);
    
    // particle.geometry.setAttribute('position', new THREE.BufferAttribute( attributes.positions[imageIndex], 3));
    particle.geometry.setAttribute('aTarget', new THREE.BufferAttribute( attributes.endPositions[imageIndex], 3));

    renderer.render(scene, camera);
}

// @todo 時間差に
function updatePositin(mousePos, index) {
    const count = 3;
    // スマホは除外
    for (var i = 0; i < MAX; i++) {
      if (i % 2 !== 0) continue;
      let targetX = attributes.endPositions[imageIndex][i * count] - (mousePos.tx / 2);
      targetX = targetX < 80 ? targetX : Math.random() * 80;
      targetX = targetX > -60 ? targetX : Math.random() * -60;
      let targetY = attributes.endPositions[imageIndex][i * count + 1] + (mousePos.ty / 2);
      targetY = targetY < 200 ? targetY : Math.random() * 200;
      targetY = targetY > -200 ? targetY : Math.random() * -200;
      attributes.endPositions[imageIndex][i * count] = targetX;
      attributes.endPositions[imageIndex][i * count + 1] = targetY;
      attributes.endPositions[imageIndex][i * count + 2] = range(0, 0);
    }
  
}

function rule3(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
  
}


const maxMouseXPos = 4;
const maxMouseYPos = 10;
async function onDocumentMouseMove(event){
    event.preventDefault();
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    
    // add mouse
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
    mousePos.px = mousePos.x / window.innerWidth;
    mousePos.py = 1.0 - mousePos.y / window.innerHeight;
    
    
    mousePos.tx = event.clientX - (window.innerWidth / 2);
      mousePos.ty = event.clientY - (window.innerHeight / 2);
      mousePos.tx = mousePos.tx > maxMouseXPos ? maxMouseXPos : mousePos.tx;
      mousePos.tx = mousePos.tx < -maxMouseXPos ? -maxMouseXPos : mousePos.tx;
      mousePos.ty = mousePos.ty > maxMouseYPos ? maxMouseYPos : mousePos.ty;
      mousePos.ty = mousePos.ty < -maxMouseYPos ? -maxMouseYPos : mousePos.ty;
        
    targetMousePos.x = mousePos.px;
    targetMousePos.y = mousePos.py;
    
}

window.addEventListener("resize", function(ev){
    if(camera){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    }

  if(renderer)
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', function(e){
  imageIndex +=1;
  if (imgSrcArr.length <= imageIndex) {
    imageIndex = 0;
  }
  
  particle.geometry.setAttribute('position', new THREE.BufferAttribute( attributes.positions[imageIndex], 3));
  particle.geometry.setAttribute('aTarget', new THREE.BufferAttribute( attributes.endPositions[imageIndex], 3));
  particle.geometry.setAttribute('aTime', new THREE.BufferAttribute( attributes.times[imageIndex], 1));
  particle.geometry.setAttribute('aAlpha', new THREE.BufferAttribute( attributes.alphas[imageIndex], 1));
  particle.geometry.setAttribute('aColor', new THREE.BufferAttribute( attributes.colors[imageIndex], 3));
});