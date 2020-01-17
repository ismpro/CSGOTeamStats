/* eslint-disable */
let searching = false;

function pageLoad(cb) {
    return cb()
}

function search(e) {
    e.preventDefault();
    let input = document.getElementById('search_string').value;
    input = input.trim()
    if (input.length > 0 && !searching) {
        searching = true
        api.post('/search', {
            text: input
        }).then(res => {
            searching = false
            if (res.status === 200) {
                let players = res.data.players
                let teams = res.data.teams
                let searchDiv = document.getElementById('search_list');
                searchDiv.innerHTML = ""
                if (players.length === 0 && teams.length === 0) {
                    searchDiv.innerHTML = '<p>No results</p>'
                } else {
                    if (players.length !== 0) {
                        let div1 = document.createElement('div')
                        div1.classList.add('search-header')
                        div1.innerHTML = '<span><b>Players</b></span>'
                        searchDiv.appendChild(div1);
                        for (const player of players) {
                            let divPlayer = document.createElement('div');
                            divPlayer.classList.add('searchBox')
                            let a = document.createElement('a');
                            a.href = `/player/${player.id}`
                            let img = document.createElement('img')
                            img.src = player.image
                            img.classList.add('search-img')
                            a.appendChild(img)
                            divPlayer.appendChild(a)
                            let divInfo = document.createElement('div')
                            divInfo.classList.add('search-info')
                            let aName = document.createElement('a')
                            aName.classList.add('search-text')
                            let aTeam = document.createElement('a')
                            aTeam.classList.add('search-text')
                            aName.innerHTML = `${player.name || ''} "${player.ign || ''}"`
                            aTeam.innerHTML = player.team ? `Playing for ${player.team.name || ''}` : 'No team'
                            aName.href = `/player/${player.id}`
                            aTeam.href = player.team ? `/team/${player.team.id}` : '#'
                            divInfo.appendChild(aName)
                            divInfo.appendChild(aTeam)
                            divPlayer.appendChild(divInfo)
                            searchDiv.appendChild(divPlayer)
                        }
                    }
                    if (teams.length !== 0) {
                        let div2 = document.createElement('div')
                        div2.classList.add('search-header')
                        div2.innerHTML = '<span><b>Teams</b></span>';
                        searchDiv.appendChild(div2);
                        for (const team of teams) {
                            let divPlayer = document.createElement('div');
                            divPlayer.classList.add('searchBox')
                            let a = document.createElement('a');
                            a.href = `/team/${team.id}`
                            let img = document.createElement('img')
                            img.src = team.logo
                            img.classList.add('search-img')
                            a.appendChild(img)
                            divPlayer.appendChild(a)
                            let divInfo = document.createElement('div')
                            divInfo.classList.add('search-info')
                            let aName = document.createElement('a')
                            aName.classList.add('search-text')
                            aName.innerHTML = team.name
                            aName.href = `/team/${team.id}`
                            divInfo.appendChild(aName)
                            divPlayer.appendChild(divInfo)
                            searchDiv.appendChild(divPlayer)
                        }
                    }
                }
            }
        }).catch(err => {
            let searchDiv = document.getElementById('search_list');
            searchDiv.innerHTML = "<p>Server Error</p>"
        })
    } else if (input.length === 0) {
        let searchDiv = document.getElementById('search_list');
        searchDiv.innerHTML = "<p>Type to search</p>"
    }
}

var matchesDetails = document.getElementsByClassName("match");
var i;

for (i = 0; i < matchesDetails.length; i++) {
    matchesDetails[i].addEventListener("click", function () {
        if (!isOpen) {
            var details = this.nextElementSibling;
            if (details.style.maxHeight) {
                details.style.maxHeight = null;
            } else {
                details.style.maxHeight = details.scrollHeight + "px";
            }
        }
    });
}