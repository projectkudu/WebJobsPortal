import { ScmTypes, BuildProvider } from '../../../../models/site/config';
import { DeploymentCenterFormData, DeploymentCenterYupValidationSchemaType, DeploymentCenterCodeFormData } from '../DeploymentCenter.types';
import * as Yup from 'yup';
import { DeploymentCenterFormBuilder } from '../DeploymentCenterFormBuilder';

export class DeploymentCenterCodeFormBuilder extends DeploymentCenterFormBuilder {
  public generateFormData(): DeploymentCenterFormData<DeploymentCenterCodeFormData> {
    return {
      sourceProvider: ScmTypes.None,
      buildProvider: BuildProvider.None,
      runtimeStack: '',
      runtimeVersion: '',
      ...this.generatePublishingCredentialsFormData(),
    };
  }

  public generateYupValidationSchema(): DeploymentCenterYupValidationSchemaType<DeploymentCenterCodeFormData> {
    return Yup.object().shape({
      sourceProvider: Yup.mixed().required(),
      buildProvider: Yup.mixed().required(),
      runtimeStack: Yup.string().test('validateIfNeeded', this._t('nomatchpassword'), function(value) {
        return this.parent.buildProvider !== BuildProvider.GitHubAction || !value;
      }),
      runtimeVersion: Yup.string().test('validateIfNeeded', this._t('nomatchpassword'), function(value) {
        return this.parent.buildProvider !== BuildProvider.GitHubAction || !value;
      }),
      ...this.generatePublishingCredentailsYupValidationSchema(),
    });
  }
}