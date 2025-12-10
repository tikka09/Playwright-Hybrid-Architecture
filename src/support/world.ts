import { setWorldConstructor, IWorld } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';

export interface ICustomWorld extends IWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

type WorldCtorParams = {
  attach: IWorld['attach'];
  parameters?: IWorld['parameters'];
  log?: IWorld['log'];
  link?: IWorld['link'];
};

class CustomWorld implements ICustomWorld {
  attach: IWorld['attach'];
  parameters: IWorld['parameters'];
  log: IWorld['log'];
  link: IWorld['link'];
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor({ attach, parameters, log, link }: WorldCtorParams) {
    this.attach = attach;
    this.parameters = parameters ?? {};
    this.log = log ?? (() => {});
    this.link = link ?? (() => {});
  }
}

setWorldConstructor(CustomWorld);
