var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


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
    return color;

};

let restaurants = [];
let sections = {};
let position = 0;
let momentum = 0;
//0.113 = one full rotation

let moving = false;

let spinIt = function() {
    document.getElementById("resField").style.display = "none";
    document.getElementById("add").style.display = "none";
    document.getElementById("spin").style.display = "none";
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
                    document.getElementById("spin").style.display = "initial";
                    document.getElementById("add").style.display = "initial";
                    document.getElementById("resField").style.display = "initial";

                }

            }
        }


    } else {
        momentum = Math.random();
        spinIt();
    }
}
let drawCir = function(items) {
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
        document.getElementById("spin").style.display = "initial";

    }


};

let addRes = function() {
    if (document.getElementById('resField').value) {
        let res = document.getElementById('resField').value;
        restaurants.push(res);
        let list = document.getElementById("restaurants");
        let listItem = document.createElement("LI");
        let textNode = document.createTextNode(res);
        listItem.appendChild(textNode);
        list.appendChild(listItem);
        console.log(sections);
        drawCir(restaurants.length)
        listItem.style.color = newColor;
        document.getElementById('resField').value = "";
    }
}



document.getElementById("spin").addEventListener('click', spinIt, false);

document.getElementById("add").addEventListener('click', addRes, false);


window.onload = function(){

TweenLite.to("#title1", 0.75, {top: 0});
TweenLite.to("#title2", 0.75, {top: 0, delay: 0.75});
TweenLite.to("#title3", 0.75, {top: 0, delay: 1.5});
TweenLite.to("#sammy", 0.75, {top: 20, delay: 1.65, rotation:"1080"});    
    
};

