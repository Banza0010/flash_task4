const { test, expect, chromium } = require('@playwright/test');
const { Register } = require('../pages/Register'); 
const { Login } = require('../pages/Login');
const { Cart } = require('../pages/Cart');
const { Products } = require('../pages/Products');

test('Register and login', async () => {

  ///---trying to resolve for the cloudflare block issues using chromium
  const userDataDir = './user_data';
  const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      channel: 'chrome', // Uses Chrome install as chromiun triggers bot detection with cloudflare on my side
      args: ['--disable-blink-features=AutomationControlled']
  });
  //--ends here

  const page = await context.newPage();

  const registerPagge = new Register(page);
  const loginPage = new Login(page);
  const productsPage = new Products(page);
  const cartPage = new Cart(page);

  const email = `user${Date.now()}@testuser.com`;   //create unique email with every new user registration
  const userPassword = 'Password123!';
  const name = 'Karaboo';
  const lname = 'Testerr';

  console.log(`user registered with email: ${email}`); //note to self

  await registerPagge.goToSite(); //1. navigate to site 
  await registerPagge.registerUser(name, lname, email, userPassword);  // / 2. Register user

  await expect(registerPagge.successMessage).toContainText('Your registration completed');
  console.log('Registered user!!'); //note to self

  await loginPage.login(email,userPassword);  //3. Login as user

  await expect(loginPage.logoutLink).toBeVisible();
  console.log('Login Successful!'); //note to self

  await productsPage.navigateToDesktops();  // // 4. & 5 navigate to category

  await productsPage.sortAllOptions();   //6 sort desktops
  
  await productsPage.addAllToCart();   //7 add to cart n check total --potential issue in here
  console.log('desktops added to cart!!'); //note to self

  const firstCheck = await cartPage.validateTotal(); //check math with all items
  await cartPage.removeItem();   //8 remove the first item
  const secondCheck = await cartPage.validateTotal();   //Check math again (it should be lower now)
  console.log('Math is math-ing!'); //note to self

  await cartPage.proceedToCheckout(); /// 9. Checkout
  await cartPage.completeCheckout();  // 10. Fill checkout info
  await cartPage.validateInMyAccount(); //11. Navigate to My Account and validate

  console.log('Done'); //note to self

});
