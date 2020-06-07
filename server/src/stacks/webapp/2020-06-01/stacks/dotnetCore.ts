import { WebAppStack } from './../stack.model';

const dotnetCore2Point1EOL = new Date(20201, 8, 21);

export const dotnetCoreStack: WebAppStack = {
  displayText: '.NET Core',
  value: '.NET Core',
  sortOrder: 4,
  preferredOs: 'windows',
  majorVersions: [
    {
      displayText: '.NET Core 3',
      value: '3',
      minorVersions: [
        {
          displayText: '.Net Core 3.1 (LTS)',
          value: '3.1',
          platforms: {
            windows: {
              runtimeVersion: '3.1',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '3.1.102',
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|3.1',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '3.1.102',
              },
            },
          },
        },
        {
          displayText: '.Net Core 3.0',
          value: '3.0',
          platforms: {
            windows: {
              runtimeVersion: '3.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|3.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
          },
        },
      ],
    },
    {
      displayText: '.NET Core 2',
      value: 'DotnetCore2',
      minorVersions: [
        {
          displayText: '.NET Core 2.2',
          value: '2.2',
          platforms: {
            windows: {
              runtimeVersion: '2.2',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|2.2',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
          },
        },
        {
          displayText: '.NET Core 2.1 (LTS)',
          value: '2.1',
          platforms: {
            windows: {
              runtimeVersion: '2.1',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '2.1.804',
              },
              projectedEndOfLifeDate: dotnetCore2Point1EOL,
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|2.1',
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
                supportedVersion: '2.1.804',
              },
            },
          },
        },
        {
          displayText: '.NET Core 2.0',
          value: '2.0',
          platforms: {
            windows: {
              runtimeVersion: '2.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|2.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
          },
        },
      ],
    },
    {
      displayText: '.NET Core 1',
      value: '1',
      minorVersions: [
        {
          displayText: '.NET Core 1.1',
          value: '1.1',
          platforms: {
            windows: {
              runtimeVersion: '1.1',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|1.1',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
          },
        },
        {
          displayText: '.NET Core 1.0',
          value: '1.0',
          platforms: {
            windows: {
              runtimeVersion: '1.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
            linux: {
              runtimeVersion: 'DOTNETCORE|1.0',
              isDeprecated: true,
              remoteDebuggingSupported: false,
              appInsightsSettings: {
                isSupported: false,
              },
              gitHubActionSettings: {
                isSupported: true,
              },
            },
          },
        },
      ],
    },
  ],
};