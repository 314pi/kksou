window.onload = prepareLinks;

//var urlbase = 'http://127.0.0.1/ajax/test2/';
var urlbase = 'https://www.kksou.com/php-gtk2/util/ajax/';
//var urlbase = '/php-gtk2/util/ajax/';
var progressbar_gif = '6.gif';
var check_status = new Array();
check_status[0] = urlbase + 'check_download_status.php?j='+j10+'&id=0';
check_status[1] = urlbase + 'check_download_status.php?j='+j15+'&id=1';
var timeout_id = new Array();
var status = new Array();

function prepareLinks() {
  if (!document.getElementById || !document.getElementsByTagName) {
    return;
  }
  if (!document.getElementById("links")) {
    return;
  }
  var list = document.getElementById("links");
  var links = list.getElementsByTagName("a");

  var progressbar1 = new Image(150, 13);
  progressbar1.src = urlbase + progressbar_gif;
  //progressbar1.src="http://127.0.0.1/ajax/test2/6.gif";
  //progressbar1.src="http://www.kksou.com/php-gtk2/util/ajax/6.gif";

  links[0].onclick = function() {
  	  status[0] = 0;
      displayLoading(document.getElementById('link0'));
 	  grabFile_base(check_status[0], 0);
 	  var query = this.getAttribute("href").split("?")[1];
      download_file(query, 0);
      return false;
  };

  links[1].onclick = function() {
  	  status[1] = 0;
      displayLoading(document.getElementById('link1'));
      grabFile_base(check_status[1], 1);
      var query = this.getAttribute("href").split("?")[1];
      download_file(query, 1);
      return false;
  };

}

function download_file(query, id) {
	var url = "/php-gtk2/products/download_product.php?"+query;
	//var url = "http://www.kksou.com/php-gtk2/products/download_product.php?"+query;
    win = window.open(url, 'download'+id, 'width=200,height=100,resizable=no');
	if (!win.opener)
    	win.opener = self;
}

function grabFile_base(file, id) {
	if (timeout_id[id]) {
		clearTimeout(timeout_id[id]);
	}
	grabFile(file);
	var repeat = function() {
		grabFile_base(file, id)
	};
	if (!status[id])
	  timeout_id[id] = setTimeout(repeat,1000);
}

function grabFile(file) {
  var request = getHTTPObject();
  if (request) {
    //displayLoading(document.getElementById("progress"));
    request.onreadystatechange = function() {
      parseResponse(request, file);
    };
    request.open("GET", file, true);
    request.send(null);
    return true;
  } else {
    return false;
  }
}

function parseResponse(request, file) {
  if (request.readyState == 4) {
    if (request.status == 200 || request.status == 304) {
      //alert("t1 = "+request.responseText);
      //var details = document.getElementById("status123");
      //details.innerHTML = request.responseText;
      var myRegExp = /done/;
      var string1 = request.responseText;
      var matchPos1 = string1.search(myRegExp);
      if(matchPos1 != -1) {
      	status[id] = 1;
      	var id = string1.substring(0,1);
      	var filename = string1.substring(8);
       	//alert('done!'+status[0]+' (id='+id+')');
     	//replace_html('link'+id, 'file downloaded');
     	replace_html('link'+id, filename+' downloaded');
     	clearTimeout(timeout_id[id]);
      	//clearTimeout(file.fade);
      }
      var v_link = document.getElementById('link'+id);
      //fadeUp(link0,255,255,153);
      fadeUp(v_link,255,255,153);
    }
  }
}

function getHTTPObject() {
  var xhr = false;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch(e) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch(e) {
        xhr = false;
      }
    }
  }
  return xhr;
}

function displayLoading(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
  var image = document.createElement("img");
  image.setAttribute("src", urlbase + progressbar_gif);
  //image.setAttribute("src","http://127.0.0.1/ajax/test2/6.gif");
  //image.setAttribute("src","http://www.kksou.com/php-gtk2/util/ajax/6.gif");
  image.setAttribute("alt","Loading...");
  element.appendChild(image);
}

function fadeUp(element,red,green,blue) {
  if (element.fade) {
    clearTimeout(element.fade);
  }
  element.style.backgroundColor = "rgb("+red+","+green+","+blue+")";
   if (red == 255 && green == 255 && blue == 255) {
    return;
  }
  var newred = red + Math.ceil((255 - red)/10);
  var newgreen = green + Math.ceil((255 - green)/10);
  var newblue = blue + Math.ceil((255 - blue)/10);
  var repeat = function() {
    fadeUp(element,newred,newgreen,newblue)
  };
  element.fade = setTimeout(repeat,100);
}

function replace_html(id, content) {
	document.getElementById(id).innerHTML = content;
	fadeUp(document.getElementById(id), 255, 255, 153);
}
