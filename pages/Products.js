class Products {
    constructor(page) {
        this.page = page;
        // Navigation
        this.computersLink = page.locator('a.menu__link[href="/computers"]');
        this.desktopsLink = page.locator('.menu__list-view a[href="/desktops"]');
        // Products
        this.sortDropdown = page.locator('#products-orderby');
        this.addToCartButtons = page.locator('.product-box-add-to-cart-button');
        // Global
        this.successBar = page.locator('#bar-notification');
        this.successClose = page.locator('#bar-notification .close');
    }

    async navigateToDesktops() {
        await this.computersLink.click();
        await this.desktopsLink.waitFor({ state: 'visible' });
        await this.desktopsLink.click();
        await this.page.waitForURL(/desktops/);
        console.log('Navigated to Desktops');
    }

    async sortAllOptions() {
        const values = ['5', '6', '10', '11', '15']; //filter options
        for (const val of values) {
            await this.sortDropdown.selectOption(val);
            await this.page.waitForLoadState('networkidle');
            console.log(`Sorted by: ${val}`);
        }
    }

    /* async addAllToCart() {
        
        const cartbuttons = this.addToCartButtons;
        const count = await cartbuttons.count();

        console.log(`Found ${count} desktops to add.`);

        for (let i = 0; i < count; i++) {
        // iterate n Click each button one 
        await cartbuttons.nth(i).click();
        const successBar = this.page.locator('#bar-notification');
        await successBar.waitFor({ state: 'visible' });
        await successBar.locator('.close').click();
     }
    }*/

    async addAllToCart() {
        const count = await this.addToCartButtons.count();
        
        for (let i = 0; i < count; i++) {
            // Re-locate the button inside the loop to avoid stale element errors
            const currentButton = this.addToCartButtons.nth(i);
            
            await currentButton.click();
            
            //prevents the script from checking the URL too early
            await Promise.race([
                this.page.waitForURL(/build-your-own-computer/, { timeout: 3000 }).catch(() => {}),
                this.successBar.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
            ]);

            if (this.page.url().includes('build-your-own-computer')) {
                await this.configureAndAddToCart();
                
                if (i === count - 1) {
                    await this.page.goto('https://demo.nopcommerce.com/cart');
                    return; 
                }
                // Return to list
                await this.page.goto('https://demo.nopcommerce.com/desktops');
                await this.page.waitForLoadState('networkidle');
                continue;
            }

            // Normal handling
            if (await this.successBar.isVisible()) {
                await this.successClose.click();
                await this.successBar.waitFor({ state: 'hidden' });
            }
        }
        await this.page.goto('https://demo.nopcommerce.com/cart');
    }

    async configureAndAddToCart() {
        console.log('Configuring Custom Computer...');
        
        // Wait for the specific element that signifies the page is loaded
        const ramDropdown = this.page.locator('#product_attribute_2');
        await ramDropdown.waitFor({ state: 'visible' });

        await ramDropdown.selectOption('5'); // 8GB
        await this.page.locator('#product_attribute_3_6').click(); // HDD 320
        await this.page.locator('#product_attribute_4_9').click(); // Vista Premium
        
        await this.page.locator('#add-to-cart-button-1').click();

        // Ensure notification is handled before leaving the page
        await this.successBar.waitFor({ state: 'visible' });
        await this.successClose.click();
        await this.successBar.waitFor({ state: 'hidden' });
        console.log('Custom build desktop added');
    }
}

module.exports = { Products };