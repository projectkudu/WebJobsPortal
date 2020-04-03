import React, { useState, useContext, useEffect } from 'react';
import { StartupInfoContext } from '../../../../StartupInfoContext';
import { ArmSiteDescriptor } from '../../../../utils/resourceDescriptors';
import AppInsightsService from '../../../../ApiHelpers/AppInsightsService';
import { ArmObj } from '../../../../models/arm-obj';
import { AppInsightsComponent } from '../../../../models/app-insights';
import LogService from '../../../../utils/LogService';
import { LogCategories } from '../../../../utils/LogCategories';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import AppInsightsSetup from '../../functions/function/monitor/AppInsightsSetup';
import FunctionLogAppInsightsDataLoader from '../../functions/function/function-log/FunctionLogAppInsightsDataLoader';
import { paddingStyle } from './LogStream.styles';

export interface LogStreamDataLoaderProps {
  resourceId: string;
}

const LogStreamDataLoader: React.FC<LogStreamDataLoaderProps> = props => {
  const { resourceId } = props;
  const [appInsightsComponent, setAppInsightsComponent] = useState<ArmObj<AppInsightsComponent> | undefined | null>(undefined);
  const startupInfoContext = useContext(StartupInfoContext);
  const armSiteDescriptor = new ArmSiteDescriptor(resourceId);
  const siteResourceId = armSiteDescriptor.getTrimmedResourceId();

  const fetchComponent = async (force?: boolean) => {
    const appInsightsResourceIdResponse = await AppInsightsService.getAppInsightsResourceId(
      siteResourceId,
      startupInfoContext.subscriptions
    );
    if (appInsightsResourceIdResponse.metadata.success) {
      const aiResourceId = appInsightsResourceIdResponse.data;
      if (!!aiResourceId) {
        const appInsightsResponse = await AppInsightsService.getAppInsights(aiResourceId);
        if (appInsightsResponse.metadata.success) {
          setAppInsightsComponent(appInsightsResponse.data);
        } else {
          LogService.error(
            LogCategories.functionLog,
            'getAppInsights',
            `Failed to get app insights: ${appInsightsResponse.metadata.error}`
          );
        }
      }
    } else {
      setAppInsightsComponent(null);
      LogService.error(
        LogCategories.functionLog,
        'getAppInsightsResourceId',
        `Failed to get app insights resource Id: ${appInsightsResourceIdResponse.metadata.error}`
      );
    }
  };

  const resetAppInsightsComponent = () => {
    setAppInsightsComponent(undefined);
  };

  useEffect(() => {
    fetchComponent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appInsightsComponent === undefined) {
      fetchComponent(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appInsightsComponent]);

  if (appInsightsComponent === undefined) {
    return <LoadingComponent />;
  }

  if (appInsightsComponent === null) {
    return <AppInsightsSetup siteId={siteResourceId} fetchNewAppInsightsComponent={resetAppInsightsComponent} />;
  }

  return (
    <div style={paddingStyle}>
      <FunctionLogAppInsightsDataLoader
        resourceId={resourceId}
        isExpanded={true}
        forceMaximized={true}
        isResizable={false}
        hideChevron={true}
        isFunctionApp={true}
      />
    </div>
  );
};

export default LogStreamDataLoader;
