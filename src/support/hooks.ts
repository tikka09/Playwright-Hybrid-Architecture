import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { logger, serilogEntry } from './logger';
import { ICustomWorld } from './world';
import { config } from '../config/config';

setDefaultTimeout(60 * 1000);

Before(async function (this: ICustomWorld) {
  logger.info('Before scenario - launching browser');
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext();
  const page = await context.newPage();
  this.browser = browser;
  this.context = context;
  this.page = page;
});

After(async function (this: ICustomWorld, scenario) {
  try {
    const status = scenario.result?.status;
    logger.info({ scenario: scenario.pickle?.name, status }, 'After scenario');
    if (status === Status.FAILED && this.page) {
      const buffer = await this.page.screenshot({ fullPage: true });
      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
      const file = path.join(screenshotsDir, `fail-${Date.now()}.png`);
      fs.writeFileSync(file, buffer);
      if (typeof this.attach === 'function') await this.attach(buffer, 'image/png');
      serilogEntry('error', 'Scenario failed - screenshot captured', { scenario: scenario.pickle?.name, screenshot: file });
    }
  } finally {
    try { if (this.context) await this.context.close(); } catch (e) { logger.warn(e); }
    try { if (this.browser) await this.browser.close(); } catch (e) { logger.warn(e); }
  }
});
