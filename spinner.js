var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

// var stuff = ["kfc", "mcd", "king"];
// var restaurants = JSON.parse(localStorage.getItem("restaurants"));
// console.log(JSON.parse(localStorage.getItem("restaurant")));

var settings = {
    lossOfMomentum: .001
}

var c = canvas.getContext('2d');
// context.arc(x,y,r,sAngle,eAngle,counterclockwise);
var newColor = "";

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

let getItems = function(num) {
    return (Math.PI * 2) / num
};

let getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    newColor = color;
    if(isIE || isEdge){
        return color+"80";
    }
   else{return color+"80";}

};

let restaurants = [];
if (JSON.parse(localStorage.getItem("restaurants"))){
            restaurants = JSON.parse(localStorage.getItem("restaurants"));
        };
let sections = {};
let position = 0;
let momentum = 0;
//0.113 = one full rotation

let moving = false;

let spinIt = function() {
    document.getElementById("resField").style.visibility = "hidden";
    document.getElementById("add").style.visibility = "hidden";
    document.getElementById("spin").style.visibility = "hidden";
    let deleteKeys = document.getElementsByClassName("deleteKey");
    for (var i = 0; i < deleteKeys.length; i++) {
        deleteKeys[i].style.visibility = "hidden";
    }
    
    if (momentum > 0 && Object.keys(sections).length > 1) {
        c.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < Object.keys(sections).length; i++) {

            c.beginPath();
            c.arc(canvas.width / 2, canvas.height / 2, 200, sections[i].arc.start + position, sections[i].arc.section + position, false);
            c.lineTo(canvas.width / 2, canvas.height / 2);
            c.fillStyle = sections[i].color;
            c.fill();
            c.closePath();

            //pointer
            c.beginPath();
            c.arc(canvas.width / 2, canvas.height / 2, 250, -0.02, 0.02, false);
            c.lineTo((canvas.width / 2) + 50, canvas.height / 2);
            c.fillStyle = getRandomColor();
            c.fill();
            c.closePath();
        }

        if (momentum > 0.01) {
            momentum = (momentum - settings.lossOfMomentum).toFixed(3);
            if (position <= 0 && position > -6.2831) {
                position = (position - momentum);
            } else { position = 0 }
            console.log("mom", momentum);
            console.log("position", (position / (Math.PI * 2)).toFixed(3));
            requestAnimationFrame(spinIt);
        } else {
            for (var i = 0; i < Object.keys(sections).length; i++) {
                if (0 >= sections[i].arc.start + position && 0 < sections[i].arc.section + position) {
                    
                    
                    $('#modal-body').text(sections[i].name);
                    $('#myModal').modal('show');
                    
                    // alert(sections[i].name);
                    momentum = 0;
                    document.getElementById("spin").style.visibility = "visible";
                    document.getElementById("add").style.visibility = "visible";
                    document.getElementById("resField").style.visibility = "visible";
                        for (var i = 0; i < deleteKeys.length; i++) {
                            deleteKeys[i].style.visibility = "visible";
                        }

                }

            }
        }


    } else {
        momentum = Math.random()+Math.random();
        spinIt();
    }
}
let drawCir = function(items) {
    sections = {};
    c.clearRect(0, 0, canvas.width, canvas.height);
    let start = 0;
    let section = (Math.PI * 2) / items;

    c.beginPath();

    for (var i = 0; i < items; i++) {

        c.beginPath();
        c.arc(canvas.width / 2, canvas.height / 2, 200, start, section * (i + 1), false);
        c.lineTo(canvas.width / 2, canvas.height / 2);

        newColor = getRandomColor();

        sections[i] = {
            arc: {
                start: start,
                section: section * (i + 1)
            },
            color: newColor,
            name: restaurants[i]
        };
        document.getElementsByTagName("LI")[i].style.color = newColor;
        c.fillStyle = sections[i].color;
        c.fill();
        c.closePath();
        start += section;
    }

    if (Object.keys(sections).length > 1) {
        document.getElementById("spin").style.visibility = "visible";

    }
    else{
        document.getElementById("spin").style.visibility = "hidden";

    }


};

let button = function(el){
    let but = document.createElement("BUTTON");
    but.innerHTML = "&#10006";
    let cls = document.createAttribute("class");
    cls.value = "deleteKey delete btn btn-sm btn-danger";
    but.setAttributeNode(cls);
    but.onclick = deleteRes;
    $(el).prepend(but);
};

let addRes = function() {
    if (document.getElementById('resField').value) {
        let res = document.getElementById('resField').value;
        restaurants.push(res);
        localStorage.setItem("restaurants", JSON.stringify(restaurants));
        let list = document.getElementById("restaurants");
        let listItem = document.createElement("LI");
        let textNode = document.createTextNode(res);
        listItem.appendChild(textNode);
        list.appendChild(listItem);
        button(listItem);
        console.log(sections);
        drawCir(restaurants.length);
        listItem.style.color = newColor;
        document.getElementById('resField').value = "";
    }
};

let start = function(){
    console.log("restaurants", restaurants);
        let list = document.getElementById("restaurants");
        
        for (var i = 0; i < restaurants.length; i++) {
            
        let listItem = document.createElement("LI");
        let textNode = document.createTextNode(restaurants[i]);
        listItem.appendChild(textNode);
        list.appendChild(listItem);
        button(listItem);
        listItem.style.color = newColor;   
        }
        drawCir(restaurants.length);
};

let deleteRes = function(){
    let deleteKeys = document.getElementsByClassName("deleteKey");
    // console.log(deleteKeys, this.parentNode);
    this.parentNode.parentNode.removeChild(this.parentNode);
    let content = this.parentNode.innerText.substr(1);
    // console.log(this.parentNode.innerText.substr(1));
    let idx = restaurants.indexOf(content);
    restaurants.splice(idx, 1);
    localStorage.setItem("restaurants", JSON.stringify(restaurants));
    drawCir(restaurants.length);
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
                // c.width = window.innerWidth;
                // c.height = window.innerHeight;
                drawCir(restaurants.length);
            }

document.getElementById("spin").addEventListener('click', spinIt, false);
document.getElementById("add").addEventListener('click', addRes, false);
window.addEventListener('resize', resizeCanvas, false);

window.onload = function(){

TweenLite.to("#title1", 0.75, {top: 0});
TweenLite.to("#title2", 0.75, {top: 0, delay: 0.75});
TweenLite.to("#title3", 0.75, {top: 0, delay: 1.5});
TweenLite.to("#sammy", 0.75, {top: 20, delay: 1.65, rotation:"1080"});
start();    
    
};

