/* eslint-disable */
function loadPage() {
    setTimeout(() => {
        fade(true, 'loader', 'page')
    }, 100)
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