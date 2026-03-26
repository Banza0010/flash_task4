class Cart {
    constructor(page) {
        this.page = page;

        // Unit prices and Grand Total based on inspector results
        this.unitPrices = page.locator('.product-unit-price'); 
        this.grandTotal = page.locator('.cart-total-right .value-summary strong');  
        
        // Removal button "X"
        this.removeBtn = page.locator('.remove-btn'); 
        
        // Checkout initialization
        this.termsCheckbox = page.locator('#termsofservice');
        this.checkoutBtn = page.locator('#checkout');

        // Billing
        this.billingContinue = page.locator('#billing-buttons-container .new-address-next-step-button');
        this.countryDropdown = page.locator('#BillingNewAddress_CountryId');
        this.cityInput = page.locator('#BillingNewAddress_City');
        this.address1Input = page.locator('#BillingNewAddress_Address1');
        this.zipInput = page.locator('#BillingNewAddress_ZipPostalCode');
        this.phoneInput = page.locator('#BillingNewAddress_PhoneNumber');
        
        // Shipping Option - Ground
        this.groundShippingRadio = page.locator('#shippingoption_0');
        this.shippingContinue = page.locator('.shipping-method-next-step-button');

        // Payment Method - Check/Money Order
        this.checkMoneyOrderRadio = page.locator('#paymentmethod_0');
        this.paymentContinue = page.locator('.payment-method-next-step-button');
        
        // Confirmations
        this.paymentInfoContinue = page.locator('.payment-info-next-step-button');
        this.confirmOrderBtn = page.locator('.confirm-order-next-step-button');

        // Success message
        this.orderSuccessTitle = page.locator('.order-completed .title');
        
        // Account navigation
        this.accountLink = page.locator('.header-links .account');
        this.ordersHistoryLink = page.locator('.sidebar a[href="/order/history"]');
    }

    async goToCart() {
        await this.page.locator('.cart-label').click();
        await this.page.waitForLoadState('networkidle');
    }

    async removeItem() {
      
        await this.removeBtn.first().click();        
        // Wait for AJAx Loader and network to settle
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1500); 
    }

    async validateTotal() {
        await this.grandTotal.waitFor({ state: 'visible' });
        
        const priceElements = await this.unitPrices.allInnerTexts();
        let sum = 0;
        for (const p of priceElements) {
            sum += parseFloat(p.replace(/[^\d.]/g, ''));
        }
        
        const totalText = await this.grandTotal.innerText();
        const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
        
        console.log(`Sum: ${sum.toFixed(2)} | UI Total: ${total.toFixed(2)}`);
        return Math.abs(sum - total) < 0.01;
    }

    async proceedToCheckout() {
        await this.termsCheckbox.check();
        await this.checkoutBtn.click();
    }

    async completeCheckout() {
        
        //Billing
        if (await this.cityInput.isVisible()) {
            await this.countryDropdown.selectOption({ label: 'United States' });
            await this.cityInput.fill('Pretoria');
            await this.address1Input.fill('123 Beach road');
            await this.zipInput.fill('0122');
            await this.phoneInput.fill('5555555555');
        }
        await this.billingContinue.click();

        //Shipping
        await this.groundShippingRadio.waitFor({ state: 'visible' });
        await this.groundShippingRadio.check();
        await this.shippingContinue.click();

        //Payment Method
        await this.checkMoneyOrderRadio.waitFor({ state: 'visible' });
        await this.checkMoneyOrderRadio.check();
        await this.paymentContinue.click();

        //ayment Info
        await this.paymentInfoContinue.waitFor({ state: 'visible' });
        await this.paymentInfoContinue.click();

        // Confirm
        await this.confirmOrderBtn.waitFor({ state: 'visible' });
        await this.confirmOrderBtn.click();
    }

    async validateInMyAccount() {
        
        await this.orderSuccessTitle.waitFor({ state: 'visible' });
        
        await this.accountLink.click();
        await this.ordersHistoryLink.click();
        
        const firstOrder = this.page.locator('.order-list .order-item').first();
        await firstOrder.waitFor({ state: 'visible' });
        
        console.log('End-to-end flow successful!');
        return true;
    }
}

module.exports = { Cart };