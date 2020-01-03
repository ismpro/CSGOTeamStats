/* eslint-disable */
let favController = false
let comments = [{
    id: 1234,
    text: 'O gajo que escreveu que não deste jogador pode morrer no inferno!',
    date: new Date(),
    hasEdit: false,
    user: {
        name: 'Ismpro (for testing)',
        id: '5dea68b738defa02b0f6ff87'
    },
    isFromUser: true
}]

function pageLoad(cb) {
    document.getElementById("defaultTab").click();
    let fav = document.getElementsByClassName('clickFav')[0]
    fav.addEventListener('click', () => {
        if (!favController) {
            favController = true
            let path = window.location.pathname
            let id = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf(''))
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
    api.post(window.location.pathname).then(res => {
        console.log(res.data)
        loadData(res.data)
        let star = document.getElementsByClassName('clickFav')[0].firstElementChild
        if (res.data.fav) {
            star.classList.add('fa-star')
            star.classList.remove('fa-star-o')
        } else {
            star.classList.remove("fa-star")
            star.classList.add("fa-star-o")
        }
        comments = res.data.comments
        loadComments()
        cb()
    }).catch(err => console.log(err))
}

function onsession() {
    document.getElementById('comments_area').innerHTML = '<textarea placeholder="Write your comment here..." id="comment_text"></textarea> \
        <div>Anonymous? <input type = "checkbox" id="anonymous_check"> \
        <button onclick="javascript:createComment()" id="comment_button" >Comment</button></div>'
    document.getElementById('comment_button').onclick = () => createComment()
    document.getElementById("playerFav").innerHTML = '<div class="clickFav"> \
    <span class= "fa star fa-star-o"></span><p id="fav_text" class="info">&nbsp;&nbsp;Added!</p></div>'
}

function onlogout() {
    document.getElementById('comments_area').innerHTML = '<p>You need to login to write comments</p>'
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
    let teamData = data.team
    data = data.player
    let imagetag = document.getElementById('player_image')
    imagetag.src = data.image
    imagetag.alt = data.ign || 'Not Specified'
    imagetag.title = data.ign || 'Not Specified'
    document.getElementById('player_ign').innerHTML = data.ign || 'Not Specified'
    let countrytag = document.getElementById('player_country')
    countrytag.src = `https://www.countryflags.io/${data.country.code}/shiny/24.png`
    countrytag.alt = data.country.name || 'World'
    document.getElementById('player_real').innerHTML = data.name || 'Not Specified'
    let socialDiv = document.getElementById('player_social')
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
    document.getElementById('player_age').innerHTML = data.age || ''
    if (data.team) {
        let teamtag = document.getElementById('team_flag')
        teamtag.src = teamData ? teamData.logo : window.location.origin + '/static/images/logo-team.png'
        teamtag.alt = teamData.name || ''
        document.getElementById('team_name').innerHTML = teamData ? `<a class="teamLink" href="${window.location.origin + '/team/' + teamData.id}">${teamData.name}</a>` : `<a class="teamLink" href="#">Error</a>`


    }
    document.getElementById('player_ign_stats').innerHTML = `${data.ign || ''} statistics<span class=" stats-window">(Past 3 months)</span>`

    document.getElementById('player_rating').innerHTML = data.statistics.rating
    document.getElementById('player_kills').innerHTML = data.statistics.killsPerRound
    document.getElementById('player_hs').innerHTML = data.statistics.headshots
    document.getElementById('player_maps').innerHTML = data.statistics.mapsPlayed
    document.getElementById('player_death').innerHTML = data.statistics.deathsPerRound
    document.getElementById('player_rc').innerHTML = data.statistics.roundsContributed

    document.getElementById('player_achivs_headline').innerHTML = `Achievements for ${data.ign} <span class="stats-window">Past 15 games</span>`

    if (data.achievements && data.achievements.length > 0) {
        let table = document.getElementById('player_achiv')
        let html = '';
        data.achievements.forEach((achiv) => {
            html += '<tr><td>'
            if (achiv.place === '1st') {
                html += '<div><i class="fa fa-trophy "></i>1st</div></td>'
            } else if (achiv.place === '2nd') {
                html += '<div><i class="fa fa-trophy "></i>2st</div></td>'
            } else if (achiv.place === '3rd') {
                html += '<div><i class="fa fa-trophy "></i>3st</div></td>'
            } else {
                html += achiv.place + '</td>'
            }
            html += `<td>${achiv.event.name}</td></tr>`
        })
        table.innerHTML = html
    }
    paginator({
        table: document.getElementById("table_to_page"),
        box: document.getElementById("table_pages_numbers"),
        box_mode: "button",
        rows_per_page: 10
    });
}

function changeTab(e, tabName) {

    var i;
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " active";
}

function loadComments(id) {

    let commentsDiv = document.getElementById('comments')
    let html = ''
    comments.forEach((comment, index) => {
        html += `<li id="comment_${comment.id}"><blockquote class="comments-bubble${index % 2 ? ' comments_odd' : ''}"><div class="comments_bubble_text"><p id="comment_text_${comment.id}" contenteditable="false">`
        html += comment.text;
        html += '</p></div><div class="comments_madeby">'
        if (comment.hasEdit) {
            html += 'Edit '
        }
        let timeString = timeSince(comment.date)
        if (timeString === 'just now') {
            html += 'Just now by '
        } else {
            html += `${timeString} ago by `
        }

        if (comment.hasEdit) {
            html += `<a href="#">${comment.hasEdit}</a> / Made by: `
        }
        if (comment.user === 'anon') {
            html += 'Anonymous'
        } else {
            html += `<a href="#">${comment.user}</a>`
        }
        if (comment.isFromUser || admin) {
            html += `<div class="comments_buttons_group"><span id="comment_buttons_${comment.id}" class="comments_buttons">`
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
        let comment = res.data
        comments.unshift(comment)
        document.getElementById('comment_text').value = ''
        loadComments()
    })
}

function deleteComment(id) {
    return function () {
        var index = comments.findIndex((comment) => comment.id === id);
        if (index !== -1) {
            comments.splice(index, 1);
            loadComments()
        }
    }
}

function editComment(id) {
    const saveComment = () => () => {
        let textTag = document.getElementById(`comment_text_${id}`);

        var index = comments.findIndex((comment) => comment.id === id);
        if (index !== -1) {
            comments[index] = {
                id: id,
                text: textTag.innerHTML,
                date: new Date(),
                hasEdit: true,
                editBy: {
                    name: 'Ismpro (for testing)',
                    id: '5dea68b738defa02b0f6ff87'
                },
                user: comments[index].user
            }
            loadComments()
        }
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