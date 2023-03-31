
import Video360Canvas from './plugins/es.upv.paella.video360Canvas';

export default function getZoomPluginContext() {
    return require.context("./plugins", true, /\.js/)
}

export const Video360CanvasPlugin = Video360Canvas;
