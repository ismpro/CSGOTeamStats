/* eslint-disable */
function pageLoad(cb) {
    return cb()
}

function sendEmail(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let text = document.getElementById('message').value;
    let checked = document.getElementById('ckb1').checked;

    api.post('/email', {
        name: name,
        email: email,
        text: text,
        check: checked
    }).then((res) => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })
}