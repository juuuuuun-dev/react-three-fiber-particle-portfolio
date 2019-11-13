// @todo scene add loop

var imgSrc = "images/a.png";
var imgSrcArr = [
  {
    src: 'images/a.png',
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
var MAX = 50000;
let attributes = {
  positions: [],
  endPositions: [],
  alphas: [],
  colors: [],
  times: [],
};

imagesInit();


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
        
        attr.endPositions[i][n * count] = range(0, 30);
        attr.endPositions[i][n * count + 1] = range(0, 30);
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
  renderer.setClearColor(0x333333);
  clock = new THREE.Clock();
  document.body.appendChild(renderer.domElement);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  TweenMax.ticker.addEventListener("tick", loop);
}


class CustomParticle extends THREE.BufferGeometry {
  constructor(){
    super()
    this.count = MAX;
    var positionArray = new Float32Array(this.count * 3);
    var endPositionArray = new Float32Array(this.count * 3);
    var alphaArray = new Float32Array(this.count);
    var timeArray = new Float32Array(this.count);
    var colorArray = new Float32Array(this.count * 3);
    const datas = imagePositions[imageIndex];
    // @todo これを別のfunctionにと画像配列分
    for(var ii = 0; ii < this.count; ii++){
      var data = datas[parseInt(datas.length * Math.random())];
      
      positionArray[ii * 3 + 0] = data.x;
      positionArray[ii * 3 + 1] = 0;
      positionArray[ii * 3 + 2] = data.y;

      endPositionArray[ii * 3 + 0] = range(0, 30);
      endPositionArray[ii * 3 + 1] = range(0, 30);
      endPositionArray[ii * 3 + 2] = range(0, 0);

      timeArray[ii] = 3 * Math.random();

      alphaArray[ii] = Math.random();

      colorArray[ii * 3 + 0] = data.color.r;
      colorArray[ii * 3 + 1] = data.color.g;
      colorArray[ii * 3 + 2] = data.color.b;
    }

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
        uTime : {type : "f", value : 0}
    };
    super({
        uniforms: uniforms,
        vertexShader: document.getElementById("vertex").textContent,
        fragmentShader: document.getElementById("fragment").textContent
    });

    this.transparent = true;
    this.depthWrite = false;
    this.blending = THREE.AdditiveBlending;
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
var time = 0;
var mouse = new THREE.Vector2();

function loop(){
    var delta = clock.getDelta();
    time += delta;
    theta += (mouse.x /3 - theta)/10;

    camera.position.z = 10 * Math.cos(theta);
    camera.position.x = 10 * Math.sin(theta);
    camera.lookAt(new THREE.Vector3())

    particle.material.uniforms.uTime.value = time;
    renderer.render(scene, camera);
}



function onDocumentMouseMove(event){
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
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
  particle.geometry.setAttribute('position', new THREE.BufferAttribute( attributes.positions[1], 3));
  particle.geometry.setAttribute('aTarget', new THREE.BufferAttribute( attributes.endPositions[1], 3));
  particle.geometry.setAttribute('aTime', new THREE.BufferAttribute( attributes.times[1], 1));
  particle.geometry.setAttribute('aAlpha', new THREE.BufferAttribute( attributes.alphas[1], 1));
  particle.geometry.setAttribute('aColor', new THREE.BufferAttribute( attributes.colors[1], 3));

});