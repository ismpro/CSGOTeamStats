function login(e) {
    e.preventDefault()
    api.post('/admin/login', {
        email: document.getElementById("uname").value,
        password: document.getElementById("psw").value
    })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
            document.getElementById('mgsLogin').innerHTML = "Connection Error"
        });
}