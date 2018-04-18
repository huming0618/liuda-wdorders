const puppeteer = require('puppeteer');

const loginPage = "https://d.weidian.com/loginNew/#/login/loginSubAccount";

const run = async ()=>{
    const box = await puppeteer.launch({headless:false});
    const page = await box.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    

    await page.goto(loginPage);
    //table[data-key="spot-btc"]

    const fillLoginForm = ()=>{
        const loginPhoneInput = document.querySelectorAll('input[name="telephone"]')[0];
        console.log(loginPhoneInput);
        const loginNameInput = document.querySelectorAll('input[name="account"]')[0];
        const loginPwdInput = document.querySelectorAll('input[name="password"]')[0];
        const loginBtn = document.querySelectorAll('form[name="loginer"]')[0].querySelector('a');

        loginPhoneInput.value = "1121212112";
        loginNameInput.value = "test01";
        loginPwdInput.value = "test03";
  
        [loginPhoneInput, loginNameInput, loginPwdInput].forEach(input=>{
            const $input = $(input);
            $input.trigger('input'); 
            $input.trigger('change'); 
        })
        setTimeout(()=>{
            loginBtn.click();
        })
    }



    const login = async ()=>{
        await page.evaluate(fillLoginForm);

    }

    page.on('response', ()=>{
        const url = page.url();
        console.log('load', url);
        if (url.indexOf("/loginNew") > 0){
            console.log('to login');
            login();
        }
    });
    
    
}

run();