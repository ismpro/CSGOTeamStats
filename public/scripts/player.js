/* eslint-disable */
let favAnimation = false

function pageLoad(cb) {
    cb()
    document.getElementById("defaultTab").click();
    let fav = document.getElementsByClassName('clickFav')[0]
    fav.addEventListener('click', () => {
        let star = fav.firstElementChild
        if (!favAnimation) {
            favAnimation = true
            if (star.classList.contains("fa-star")) {
                setTimeout(function () {
                    star.classList.remove("fa-star")
                    star.classList.add("fa-star-o")
                }, 15)
                document.getElementById('fav_text').innerText = 'Removed!'
                fav.lastElementChild.classList.add('info-tog')
                setTimeout(function () {
                    fav.lastElementChild.classList.remove('info-tog')
                    favAnimation = false
                }, 1000)
            } else {
                setTimeout(function () {
                    star.classList.add('fa-star')
                    star.classList.remove('fa-star-o')
                }, 150)
                document.getElementById('fav_text').innerHTML = '&nbsp;&nbsp;Added!'
                fav.lastElementChild.classList.add('info-tog')
                setTimeout(function () {
                    fav.lastElementChild.classList.remove('info-tog')
                    favAnimation = false
                }, 1000)
            }
        }
    })
}

/* 
} else {
    $('.click').addClass('active')
    $('.click').addClass('active-2')
    setTimeout(function () {
        $('span').addClass('fa-star')
        $('span').removeClass('fa-star-o')
    }, 150)
    setTimeout(function () {
        $('.click').addClass('active-3')
    }, 150)
    $('.info').addClass('info-tog')
    setTimeout(function () {
        $('.info').removeClass('info-tog')
    }, 1000)
} */

function changeTab(e, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks-down");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }


    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " active";
}