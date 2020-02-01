// @ts-nocheck
/* eslint-disable */
let mode = true;

function pageLoad(cb) {
    cb()
}

function loginSubmit(e) {
    e.preventDefault();
    let email = document.getElementById("email_login").value.trim();
    let password = document.getElementById("password_login").value;
    if (email.length === 0) {
        document.getElementById('mgsLogin').textContent = 'Need to write an email!';
    } else if (password.length === 0) {
        document.getElementById('mgsLogin').textContent = 'Need to write an password!';
    } else {
        api.post('/auth/login', {
            email: email,
            password: password
        })
            .then(function (res) {
                let code = res.status
                if (code === 220) {
                    if (document.referrer === window.location.href) {
                        window.location.replace('/');
                    } else {
                        window.location = document.referrer;
                    }
                } else {
                    document.getElementById('mgsLogin').textContent = res.data
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}

function registerSubmit(e) {
    e.preventDefault();
    let email = document.getElementById("email_register").value;
    let password = document.getElementById("password_register").value;
    let first_name = document.getElementById("first_name_register").value;
    let last_name = document.getElementById("last_name_register").value;

    if (email.length === 0 || password.length === 0 ||
        first_name.length === 0 || last_name.length === 0) {
        document.getElementById('mgsRegister').textContent = 'All fields are required';
    } else if (!validateEmail(email)) {
        document.getElementById('mgsRegister').textContent = 'Email are not correct';
    } else {
        api.post('/auth/register', {
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name
        })
            .then(function (res) {
                let code = res.status
                if (code === 230) {
                    changeMode()
                } else {
                    document.getElementById('mgsRegister').innerHTML = res.data
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}

function changeMode() {
    if (mode) {
        fade(true, 'login_form', 'register_form').then(() => {
            document.getElementById('login').style.top = '350px';
            document.getElementById('mgsLogin').innerHTML = '';
            document.getElementById('mgsRegister').innerHTML = '';
        });
    } else {
        fade(true, 'register_form', 'login_form').then(() => {
            document.getElementById('login').style.top = '410px';
            document.getElementById('mgsLogin').innerHTML = '';
            document.getElementById('mgsRegister').innerHTML = '';
        });
    }
    mode = !mode
}