/* eslint-disable */

let reversed = false;

function getReversed() {
    return reversed;
}
    
    function reverseNominations() {
    let table = document.getElementById('Nomination-emoteSort'),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = oldTbody.rows,
        i = rows.length - 2;
        newTbody.appendChild(rows[0]);
        console.log(newTbody);
    while (i >= 0) {
        newTbody.appendChild(rows[i]);
        i -= 1;
    }

    oldTbody.parentNode.replaceChild(newTbody, oldTbody);

    reversed = (reversed) ? false : true;
    let sorted = document.getElementById('Nomination-sorted');
    let Sort = document.getElementById('Nomination-sort-button');
    if (reversed) {
        sorted.innerText = 'Sorted by: Last added';
        Sort.innerText = 'Sort ▼';
    } else {
        sorted.innerText = 'Sorted by: First added';
        Sort.innerText = 'Sort ▲';
    }
}

function reverseNymn() {
    let table = document.getElementById('Nymn-emoteSort'),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = oldTbody.rows,
        i = rows.length - 2;
        newTbody.appendChild(rows[0]);
        console.log(newTbody);
    while (i >= 0) {
        newTbody.appendChild(rows[i]);
        i -= 1;
    }

    oldTbody.parentNode.replaceChild(newTbody, oldTbody);

    reversed = (reversed) ? false : true;
    let sorted = document.getElementById('Nymn-sorted');
    let Sort = document.getElementById('Nymn-sort-button');
    if (reversed) {
        sorted.innerText = 'Sorted by: Last added';
        Sort.innerText = 'Sort ▼';
    } else {
        sorted.innerText = 'Sorted by: First added';
        Sort.innerText = 'Sort ▲';
    }
}

function reverseMods() {
    let table = document.getElementById('Mods-emoteSort'),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
        rows = oldTbody.rows,
        i = rows.length - 2;
        newTbody.appendChild(rows[0]);
        console.log(newTbody);
    while (i >= 0) {
        newTbody.appendChild(rows[i]);
        i -= 1;
    }

    oldTbody.parentNode.replaceChild(newTbody, oldTbody);

    reversed = (reversed) ? false : true;
    let sorted = document.getElementById('Mods-sorted');
    let Sort = document.getElementById('Mods-sort-button');
    if (reversed) {
        sorted.innerText = 'Sorted by: Last added';
        Sort.innerText = 'Sort ▼';
    } else {
        sorted.innerText = 'Sorted by: First added';
        Sort.innerText = 'Sort ▲';
    }
}