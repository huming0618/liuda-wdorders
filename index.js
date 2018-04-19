const puppeteer = require('puppeteer');
const path = require('path');
const url = require('url');

console.log('GRAB ORDERS PROGRAM');

const LOGIN_PAGE = "https://d.weidian.com/loginNew/#/login/loginSubAccount";
const ORDER_PAGE = "https://d.weidian.com/orderNew/#/orderList/list";

// const angular = {
//     callbacks: {
//         _2: (x)=>{
//             return x;
//         }
//     }
// }

const run = async ()=>{
    console.log('start ....');
    const box = await puppeteer.launch();
    const page = await box.newPage();

    console.log('lunch ....');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    //table[data-key="spot-btc"]


    const fillLoginForm = ()=>{
        const loginPhoneInput = document.querySelectorAll('input[name="telephone"]')[0];
        console.log(loginPhoneInput);
        const loginNameInput = document.querySelectorAll('input[name="account"]')[0];
        const loginPwdInput = document.querySelectorAll('input[name="password"]')[0];
        const loginBtn = document.querySelectorAll('form[name="loginer"]')[0].querySelector('a');

        loginPhoneInput.value = "13880706869";
        loginNameInput.value = "liuda93";
        loginPwdInput.value = "liuda93";
  
        [loginPhoneInput, loginNameInput, loginPwdInput].forEach(input=>{
            const $input = $(input);
            $input.trigger('input'); 
            $input.trigger('change'); 
        })
        setTimeout(()=>{
            loginBtn.click();
        }, 300)
    }



    const login = async ()=>{
        await page.evaluate(fillLoginForm);
        console.log('login done');
        //await page.screenshot({path: path.join(__dirname, 'login.png')});
    }

    const clickOrderPages = async ()=>{
        const pageButtons = await page.$$('li.pagination-page>a');
        await pageButtons[1].click();
        console.log('pageButtons', pageButtons.length);
    }
    
    page.on('response', (resp)=>{
        const fromUrl = resp.url();
        


        if (fromUrl.indexOf('seller_query_order_list') > 0){
            
            const parsed = new url.URL(fromUrl);
            const callbackName = parsed.searchParams.get('callback');
            console.log('resp callbackname', callbackName);

            resp.text().then(text=>{
                const orders = eval(text);
                //console.log(orders);
            })
            
        }
    });

    page.on('load', ()=>{
        const fromUrl = page.url();
        console.log('load', fromUrl);
        if (fromUrl.indexOf("/loginNew") > 0){
            console.log('to login');
            login();
        }
        else if (fromUrl.indexOf('/index') > 0){
            console.log('home');
            page.goto(ORDER_PAGE);
        }
        else if (fromUrl.indexOf('/orderNew') > 0){
            console.log('orders');
            clickOrderPages();
            //page.screenshot({path: path.join(__dirname, 'order.png')});
        }
    });

    await page.goto(LOGIN_PAGE);
    
}

run();