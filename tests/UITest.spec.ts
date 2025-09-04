import { test, expect, request } from '@playwright/test'
import { BasePage } from '../pages/BasePage'
import fs from 'fs'

let apiContext;
test.describe.parallel('Create project page tests', () => {
    test.beforeAll(async ({ playwright }) => {
      apiContext = await playwright.request.newContext({
        extraHTTPHeaders: {
          'Authorization': `token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
          },
        });
      })
    test.beforeEach(async ({ page }, testInfo) => {
        const basePage = new BasePage(page);
        testInfo.setTimeout(120000);
        await page.goto(basePage.uiBaseURL);
        await page.waitForLoadState();
    })

    test('Ping @uiFirst', async ({ page }) => {
        const basePage = new BasePage(page);
        await expect(page).toHaveTitle("QIWI Демо");
        const response = await request.get(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/providers");
        expect(response.ok()).toBeTruthy();
    })

    test('Balance check @uiSecond', async ({ page }) => {
        const basePage = new BasePage(page);
        await expect(page).toHaveTitle("QIWI Демо");
        const response = await request.get(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/balance");
        expect(response.ok()).toBeTruthy();
        const responseJson = response.json();
        expect(responseJson.balance.value).toBeGreaterThan(0);
        await page.goto(basePage.uiBaseURL+"/balance");
        await page.waitForLoadState();
        expect(basePage.balance).toHaveText(responseJson.balance.value);
    })

    test(('Create payment @uiThird'), async ({ page }) => {
        const basePage = new BasePage(page);
        await page.goto(basePage.uiBaseURL +"/payment");
        await page.waitForLoadState();
        await basePage.paymentTypeButton.click();
        await page.waitForLoadState();
        await basePage.paymentAmountField.type('1');
        await basePage.paymentPanField.type(basePage.pan);
        await basePage.createPaymentButton.click()
        const responsePromise = await page.waitForResponse(response =>
        response.url() === basePage.apiBaseURL + '/partner/payout/v1/agents/acme/points/00001/payments/' && response.status() === 200
            && response.request().method() === 'PUT'
            );
        const responseJson = await responsePromise.json();
        await page.goto(basePage.uiBaseURL +"/payment"+ responseJson.paymentId);
        await page.waitForLoadState();
        expect(basePage.paymentStatus).toHaveText("Created");
        expect(basePage.paymentAmount).toHaveText(responseJson.amount.value);
        expect(basePage.paymentType).toHaveText(responseJson.source.paymentType);
        expect(basePage.paymentToolType).toHaveText(responseJson.source.paymentToolType);
        expect(basePage.paymentTerminalType).toHaveText(responseJson.source.paymentTerminalType);
        expect(basePage.paymentPan).toHaveText(responseJson.recipientDetails.fields.pan);

        fs.writeFileSync('../paymentIDUI.txt', responseJson.paymentId, { encoding: 'utf-8' });
      }) 

    test(('Execute payment @uiFourth'), async ({ page }) => {
        const basePage = new BasePage(page);
        const paymentId = fs.readFileSync('../paymentID.txt', { encoding: 'utf-8' });
        await page.goto(basePage.uiBaseURL +"/payment"+ paymentId);
        await page.waitForLoadState();
        await basePage.executePayment.click();
        const responsePromise = await page.waitForResponse(response =>
        response.url() === basePage.apiBaseURL + '/partner/payout/v1/agents/acme/points/00001/payments/' && response.status() === 200
            && response.request().method() === 'POST'
            );
        const response = await responsePromise;
        const responseJson = await response.json();
        await page.goto(basePage.uiBaseURL +"/payment"+ responseJson.paymentId);
        await page.waitForLoadState();
        expect(basePage.paymentStatus).toHaveText("Done");
        expect(basePage.paymentAmount).toHaveText(responseJson.amount.value);
        expect(basePage.paymentType).toHaveText(responseJson.source.paymentType);
        expect(basePage.paymentToolType).toHaveText(responseJson.source.paymentToolType);
        expect(basePage.paymentTerminalType).toHaveText(responseJson.source.paymentTerminalType);
        expect(basePage.paymentPan).toHaveText(responseJson.recipientDetails.fields.pan);
        fs.writeFileSync('../paymentIDUI.txt', responseJson.paymentId, { encoding: 'utf-8' });
      }) 

})
