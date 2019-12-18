/* eslint-disable */
let favAnimation = false
let comments = [{
    id: 1234,
    text: 'O gajo que escreveu que não deste jogador pode morrer no inferno!',
    date: new Date(),
    hasEdit: false,
    user: {
        name: 'Ismpro (for testing)',
        id: '5dea68b738defa02b0f6ff87'
    }
}, {
    id: 1232,
    text: 'Epa não gosto deste jogador. Joga mesmo mal!.',
    date: new Date(2019, 11, 18, 9, 20),
    hasEdit: false,
    user: {
        name: 'Ismpro (for testing)',
        id: '5dea68b738defa02b0f6ff87'
    }
}, {
    id: 3421,
    text: 'Gosto muito do layout desta pagina',
    date: new Date(2019, 11, 17, 18, 35),
    hasEdit: false,
    user: {
        name: 'anon',
        id: '5dea68b738defa02b0f6ff87'
    }
}]

function pageLoad(cb) {
    document.getElementById("defaultTab").click();
    document.getElementById('comment_button').onclick = () => createComment()
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
    return cb()
}

function changeTab(e, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks-down");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }


    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " active";
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
        html += timeSince(comment.date)
        html += ' ago by '
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
        let buttonsTag = document.getElementById(`comment_buttons_${id}`);

        textTag.classList.remove('editable')
        textTag.contentEditable = 'false'
        buttonsTag.classList.remove('editableButtons')
        buttonsTag.innerHTML = `<button id="comment_edit_${id}">edit</button>|<button id="comment_delete_${id}">delete</button>`

        document.getElementById(`comment_delete_${id}`).onclick = deleteComment(id)
        document.getElementById(`comment_edit_${id}`).onclick = editComment(id)

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