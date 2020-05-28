import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  pivotItemWrapper,
  functionTestGroupStyle,
  responseCodeStyle,
  responseContentStyle,
  testFormLabelStyle,
} from './FunctionTest.styles';
import { Label } from 'office-ui-fabric-react';
import { ResponseContent } from '../FunctionEditor.types';
import { HttpConstants } from '../../../../../../utils/constants/HttpConstants';
import { PortalTheme } from '../../../../../../models/portal-models';
import MonacoEditor, { getMonacoEditorTheme } from '../../../../../../components/monaco-editor/monaco-editor';
import { EditorLanguage } from '../../../../../../utils/EditorManager';
import { StartupInfoContext } from '../../../../../../StartupInfoContext';

export interface FunctionTestOutputProps {
  responseContent?: ResponseContent;
}

// TODO (krmitta): Add Content for Output-Tab [WI: 5536379]
const FunctionTestOutput: React.SFC<FunctionTestOutputProps> = props => {
  const { t } = useTranslation();
  const { responseContent } = props;

  const startUpInfoContext = useContext(StartupInfoContext);

  return (
    <div className={pivotItemWrapper}>
      <div className={functionTestGroupStyle}>
        <Label className={testFormLabelStyle}>{t('httpRun_responseCode')}</Label>
        <div className={responseCodeStyle}>
          {!!responseContent ? `${responseContent.code} ${HttpConstants.statusCodeToText(responseContent.code)}` : ''}
        </div>
      </div>
      <div className={functionTestGroupStyle}>
        <Label className={testFormLabelStyle}>{t('httpRun_responseContent')}</Label>
        <div className={responseContentStyle}>
          <MonacoEditor
            language={EditorLanguage.json}
            value={!!responseContent && !!responseContent.text ? responseContent.text : ''}
            theme={getMonacoEditorTheme(startUpInfoContext.theme as PortalTheme)}
            height="70px"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: false,
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 0,
              disableLayerHinting: true,
              readOnly: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionTestOutput;
