# paella-webgl-plugins

A set of canvas plugins to show videos using a WebGL canvas.



## Video 360 Canvas

It is a canvas plugin that allows you to display 360-degree videos recorded in equirectangular format. Mouse or touch actions on the canvas are used to zoom and scroll the video, therefore with this canvas the play/pause by clicking on the video canvas is disabled.

This video canvas works with those streams that have `video360` as canvas identifier in the [video manifest](https://paellaplayer.upv.es/#/doc/video_manifest.md).

**data.json:**

```json
{
    ...
    "streams": [
        {
            "sources": {...},
            "content": "presenter",
            "canvas":["video360"]
        }
    ]
}
```

**config.json:**

```json
{
    "plugins": {
        "es.upv.paella.video360Canvas": {
            "enabled": true,
            "maxZoom": 2,
            "minZoom": 0.5,
            "speedX": 0.4,
            "speedY": 0.4
        }
    }
}
```

**Exported as** `Video360CanvasPlugin`.
¡