//CANVAS VARIABLES
var c = document.getElementById("myCanvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

//GLOBAL VARIABLE DECLARATION
var hue=125;
var direction=1;
timer = ""
var count_date_obj = new Date(count_date)
var counter = 0
var ga = 0
var splash_img = new Image();
splash_img.src = "/assets/splash.png"



function calc_new_time() {
    var today_date_obj = new Date()
    
    var par = (count_date_obj.getTime() - today_date_obj.getTime()) / 1000
    d = ("0"+Math.floor(par/86400)).slice(-2);
    h = ("0"+Math.floor((par%86400)/3600)).slice(-2);
    m = ("0"+Math.floor((par%3600)/60)).slice(-2);
    s = ("0"+Math.floor(par%60)).slice(1)
    timer = "";
    timer += (par>86400?d+"D ":"");
    timer += (par>3600?h+"H ":"");
    timer += (par>60?m+"M ":"");
    timer += s+"S";
    counter = counter + 1
}

function clear_canvas() {
    ctx.fillStyle='black';
    ctx.fillRect(0,0,c.width,c.height);
}

function draw_timer() {
    ctx.lineWidth = "0";    
    ctx.font = "40px Fruktur";
    const metrics = ctx.measureText(timer);
    ctx.fillStyle = `rgba(60, 60, 60, 0.5)`;
    ctx.drawImage(splash_img, (c.width / 2) - (metrics.width + 100), c.height / 2 -275, (metrics.width + 100)*2, 500);
    ctx.fill()
    ctx.fillStyle='red';
    ctx.textAlign = "center"; 
    ctx.fillText("GameJam 2021 ends in:", c.width / 2, (c.height / 2) - 80); 
    ctx.fillStyle='hsl('+hue+',100%,50%)';
    ctx.textAlign = "center"
    ctx.font = "80px Squealer";
    ctx.fillText(timer, c.width / 2, c.height / 2); 
}

function createRainbowColor() {   
    hue+=direction*2;
    if(hue>254){direction*=-1;hue=255;}
    if(hue<1){direction*=-1;hue=0;}
}

draw_quotes = []
recieved_motto = {}
function draw_quote() {
    if(counter % 6 == 0) {
        if(draw_quotes.length > 6) {
            draw_quotes.pop()
        }
        $.ajax({                                      
            url: '/',              
            type: "post",          
            data: {
                "action" : "getRandomQuote"
            },
            success : function(data) {
                x = getRandomArbitrary(0, c.width)
                y = getRandomArbitrary(0, c.height)
                data.x = x
                data.y = y
                ctx.font = "20px Noto Sans";
                const metrics = ctx.measureText(data.motto + " - " + data.name);
                if(data.x + metrics.width > c.width) {
                    data.x = c.width - metrics.width
                }
                if(data.x - metrics.width < 0) {
                    data.x = c.width + metrics.width
                }
                if(data.y + metrics.height > c.height - 100) {
                    data.y = c.height - metrics.height -100
                }
                if(data.y - metrics.height < 0) {
                    data.y = c.height + metrics.height
                }
                draw_quotes.unshift(data)

                ga = 0
            }
        });
        counter = counter+1
    }
    for(i in draw_quotes) {
        if(i == 0) {
            ctx.fillStyle = `rgba(0, 255, 0, ${ga})`;
            ctx.font = "20px Noto Sans";
            ctx.textAlign = "end"; 
            ctx.fillText(draw_quotes[i].title, draw_quotes[i].x, draw_quotes[i].y); 
            ctx.fillStyle = `rgba(0, 0, 255, ${ga})`;
            ctx.textAlign = "right"; 
            ctx.fillText(draw_quotes[i].motto, draw_quotes[i].x, draw_quotes[i].y + 25); 
            ctx.fillStyle = `rgba(160, 200, 220, ${ga})`;
            ctx.textAlign = "left"; 
            ctx.fillText(" - " + draw_quotes[i].name, draw_quotes[i].x, draw_quotes[i].y + 25); 

        } else if (i == 6) {
            ctx.fillStyle = `rgba(0, 255, 0, ${1 - ga})`;
            ctx.font = "20px Noto Sans";
            ctx.textAlign = "end"; 
            ctx.fillText(draw_quotes[i].title, draw_quotes[i].x, draw_quotes[i].y); 
            ctx.fillStyle = `rgba(0, 0, 255, ${1 - ga})`;
            ctx.textAlign = "right"; 
            ctx.fillText(draw_quotes[i].motto, draw_quotes[i].x, draw_quotes[i].y + 25); 
            ctx.fillStyle = `rgba(160, 200, 220, ${1 - ga})`;
            ctx.textAlign = "left"; 
            ctx.fillText(" - " + draw_quotes[i].name, draw_quotes[i].x, draw_quotes[i].y + 25);  

        } else {
            ctx.fillStyle='green';
            ctx.font = "20px Noto Sans";
            ctx.textAlign = "end"; 
            ctx.fillText(draw_quotes[i].title, draw_quotes[i].x, draw_quotes[i].y); 
            ctx.fillStyle='blue';
            ctx.textAlign = "right"; 
            ctx.fillText(draw_quotes[i].motto, draw_quotes[i].x, draw_quotes[i].y + 25); 
            ctx.fillStyle = `rgb(160, 200, 220)`;
            ctx.textAlign = "left"; 
            ctx.fillText(" - " + draw_quotes[i].name, draw_quotes[i].x, draw_quotes[i].y + 25); 
        }
        if(ga + 0.1 < 1) ga = ga + 0.05
    }
}

function draw() {
    clear_canvas()
    draw_quote()
    createRainbowColor()
    draw_timer()
}


calc_new_time()
draw()
window.setInterval(draw, 100);
window.setInterval(calc_new_time, 1000);



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  