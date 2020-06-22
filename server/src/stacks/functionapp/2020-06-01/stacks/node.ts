import { FunctionAppStack } from '../stack.model';

const node12EOL = new Date(2022, 4, 1);
const node10EOL = new Date(2021, 4, 1);
const node8EOL = new Date(2019, 12, 31);

export const nodeStack: FunctionAppStack = {
  displayText: 'Node.js',
  value: 'node',
  preferredOs: 'windows',
  majorVersions: [
    {
      displayText: 'Node.js 12',
      value: '12',
      minorVersions: [
        {
          displayText: 'Node.js 12 LTS',
          value: '12 LTS',
          stackSettings: {
            windowsRuntimeSettings: {
              runtimeVersion: '~12',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: true,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '12.x',
              },
              appSettingsDictionary: {
                FUNCTIONS_WORKER_RUNTIME: 'node',
                WEBSITE_NODE_DEFAULT_VERSION: '~12',
              },
              siteConfigPropertiesDictionary: {},
              supportedFunctionsExtensionVersions: ['~3'],
              endOfLifeDate: node12EOL,
            },
            linuxRuntimeSettings: {
              runtimeVersion: 'Node|12',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: true,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '10.x',
              },
              appSettingsDictionary: {
                FUNCTIONS_WORKER_RUNTIME: 'node',
              },
              siteConfigPropertiesDictionary: {
                Use32BitWorkerProcess: false,
                linuxFxVersion: 'Node|12',
              },
              supportedFunctionsExtensionVersions: ['~3'],
              endOfLifeDate: node12EOL,
            },
          },
        },
      ],
    },
    {
      displayText: 'Node.js 10',
      value: '10',
      minorVersions: [],
    },
    {
      displayText: 'Node.js 8',
      value: '8',
      minorVersions: [],
    },
  ],
};
