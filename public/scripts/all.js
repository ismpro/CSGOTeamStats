/* eslint-disable */
const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

let admin = false;

function loadPage() {
    pageLoad(() => {
        setTimeout(() => {
            fade(true, 'loader', 'page')
        }, 100)
    })
    if (location.pathname !== '/login' && location.pathname !== '/contact') {
        api.post('/auth/validate').then((res) => {
            if (typeof res.data === 'string') {
                authLogin()
            } else {
                authLogout()
            }
        }).catch(err => console.log(err))
    }
}

function authLogin() {
    //sessionId = res.data  <- WTF is this ?????? TODO
    let button = document.getElementById('loginButton')
    button.style.display = "inline";
    button.innerHTML = '<button class="loginButton">Log out</button>'
    button.firstElementChild.onclick = () => {
        api.post('/auth/logout').then((res) => {
            if (res.data) {
                authLogout()
            }
        }).catch(err => console.log(err))
    }
    let nav = document.getElementById('mySidenav')
    //<a href="/profile/-">Profile</a>
    let a = document.createElement('a')
    a.href = '/profile/-';
    a.textContent = 'My Profile';
    a.id = "profilelink";
    nav.insertBefore(a, nav.children[1]);
    try {
        onsession()
    } catch (error) {
        console.log(error) //DELETE
        console.warn('onsession not define')
    }
}

function authLogout() {
    try {
        onlogout()
    } catch (error) {
        console.log(error) //DELETE
        console.warn('onlogout not define')
    } finally {
        let button = document.getElementById('loginButton')
        button.style.display = "inline";
        button.innerHTML = '<a href="/login" class="loginButton">Log in</a>'
        document.getElementById('profilelink').remove();
    }
}

function fade(isOut, element1, element2) {
    return new Promise((resolve, reject) => {
        try {
            let op = isOut ? 1 : 0;
            let timer = setInterval(function () {
                if ((op <= 0.1 && isOut) || (op >= 0.9 && !isOut)) {
                    clearInterval(timer);
                    document.getElementById(element1).style.display = "none";
                    document.getElementById(element2).style.opacity = 0;
                    document.getElementById(element2).style.display = "block";
                    document.getElementById(element2).style.opacity = 1;
                    resolve()
                }
                document.getElementById(element1).style.opacity = op;
                document.getElementById(element1).style.filter = 'alpha(opacity=' + op * 100 + ")";
                if (isOut) {
                    op -= 0.1;
                } else {
                    op += 0.1;
                }
            }, 10);
        } catch (err) {
            reject(err)
        }
    })
}
let isOpen = false;
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function sideNav(e) {
    if (isOpen) {
        e.classList.toggle("change");
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("main").style.opacity = "1.0";
    } else {
        e.classList.toggle("change");
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("main").style.opacity = "0.4";
        let tabs = document.getElementsByClassName("details")
        if (tabs) {
            for (const tab of tabs) {
                tab.style.maxHeight = null;
            }
        }
    }
    isOpen = !isOpen;
}

function timeSince(date) {

    date = new Date(date)

    var seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 20) {
        return 'just now'
    }
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return seconds + " seconds";
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function playerNaming(name, ign) {
    let nameArray = name.split(" ");
    return `${nameArray[0]} "${ign}" ${nameArray[nameArray.length - 1]}`
}