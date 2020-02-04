/* eslint-disable */
// @ts-ignore
const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

let admin = false;

/**
 * Function that is executed when the page is loaded
 */
function loadPage() {
    pageLoad(() => {
        setTimeout(() => {
            fade(true, 'loader', 'page')
        }, 100)
    })
    if (location.pathname !== '/login' && location.pathname !== '/contact') {
        /**
         * @param {{ data: any; }} res
         */
        /**
         * @param {any} err
         */
        api.post('/auth/validate').then((res) => {
            if (typeof res.data === 'string') {
                authValidated()
            } else {
                authNotSession()
            }
        }).catch(err => console.log(err))
    }
}

/**
 * Function that is executed when the session is validated by the server
 */
function authValidated() {
    //sessionId = res.data  <- WTF is this ?????? TODO
    let button = document.getElementById('loginButton')
    button.style.display = "inline";
    button.innerHTML = '<button class="loginButton">Log out</button>'
    button.firstElementChild.onclick = () => {
        /**
         * @param {{ data: any; }} res
         */
        /**
         * @param {any} err
         */
        api.post('/auth/logout').then((res) => {
            if (res.data) {
                authNotSession()
            }
        }).catch(err => console.log(err))
    }
    let nav = document.getElementById('mySidenav')
    let a = document.createElement('a')
    a.href = '/profile/-';
    a.textContent = 'My Profile';
    a.id = "profilelink";
    nav.insertBefore(a, nav.children[1]);
    try {
        // @ts-ignore
        onsession()
    } catch (error) {
        console.log(error)
        console.warn('onsession not define')
    }
}

/**
 * Function that is executed when the session is not logged in by the server
 */
function authNotSession() {
    try {
        // @ts-ignore
        onlogout()
    } catch (error) {
        console.log(error)
        console.warn('onlogout not define')
    } finally {
        let button = document.getElementById('loginButton')
        button.style.display = "inline";
        button.innerHTML = '<a href="/login" class="loginButton">Log in</a>'
        let profilelink = document.getElementById('profilelink');
        if (profilelink) {
            profilelink.remove();
        }
    }
}

/**
 * Used for making 2 DOM elements fadeout and fadein
 * @param {boolean} isOut Use always true - the false value doenst work
 * @param {string} element1 the id of a dom element that is going to fade out
 * @param {string} element2 the id of a dom element that is going to fade in
 * @returns {Promise}
 */
function fade(isOut, element1, element2) {
    return new Promise((resolve, reject) => {
        try {
            let op = isOut ? 1 : 0;
            let timer = setInterval(function () {
                if ((op <= 0.1 && isOut) || (op >= 0.9 && !isOut)) {
                    clearInterval(timer);
                    document.getElementById(element1).style.display = "none";
                    document.getElementById(element2).style.opacity = '0';
                    document.getElementById(element2).style.display = "block";
                    document.getElementById(element2).style.opacity = '1';
                    resolve()
                }
                document.getElementById(element1).style.opacity = String(op);
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

/**
 * Animation of the side Nav
 * Set the width of the side navigation to 250px 
 * and the left margin of the page content to 250px 
 * and add a black background color to body
 * @param {Element} e An dom element
 */
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
                // @ts-ignore
                tab.style.maxHeight = null;
            }
        }
    }
    isOpen = !isOpen;
}

/**
 * Returns a string telling how much time as passed since the date until now
 * @param {Date} date The date
 * @returns {string}
 */
function timeSince(date) {

    date = new Date(date)

    // @ts-ignore
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

/**
 * Formats a date to a string with the format yyyy-mm-dd
 * @function formatDate
 * @param {Date} date The date to be formated
 * @returns {String}
 */
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

/**
 * Used create a string a complete name a of a player
 * with in game name in the middle
 * @param {string} name The full name
 * @param {string} ign In game name
 * @returns {string}
 */
function playerNaming(name, ign) {
    let nameArray = name.split(" ");
    return `${nameArray[0]} "${ign}" ${nameArray[nameArray.length - 1]}`
}

/**
 * Validates an email
 * @param {string} email The email to be compared
 * @returns {boolean}
 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}