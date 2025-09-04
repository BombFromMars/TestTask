import { expect, Locator, Page } from '@playwright/test'


export class BasePage {
    readonly page: Page
    readonly balance: Locator
    readonly apiBaseURL: String
    readonly uiBaseURL: string
    readonly paymentTypeButton: Locator
    readonly paymentAmountField: Locator
    readonly paymentPanField: Locator
    readonly pan: string
    readonly createPaymentButton: Locator
    readonly paymentAmount: Locator
    readonly paymentType: Locator
    readonly paymentToolType: Locator
    readonly paymentTerminalType: Locator
    readonly paymentPan: Locator
    readonly executePayment: Locator
    readonly paymentStatus: Locator
    

    constructor(page: Page) {
        const apiBaseURL = "https://api-test.qiwi.com/partner/payout";
        const uiBaseURL = "https://developer.qiwi.com/ru/demo";
        this.page = page;
        this.balance = page.locator('[data-test-id="balance"]');
        this.paymentTypeButton = page.locator('[data-test-id="paymentTypeButton"]');
        this.paymentAmountField = page.locator('[data-test-id="paymentAmountField"]');
        this.paymentPanField = page.locator('[data-test-id="paymentPanField"]');
        this.pan = "2200701563674065";
        this.createPaymentButton = page.locator('[data-test-id="createPaymentButton"]');
        this.paymentAmount =  page.locator('[data-test-id="paymentAmount"]');
        this.paymentType =  page.locator('[data-test-id="paymentType"]');
        this.paymentToolType =  page.locator('[data-test-id="paymentToolType"]');
        this.paymentTerminalType =  page.locator('[data-test-id="paymentTerminalType"]');
        this.paymentPan =  page.locator('[data-test-id="paymentPan"]');
        this.executePayment =  page.locator('[data-test-id="executePayment"]');
        this.paymentStatus =  page.locator('[data-test-id="paymentStatus"]');
    }



}
