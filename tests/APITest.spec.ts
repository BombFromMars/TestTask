import { test, expect, request } from '@playwright/test'
import { BasePage } from '../pages/BasePage'
import fs from 'fs'

let apiContext; 
test.describe('Тестовое задание', () => {
  test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    extraHTTPHeaders: {
      'Authorization': `token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
      },
    });
  })

test(('Ping @APIfirst'), async ({ page }) => {
    const basePage = new BasePage(page);
    test.setTimeout(1200000);
    const response = await request.get(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/providers");
    expect(response.ok()).toBeTruthy();

  })

test(('Balance check @APIsecond'), async ({ page }) => {
    const basePage = new BasePage(page);
    test.setTimeout(1200000);
    const response = await request.get(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/balance");
    expect(response.ok()).toBeTruthy();
    const responseJson = response.json();
    expect(responseJson.balance.value).toBeGreaterThan(0);
  }) 

test(('Create payment @APIthird'), async ({ page }) => {
    const basePage = new BasePage(page);
    test.setTimeout(1200000);
    const response = await request.put(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/payments/c0d85b0b-a528-9c66-4a15-cb7a12eda9d6",
      {
        "recipientDetails": {
            "providerCode": "bank-card-russia",
            "fields": {
              "pan": "2200701563674065"
            }
          },
          "amount": {
            "value": "1.00",
            "currency": "RUB"
          },
          "source": {
            "paymentType": "NO_EXTRA_CHARGE",
            "paymentToolType": "BANK_ACCOUNT",
            "paymentTerminalType": "INTERNET_BANKING"
          }
      }
    );
    expect(response.ok()).toBeTruthy();
    const responseJson = response.json();
    expect(responseJson.balance.value).toBeGreaterThan(0);
    expect(responseJson.amount.value).toBe(1);
    expect(responseJson.source.paymentType).toBe("NO_EXTRA_CHARGE");
    expect(responseJson.source.paymentToolType).toBe("BANK_ACCOUNT");
    expect(responseJson.source.paymentTerminalType).toBe("INTERNET_BANKING");
    expect(responseJson.recipientDetails.fields.pan).toBe("2200701563674065");
    fs.writeFileSync('../paymentID.txt', responseJson.paymentId, { encoding: 'utf-8' });
  }) 

  test(('Execute payment @APIfourth'), async ({ page }) => {
    const basePage = new BasePage(page);
    test.setTimeout(1200000);
    const paymentId = fs.readFileSync('../paymentID.txt', { encoding: 'utf-8' });
    const response = await request.post(basePage.apiBaseURL + "/partner/payout/v1/agents/acme/points/00001/payments/"+paymentId+"/execute");
    expect(response.ok()).toBeTruthy();
    const responseJson = response.json();
    expect(responseJson.amount.value).toBe(1);
    expect(responseJson.source.paymentType).toBe("NO_EXTRA_CHARGE");
    expect(responseJson.source.paymentToolType).toBe("BANK_ACCOUNT");
    expect(responseJson.source.paymentTerminalType).toBe("INTERNET_BANKING");
    expect(responseJson.recipientDetails.fields.pan).toBe("2200701563674065");
  })
})
