// @ts-nocheck
/* eslint-disable */
let favController = false
let comments = []

function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        cb()
    }).catch(err => console.log(err))
}

function loadData(data) {
    
    console.log(data)

    let scoreTeam1 = 0
    let scoreTeam2 = 0
    for (const map of data.match.maps) {
        if (map.team1.score > map.team2.score) {
            scoreTeam1++
        } else {
            scoreTeam2++
        }
    }

    let main_div = document.getElementById('main')
    
    let score = document.createElement('div')
    score.classList.add('score')

    let team1 = document.createElement('div')
    let result = document.createElement('div')
    let team2 = document.createElement('div')
    team1.classList.add('team1')
    result.classList.add('result')
    team2.classList.add('team2')

    let logoTeam1 = document.createElement("img")
    let logoTeam2 = document.createElement("img")
    logoTeam1.src = "https://static.hltv.org/images/team/logo/" + data.match.team1.id
    logoTeam2.src = "https://static.hltv.org/images/team/logo/" + data.match.team2.id
    logoTeam1.classList.add("logo")
    logoTeam2.classList.add("logo")

    let nameTeam1 = document.createElement("span")
    let nameTeam2 = document.createElement("span")
    nameTeam1.innerHTML = data.match.team1.name
    nameTeam2.innerHTML = data.match.team2.name

    result.innerHTML = "<span class=\"team1\">" + scoreTeam1 + "</span><span class=\"team2\">" + scoreTeam2 + "</span>"

    team1.appendChild(logoTeam1)
    team1.appendChild(nameTeam1)
    team2.appendChild(logoTeam2)
    team2.appendChild(nameTeam2)

    score.appendChild(team1)
    score.appendChild(result)
    score.appendChild(team2)

    main_div.appendChild(score)

    //------------------------------------------------------------------------------------------------//
    
    let maps = document.createElement('div')
    maps.classList.add('maps')

    for (const map of data.match.maps) {
        let mapImage = "https://hltv.org/img/static/maps/"
        let mapName
        if (map.map === "nuke") {
            mapImage += "nuke"
            mapName = "Nuke"
        } else if (map.map === "trn") {
            mapImage += "train"
            mapName = "Train"
        } else if (map.map === "mrg") {
            mapImage += "mirage"
            mapName = "Mirage"
        } else if (map.map === "d2") {
            mapImage += "dust2"
            mapName = "Dust2"
        } else if (map.map === "ovp") {
            mapImage += "overpass"
            mapName = "Overpass"
        } else if (map.map === "vertigo") {
            mapImage += "vertigo"
            mapName = "Vertigo"
        } else if (map.map === "inf") {
            mapImage += "inferno"
            mapName = "Inferno"
        }
        mapImage += ".png"

        let mapDiv = document.createElement('div')
        let image = document.createElement('img')
        let scoreTeam1Div = document.createElement('div')
        let scoreTeam2Div = document.createElement('div')
        let mapNameDiv = document.createElement('div')

        mapDiv.classList.add('map')
        scoreTeam1Div.classList.add('team1_score')
        scoreTeam2Div.classList.add('team2_score')
        mapNameDiv.classList.add('map_name')
        image.classList.add('map_image')

        image.src = mapImage
        image.alt = mapName

        scoreTeam1Div.innerHTML = map.team1.score
        scoreTeam2Div.innerHTML = map.team2.score
        mapNameDiv.innerHTML = mapName




        






        mapDiv.appendChild(image)
        mapDiv.appendChild(scoreTeam1Div)
        mapDiv.appendChild(mapNameDiv)
        mapDiv.appendChild(scoreTeam2Div)

        maps.appendChild(mapDiv)
    }
    
    main_div.appendChild(maps)



    /*
    // nomes das equipas
    let team1Name = data.match.team1.name
    let team2Name = data.match.team2.name
    let playersTeam1 = data.playersTeam1
    let playersTeam2 = data.playersTeam2
    data = data.match
    console.log(data)
    document.title = data.event + 'Match';
    // nomes das equipas
    let team1Name = data.team1.name
    let team2Name = data.team2.name
    document.getElementById('team1_name').innerHTML = team1Name
    document.getElementById('team2_name').innerHTML = team2Name
    // imagens das equipas
    let logo_team1 = "https://static.hltv.org/images/team/logo/" + data.match.team1.id
    let logo_team2 = "https://static.hltv.org/images/team/logo/" + data.match.team2.id
    document.getElementById('team1_logo').src = logo_team1
    document.getElementById('team2_logo').src = logo_team2
    // mapas
    let maps = data.match.maps
    // resultado
    let leftCounter = 0
    let rightCounter = 0
    // para cada mapa, vai aumentando o contador de cada equipa
    
    for (const map of maps) {
        let leftResult = map.team1.score
        let rightResult = map.team2.score

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
        if (map.map === "nuke") {
            mapImage += "nuke"
            mapName = "Nuke"
        } else if (map.map === "trn") {
            mapImage += "train"
            mapName = "Train"
        } else if (map.map === "mrg") {
            mapImage += "mirage"
            mapName = "Mirage"
        } else if (map.map === "d2") {
            mapImage += "dust2"
            mapName = "Dust2"
        } else if (map.map === "ovp") {
            mapImage += "overpass"
            mapName = "Overpass"
        } else if (map.map === "vertigo") {
            mapImage += "vertigo"
            mapName = "Vertigo"
        } else if (map.map === "inf") {
            mapImage += "inferno"
            mapName = "Inferno"
        }
        mapImage += ".png"
        let team1Score = map.team1.score
        let team2Score = map.team2.score
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

    //console.log(data.playersTeam1)
    
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

function onsession() {
    let path = window.location.pathname
    let id = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf(''))
    document.getElementById('comments_area').innerHTML = '<textarea placeholder="Write your comment here..." id="comment_text"></textarea> \
        <div>Anonymous? <input type = "checkbox" id="anonymous_check"> \
        <button onclick="javascript:createComment()" id="comment_button" >Comment</button></div>'
    document.getElementById('comment_button').onclick = () => createComment()
    /* api.post('/fav', {
        type: 'match',
        id: id
    }).then((res) => {
        if (typeof (res.data) !== "string") {
            document.getElementById("playerFav").innerHTML = '<div class="clickFav"> \
    <span class= "fa star fa-star-o"></span><p id="fav_text" class="info">&nbsp;&nbsp;Added!</p></div>'
            let fav = document.getElementsByClassName('clickFav')[0]
            fav.addEventListener('click', () => {
                if (!favController) {
                    favController = true
                    api.post('/fav/player', {
                        id: id
                    }).then((data) => {
                        if (data.status === 200) {
                            data = data.data
                            favAnimation(data === 'added', fav)
                        }
                    }).catch(err => console.log(err))
                }
            })
            let star = document.getElementsByClassName('clickFav')[0].firstElementChild
            if (res.data) {
                star.classList.add('fa-star')
                star.classList.remove('fa-star-o')
            } else {
                star.classList.remove("fa-star")
                star.classList.add("fa-star-o")
            }
        } else {
            location.replace()
        }
    }) */
}

function onlogout() {
    document.getElementById('comments_area').innerHTML = '<p>You need to login to write comments</p>'
    /* document.getElementById("playerFav").innerHTML = '' */
    let group_buttons = document.getElementsByName('buttons_comments')
    if (group_buttons.length > 0) {
        for (const group_button of group_buttons) {
            group_button.remove()
        }
    }
}

function loadComments() {

    let commentsDiv = document.getElementById('comments')
    let html = ''
    comments.forEach((comment, index) => {
        html += `<li id="comment_${comment.id}"><blockquote class="comments-bubble${index % 2 ? ' comments_odd' : ''}"><div class="comments_bubble_text"><p id="comment_text_${comment.id}" contenteditable="false">`
        html += comment.text;
        html += '</p></div><div class="comments_madeby">'
        if (comment.hasEdit) {
            html += 'Edit '
        }
        let timeString = timeSince(comment.hasEdit ? comment.hasEdit.date : comment.date)
        if (timeString === 'just now') {
            html += 'Just now by '
        } else {
            html += `${timeString} ago by `
        }
        if (comment.hasEdit) {
            html += `<a href="#">${comment.hasEdit.user}</a> / Made by: `
        }
        if (typeof comment.user === 'anon') {
            html += comment.user === 'anon' ? 'Anonymous' : 'Deleted'
        } else {
            html += `<a href="/profile/${comment.user.id}">${comment.user.name}</a>`
        }
        if (comment.isFromUser || admin) {
            html += `<div name="buttons_comments" class="comments_buttons_group"><span id="comment_buttons_${comment.id}" class="comments_buttons">`
            html += `<button id="comment_edit_${comment.id}">edit</button>|<button id="comment_delete_${comment.id}">delete</button></span></div>`
        }
        html += '</div></blockquote></li>'
    })
    commentsDiv.innerHTML = html;
    comments.forEach((comment) => {
        if (comment.isFromUser || admin) {
            document.getElementById(`comment_delete_${comment.id}`).onclick = deleteComment(comment.id)
            document.getElementById(`comment_edit_${comment.id}`).onclick = editComment(comment.id)
        }
    })
}

function createComment() {
    let text = document.getElementById('comment_text').value;
    let isAnon = document.getElementById('anonymous_check').checked;
    let path = window.location.pathname
    api.post('/comment/create', {
        type: 'player',
        id: path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('')),
        text: text,
        isAnon: isAnon
    }).then((res) => {
        if (res.data) {
            let comment = res.data
            comments.unshift(comment)
            document.getElementById('comment_text').value = ''
            loadComments()
        } else {
            location.reload();
        }
    })
}

function deleteComment(id) {
    return function () {
        api.post('/comment/delete', {
            id: id
        }).then((res) => {
            if (res.data) {
                var index = comments.findIndex((comment) => comment.id === id);
                if (index !== -1) {
                    comments.splice(index, 1);
                    loadComments()
                }
            } else {
                location.reload();
            }
        }).catch(err => {
            console.log(err)
        })
    }
}

function editComment(id) {
    const saveComment = () => () => {
        let text = document.getElementById(`comment_text_${id}`).innerHTML;
        if (text.includes('<br>')) text = text.replace('<br>', '') //Firefox adds <br> in input text
        api.post('/comment/edit', {
            id: id,
            text: text
        }).then((res) => {
            if (res.data) {
                var index = comments.findIndex((comment) => comment.id === id);
                if (index !== -1) {
                    comments[index] = res.data
                    loadComments()
                }
            } else {
                location.reload();
            }
        }).catch(err => {
            console.log(err)
        })

    }
    const cancelComment = (beforeText) => () => {
        let textTag = document.getElementById(`comment_text_${id}`);
        let buttonsTag = document.getElementById(`comment_buttons_${id}`);

        textTag.innerHTML = beforeText;
        textTag.classList.remove('editable');
        textTag.contentEditable = 'false'
        buttonsTag.classList.remove('editableButtons');
        buttonsTag.innerHTML = `<button id="comment_edit_${id}">edit</button>|<button id="comment_delete_${id}">delete</button>`

        document.getElementById(`comment_delete_${id}`).onclick = deleteComment(id)
        document.getElementById(`comment_edit_${id}`).onclick = editComment(id)
    }
    return function () {
        let textTag = document.getElementById(`comment_text_${id}`);
        let buttonsTag = document.getElementById(`comment_buttons_${id}`);
        let beforeTextTag = textTag.innerHTML;

        textTag.classList.add('editable')
        textTag.contentEditable = 'true'
        textTag.focus();
        buttonsTag.classList.add('editableButtons')
        buttonsTag.innerHTML = `<button id="comment_save_${id}">Save</button>|<button id="comment_cancel_${id}">Cancel</button>`

        document.getElementById(`comment_cancel_${id}`).onclick = cancelComment(beforeTextTag);
        document.getElementById(`comment_save_${id}`).onclick = saveComment();
    }
}