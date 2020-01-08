/* eslint-disable */
function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        cb()
    }).catch(err => console.log(err))
}

function loadData(data) {
    let team1 = data.team1
    let team2 = data.team2
    let maps = data.maps
    let team1Players = data.players.team1
    let team2Players = data.players.team2

    document.getElementById("teste").innerHTML = team1;
}