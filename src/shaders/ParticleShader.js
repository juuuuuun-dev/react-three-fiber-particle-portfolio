import * as THREE from 'three';

const ParticleShader = {
  uniforms: {
    uTime: { type: 'f', value: 0 },
    uCoefficient: { type: 'f', value: 0 },
    uMousePosition: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) }
  },
  vertexShader: `
    attribute float aAlpha;
    attribute vec3  aColor;
    attribute float aTime;
    attribute vec3 aTarget;
    uniform float uTime;
    uniform vec4 uMousePosition;
    uniform float uCoefficient;
    varying float vAlpha;
    varying vec3 vColor;
    
    highp float random(vec2 co)
    {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }
    
    void main(){
    
        float curTime = mod(uTime + aTime, 1.3);
        // float rate = curTime/3.; 
        // todo この数字をattributeに
        float rate = curTime/10.; 
        vec3 pos;
        if(rate < 1.){
            pos = mix(position, aTarget * uMousePosition.x * -uCoefficient, rate);
        }else{
            float fract = rate + 1.0;
            pos = mix(position, aTarget * 1.0, 1.0 + fract * fract);
        }
    
        if(aAlpha < 0.7) vAlpha =  clamp((1.0 - rate)/1.0, 0., 1.0);
        // else             vAlpha =  clamp((1.0 - rate)/0.5, 0., 1.0);
        vColor = aColor;
        gl_PointSize = 0.5; //(size * scale) * (1000.0 / length(mvPosition.xyz));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, vAlpha );
    }
  `
};

export default ParticleShader;
