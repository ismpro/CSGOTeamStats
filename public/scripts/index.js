/* eslint-disable */
let searching = false;

function pageLoad(cb) {

    Promise.all([api.get('/ranking/players'), api.post('/results', { limit: 10 })])
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
                    td1.setAttribute("style", "min-width: 100px;")
                    let td2 = document.createElement('td')
                    //td2.textContent = result.team1.name
                    td2.innerHTML = "<a class=\"\" href=\"/team/" + result.team1.id + "\">" + result.team1.name + "</a>"
                    td2.setAttribute("style", "min-width: 180px; text-align: right;")
                    let td3 = document.createElement('td')
                    td3.innerHTML = `<img alt="${result.team1.name}" src="https://static.hltv.org/images/team/logo/${result.team1.id}"
                                            style="width: 20px; height: 20px" title="${result.team1.name}">`
                    let td4 = document.createElement('td')
                    td4.classList.add('result')

                    let team1Counter = 0
                    let team2Counter = 0
                    for (const map of result.maps) {
                        if (map.team1.score > map.team2.score) {
                            team1Counter++
                        } else {
                            team2Counter++
                        }
                    }
                    td4.innerHTML = "<span>" + team1Counter + "</span> VS <span>" + team2Counter + "</span>"

                    let td5 = document.createElement('td')
                    td5.innerHTML = `<img alt="${result.team2.name}" src="https://static.hltv.org/images/team/logo/${result.team2.id}"
                                            style="width: 20px; height: 20px" title="${result.team2.name}">`
                    let td6 = document.createElement('td')
                    //td6.textContent = result.team2.name
                    td6.innerHTML = "<a class=\"\" href=\"/team/" + result.team2.id + "\">" + result.team2.name + "</a>"
                    td6.setAttribute("style", "min-width: 150px; text-align: left;")
                    let td7 = document.createElement('td')
                    td7.setAttribute("style", "min-width: 120px; float: right")
                    td7.innerHTML = `<a href="/match/${result.id}"><img src="/static/images/game-details.png"
                                                style="width: 15px; height: 15px; float: right"></a>`
                    table.appendChild(td1)
                    table.appendChild(td2)
                    table.appendChild(td3)
                    table.appendChild(td4)
                    table.appendChild(td5)
                    table.appendChild(td6)
                    table.appendChild(td7)

                    matchDiv.appendChild(table)

                    main_div.appendChild(matchDiv)

                    //--------------------------------------------------------------------------------------//
                    // divs para os detalhes
                    let detailsDiv = document.createElement('div')
                    let team1Div = document.createElement('div')
                    let team2Div = document.createElement('div')
                    let team1Players = document.createElement('table')
                    let team2Players = document.createElement('table')
                    detailsDiv.classList.add('details')
                    team1Div.classList.add('team1')
                    team2Div.classList.add('team2')
                    team1Players.classList.add('team1_players')
                    team2Players.classList.add('team2_players')

                    // imagens das equipas
                    let logoTeam1 = document.createElement("img")
                    let logoTeam2 = document.createElement("img")
                    let team1Ref = document.createElement("a")
                    let team2Ref = document.createElement("a")
                    logoTeam1.alt = result.team1.name
                    logoTeam2.alt = result.team2.name
                    logoTeam1.src = "https://static.hltv.org/images/team/logo/" + result.team1.id
                    logoTeam2.src = "https://static.hltv.org/images/team/logo/" + result.team2.id
                    logoTeam1.title = result.team1.name
                    logoTeam2.title = result.team2.name
                    logoTeam1.classList.add('logo')
                    logoTeam2.classList.add('logo')
                    team1Ref.href = "/team/" + result.team1.id
                    team2Ref.href = "/team/" + result.team2.id
                    team1Ref.title = result.team1.name
                    team2Ref.title = result.team2.name
                    team1Ref.appendChild(logoTeam1)
                    team2Ref.appendChild(logoTeam2)
                    team1Div.appendChild(team1Ref)
                    team2Div.appendChild(team2Ref)

                    // players equipa 1
                    for (const player of result.players.team1) {
                        let tr = document.createElement("tr")
                        let a = document.createElement("a")
                        a.href = "/player/" + player.id
                        a.title = player.name
                        a.innerHTML = player.name
                        //a.classList.add('')
                        tr.appendChild(a)
                        team1Players.appendChild(tr)
                    }
                    // players equipa 2
                    for (const player of result.players.team2) {
                        let tr = document.createElement("tr")
                        let a = document.createElement("a")
                        a.href = "/player/" + player.id
                        a.title = player.name
                        a.innerHTML = player.name
                        //a.classList.add('')
                        tr.appendChild(a)
                        team2Players.appendChild(tr)
                    }
                    team1Div.appendChild(team1Players)
                    team2Div.appendChild(team2Players)

                    // resultado final
                    let resultDiv = document.createElement('div')
                    resultDiv.classList.add('result')
                    resultDiv.innerHTML = "<span>" + team1Counter + "</span>-<span>" + team2Counter + "</span>"
                    // divisão entre os players e os mapas
                    let br1 = document.createElement('br')
                    let hr = document.createElement('hr')
                    // mapas jogados
                    let mapsDiv = document.createElement('div')
                    let mapsTable = document.createElement('table')
                    mapsTable.classList.add('maps')
                    let mapsHTML = "<tr>"
                    // nomes dos mapas
                    for (const map of result.maps) {
                        let mapName = ""
                        if (map.map === "nuke") {
                            mapName = "Nuke:"
                        } else if (map.map === "trn") {
                            mapName = "Train:"
                        } else if (map.map === "mrg") {
                            mapName = "Mirage:"
                        } else if (map.map === "d2") {
                            mapName = "Dust2:"
                        } else if (map.map === "ovp") {
                            mapName = "Overpass:"
                        } else if (map.map === "vertigo") {
                            mapName = "Vertigo:"
                        } else if (map.map === "inf") {
                            mapName = "Inferno:"
                        }
                        mapsHTML += "<td>" + mapName + "</td>"
                    }
                    mapsHTML += "</tr><tr>"
                    // resultados dos mapas
                    for (const map of result.maps) {
                        mapsHTML += "<td><span>" + map.team1.score + "</span> - <span>" + map.team2.score + "</span></td>"
                    }
                    mapsHTML += "</tr>"
                    mapsTable.innerHTML = mapsHTML
                    mapsDiv.appendChild(mapsTable)

                    // adicionar todos os items dos detalhes ao detailsDiv
                    detailsDiv.appendChild(team1Div)
                    detailsDiv.appendChild(resultDiv)
                    detailsDiv.appendChild(team2Div)
                    detailsDiv.appendChild(br1)
                    detailsDiv.appendChild(hr)
                    detailsDiv.appendChild(mapsDiv)
                    // a div detailsDiv é adicionada à div principal
                    main_div.appendChild(detailsDiv)
                }

                var matchesDetails = document.getElementsByClassName("match");
                var i;
                for (i = 0; i < matchesDetails.length; i++) {

                    matchesDetails[i].addEventListener("click", function () {
                        // não deixa abrir mais que um detalhe de jogo
                        var j;
                        for (j = 0; j < matchesDetails.length; j++) {
                            if (matchesDetails[j] !== this) {
                                matchesDetails[j].nextElementSibling.style.maxHeight = null;
                            }
                        }
                        // abre ou fecha o detalhe de jogo
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
                            aName.innerHTML = playerNaming(player.name, player.ign)
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
/*
var matchesDetails = document.getElementsByClassName("match");
var i;

for (i = 0; i < matchesDetails.length; i++) {
    console.log("entrou")

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
*/