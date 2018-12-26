import * as deepmerge from 'deepmerge';
import { IMergeConfigs } from '@testring/types';

const emptyTarget = value => Array.isArray(value) ? [] : {};
const clone = (value, options) => deepmerge(emptyTarget(value), value, options);

function mergePlugins(target: Array<any>, source: Array<any>, options) {
    const plugins = {};

    const putPluginIntoDictionary = (element) => {
        if (typeof element === 'string') {
            if (!(element in plugins)) {
                plugins[element] = null;
            }

            return;
        }

        if (Array.isArray(element)) {
            const plugin = element[0];
            const config = element[1];

            if (!(plugin in plugins)) {
                plugins[plugin] = clone(config, options);
            } else {
                plugins[plugin] = deepmerge(plugins[plugin], config, options);
            }
        }
    };

    target.forEach(putPluginIntoDictionary);
    source.forEach(putPluginIntoDictionary);

    return Object.keys(plugins).map((pluginName) => {
        if (plugins[pluginName]) {
            return [pluginName, plugins[pluginName]];
        } else {
            return pluginName;
        }
    });
}

function deepMergePlugins(configs: any[], options) {
    let plugins: any[] = [];

    for (let config of configs) {
        if (typeof config === 'object' && Array.isArray(config.plugins)) {
            plugins = mergePlugins(plugins, config.plugins, options);
        }
    }

    return plugins;
}

export const mergeConfigs: IMergeConfigs = function mergeConfigs(...configs) {
    const options = {};

    const plugins = deepMergePlugins([{}, ...configs], options);
    const source = deepmerge.all([{}, ...configs], options);

    if (plugins.length > 0) {
        (source as any).plugins = plugins;
    }

    return source;
};
