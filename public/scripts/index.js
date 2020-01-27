/* eslint-disable */
let searching = false;

function pageLoad(cb) {

    Promise.all([api.get('/ranking/players'), api.post('/results', { limit: 5 })])
        .then(res => {
            let rankRes = res[0]
            let lastRes = res[1]
            if (rankRes.status === 200) {
                let ranking = rankRes.data;
                let mainDiv = document.getElementById('top_players')
                mainDiv.innerHTML = ""
                let count = 1
                for (const rank of ranking) {
                    let div = document.createElement('div')
                    div.classList.add('player')
                    let span1 = document.createElement('span')
                    let playerA = document.createElement('a')
                    let teamA = document.createElement('a')
                    let img1 = document.createElement('img')
                    let img2 = document.createElement('img')
                    span1.classList.add('rank')
                    playerA.classList.add('text')
                    img1.classList.add('left-img')
                    img2.classList.add('right-img')
                    span1.innerHTML = '#' + count
                    playerA.innerHTML = rank.ign
                    img1.src = rank.image ? rank.image : "/static/images/logo-jogador.png";
                    img2.src = rank.team ? rank.team.logo : "/static/images/logo-team.png";
                    img1.title = rank.ign
                    img2.title = rank.team ? rank.team.name : 'Not Specified'
                    teamA.href = rank.team ? `/team/${rank.team.id}` : '#'
                    playerA.href = `/player/${rank.id}`
                    teamA.appendChild(img2)
                    div.appendChild(span1)
                    div.appendChild(img1)
                    div.appendChild(playerA)
                    div.appendChild(teamA)
                    mainDiv.appendChild(div)
                    count++
                }

            }
            if (lastRes.status === 200) {
                let results = lastRes.data;
                console.log(results)
                let main_div = document.getElementById('results')
                for (const result of results) {
                    let matchDiv = document.createElement('div')
                    matchDiv.classList.add('match')
                    let table = document.createElement('table')
                    let td1 = document.createElement('td')
                    td1.textContent = formatDate(result.date)
                    let td2 = document.createElement('td')
                    td2.textContent = result.team1.name
                    td2.setAttribute("style", "min-width: 250px; text-align: right;");
                    let td3 = document.createElement('td')
                    td3.innerHTML = `<img alt="${result.team1.name}" src="https://static.hltv.org/images/team/logo/${result.team1.id}"
                                            style="width: 20px; height: 20px" title="${result.team1.name}">`
                    let td4 = document.createElement('td')
                    td4.classList.add('result')
                    td4.innerHTML = `<span>0</span> VS <span>2</span>`
                    let td5 = document.createElement('td')
                    td5.innerHTML = `<img alt="${result.team2.name}" src="https://static.hltv.org/images/team/logo/${result.team2.id}"
                                            style="width: 20px; height: 20px" title="${result.team2.name}">`
                    let td6 = document.createElement('td')
                    td6.textContent = result.team2.name
                    td6.setAttribute("style", "min-width: 300px; text-align: left;");
                    let td7 = document.createElement('td')
                    td7.innerHTML = `<a href="/match/${result.id}"><img src="/static/images/game-details.png"
                                                style="width: 15px; height: 15px; float: right"></a>`
                    table.appendChild(td1)
                    table.appendChild(td2)
                    table.appendChild(td3)
                    table.appendChild(td4)
                    table.appendChild(td5)
                    table.appendChild(td6)
                    table.appendChild(td7)
                    main_div.appendChild(table)

                    //--------------------------------------------------------------------------------------//

                    let detailsDiv = document.createElement('div')
                    detailsDiv.classList.add('details')

                    





                }
            }

            if (lastRes.status === 200
                && rankRes.status === 200) {
                cb()
            }
        })
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
                            img.src = player.image || '/static/images/logo-jogador.png'
                            img.classList.add('search-img')
                            a.appendChild(img)
                            divPlayer.appendChild(a)
                            let divInfo = document.createElement('div')
                            divInfo.classList.add('search-info')
                            let aName = document.createElement('a')
                            aName.classList.add('search-text-link')
                            aName.innerHTML = `${player.name || ''} "${player.ign || ''}"`
                            aName.href = `/player/${player.id}`
                            divInfo.appendChild(aName)
                            //When theres is no team the server sends a empty objects for some reason
                            if (Object.entries(player.team).length !== 0) {
                                let aTeam = document.createElement('span')
                                aTeam.classList.add('search-text')
                                aTeam.innerHTML = `Playing for <a class="search-text-link" href="/team/${player.team.id}"> ${player.team.name || ''}</a>`
                                divInfo.appendChild(aTeam)
                            } else {
                                let pTeam = document.createElement('span')
                                pTeam.classList.add('search-text')
                                pTeam.textContent = `No team`
                                divInfo.appendChild(pTeam)
                            }
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
                            img.src = team.logo || '/static/images/logo-team.png'
                            img.classList.add('search-img')
                            a.appendChild(img)
                            divPlayer.appendChild(a)
                            let divInfo = document.createElement('div')
                            divInfo.classList.add('search-info')
                            let aName = document.createElement('a')
                            aName.classList.add('search-text-link')
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
            console.log(err)
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