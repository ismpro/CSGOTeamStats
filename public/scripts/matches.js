/* eslint-disable */
function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        cb()
    }).catch(err => console.log(err))
}

function loadData(data) {
    let team1Name = data.team1.name
    let team2Name = data.team2.name
    let maps = data.maps
    let team1Players = data.players.team1
    let team2Players = data.players.team2
    let statsTeam1 = data.playerStats.team1
    let statsTeam2 = data.playerStats.team2

    let logo_team1 = "https://static.hltv.org/images/team/logo/" + data.team1.id
    let logo_team2 = "https://static.hltv.org/images/team/logo/" + data.team2.id

    document.getElementById('team1_logo').src = logo_team1
    document.getElementById('team2_logo').src = logo_team2

    document.getElementById('team1_name').innerHTML = team1Name
    document.getElementById('team2_name').innerHTML = team2Name

    // preencher a parte da estatística
    stats = "<table>"
    for (const player of statsTeam1) {
        
    }
    stats += "</table>"


}