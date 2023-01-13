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
         Sort.innerText = 'Date added ▼';
     } else {
         sorted.innerText = 'Sorted by: First added';
         Sort.innerText = 'Date added ▲';
     }
 }
 
 function reverseViewers() {
     let table = document.getElementById('Viewers-emoteSort'),
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
     let sorted = document.getElementById('Viewers-sorted');
     let Sort = document.getElementById('Viewers-sort-button');
     if (reversed) {
         sorted.innerText = 'Sorted by: Last added';
         Sort.innerText = 'Date added ▼';
     } else {
         sorted.innerText = 'Sorted by: First added';
         Sort.innerText = 'Date added ▲';
     }
 }
 
 function reverseNymnMods() {
     let table = document.getElementById('Nymn/mods-emoteSort'),
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
     let sorted = document.getElementById('Nymn/mods-sorted');
     let Sort = document.getElementById('Nymn/mods-sort-button');
     if (reversed) {
         sorted.innerText = 'Sorted by: Last added';
         Sort.innerText = 'Date added ▼';
     } else {
         sorted.innerText = 'Sorted by: First added';
         Sort.innerText = 'Date added ▲';
     }
 }