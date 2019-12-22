/* eslint-disable */

let comments = [{
    id: 1234,
    text: 'Cool Team',
    date: new Date(),
    hasEdit: false,
    user: {
        name: 'Ismpro (for testing)',
        id: '5dea68b738defa02b0f6ff87'
    }
}]
let favAnimation = false

function pageLoad(cb) {
    let fav = document.getElementsByClassName('clickFav')[0]
    fav.addEventListener('click', () => {
        let star = fav.firstElementChild
        if (!favAnimation) {
            favAnimation = true
            if (star.classList.contains("fa-star")) {
                setTimeout(() => {
                    star.classList.remove("fa-star")
                    star.classList.add("fa-star-o")
                }, 15)
                document.getElementById('fav_text').innerText = 'Removed!'
                fav.lastElementChild.classList.add('info-tog')
                setTimeout(() => {
                    fav.lastElementChild.classList.remove('info-tog')
                    favAnimation = false
                }, 1000)
            } else {
                setTimeout(() => {
                    star.classList.add('fa-star')
                    star.classList.remove('fa-star-o')
                }, 150)
                document.getElementById('fav_text').innerHTML = '&nbsp;&nbsp;Added!'
                fav.lastElementChild.classList.add('info-tog')
                setTimeout(() => {
                    fav.lastElementChild.classList.remove('info-tog')
                    favAnimation = false
                }, 1000)
            }
        }
    })
    loadComments()
    /* paginator({
        table: document.getElementById("table_to_page"),
        box: document.getElementById("table_pages_numbers"),
    }); */
    cb()
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
        let timeString = timeSince(comment.date)
        if (timeString === 'just now') {
            html += 'Just now by '
        } else {
            html += `${timeString} ago by `
        }

        if (comment.hasEdit) {
            html += `<a href="#">${comment.editBy.name}</a> / Made by: `
        }
        if (comment.user.name === 'anon') {
            html += 'Anonymous'
        } else {
            html += `<a href="#">${comment.user.name}</a>`
        }
        html += `<div class="comments_buttons_group"><span id="comment_buttons_${comment.id}" class="comments_buttons">`
        html += `<button id="comment_edit_${comment.id}">edit</button>|<button id="comment_delete_${comment.id}">delete</button></span></div>`
        html += '</div></blockquote></li>'
    })
    commentsDiv.innerHTML = html;
    comments.forEach((comment) => {
        document.getElementById(`comment_delete_${comment.id}`).onclick = deleteComment(comment.id)
        document.getElementById(`comment_edit_${comment.id}`).onclick = editComment(comment.id)
    })
}

function createComment() {
    let text = document.getElementById('comment_text').value;
    let isAnon = document.getElementById('anonymous_check').checked;
    comments.unshift({
        id: ((Math.random() * 1e6) | 0),
        text: text,
        date: new Date(),
        user: isAnon ? {
            name: 'anon',
            id: '5dea68b738defa02b0f6ff87'
        } : {
                name: 'Ismpro (for testing)',
                id: '5dea68b738defa02b0f6ff87'
            }
    })
    document.getElementById('comment_text').value = ''
    loadComments()
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