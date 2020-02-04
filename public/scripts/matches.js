// @ts-nocheck
/* eslint-disable */
let favController = false
let comments = []

function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        loadData(res.data)
        if (res.data.comments) {
            comments = res.data.comments
        }
        loadComments()
        cb()
    }).catch(err => console.log(err))
}

function loadData(data) {

    console.log(data)
    document.title = data.match.event;

    let scoreTeam1 = 0
    let scoreTeam2 = 0
    for (const map of data.match.maps) {
        if (map.team1.score > map.team2.score) {
            scoreTeam1++
        } else {
            scoreTeam2++
        }
    }

    let main_div = document.getElementById('match_page')

    let score = document.getElementById('score')
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
    nameTeam1.setAttribute("style", "text-align: center")
    nameTeam2.setAttribute("style", "text-align: center")
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

    let maps = document.getElementById('maps')
    let commentsDiv = document.getElementById('commentsdiv')
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

        let statsTeam1 = document.createElement('table')
        let statsTeam2 = document.createElement('table')

        statsTeam2.setAttribute("style", "float: right")
        // header das estatísticas
        for (let i = 0; i < 2; i++) {
            let trHeader = document.createElement('tr')
            let th1 = document.createElement('th')
            let th2 = document.createElement('th')
            let th3 = document.createElement('th')
            let th4 = document.createElement('th')
            let th5 = document.createElement('th')
            let th6 = document.createElement('th')
            let imgTeam = document.createElement('img')
            if (i === 0) {
                imgTeam.src = "https://static.hltv.org/images/team/logo/" + map.team1.id
            } else {
                imgTeam.src = "https://static.hltv.org/images/team/logo/" + map.team2.id
            }
            imgTeam.alt = map.team1.name
            imgTeam.classList.add("logo_team")
            th2.setAttribute("style", "min-width: 85px")
            th1.appendChild(imgTeam)
            th2.innerHTML = "Game Tag"
            th3.innerHTML = "K/D"
            th4.innerHTML = "Assists"
            th5.innerHTML = "ADR"
            th6.innerHTML = "KDR"
            trHeader.appendChild(th1)
            trHeader.appendChild(th2)
            trHeader.appendChild(th3)
            trHeader.appendChild(th4)
            trHeader.appendChild(th5)
            trHeader.appendChild(th6)
            if (i === 0) {
                statsTeam1.appendChild(trHeader)
            } else {
                statsTeam2.appendChild(trHeader)
            }
        }

        // estatísticas de cada jogador para cada mapa
        for (const player of map.playerStats.team1) {
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            let td2 = document.createElement('td')
            let td3 = document.createElement('td')
            let td4 = document.createElement('td')
            let td5 = document.createElement('td')
            let td6 = document.createElement('td')
            let countryFlag = document.createElement('img')
            for (const p of data.playersTeam1) {
                if (p.id === player.id) {
                    countryFlag.src = "https://www.countryflags.io/" + p.country.code + "/shiny/24.png"
                    countryFlag.alt = p.country.name
                }
            }
            td1.appendChild(countryFlag)
            td2.innerHTML = player.name
            td3.innerHTML = player.kills + "/" + player.deaths
            td4.innerHTML = player.assists
            td5.innerHTML = player.ADR
            td6.innerHTML = player.rating
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
            statsTeam1.appendChild(tr)
        }

        for (const player of map.playerStats.team2) {
            let tr = document.createElement('tr')
            let td1 = document.createElement('td')
            let td2 = document.createElement('td')
            let td3 = document.createElement('td')
            let td4 = document.createElement('td')
            let td5 = document.createElement('td')
            let td6 = document.createElement('td')
            let countryFlag = document.createElement('img')
            for (const p of data.playersTeam2) {
                if (p.id === player.id) {
                    countryFlag.src = "https://www.countryflags.io/" + p.country.code + "/shiny/24.png"
                    countryFlag.alt = p.country.name
                }
            }
            td1.appendChild(countryFlag)
            td2.innerHTML = player.name
            td3.innerHTML = player.kills + "/" + player.deaths
            td4.innerHTML = player.assists
            td5.innerHTML = player.ADR
            td6.innerHTML = player.rating
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
            statsTeam2.appendChild(tr)
        }

        mapDiv.appendChild(image)
        mapDiv.appendChild(scoreTeam1Div)
        mapDiv.appendChild(mapNameDiv)
        mapDiv.appendChild(scoreTeam2Div)
        mapDiv.appendChild(statsTeam1)
        mapDiv.appendChild(statsTeam2)

        maps.insertBefore(mapDiv, commentsDiv);
    }

    // highlighted players
    highlightsDiv = document.createElement('div')
    mostKillsDiv = document.createElement('div')
    mvpDiv = document.createElement('div')
    mostDamageDiv = document.createElement('div')

    highlightsDiv.classList.add("highlights")
    mostKillsDiv.setAttribute("style", "display: inline-block; width: 100px; text-align: center; margin-left: 45px; margin-right: 70px; font-size: 12px;")
    mvpDiv.setAttribute("style", "display: inline-block; width: 170px;  text-align: center; margin-right: 70px;")
    mostDamageDiv.setAttribute("style", "display: inline-block; width: 100px;  text-align: center; font-size: 12px;")

    // iteração a todos os jogadores do jogo
    for (const player of data.playersTeam1) {
        // guarda jogador com mais kills
        if (player.name === data.match.overview.mostKills.name) {
            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>Most Kills</b>"
            //highlight.setAttribute("style", "color:red")
            div.setAttribute("style", "border-top: 5px solid red;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            value = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name
            value.innerHTML = "Total kills: " + data.match.overview.mostKills.value
            value.setAttribute("style", "color: red")

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)
            div.appendChild(value)

            mostKillsDiv.appendChild(highlight)
            mostKillsDiv.appendChild(div)
        }
        // guarda jogador MVP
        if (player.name === data.match.highlightedPlayer.name) {
            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>MVP</b>"
            //highlight.setAttribute("style", "color:gold")
            div.setAttribute("style", "border-top: 5px solid gold;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 170px; height: 170px; display: block; margin-left: auto; margin-right: auto;")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)

            mvpDiv.appendChild(highlight)
            mvpDiv.appendChild(div)
        }
        // guarda jogador com mais ADR
        if (player.name === data.match.overview.mostDamage.name) {
            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>Most Damage</b>"
            //highlight.setAttribute("style", "color:blue")
            div.setAttribute("style", "border-top: 5px solid blue;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            value = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name
            value.innerHTML = "ADR: " + data.match.overview.mostDamage.value.toFixed(1).toString()
            value.setAttribute("style", "color: blue")

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)
            div.appendChild(value)

            mostDamageDiv.appendChild(highlight)
            mostDamageDiv.appendChild(div)
        }
    }
    for (const player of data.playersTeam2) {

        // guarda jogador com mais kills
        if (player.name === data.match.overview.mostKills.name) {

            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>Most Kills</b>"
            //highlight.setAttribute("style", "color:red")
            div.setAttribute("style", "border-top: 5px solid red;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            value = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name
            value.innerHTML = "Total kills: " + data.match.overview.mostKills.value
            value.setAttribute("style", "color: red")

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)
            div.appendChild(value)

            mostKillsDiv.appendChild(highlight)
            mostKillsDiv.appendChild(div)

        }
        // guarda jogador MVP
        if (player.name === data.match.highlightedPlayer.name) {

            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>MVP</b>"
            //highlight.setAttribute("style", "color:gold")
            div.setAttribute("style", "border-top: 5px solid gold;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 170px; height: 170px; display: block; margin-left: auto; margin-right: auto;")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)

            mvpDiv.appendChild(highlight)
            mvpDiv.appendChild(div)
        }
        // guarda jogador com mais ADR
        if (player.name === data.match.overview.mostDamage.name) {

            div = document.createElement('div')

            highlight = document.createElement('span')
            highlight.innerHTML = "<b>Most Damage</b>"
            //highlight.setAttribute("style", "color:blue")
            div.setAttribute("style", "border-top: 5px solid blue;")

            playerImg = document.createElement('img')
            playerDiv = document.createElement('div')
            countryImg = document.createElement('img')
            nameTag = document.createElement('span')
            value = document.createElement('span')
            playerImg.src = player.image
            playerImg.alt = player.name
            nameTag.setAttribute("style", "margin-left: 5px;")
            countryImg.setAttribute("style", "margin-top: 5px;")
            playerDiv.setAttribute("style", "display: inline-block; width:100%")
            playerImg.setAttribute("style", "width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto")
            countryImg.src = "https://www.countryflags.io/" + player.country.code + "/shiny/24.png"
            nameTag.innerHTML = player.name
            value.innerHTML = "ADR: " + data.match.overview.mostDamage.value.toFixed(1).toString()
            value.setAttribute("style", "color: blue")

            playerDiv.appendChild(countryImg)
            playerDiv.appendChild(nameTag)

            div.appendChild(playerImg)
            div.appendChild(playerDiv)
            div.appendChild(value)

            mostDamageDiv.appendChild(highlight)
            mostDamageDiv.appendChild(div)
        }
    }

    highlightsDiv.appendChild(mostKillsDiv)
    highlightsDiv.appendChild(mvpDiv)
    highlightsDiv.appendChild(mostDamageDiv)
    maps.insertBefore(highlightsDiv, commentsDiv);

    main_div.appendChild(maps)
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
    if (Array.isArray(comments) && comments.length > 0) {
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
            if (typeof comment.user === 'string') {
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
    } else {
        commentsDiv.innerHTML = '<div style="margin-top: 30px;">Write the first comment!</div>'
    }
}

function createComment() {
    let text = document.getElementById('comment_text').value;
    let isAnon = document.getElementById('anonymous_check').checked;
    let path = window.location.pathname
    api.post('/comment/create', {
        type: 'match',
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