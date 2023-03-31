import { CanvasPlugin, Canvas, createElementWithHtmlText } from 'paella-core';
import WebGLCanvas from '../js/WebGLCanvas';
import Shader from '../js/Shader';
import SceneObject from '../js/SceneObject';
import VideoTexture from '../js/VideoTexture';
import { createSphere } from '../js/primitives';
import Mat4 from '../js/math/Mat4';

const vertex = `
attribute vec4 inVertexPos;
attribute vec2 inTexCoord;

varying vec2 fsTexCoord;

uniform mat4 uView;
uniform mat4 uProj;

void main() {
    gl_Position = uProj * uView * inVertexPos;
    fsTexCoord = inTexCoord;
}
`;

const fragment = `
precision highp float;
uniform sampler2D uVideoTexture;

varying vec2 fsTexCoord;

void main() {
    gl_FragColor = texture2D(uVideoTexture,fsTexCoord);
    // gl_FragColor = vec4(fsTexCoord, 0.0, 1.0);
}
`;

const removeVideoElement = (video, debug = false) => {
    const playerParent = video.parentNode;
    playerParent.removeChild(video);
    document.body.appendChild(video);
    video.style.position = "fixed";
    video.style.width = "100px";
    video.style.height = "50px";
    video.style.top = "0px";
    video.style.left = "0px";
    if (!debug) {
        video.style.display = "none";
    }
}

export class Video360Canvas extends Canvas {
    constructor(player, videoContainer, config) {
        super('canvas', player, videoContainer);
        this.config = config;

        let downPosition = [0,0];
        let drag = false;
        this._pitch = 0;
        this._yaw = 0;
        this.element.addEventListener('mousedown', evt => {
            drag = true;
            downPosition = [evt.clientX, evt.clientY];
            evt.stopPropagation();
        });

        this.element.addEventListener('click', evt => {
            evt.stopPropagation();
        });

        this.element.addEventListener('mouseup', evt => {
            drag = false;
            evt.stopPropagation();
        });

        this.element.addEventListener('mousemove', evt => {
            if (drag) {
                const newPos = [evt.clientX, evt.clientY];
                const diff = [downPosition[0] - newPos[0], downPosition[1] - newPos[1]];
                downPosition = newPos;
                console.log(diff);
                this._yaw += diff[0] * 0.008;
                this._pitch += diff[1] * 0.004;
                if (this._yaw>2*Math.PI) {
                    this._yaw = this._yaw - 2 * Math.PI;
                }
                else if (this._yaw<0) {
                    this._yaw = 2 * Math.PI + this._yaw;
                }

            }
            evt.stopPropagation();
        });
    }

    async loadCanvas(player) {
        this.currentZoom = 1;
        this._videoPlayer = player;

        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";

        this._videoPlayer = player;
        player.element.crossOrigin = "";
        removeVideoElement.apply(this, [player.element, true])

        this._webGLCanvas = new WebGLCanvas(this.element);
        await this._webGLCanvas.init({ clearColor: [0.2, 0.3, 0.8, 1] });

        const { gl } = this._webGLCanvas;

        const videoTexture = new VideoTexture(gl, player.element);

        const shader = new Shader(gl, { 
            vertex, fragment, 
            attribs: [ 'inVertexPos', 'inTexCoord' ], 
            uniforms: [ 'uView', 'uProj', 'uVideoTexture' ]
        });

        const sphereData = createSphere(10);
        console.log(sphereData);

        const sphere = new SceneObject(gl, sphereData.positions.flat(), sphereData.uvs.flat(), sphereData.triangles.flat());

        const quad = new SceneObject(gl, 
            [
                 1, 1, 0,
                -1, 1, 0,
                -1,-1, 0,
                 1,-1, 0
            ],
            [
                1, 0,
                0, 0,
                0, 1,
                1, 1
            ],
            [
                0, 1, 2,
                2, 3, 0
            ]);

        const projection = Mat4.MakePerspective(45.0, 1, 0.01, 10.0);
        const view = Mat4.MakeTranslation(0, 0, -5);
        
        //const mat = Mat4.Mult(projection, translation);
     
        this._rot = 0;
        const canvas = this.element;
        const draw = () => {
            this._rot = this._yaw;
            const model = Mat4.MakeRotation(this._rot, 0, 1, 0);
            videoTexture.updateTexture();
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            gl.clear(gl.COLOR_BUFFER_BIT);
    
            shader.useProgram();
            //shader.enablePositionArray('inVertexPos', quad);
            //shader.enableTexCoordArray('inTexCoord', quad);
            shader.enablePositionArray('inVertexPos', sphere);
            shader.enablePositionArray('inTexCoord', sphere);
            shader.bindMatrix4('uView', Mat4.Mult(model,view));
            shader.bindMatrix4('uProj', projection);
            shader.bindTexture('uVideoTexture', videoTexture.texture);
            //quad.draw();
            sphere.draw();
            requestAnimationFrame(draw);    
        }
        draw();
    }
}

export default class Video360CanvasPlugin extends CanvasPlugin {
    get canvasType() { return "video360"; }

    isCompatible(stream) {
        if (stream.canvas?.find(c => c == this.canvasType)) {
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer) {
        return new Video360Canvas(this.player, videoContainer, this.config);
    }
}
