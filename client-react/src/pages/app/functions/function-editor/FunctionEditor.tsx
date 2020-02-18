import React, { useState, useEffect, useContext } from 'react';
import { ArmObj } from '../../../../models/arm-obj';
import { FunctionInfo } from '../../../../models/functions/function-info';
import FunctionEditorCommandBar from './FunctionEditorCommandBar';
import FunctionEditorFileSelectorBar from './FunctionEditorFileSelectorBar';
import { BindingType } from '../../../../models/functions/function-binding';
import { Site } from '../../../../models/site/site';
import Panel from '../../../../components/Panel/Panel';
import { PanelType, IDropdownOption, Pivot, PivotItem } from 'office-ui-fabric-react';
import FunctionTest from './function-test/FunctionTest';
import MonacoEditor from '../../../../components/monaco-editor/monaco-editor';
import { InputFormValues, ResponseContent, PivotType, FileContent, UrlObj } from './FunctionEditor.types';
import { VfsObject } from '../../../../models/functions/vfs';
import LoadingComponent from '../../../../components/Loading/LoadingComponent';
import FunctionsService from '../../../../ApiHelpers/FunctionsService';
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import {
  pivotStyle,
  testLoadingStyle,
  commandBarSticky,
  logPanelStyle,
  defaultMonacoEditorHeight,
  testPanelStyle,
} from './FunctionEditor.styles';
import EditorManager, { EditorLanguage } from '../../../../utils/EditorManager';
import { editorStyle } from '../../app-files/AppFiles.styles';
import FunctionLog from './function-log/FunctionLog';
import { FormikActions } from 'formik';
import EditModeBanner from '../../../../components/EditModeBanner/EditModeBanner';
import { SiteStateContext } from '../../../../SiteStateContext';
import SiteHelper from '../../../../utils/SiteHelper';
import { BindingManager } from '../../../../utils/BindingManager';

export interface FunctionEditorProps {
  functionInfo: ArmObj<FunctionInfo>;
  site: ArmObj<Site>;
  run: (functionInfo: ArmObj<FunctionInfo>) => void;
  functionRunning: boolean;
  urlObjs: UrlObj[];
  resetAppInsightsToken: () => void;
  showTestPanel: boolean;
  setShowTestPanel: (showPanel: boolean) => void;
  responseContent?: ResponseContent;
  runtimeVersion?: string;
  fileList?: VfsObject[];
  appInsightsToken?: string;
}

export const FunctionEditor: React.SFC<FunctionEditorProps> = props => {
  const {
    functionInfo,
    site,
    fileList,
    runtimeVersion,
    responseContent,
    functionRunning,
    urlObjs,
    appInsightsToken,
    resetAppInsightsToken,
    showTestPanel,
    setShowTestPanel,
  } = props;
  const [reqBody, setReqBody] = useState('');
  const [fetchingFileContent, setFetchingFileContent] = useState(false);
  const [fileContent, setFileContent] = useState<FileContent>({ default: '', latest: '' });
  const [selectedFile, setSelectedFile] = useState<IDropdownOption | undefined>(undefined);
  const [editorLanguage, setEditorLanguage] = useState(EditorLanguage.plaintext);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<IDropdownOption | undefined>(undefined);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [savingFile, setSavingFile] = useState<boolean>(false);
  const [selectedPivotTab, setSelectedPivotTab] = useState(PivotType.input);
  const [monacoHeight, setMonacoHeight] = useState(defaultMonacoEditorHeight);
  const [logPanelExpanded, setLogPanelExpanded] = useState(false);
  const [logPanelFullscreen, setLogPanelFullscreen] = useState(false);
  const [fileSavedCount, setFileSavedCount] = useState(0);
  const [readOnlyBanner, setReadOnlyBanner] = useState<HTMLDivElement | null>(null);

  const { t } = useTranslation();

  const siteState = useContext(SiteStateContext);

  const save = async () => {
    if (!selectedFile) {
      return;
    }
    setSavingFile(true);
    const fileData = selectedFile.data;
    const headers = {
      'Content-Type': fileData.mime,
      'If-Match': '*',
    };
    const fileResponse = await FunctionsService.saveFileContent(
      site.id,
      fileData.name,
      fileContent.latest,
      functionInfo.properties.name,
      runtimeVersion,
      headers
    );
    if (fileResponse.metadata.success) {
      setFileContent({ ...fileContent, default: fileContent.latest });
      setLogPanelExpanded(true);
      setFileSavedCount(fileSavedCount + 1);
    }
    setSavingFile(false);
  };

  const discard = () => {
    setFileContent({ ...fileContent, latest: fileContent.default });
  };

  const test = () => {
    setShowTestPanel(true);
  };

  const onCancelTest = () => {
    setShowTestPanel(false);
  };

  const isDirty = () => {
    return fileContent.default !== fileContent.latest;
  };

  const onFileSelectorChange = async (e: unknown, option: IDropdownOption) => {
    if (isDirty()) {
      setSelectedDropdownOption(option);
      return;
    }
    changeDropdownOption(option);
  };

  const changeDropdownOption = (option: IDropdownOption) => {
    closeConfirmDialog();
    setFetchingFileContent(true);
    setSelectedFile(option);
    setSelectedFileContent(option.data);
    getAndSetEditorLanguage(option.data.name);
    setFetchingFileContent(false);
  };

  const run = (values: InputFormValues, formikActions: FormikActions<InputFormValues>) => {
    const data = JSON.stringify({
      method: values.method,
      queryStringParams: values.queries,
      headers: values.headers,
      body: reqBody,
    });
    const tempFunctionInfo = functionInfo;
    tempFunctionInfo.properties.test_data = data;
    props.run(tempFunctionInfo);
  };

  const inputBinding =
    functionInfo.properties.config && functionInfo.properties.config.bindings
      ? functionInfo.properties.config.bindings.find(e => e.type === BindingType.httpTrigger)
      : null;

  const getDropdownOptions = (): IDropdownOption[] => {
    return !!fileList
      ? fileList
          .map(file => ({
            key: file.name,
            text: file.name,
            isSelected: false,
            data: file,
          }))
          .filter(file => file.data.mime !== 'inode/directory')
          .sort((a, b) => a.key.localeCompare(b.key))
      : [];
  };

  const setSelectedFileContent = async (file: VfsObject) => {
    const headers = {
      'Content-Type': file.mime,
    };
    const fileResponse = await FunctionsService.getFileContent(site.id, functionInfo.properties.name, runtimeVersion, headers, file.name);
    if (fileResponse.metadata.success) {
      let fileText = fileResponse.data as string;
      if (typeof fileResponse.data !== 'string') {
        // third parameter refers to the number of white spaces.
        // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
        fileText = JSON.stringify(fileResponse.data, null, 2);
      }
      setFileContent({ default: fileText, latest: fileText });
    }
  };

  const getScriptFileOption = (): IDropdownOption | undefined => {
    const scriptHref = functionInfo.properties.script_href;
    const filename = (scriptHref && scriptHref.split('/').pop()) || '';
    const filteredOptions = getDropdownOptions().filter(option => option.text === filename.toLowerCase());
    return filteredOptions.length === 1 ? filteredOptions[0] : getDefaultFile();
  };

  const getDefaultFile = (): IDropdownOption | undefined => {
    const options = getDropdownOptions();
    return options.length > 0 ? options[0] : undefined;
  };

  const fetchData = async () => {
    const file = getScriptFileOption();
    if (!!file) {
      setSelectedFileContent(file.data);
      setSelectedFile(file);
      getAndSetEditorLanguage(file.data.name);
    }
    setInitialLoading(false);
  };

  const onChange = (newValue, event) => {
    setFileContent({ ...fileContent, latest: newValue });
  };

  const getAndSetEditorLanguage = (fileName: string) => {
    setEditorLanguage(EditorManager.getEditorLanguage(fileName));
  };

  const isLoading = () => {
    return fetchingFileContent || initialLoading || savingFile;
  };

  const isDisabled = () => {
    return isLoading() || functionRunning;
  };

  const closeConfirmDialog = () => {
    setSelectedDropdownOption(undefined);
  };

  const getPivotTabId = (itemKey: string, index: number): string => {
    return `function-test-${itemKey}`;
  };

  const onPivotItemClick = (item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {
    if (!!item) {
      setSelectedPivotTab(item.props.itemKey as PivotType);
    }
  };

  const getHeaderContent = (): JSX.Element => {
    return (
      <Pivot getTabId={getPivotTabId} className={pivotStyle} onLinkClick={onPivotItemClick} selectedKey={selectedPivotTab}>
        <PivotItem itemKey={PivotType.input} linkText={t('functionTestInput')} />
        <PivotItem itemKey={PivotType.output} linkText={t('functionTestOutput')} />
      </Pivot>
    );
  };

  const changePivotTab = (pivotItem: PivotType) => {
    setSelectedPivotTab(pivotItem);
  };

  const toggleLogPanelExpansion = () => {
    setLogPanelExpanded(!logPanelExpanded);
  };

  const getReadOnlyBannerHeight = () => {
    return !!readOnlyBanner ? readOnlyBanner.offsetHeight : 0;
  };

  const isTestDisabled = () => {
    const httpTriggerTypeInfo = BindingManager.getHttpTriggerTypeInfo(functionInfo.properties);
    const webHookTypeInfo = BindingManager.getWebHookTypeInfo(functionInfo.properties);
    return !httpTriggerTypeInfo && !webHookTypeInfo;
  };

  useEffect(() => {
    setMonacoHeight(`calc(100vh - ${(logPanelExpanded ? 310 : 138) + getReadOnlyBannerHeight()}px)`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logPanelExpanded, readOnlyBanner]);
  useEffect(() => {
    if (!!responseContent) {
      changePivotTab(PivotType.output);
    }
  }, [responseContent]);
  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={commandBarSticky}>
        <FunctionEditorCommandBar
          saveFunction={save}
          resetFunction={discard}
          testFunction={test}
          showGetFunctionUrlCommand={!!inputBinding}
          dirty={isDirty()}
          disabled={isDisabled()}
          urlObjs={urlObjs}
          testDisabled={isTestDisabled()}
        />
        <ConfirmDialog
          primaryActionButton={{
            title: t('ok'),
            onClick: () => !!selectedDropdownOption && changeDropdownOption(selectedDropdownOption),
          }}
          defaultActionButton={{
            title: t('cancel'),
            onClick: closeConfirmDialog,
          }}
          title={t('editor_changeFile')}
          content={t('editor_changeFileConfirmMessage')}
          hidden={!selectedDropdownOption}
          onDismiss={closeConfirmDialog}
        />
        <EditModeBanner setBanner={setReadOnlyBanner} />
        <FunctionEditorFileSelectorBar
          disabled={isDisabled()}
          functionAppNameLabel={site.name}
          functionInfo={functionInfo}
          fileDropdownOptions={getDropdownOptions()}
          fileDropdownSelectedKey={!!selectedFile ? (selectedFile.key as string) : ''}
          onChangeDropdown={onFileSelectorChange}
        />
      </div>
      <Panel
        type={PanelType.medium}
        isOpen={showTestPanel}
        onDismiss={onCancelTest}
        overlay={functionRunning}
        headerContent={getHeaderContent()}
        isBlocking={false}
        customStyle={testPanelStyle}>
        {functionRunning && <LoadingComponent className={testLoadingStyle} />}
        <FunctionTest
          cancel={onCancelTest}
          run={run}
          functionInfo={functionInfo}
          reqBody={reqBody}
          setReqBody={setReqBody}
          responseContent={responseContent}
          selectedPivotTab={selectedPivotTab}
          functionRunning={functionRunning}
        />
      </Panel>
      {isLoading() && <LoadingComponent />}
      {!logPanelFullscreen && (
        <div className={editorStyle}>
          <MonacoEditor
            value={fileContent.latest}
            language={editorLanguage}
            onChange={onChange}
            height={monacoHeight}
            disabled={isDisabled()}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              cursorBlinking: true,
              renderWhitespace: 'all',
              readOnly: SiteHelper.isFunctionAppReadOnly(siteState),
            }}
          />
        </div>
      )}
      <div className={logPanelStyle(logPanelExpanded, logPanelFullscreen, getReadOnlyBannerHeight())}>
        <FunctionLog
          toggleExpand={toggleLogPanelExpansion}
          isExpanded={logPanelExpanded}
          toggleFullscreen={setLogPanelFullscreen}
          fileSavedCount={fileSavedCount}
          resetAppInsightsToken={resetAppInsightsToken}
          appInsightsToken={appInsightsToken}
          readOnlyBannerHeight={getReadOnlyBannerHeight()}
          functionName={functionInfo.properties.name}
        />
      </div>
    </>
  );
};
