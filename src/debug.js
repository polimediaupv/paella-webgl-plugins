import { Paella } from 'paella-core';
import getZoomPluginContext from './index';

const initParams = {
    customPluginContext: [
        getZoomPluginContext()
    ]
};

const paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));
