import i18next from 'i18next';
import { PanelType } from 'office-ui-fabric-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FunctionsService from '../../../../../ApiHelpers/FunctionsService';
import LoadingComponent from '../../../../../components/loading/loading-component';
import Panel from '../../../../../components/Panel/Panel';
import { ArmObj } from '../../../../../models/arm-obj';
import { BindingConfigDirection, BindingsConfig } from '../../../../../models/functions/bindings-config';
import { BindingInfo } from '../../../../../models/functions/function-binding';
import { FunctionInfo } from '../../../../../models/functions/function-info';
import { LogCategories } from '../../../../../utils/LogCategories';
import LogService from '../../../../../utils/LogService';
import BindingCreator from './BindingCreator';
import BindingEditor from './BindingEditor';

export interface BindingEditorDataLoaderProps {
  functionInfo: ArmObj<FunctionInfo>;
  functionAppId: string;
  bindingInfo?: BindingInfo;
  bindingDirection: BindingConfigDirection;
  isOpen: boolean;
  onPanelClose: () => void;
  onSubmit: (newBindingInfo: BindingInfo, currentBindingInfo?: BindingInfo) => void;
}

const BindingEditorDataLoader: React.SFC<BindingEditorDataLoaderProps> = props => {
  const { functionInfo, functionAppId, bindingInfo, bindingDirection, isOpen, onPanelClose } = props;
  const [bindingsConfig, setBindingsConfig] = useState<BindingsConfig | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    FunctionsService.getBindingConfigMetadata().then(r => {
      if (!r.metadata.success) {
        LogService.trackEvent(
          LogCategories.bindingEditor,
          'getBindingConfigMetadata',
          `Failed to get bindingConfigMetadata: ${r.metadata.error}`
        );
        return;
      }

      setBindingsConfig(r.data);
    });
  }, []);

  if (!bindingsConfig) {
    return <LoadingComponent />;
  }

  {
    return (
      <Panel
        isOpen={isOpen}
        type={PanelType.smallFixedFar}
        headerText={getPanelHeader(t, bindingDirection, bindingInfo)}
        onDismiss={onPanelClose}>
        <div style={{ marginTop: '10px' }}>
          {!bindingInfo ? (
            <BindingCreator bindingsConfig={bindingsConfig} functionAppId={functionAppId} bindingDirection={bindingDirection} {...props} />
          ) : (
            <BindingEditor
              functionInfo={functionInfo}
              allBindingsConfig={bindingsConfig}
              currentBindingInfo={bindingInfo}
              resourceId={functionAppId}
              onSubmit={props.onSubmit}
            />
          )}
        </div>
      </Panel>
    );
  }
};

// If binding info is undefined that means you are creating a new binding info, otherwise you are editing
const getPanelHeader = (t: i18next.TFunction, bindingDirection: BindingConfigDirection, bindingInfo?: BindingInfo) => {
  if (!bindingInfo) {
    switch (bindingDirection) {
      case BindingConfigDirection.in: {
        return t('integrateCreateInput');
      }
      case BindingConfigDirection.out: {
        return t('integrateCreateOutput');
      }
    }
  }

  switch (bindingDirection) {
    case BindingConfigDirection.in: {
      return t('editBindingInput');
    }
    case BindingConfigDirection.out: {
      return t('editBindingOutput');
    }
    default: {
      return t('editBindingTrigger');
    }
  }
};

export default BindingEditorDataLoader;
