/* eslint-disable */

let mode = true;

function login(e) {
    e.preventDefault()
    api.post('/admin/login', {
            email: document.getElementById("eamil").value,
            password: document.getElementById("psw").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
                document.getElementById('login').style.display = "none"
                document.getElementById('tables').style.display = "block"
            } else {
                document.getElementById('mgsLogin').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
            document.getElementById('mgsLogin').innerHTML = "Connection Error"
        });
}

function sendEmail(e) {
    e.preventDefault()
    api.post('/admin/ask', {
            email: document.getElementById("eamil1").value
        })
        .then(function (res) {
            let code = res.status
            if (code === 220) {
                changeMode()
                document.getElementById('mgsAsk').innerHTML = res.data
            } else {
                document.getElementById('mgsAsk').innerHTML = res.data
            }
        })
        .catch(function (err) {
            console.log(err);
            document.getElementById('mgsAsk').innerHTML = "Connection Error"
        });
}

function changeMode() {
    if (mode) {
        fade(true, 'login', 'trying');
    } else {
        fade(true, 'trying', 'login');
    }
    mode = !mode
}

function onChangeChk(element, type) {
    let inputs = Array.from(document.getElementById('checkboxs').getElementsByTagName('input'))
    inputs.forEach(input => {
        if (input.id !== element.id) {
            input.checked = false
        }
    })
    let table = document.getElementById('table')
    table.innerHTML = ""
    switch (type) {
        case 'user':
            api.post('/admin/info/user/get').then(res => {
                if (typeof res.data === 'object' && res.status === 200) {
                    createTable(type, res.data, table, ['favorite', 'password'])
                } else {
                    //console.log(err)
                }
            }).catch(err => console.log(err))
            break;
        case 'team':
            api.post('/admin/info/team/get').then(res => {
                if (typeof res.data === 'object' && res.status === 200) {
                    createTable(type, res.data, table, ['recentResults'])
                } else {
                    //console.log(err)
                }
            }).catch(err => console.log(err))
            break;
        case 'player':
            api.post('/admin/info/player/get').then(res => {
                if (typeof res.data === 'object' && res.status === 200) {
                    createTable(type, res.data, table)
                } else {
                    //console.log(err)
                }
            }).catch(err => console.log(err))
            break;
        case 'match':
            api.post('/admin/info/match/get').then(res => {
                if (typeof res.data === 'object' && res.status === 200) {
                    createTable(type, res.data, table)
                } else {
                    console.log(err)
                }
            }).catch(err => console.log(err))
            break;
        default:
            //console.log(err)
            break;
    }
}

let inputs = Array.from(document.getElementById('checkboxs').getElementsByTagName('input'))
inputs.forEach(input => {
    input.checked = false
})
document.getElementById('user_chk').checked = true
api.post('/admin/info/user/get').then(res => {
    if (typeof res.data === 'object' && res.status === 200) {
        createTable('player', res.data, table, ['favorite', 'password'])
    } else {
        //console.log(err)
    }
}).catch(err => console.log(err))

// When the user clicks anywhere outside of the modal, close it
let modal = document.getElementById("modal");
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createTable(type, tableData, table, rejectKeys = []) {
    let tableBody = document.createElement('tbody');
    let thead = document.createElement('thead');
    let head = []

    let numberHead = 0;
    let indexForHead = 0;
    tableData.forEach((rowData, index) => {
        let keys = Object.keys(rowData)
        if (keys.length > numberHead) {
            numberHead = keys.length
            indexForHead = index
        }
    })

    let keys = Object.keys(tableData[indexForHead])
    for (const key of keys) {
        if (!rejectKeys.includes(key)) {
            if (key !== '_id') {
                let th = document.createElement('th')
                th.appendChild(document.createTextNode(key));
                thead.appendChild(th)
            }
            head.push(key)
        }
    }
    let headwithId = Array.from(head)
    head.splice(head.findIndex(e => e === '_id'), 1)

    tableData.forEach(function (rowData) {
        let row = document.createElement('tr');
        let index = 0;
        let _id = '';
        let current = []
        for (const key in rowData) {
            if (rowData.hasOwnProperty(key) && !rejectKeys.includes(key)) {
                const element = rowData[key];
                if (key === '_id') {
                    _id = element
                    index++
                } else {
                    while (key !== headwithId[index]) {
                        let cell = document.createElement('td');
                        cell.appendChild(document.createTextNode('null'));
                        row.appendChild(cell);
                        current.push('null')
                        index++
                    }
                    let cell = document.createElement('td');
                    current.push(element)
                    if (typeof element === 'object') {
                        cell.appendChild(document.createTextNode(JSON.stringify(element)));
                    } else {
                        cell.appendChild(document.createTextNode(element));
                    }
                    row.appendChild(cell);
                    index++
                }
            }
        }
        row.addEventListener('dblclick', editCell(type, _id, head, current))
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
    table.appendChild(thead);
}

function editCell(type, id, keys, current) {
    return function () {
        let modal_head = document.getElementById("head_modal");
        modal_head.innerHTML = type
        let modal_body = document.getElementById("modal_body");
        let html = '<p>'
        current.forEach(e => {
            html += e + ' |'
        })
        html += '</p>'
        modal_body.innerHTML = html
        modal.style.display = 'block'
    }
}