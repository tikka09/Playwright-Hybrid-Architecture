const { generate } = require('multiple-cucumber-html-reporter');
const path = require('path');

generate({
  jsonDir: path.join(process.cwd(), 'reports'),
  reportPath: path.join(process.cwd(), 'reports', 'html'),
  metadata: {
    browser: { name: 'playwright', version: '' },
    device: 'CI',
    platform: { name: process.platform }
  },
  customData: {
    title: 'Run info',
    data: [{ label: 'Project', value: 'Playwright POC' }, { label: 'Cycle', value: 'POC' }]
  }
});