/*
* ImgAscii.js - Romain Arnaud 2016
* Beerware License
* https://github.com/Rominou34
*/

var canvas, ctx, img, result, detail, int, prog;
/*
* This array contains the characters we'll display
* The ones at the beginning are darker ( if you group a lot of them it will look
* like a dark zone ) while the ones at the end are brighter
* We pick them based on the average lightness of each group of pixels
*/
var char = ["@","#","&","6","M","€","E","$","%","K","2","g","=","+","y","m","n","o","u","°",";","*",
":","\'","-",".","\u2002"];

/*
* The function launching the program
*/
var launch = function() {
  result = document.querySelector("#result");
  result.innerHTML = "Image is loading...";
  prog = document.querySelector("#progress div");
  img = new Image;
  img.src = URL.createObjectURL(document.querySelector("#myFile").files[0]);
  img.onload = function() {
    result.innerHTML = "";
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    if(document.querySelector("#choice").checked) {
      convert(true);
    } else {
      convert(false);
    }
  }
}

/*
* The function taking data from the canvas and converting it into ASCII
*/
var convert = function(color) {
  // The quality defines the number of blocks ( more blocks => bigger result )
  var quality = (1000*parseInt(document.querySelector("#quality").value));
  // The detail defines the number of pixels per block ( one block = one character )
  detail = Math.round(Math.sqrt((img.height*img.width)/quality));
  var pix, g=0, t=0, text="", y=0, r=0, v=0, b=0, a=0;

  // We use a setInterval so the loop doesn't freeze the browser and block the DOM
  // With a normal loop the progress bar doesn't work
  int = setInterval(function() {
    for(var x=0; x < img.width-detail; x+=detail) {
        pix = ctx.getImageData(x, y, detail, detail).data;

        g=0;
        t=0;
        r=0;
        v=0;
        b=0;
        a=0;
        for (var i = 0, n = pix.length; i < n; i += 4) {
          r += pix[i];
          v += pix[i+1];
          b += pix[i+2];
          a += pix[i+3];
          g += (pix[i] + pix[i+1] + pix[i+2])/3;
          t++;
        }
        r=Math.round(r/t);
        v=Math.round(v/t);
        b=Math.round(b/t);
        a=((a/t)/255);
        if(color) {
          text += '<span style="color: rgba('+r+','+v+','+b+','+a+')">';
        }

        text+=char[Math.round((g/t)/10)];

        if(color) {
          text += '</span>';
        }
    }
    text+="<br/>";
    y+=detail;
    prog.style.width = Math.ceil((y/img.height)*100) + "%";
    if(y>=img.height-detail) {
      result.innerHTML = text;
      clearInterval(int);
    }
  }, 1);
}
