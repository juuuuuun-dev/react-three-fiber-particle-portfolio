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

imageInit();
imagesInit();

function range(min, max){
    return min + (max - min) * Math.random();
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

        this.addAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        this.addAttribute("aTarget", new THREE.BufferAttribute(endPositionArray, 3));
        this.addAttribute("aTime", new THREE.BufferAttribute(timeArray, 1));
        this.addAttribute("aAlpha", new THREE.BufferAttribute(alphaArray, 1));
        this.addAttribute("aColor", new THREE.BufferAttribute(colorArray, 3));
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

function imageInit(){
    image = new Image();
    image.onload = onLoadimage;
    image.crossOrigin = "Anonymous";
    image.src = imgSrc;
}

/**
 * imagesInit
 * array image ver
 */
async function imagesInit() {
  var canvas = document.createElement("canvas");
  imagePositions = await createImgPosition(canvas);
  console.log(imagePositions);
  init();
}

/**
 * createImgPosition
 * @param {*} canvas
 */
function createImgPosition(canvas) {
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = e => reject();
    img.src = src;
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

    // requestAnimationFrame
    TweenMax.ticker.addEventListener("tick", loop);
}

function onLoadimage(){
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    var data = ctx.getImageData(0, 0, image.width, image.height);
    var imageData = data.data;
    var scale = 10;

    for(var yy = 0; yy < image.height; yy++){
        for(var xx = 0; xx < image.width; xx++){
            var num = 4 * (image.width * yy + xx ) + 3;
            var alpha = imageData[num];
            if(alpha !== 0){
                var rRate = xx/image.width * .9
                var gRate = yy/image.height * .2;
                var color = new THREE.Color();
                color.setRGB(rRate, gRate, 1);
                // color.setRGB(colorRate, 0.1 * Math.random(), 1)
                // color.setHSL(colorRate, 0.3 + 0.6 * Math.random(), 0.3 + 0.3 * Math.random())
                var data = {
                  x: (xx - image.width / 2 + 9 * Math.random()) / scale,
                  y: (yy - image.height / 2) / scale,
                  alpha: alpha / 255,
                  color: color,
                }
                datas.push(data);
            }

        }
    }
    // init();
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

window.addEventListener('keydown', function(ev){
    switch(ev.which){
        case 83:
            console.log(particle.geometry.attributes)
            var  positions = new Float32Array( MAX * 3 ); // 3 vertices per point
            particle.geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
            break;
    }
});