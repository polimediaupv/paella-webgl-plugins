import { PluginModule } from "paella-core";
import packageData from "../../package.json";

export default class WebGLKPluginsModule extends PluginModule {
    get moduleName() {
        return "paella-webgl-plugins";
    }

    get moduleVersion() {
        return packageData.version;
    }
}