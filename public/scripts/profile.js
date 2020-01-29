// @ts-nocheck
let favs = false
let editMode = false
function pageLoad(cb) {
    document.getElementById("defaultTab").click();
    api.post(window.location.pathname + '/get').then(res => {
        if (res.data) {
            loadData(res.data)
        } else {
            let main = document.getElementById('main')
            main.innerHTML = `<h2 class="user_not_found">User Not found</h2>`
            window.onclick = () => {
                if (document.referrer === window.location.href) {
                    window.location.replace('/');
                } else {
                    window.location = document.referrer;
                }
            }
        }
        cb()
    }).catch(err => console.log(err))
}

function buttonEdit() {
    let button = document.createElement('button')
    button.id = 'editbutton'
    button.onclick = () => {
        let pass_div = document.getElementById('user_pass')
        let name_div = document.getElementById('user_name')
        let email_div = document.getElementById('user_email')

        let email = email_div.innerHTML
        let name = name_div.innerHTML
        email_div.innerHTML = `<input id="email_form" type="text" placeholder="Email..." value="${email}" >`
        name_div.innerHTML = `<input id="name_form" type="text" placeholder="Name..." value="${name}" >`
        pass_div.innerHTML = `<input id="old_pass_form" type="password" placeholder="Old Password..."> <input id="new_pass_form" type="password" placeholder="New Password...">`
        document.getElementById('editbutton').remove()
        let span = document.createElement('span')
        let buttonSave = document.createElement('button')
        buttonSave.textContent = 'Save'
        buttonSave.onclick = () => {
            let emailV = document.getElementById('email_form').value
            let nameV = document.getElementById('name_form').value
            let oldV = document.getElementById('old_pass_form').value
            let newV = document.getElementById('new_pass_form').value
            if (emailV.length > 0 && nameV.length > 0) {
                span.remove()
                buttonEdit()
                let nameSpLit = nameV.split(" ")
                api.post(window.location.pathname + '/set', {
                    email: emailV,
                    name: [nameSpLit[0], nameSpLit[1]],
                    password: [oldV, newV]
                }).then((res) => {
                    if (typeof res.data === 'object') {
                        document.getElementById('user_name').textContent = res.data.name
                        document.getElementById('user_email').textContent = res.data.email
                        document.getElementById('user_pass').textContent = res.data.pass
                    }
                })
            }
        }
        let buttonCancel = document.createElement('button')
        buttonCancel.textContent = 'Cancel'
        buttonCancel.onclick = () => {
            span.remove()
            buttonEdit()
            document.getElementById('user_pass').innerHTML = ''
            document.getElementById('user_name').textContent = name
            document.getElementById('user_email').textContent = email
        }
        span.appendChild(buttonSave)
        span.appendChild(buttonCancel)
        document.getElementById('user_img').appendChild(span)

    }
    button.textContent = 'Edit Profile'
    document.getElementById('user_img').appendChild(button)
}

function onsession() {
    buttonEdit()
    if (favs) {
        loadFavs(favs)
        favs = {}
        document.getElementById('user_info_container').style.marginTop = "25px";
        document.getElementById('favorites').style.display = "block"
    } else {
        //Muito mau RIP
        let ti = setInterval(() => {
            if (favs) {
                clearInterval(ti)
                loadFavs(favs)
                document.getElementById('user_info_container').style.marginTop = "25px";
                document.getElementById('favorites').style.display = "block"
                favs = {}
            }
        }, 10);
    }
}


function onlogout() {
    document.getElementById('user_info_container').style.marginTop = "250px";
    document.getElementById('user_img').lastElementChild.remove()
    document.getElementById('favorites').style.display = 'none'
    document.getElementById('player_fav').innerHTML = ''
    document.getElementById('team_fav').innerHTML = ''
    document.getElementById('match_fav').innerHTML = ''
}

function loadData(data) {
    document.getElementById('user_creation').textContent = data.creationDate
    document.getElementById('user_email').textContent = data.email
    document.getElementById('user_name').textContent = data.name

    favs = data.favorites
}

function loadFavs(favs) {
    if (favs.players.length === 0) {
        document.getElementById('player_fav').innerHTML = 'No Favourites on this category!'
    } else {
        let player_tbody = document.getElementById('player_fav')
        favs.players.forEach(player => {
            let tr = document.createElement('tr')
            let imgtd = document.createElement('td')
            let nametd = document.createElement('td')
            let buttontd = document.createElement('td')

            imgtd.innerHTML = `<a href="/player/${player.id}"><img class="fav-img" src="${player.image}" alt="${player.ign}"></a>`;
            nametd.innerHTML = `<a href="/player/${player.id}">${player.name} "${player.ign}"</a>`;
            buttontd.innerHTML = `<button>Unfavourite</button>`;
            tr.appendChild(imgtd)
            tr.appendChild(nametd)
            tr.appendChild(buttontd)
            player_tbody.appendChild(tr)
            buttontd.firstElementChild.onclick = unfav(player.id, 'player', buttontd.firstElementChild)
        });
        if (favs.players.length > 5) {
            paginator({
                table: document.getElementById("table_player_to_page"),
                box: document.getElementById("table_player_pages_numbers"),
                box_mode: "button",
                rows_per_page: 5
            });
        }
    }

    if (favs.teams.length === 0) {
        document.getElementById('team_fav').innerHTML = 'No Favourites on this category!'
    } else {
        let team_tbody = document.getElementById('team_fav')
        favs.teams.forEach(team => {
            let tr = document.createElement('tr')
            let imgtd = document.createElement('td')
            let nametd = document.createElement('td')
            let buttontd = document.createElement('td')

            imgtd.innerHTML = `<a href="/team/${team.id}"><img class="fav-img" src="${team.logo}" alt="${player.name}"></a>`;
            nametd.innerHTML = `<a href="/team/${team.id}">${team.name}</a>`;
            buttontd.innerHTML = `<button>Unfavourite</button>`;
            tr.appendChild(imgtd)
            tr.appendChild(nametd)
            tr.appendChild(buttontd)
            team_tbody.appendChild(tr)
            buttontd.firstElementChild.onclick = unfav(team.id, 'team', buttontd.firstElementChild)
        });
        if (favs.teams.length > 5) {
            paginator({
                table: document.getElementById("table_team_to_page"),
                box: document.getElementById("table_team_pages_numbers"),
                box_mode: "button",
                rows_per_page: 5
            });
        }
    }

    if (favs.matches.length === 0) {
        document.getElementById('match_fav').innerHTML = 'No Favourites on this category!'
    } else {
        let match_tbody = document.getElementById('match_fav')
        favs.matches.forEach(match => {
            let tr = document.createElement('tr')
            let nametd = document.createElement('td')
            let buttontd = document.createElement('td')

            nametd.innerHTML = `<a href="/match/${match.id}">${match.name}</a>`;
            buttontd.innerHTML = `<button>Unfavourite</button>`;
            tr.appendChild(imgtd)
            tr.appendChild(nametd)
            tr.appendChild(buttontd)
            match_tbody.appendChild(tr)
            buttontd.firstElementChild.onclick = unfav(match.id, 'match', buttontd.firstElementChild)
        });
        if (favs.matches.length > 5) {
            paginator({
                table: document.getElementById("table_match_to_page"),
                box: document.getElementById("table_match_pages_numbers"),
                box_mode: "button",
                rows_per_page: 5
            });
        }
    }
}

function unfav(id, type, button) {
    return function () {
        api.post('/fav/' + type, {
            id: id
        }).then((data) => {
            if (data.status === 200) {
                data = data.data
                if (data === 'added') {
                    button.textContent = 'Unfavourite'
                } else {
                    button.textContent = 'Undo'
                }
            }
        }).catch(err => console.log(err))
    }
}

function changeTab(e, tabName) {

    var i;
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " active";
}