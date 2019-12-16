/* eslint-disable */
const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
});

function loadPage() {
    pageLoad(() => {
        setTimeout(() => {
            fade(true, 'loader', 'page')
        }, 100)
    })
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
    }
    isOpen = !isOpen;
}