import { PluginModule } from "paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class LLMChatModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new LLMChatModule();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-llm-chat";
    }

    get moduleVersion() {
        return packageData.version;
    }
}