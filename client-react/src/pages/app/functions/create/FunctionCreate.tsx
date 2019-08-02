import React, { useContext } from 'react';
import { FunctionTemplate } from '../../../../models/functions/function-template';
import { ArmObj } from '../../../../models/arm-obj';
import { FunctionInfo } from '../../../../models/functions/function-info';
import { Pivot, PivotItem, IPivotItemProps, Link } from 'office-ui-fabric-react';
import CustomTabRenderer from '../../app-settings/Sections/CustomTabRenderer';
import { ThemeContext } from '../../../../ThemeContext';
// import { useTranslation } from 'react-i18next';
import TemplatesPivot from './TemplatesPivot';
import DetailsPivot from './DetailsPivot';
import { Links } from '../../../../utils/FwLinks';
import { learnMoreLinkStyle } from '../../../../components/form-controls/formControl.override.styles';
// import { BindingFormBuilder } from '../common/BindingFormBuilder';

export interface FunctionCreateProps {
  functionTemplates: FunctionTemplate[];
  functionsInfo: ArmObj<FunctionInfo>[];
}

const paddingStyle = {
  padding: '20px',
};

export const FunctionCreate: React.SFC<FunctionCreateProps> = props => {
  const theme = useContext(ThemeContext);
  // const { t } = useTranslation();

  // const { functionTemplates } = props;

  // const builder = new BindingFormBuilder(currentBindingInfo, functionTemplates[0].function.bindings[0], t);
  // const initialFormValues = builder.getInitialFormValues();

  return (
    <>
      <div style={paddingStyle}>
        <h2>New function</h2>
        <p>
          {'Create a new function in this Function App. You can start by selecting from a template below or '}
          <Link href={Links.applicationSettingsInfo} target="_blank" className={learnMoreLinkStyle}>
            {'go to the quickstart.'}
          </Link>
        </p>
        <Pivot>
          <PivotItem
            onRenderItemLink={(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element) =>
              CustomTabRenderer(link, defaultRenderer, theme)
            }
            itemKey="templates"
            linkText={'Templates'}>
            <TemplatesPivot {...props} />
          </PivotItem>
          <PivotItem
            onRenderItemLink={(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element) =>
              CustomTabRenderer(link, defaultRenderer, theme)
            }
            itemKey="details"
            linkText={'Details'}>
            <DetailsPivot {...props} />
          </PivotItem>
        </Pivot>
      </div>
      {/*<CreateFunctionCommandBar />*/}
    </>
  );
};
