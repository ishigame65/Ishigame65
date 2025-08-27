// history.js
const worldCb = document.getElementById('world');
const japanCb = document.getElementById('japan');
const computerCb = document.getElementById('computer');
const bikeCb = document.getElementById('bike');
const worldSet = document.getElementsByClassName('world');
const japanSet = document.getElementsByClassName('japan');
const computerSet = document.getElementsByClassName('computer');
const bikeSet = document.getElementsByClassName('bike');

function worldCheck(event){
    for (let world of worldSet) world.style.display = worldCb.checked ? "initial" : "none";
}
function japanCheck(event){
    for (let japan of japanSet) japan.style.display = japanCb.checked ? "initial" : "none";
}
function computerCheck(event){
    for (let computer of computerSet) computer.style.display = computerCb.checked ? "initial" : "none";
}
function bikeCheck(event){
    for (let bike of bikeSet) bike.style.display = bikeCb.checked ? "initial" : "none";
}

worldCb.addEventListener('change', worldCheck);
japanCb.addEventListener('change', japanCheck);
computerCb.addEventListener('change', computerCheck);
bikeCb.addEventListener('change', bikeCheck);
