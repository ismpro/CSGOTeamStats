/* eslint-disable */
let favController = false
let comments = []

function pageLoad(cb) {
    api.post(window.location.pathname).then(res => {
        console.log(res.data)
        if (res.data) {
            loadData(res.data)
            comments = res.data.comments
            loadComments()
        } else {
            let main = document.getElementById('main')
            main.innerHTML = `<h2 class="team_not_found">Team Not found</h2>`
            window.onclick = () => {
                window.location.replace('/')
            }
        }
        cb()
    }).catch(err => console.log(err))
}

function onsession() {
    let path = window.location.pathname
    let id = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf(''))
    document.getElementById('comments_area').innerHTML = '<textarea placeholder="Write your comment here..." id="comment_text"></textarea> \
        <div>Anonymous? <input type = "checkbox" id="anonymous_check"> \
        <button onclick="javascript:createComment()" id="comment_button" >Comment</button></div>'
    document.getElementById('comment_button').onclick = () => createComment()
    api.post('/fav', {
        type: 'team',
        id: id
    }).then((res) => {
        document.getElementById("teamFav").innerHTML = '<div class="clickFav"> \
    <span class= "fa star fa-star-o"></span><p id="fav_text" class="info">&nbsp;&nbsp;Added!</p></div>'
        let fav = document.getElementsByClassName('clickFav')[0]
        fav.addEventListener('click', () => {
            if (!favController) {
                favController = true
                api.post('/fav/team', {
                    id: id
                }).then((data) => {
                    if (data.status === 200) {
                        data = data.data
                        favAnimation(data === 'added', fav)
                    }
                }).catch(err => console.log(err))
            }
        })
        if (typeof (res.data) !== "string") {
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
    })
}

function onlogout() {
    document.getElementById('comments_area').innerHTML = '<p>You need to login to write comments</p>'
    document.getElementById("teamFav").innerHTML = ''
    let group_buttons = document.getElementsByName('buttons_comments')
    if (group_buttons.length > 0) {
        for (const group_button of group_buttons) {
            group_button.remove()
        }
    }
}

function favAnimation(type, fav) {
    let star = fav.firstElementChild
    if (type) {
        setTimeout(() => {
            star.classList.add('fa-star')
            star.classList.remove('fa-star-o')
        }, 150)
        document.getElementById('fav_text').innerHTML = '&nbsp;&nbsp;Added!'
        fav.lastElementChild.classList.add('info-tog')
        setTimeout(() => {
            fav.lastElementChild.classList.remove('info-tog')
            favController = false
        }, 1000)
    } else {
        setTimeout(() => {
            star.classList.remove("fa-star")
            star.classList.add("fa-star-o")
        }, 15)
        document.getElementById('fav_text').innerText = 'Removed!'
        fav.lastElementChild.classList.add('info-tog')
        setTimeout(() => {
            fav.lastElementChild.classList.remove('info-tog')
            favController = false
        }, 1000)
    }
}

function loadData(data) {
    let playersData = data.players
    let recentData = data.recentResults
    data = data.team
    let imagetag = document.getElementById('team_logo')
    imagetag.src = data.logo
    imagetag.alt = data.name || 'Not Specified'
    imagetag.title = data.name || 'Not Specified'
    document.getElementById('team_name').innerHTML = data.name || 'Not Specified'
    document.title = data.name
    let countrytag = document.getElementById('team_country')
    countrytag.src = `https://www.countryflags.io/${data.location.code}/shiny/24.png`
    countrytag.alt = data.location.name || 'World'
    document.getElementById('team_country_name').innerHTML = data.location.name || 'Not Specified'
    let socialDiv = document.getElementById('teamSocial')
    socialDiv.innerHTML = ""
    if (data.twitch) {
        let tag = document.createElement("a");
        tag.href = data.twitch
        tag.classList.add("fa", "fa-twitch")
        socialDiv.appendChild(tag)
    }
    if (data.twitter) {
        let tag = document.createElement("a");
        tag.href = data.twitter
        tag.classList.add("fa", "fa-twitter")
        socialDiv.appendChild(tag)
    }
    if (data.facebook) {
        let tag = document.createElement("a");
        tag.href = data.facebook
        tag.classList.add("fa", "fa-facebook")
        socialDiv.appendChild(tag)
    }
    document.getElementById('ranking').innerHTML = '#' + data.rank || 'Not Specified'
    let playersContainer = document.getElementById('players_container')
    playersContainer.innerHTML = ""
    for (const player of playersData) {
        let playerATag = document.createElement('a')
        let playerFirstDivTag = document.createElement('div')
        let playerFirstImgTag = document.createElement('img')
        let playerSecondDivTag = document.createElement('div')
        let playerThirdDivTag = document.createElement('div')
        let playerSecondImgTag = document.createElement('img')
        let playerSpanTag = document.createElement('span')

        playerATag.href = "/player/" + player.id
        playerATag.classList.add('teamPlayer')
        playerATag.title = player.name

        playerFirstImgTag.src = player.image
        playerFirstImgTag.alt = player.name
        playerFirstImgTag.title = player.name
        playerFirstImgTag.classList.add('teamPlayer-image')

        playerSecondDivTag.classList.add('teamPlayer-name')

        playerThirdDivTag.classList.add('playerFlagName')

        if (player.country) {
            playerSecondImgTag.src = `https://www.countryflags.io/${player.country.code}/shiny/24.png`
            playerSecondImgTag.alt = player.country.name
            playerSecondImgTag.title = player.country.name
            playerSecondImgTag.classList.add('flag')
            playerThirdDivTag.appendChild(playerSecondImgTag)
        }

        playerSpanTag.innerHTML = player.name
        playerSpanTag.classList.add('playerName')

        playerThirdDivTag.appendChild(playerSpanTag)

        playerSecondDivTag.appendChild(playerThirdDivTag)

        playerFirstDivTag.appendChild(playerFirstImgTag)
        playerFirstDivTag.appendChild(playerSecondDivTag)

        playerATag.appendChild(playerFirstDivTag)

        playersContainer.appendChild(playerATag)
    }

    document.getElementById('results_headline').innerHTML = "Last Results for " + data.name

    let lastResultsCounter = 0
    let lastResultsTag = document.getElementById('results_body')
    let lastTag = document.getElementById('last_matches_r')
    lastResultsTag.innerHTML = ""
    lastTag.innerHTML = ""
    for (const result of recentData) {
        let resultTr = document.createElement('tr')
        let result1Td = document.createElement('td')
        let result2Td = document.createElement('td')
        let result1Div = document.createElement('div')
        let result1Img = document.createElement('img')
        let result1Span = document.createElement('span')
        let result2Div = document.createElement('div')
        let result3Div = document.createElement('div')
        let result2Img = document.createElement('img')
        let result2Span = document.createElement('span')
        let result1A = document.createElement('a')
        let result3Td = document.createElement('td')
        let result2A = document.createElement('a')

        result1Td.innerHTML = result.date || '00/00/0000'
        result1Td.classList.add('date')

        result2Td.classList.add('result')

        result1Div.classList.add('team1')
        result1Img.classList.add('logo')
        result1Img.src = data.logo
        result1Img.alt = data.name || 'Not Specified'
        result1Img.title = data.name || 'Not Specified'
        result1Span.innerHTML = data.name || 'Not Specified'

        let score = result.score.split(':')
        result2Div.classList.add('score')
        result2Div.innerHTML = score.join(' : ')

        result3Div.classList.add('team2')
        result2Img.classList.add('logo')
        result2Img.src = result.enemyTeam.logo
        result2Img.alt = result.enemyTeam.name || 'Not Specified'
        result2Img.title = result.enemyTeam.name || 'Not Specified'
        result1A.classList.add('teamLink')
        result1A.href = '/team/' + result.enemyTeam.id
        result1A.innerHTML = result.enemyTeam.name || 'Not Specified'

        result3Td.classList.add('matchButton')
        result2A.href = '/match/' + result.id
        result2A.innerHTML = 'Match'

        result1Div.appendChild(result1Img)
        result1Div.appendChild(result1Span)

        result2Span.appendChild(result1A)
        result3Div.appendChild(result2Span)
        result3Div.appendChild(result2Img)

        result2Td.appendChild(result1Div)
        result2Td.appendChild(result2Div)
        result2Td.appendChild(result3Div)

        result3Td.appendChild(result2A)

        resultTr.appendChild(result1Td)
        resultTr.appendChild(result2Td)
        resultTr.appendChild(result3Td)

        lastResultsTag.appendChild(resultTr)

        if (lastResultsCounter < 5) {
            let spanTag = document.createElement('span')
            if (score[0] < score[1]) {
                spanTag.style.color = "red"
                spanTag.innerHTML = "L&nbsp;"
            } else if (score[0] > score[1]) {
                spanTag.style.color = "green"
                spanTag.innerHTML = "W&nbsp;"
            } else {
                spanTag.style.color = "grey"
                spanTag.innerHTML = "?&nbsp;"
            }
            lastTag.appendChild(spanTag)
            lastResultsCounter++
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
        type: 'team',
        text: text,
        id: path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('')),
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