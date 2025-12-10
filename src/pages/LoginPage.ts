import { Page } from 'playwright';

export class LoginPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string) {
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="user-name"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[type="submit"]');
  }

  async isLoggedIn() {
    return this.page.locator('.inventory_list').isVisible();
  }

  async getError() {
    return this.page.textContent('[data-test="error"]');
  }
}