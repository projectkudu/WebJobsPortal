import React, { useState, useEffect } from 'react';
import DeploymentCenterGitHubProvider from './DeploymentCenterGitHubProvider';
import { GitHubUser } from '../../../../models/github';
import { useTranslation } from 'react-i18next';
import DeploymentCenterData from '../DeploymentCenter.data';
import { DeploymentCenterFieldProps } from '../DeploymentCenter.types';
import GitHubService from '../../../../ApiHelpers/GitHubService';

const DeploymentCenterGitHubDataLoader: React.FC<DeploymentCenterFieldProps> = props => {
  const { t } = useTranslation();
  const { formProps } = props;

  const deploymentCenterData = new DeploymentCenterData();
  const [gitHubUser, setGitHubUser] = useState<GitHubUser | undefined>(undefined);
  const [gitHubAccountStatusMessage, setGitHubAccountStatusMessage] = useState<string | undefined>(
    t('deploymentCenterOAuthFetchingUserInformation')
  );

  const authorizeGitHubAccount = () => {
    const win = window.open(GitHubService.authorizeUrl, 'windowname1', 'width=800, height=600');
    throw Error('not implemented');
  };

  // TODO(michinoy): We will need to add methods here to manage github specific network calls such as:
  // repos, orgs, branches, workflow file, etc.

  const fetchData = async () => {
    const armToken = window.appsvc && window.appsvc.env.armToken ? `bearer ${window.appsvc.env.armToken}` : '';
    const gitHubUserResponse = await deploymentCenterData.getGitHubUser(armToken);

    setGitHubAccountStatusMessage(undefined);

    if (gitHubUserResponse.metadata.success && gitHubUserResponse.data.login) {
      // NOTE(michinoy): if unsuccessful, assume the user needs to authorize.
      setGitHubUser(gitHubUserResponse.data);
    }
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DeploymentCenterGitHubProvider
      formProps={formProps}
      gitHubUser={gitHubUser}
      gitHubAccountStatusMessage={gitHubAccountStatusMessage}
      authorizeGitHubAccount={authorizeGitHubAccount}
    />
  );
};

export default DeploymentCenterGitHubDataLoader;
