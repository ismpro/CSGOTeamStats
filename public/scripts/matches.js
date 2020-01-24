/* eslint-disable */
function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        cb()
    }).catch(err => console.log(err))
}

function loadData(data) {
    // nomes das equipas
    let team1Name = data.team1.name
    let team2Name = data.team2.name
    document.getElementById('team1_name').innerHTML = team1Name
    document.getElementById('team2_name').innerHTML = team2Name
    // imagens das equipas
    let logo_team1 = "https://static.hltv.org/images/team/logo/" + data.team1.id
    let logo_team2 = "https://static.hltv.org/images/team/logo/" + data.team2.id
    document.getElementById('team1_logo').src = logo_team1
    document.getElementById('team2_logo').src = logo_team2
    // mapas
    let maps = data.maps
    // resultado
    let leftCounter = 0
    let rightCounter = 0
    // para cada mapa, vai aumentando o contador de cada equipa
    for (const map of maps) {
        let leftResult = parseInt(map.result.substr(0, map.result.indexOf(':')))
        let rightResult = parseInt(map.result.substr(map.result.indexOf(':') + 1, map.result.indexOf(' ') - 2))

        if (leftResult) {
            if (leftResult > rightResult) {
                leftCounter++
            } else {
                rightCounter++
            }
        }
    }
    document.getElementById('result_team1').innerHTML = leftCounter
    document.getElementById('result_team2').innerHTML = rightCounter
    // imagens, nomes e resultados dos mapas
    let i = 1
    for (const map of maps) {
        document.getElementById("map" + i).style.display = "block";
        let mapImage = "https://hltv.org/img/static/maps/"
        let mapName
        if (map.name === "nuke") {
            mapImage += "nuke"
            mapName = "Nuke"
        } else if (map.name === "trn") {
            mapImage += "train"
            mapName = "Train"
        } else if (map.name === "mrg") {
            mapImage += "mirage"
            mapName = "Mirage"
        } else if (map.name === "d2") {
            mapImage += "dust2"
            mapName = "Dust2"
        } else if (map.name === "ovp") {
            mapImage += "overpass"
            mapName = "Overpass"
        } else if (map.name === "vertigo") {
            mapImage += "vertigo"
            mapName = "Vertigo"
        } else if (map.name === "inf") {
            mapImage += "inferno"
            mapName = "Inferno"
        }
        mapImage += ".png"
        let team1Score = map.result.substr(0, map.result.indexOf(':'))
        let team2Score = map.result.substr(map.result.indexOf(':') + 1, map.result.indexOf(' ') - 2)
        // se não jogaram algum mapa que estava na lista, fica com menos opacidade
        if (!team1Score) {
            document.getElementById("map" + i).style.opacity = "0.5";
        }

        document.getElementById("map" + i + "_image").src = mapImage
        document.getElementById("map" + i + "_name").innerHTML = mapName
        document.getElementById("map" + i + "_team1_score").innerHTML = team1Score
        document.getElementById("map" + i + "_team2_score").innerHTML = team2Score
        i++
    }

    console.log(data.playersTeam1)
    
    //let team1Players = data.players.team1
    /*
    i = 1
    for (player of team1Players) {
        console.log(player.age)
        /*
        let playerStats = "<td>"
        playerStats+="<img src=\"https://static.hltv.org/images/bigflags/30x20/" + player.country.code + ".gif\" class=\"player_flag\">"
        playerStats+="<td>" + player.ign + "</td>"
        

        document.getElementById("player" + i).innerHTML = playerStats
        */
        /*
        let playerSecondImgTag = document.createElement('img')
        playerSecondImgTag.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"

        document.getElementById("player" + i).appendChild(playerSecondImgTag)
        i++
        
    }

    
    let team2Players = data.players.team2
    let statsTeam1 = data.playerStats.team1
    let statsTeam2 = data.playerStats.team2
    
    // preencher a parte da estatística
    stats = "<table>"
    for (const player of statsTeam1) {

    }
    stats += "</table>"

    */
}