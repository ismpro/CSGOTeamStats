/* eslint-disable */
const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

let mode = true;

function loginSubmit(e) {
    e.preventDefault();

    api.post('/auth/login', {
            email: document.getElementById("email_login").value,
            password: document.getElementById("password_login").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
                window.location.replace(res.data)
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function registerSubmit(e) {
    e.preventDefault();

    api.post('/auth/register', {
            email: document.getElementById("email_register").value,
            password: document.getElementById("password_register").value,
            first_name: document.getElementById("first_name_register").value,
            last_name: document.getElementById("last_name_register").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 230) {
                changeMode()
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function changeMode() {
    if (mode) {
        fade(true, 'login_form', 'register_form').then(() => {
            document.getElementById('login').style.top = '350px';
        });
    } else {
        fade(true, 'register_form', 'login_form').then(() => {
            document.getElementById('login').style.top = '410px';
        });
    }
    mode = !mode
}