
import LLMChat from './plugins/es.upv.paella.llmChat.js';

export default function geChatPluginContext() {
    return require.context("./plugins", true, /\.js/)
}

export const webglPlugins = [
    {
        plugin: LLMChat,
        config: {
            enabled: false
        }
    }
];

export const allPlugins = webglPlugins;

export const LLMChatPlugin = LLMChat;
