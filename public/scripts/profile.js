let favs = false
function pageLoad(cb) {
    document.getElementById("defaultTab").click();
    api.post(window.location.pathname + '/get').then(res => {
        console.log(res.data)
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

function onsession() {
    if (favs) {
        loadFavs(favs)
        favs = {}
    } else {
        //Muito mau RIP
        let ti = setInterval(() => {
            if (favs) {
                clearInterval(ti)
                loadFavs(favs)
                favs = {}
            }
        }, 10);
    }
}

function onlogout() {

}

function loadData(data) {
    document.getElementById('user_creation').textContent = data.creationDate
    document.getElementById('user_email').textContent = data.email
    document.getElementById('user_name').textContent = data.firstName + ' ' + data.lastName

    favs = data.favorites
}

function loadFavs(favs) {
    if (favs.players.length === 0) {
        document.getElementById('table_player_to_page').innerHTML = 'No Favourites on this category!'
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
        document.getElementById('table_team_to_page').innerHTML = 'No Favourites on this category!'
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
        document.getElementById('table_match_to_page').innerHTML = 'No Favourites on this category!'
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