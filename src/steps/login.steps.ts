import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { LoginPage } from '../pages/LoginPage';
import { ICustomWorld } from '../support/world';
import { queryDb } from '../db/dbClient';

Given('I open the login page', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('page not available');
  const page = this.page!;
  const login = new LoginPage(page);
  await login.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com');
  (this as any).loginPage = login;
});

When('I login with {string} and {string}', async function (this: ICustomWorld, user: string, pass: string) {
  const login: LoginPage = (this as any).loginPage;
  if (!login) throw new Error('LoginPage not set');
  await login.login(user, pass);
});

Then('I should be logged in', async function (this: ICustomWorld) {
  const login: LoginPage = (this as any).loginPage;
  const ok = await login.isLoggedIn();
  expect(ok).to.be.true;
});

Then('I should see an error message', async function (this: ICustomWorld) {
  const login: LoginPage = (this as any).loginPage;
  const err = await login.getError();
  expect(err).to.not.be.null;
});

Then('the user {string} should exist in DB', async function (this: ICustomWorld, username: string) {
  // Example query - adjust table/column names to your DB schema
  const rows = await queryDb(`SELECT * FROM users WHERE username = '${username}'`);
  if (rows && Array.isArray(rows)) {
    if (rows.length === 0) {
      throw new Error(`User ${username} not found in DB`);
    }
  } else {
    throw new Error('DB returned unexpected result');
  }
});
