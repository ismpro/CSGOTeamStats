function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        cb()
    }).catch(err => console.log(err))
}

function loadData(cb) {

    Promise.all([api.post('/results', { limit: 12 })])
        .then(res => {
            let lastRes = res[0]
            if (lastRes.status === 200) {
                let results = lastRes.data;
                console.log(results)
                let main_div = document.getElementById('main')
                let matchIndex = 0 // guarda em que match é que o HTML está a mostrar

                let lastResults = document.createElement('div')
                lastResults.innerHTML = "Last Results"
                lastResults.classList.add('title')
                main_div.appendChild(lastResults)

                for (const result of results) {

                    matchIndex++

                    let matchDiv = document.createElement('div')
                    matchDiv.classList.add('match')
                    let table = document.createElement('table')
                    let td1 = document.createElement('td')
                    td1.textContent = formatDate(result.date)
                    td1.setAttribute("style", "min-width: 100px;")
                    let td2 = document.createElement('td')
                    //td2.textContent = result.team1.name
                    td2.innerHTML = "<a class=\"\" style=\"text-decoration: none; color: black\" title=\"" + result.team1.name + "\" href=\"/team/" + result.team1.id + "\">" + result.team1.name + "</a>"
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
                    td6.innerHTML = "<a class=\"\" style=\"text-decoration: none; color: black\" title=\"" + result.team2.name + "\"  href=\"/team/" + result.team2.id + "\">" + result.team2.name + "</a>"
                    td6.setAttribute("style", "min-width: 190px; text-align: left;")
                    let td7 = document.createElement('td')
                    td7.setAttribute("style", "min-width: 130px; float: right;")
                    td7.innerHTML = `<a href="/match/${result.id}" style="text-decoration: underline; color:black;">More</a>`
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
                        a.setAttribute("style", "text-decoration: none; color: white")
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
                        a.setAttribute("style", "text-decoration: none; color: white;")
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

                let moreMatches = document.createElement('div')
                moreMatches.innerHTML = "more"
                moreMatches.id = "more"
                main_div.appendChild(moreMatches)

                moreMatches.addEventListener("click", function () {
                    let more = document.getElementById("more")
                    more.remove()
                    let k = 0
                    let limit = matchIndex + 6

                    Promise.all([api.post('/results', { limit: matchIndex + 12 })]).then(res => {
                        let lastRes = res[0]
                        let results = lastRes.data;
                        if (lastRes.status === 200) {
                            for (const result of results) {
                                console.log("g")
                                // dá skip às matches que já estão a ser mostradas
                                if (k < matchIndex) {
                                    k++
                                } else {

                                    console.log("limite " + limit)
                                    console.log("matchIndex " + matchIndex)

                                    matchIndex++

                                    let matchDiv = document.createElement('div')
                                    matchDiv.classList.add('match')
                                    let table = document.createElement('table')
                                    let td1 = document.createElement('td')
                                    td1.textContent = formatDate(result.date)
                                    td1.setAttribute("style", "min-width: 100px;")
                                    let td2 = document.createElement('td')
                                    //td2.textContent = result.team1.name
                                    td2.innerHTML = "<a class=\"\" style=\"text-decoration: none; color: black\" title=\"" + result.team1.name + "\" href=\"/team/" + result.team1.id + "\">" + result.team1.name + "</a>"
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
                                    td6.innerHTML = "<a class=\"\" style=\"text-decoration: none; color: black\" title=\"" + result.team2.name + "\"  href=\"/team/" + result.team2.id + "\">" + result.team2.name + "</a>"
                                    td6.setAttribute("style", "min-width: 190px; text-align: left;")
                                    let td7 = document.createElement('td')
                                    td7.setAttribute("style", "min-width: 130px; float: right;")
                                    td7.innerHTML = `<a href="/match/${result.id}" style="text-decoration: underline; color:black;">More</a>`
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
                                        a.setAttribute("style", "text-decoration: none; color: white")
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
                                        a.setAttribute("style", "text-decoration: none; color: white;")
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

                                    // corre esta parte apenas quando acaba de colocar mais jogos
                                    if (limit === matchIndex) {
                                        var matchesDetails = document.getElementsByClassName("match");
                                        console.log(matchesDetails.length)
                                        var i;
                                        for (i = matchIndex - 6; i < matchesDetails.length; i++) {
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
                                        main_div.appendChild(more)
                                    }
                                }
                            }
                        }
                    })
                });

            }
        })

}
