/* eslint-disable */

let mode = true;

function login(e) {
    e.preventDefault()
    api.post('/admin/login', {
            email: document.getElementById("eamil").value,
            password: document.getElementById("psw").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
                //docu
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
            document.getElementById('mgsLogin').innerHTML = "Connection Error"
        });
}

function sendEmail(e) {
    e.preventDefault()
    api.post('/admin/ask', {
            email: document.getElementById("eamil1").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
                changeMode()
                document.getElementById('mgsLogin').innerHTML = res.data
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
            document.getElementById('mgsLogin').innerHTML = "Connection Error"
        });
}

function changeMode() {
    if (mode) {
        fade(true, 'login', 'trying');
    } else {
        fade(true, 'trying', 'login');
    }
    mode = !mode
}