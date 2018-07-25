import { ILoggerServer } from './logger';
import { IFSReader } from './fs-reader';
import { ITestWorker } from './test-worker';
import { ITestRunController } from './test-run-controller';
import { IPluggableModule } from './pluggable-module';
import { IBrowserProxyController } from './browser-proxy';
import { IHttpClient } from './http-api';

export type PluginConfig = object | null;

export type Plugin = (pluginAPI: any, config: PluginConfig) => void;

export interface IPluginModules {
    logger: ILoggerServer & IPluggableModule;
    fsReader?: IFSReader & IPluggableModule;
    testWorker: ITestWorker & IPluggableModule;
    testRunController: ITestRunController & IPluggableModule;
    browserProxy: IBrowserProxyController & IPluggableModule;
    httpClientInstance: IHttpClient;
}
