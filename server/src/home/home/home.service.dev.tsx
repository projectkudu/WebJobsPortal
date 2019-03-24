import { Injectable } from '@nestjs/common';
import { HomeService } from './home.service.base';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Home } from './views';
import { ConfigService } from 'src/shared/config/config.service';

@Injectable()
export class HomeServiceDev extends HomeService {
  constructor(private configService: ConfigService) {
    super();
  }

  getAngularHomeHtml = (optimized?: boolean) => {
    return ReactDOMServer.renderToString(
      <Home {...this.configService.staticConfig} version={this.configService.get('VERSION')} versionConfig={null} />
    );
  };

  getReactHomeHtml = () => {
    return 'Use https://localhost:44400 . React is not loaded from the server in dev mode.';
  };
}
