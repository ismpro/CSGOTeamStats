/* eslint-disable */
function pageLoad(cb) {
    return cb()
}

function search(e) {
    e.preventDefault();
    let input = document.getElementById('search_string');
    api.post('/search', {
        text: input.value
    }).then(res => {
        if (res.status === 200) {
            let players = res.data.players
            let teams = res.data.teams
            let ul = document.getElementById('search_list');
            ul.innerHTML = ""
            if (players.length !== 0) {
                let li1 = document.createElement('li')
                li1.innerHTML = '<p>Players:</p>'
                ul.appendChild(li1);
                for (const player of players) {
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.href = `/player/${player.id}`
                    a.innerHTML = player.ign
                    li.appendChild(a)
                    ul.appendChild(li)
                }
            }
            if (teams.length !== 0) {
                let li1 = document.createElement('li')
                li1.innerHTML = '<p>Teams:</p>'
                ul.appendChild(li1);
                for (const team of teams) {
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.href = `/team/${team.id}`
                    a.innerHTML = team.name
                    li.appendChild(a)
                    ul.appendChild(li)
                }
            }
        }
    })
}

var matchesDetails = document.getElementsByClassName("match");
var i;

for (i = 0; i < matchesDetails.length; i++) {
    matchesDetails[i].addEventListener("click", function () {
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