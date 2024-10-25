import { Paella } from 'paella-core';
import getPluginContext from './index';

const initParams = {
    customPluginContext: [
        getPluginContext()
    ]
};

const paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));
