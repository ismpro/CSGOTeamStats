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
        if (res.status === 200) {
            let mgstext = document.getElementById('mgs')
            mgstext.textContent = res.data.text
            if (res.data.status) {
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('message').value = '';
                document.getElementById('ckb1').checked = false;
                mgstext.style.color = 'green'
            } else {
                mgstext.style.color = 'red'
            }
        }
    }).catch(err => {
        console.log(err)
    })
}