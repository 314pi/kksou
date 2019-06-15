/**
* kksouWeather module
* This module allows you to add the Google Weather in a module position.
* Author: kksou
* Copyright (C) 2006-2009. kksou.com. All Rights Reserved
* Website: http://www.kksou.com/php-gtk2
* v1.5 October 11, 2009
*/

//window.onload = prepareForm;

function gw_prepareForm(mod_id) {
	if(!document.getElementById) {
		return;
	}
	if(!document.getElementById("WeatherForm"+mod_id)) {
		return;
	}
	document.getElementById("WeatherForm"+mod_id).onsubmit = function() {
		return gw_submitform(mod_id, 0);
	};
}

function gw_submitform(mod_id, go) {
	var form = document.getElementById("WeatherForm"+mod_id)
	var data = "";
	for (var i=0; i<form.elements.length; i++) {
		if (go!=1 && form.elements[i].name=='gw_a' && form.elements[i].value=='') {
			return false;
		}
		data+= form.elements[i].name;
		data+= "=";
		if (form.elements[i].name=='gw_a' && go==1) {
			//alert('bp102. loc = '+eval('default_location'+mod_id));
			if ( gw_Get_Cookie( 'gw_last_city'+mod_id ) ) {
				//alert( 'bp202 last_city = '+gw_Get_Cookie('gw_last_city'));
				//alert( 'bp202 last_city = '+gw_Get_Cookie('gw_last_city'+mod_id));
				//data+= escape(gw_Get_Cookie('gw_last_city'));
				data+= escape(gw_Get_Cookie('gw_last_city'+mod_id));
			} else {
				data+= escape(eval('default_location'+mod_id));
			}
			go = 0;
		} else {
			if (form.elements[i].name=='gw_a') {
				//alert ('bp201 last_city = '+form.elements[i].value);
				//gw_Set_Cookie( 'gw_last_city', form.elements[i].value, '', '/', '', '' );
				gw_Set_Cookie( 'gw_last_city'+mod_id, form.elements[i].value, '90', '/', '', '' );
			}
			data+= escape(form.elements[i].value);
		}
		data+= "&";
	}
	data+= "process=1";
	var unit = document.getElementById('temp_unit'+mod_id).value;
	if (unit=='US') data+= "&toF=1";
	else if (unit=='SI') data+= "&toC=1";
	return !gw_sendData(mod_id, data);
}

function gw_toF(mod_id) {
	var a = document.getElementById('str_gw_a_org'+mod_id).value;
	document.getElementById('temp_unit'+mod_id).value = 'US';
	gw_sendData(mod_id, 'process=1&toF=1&gw_a='+escape(a));
}

function gw_toC(mod_id) {
	var a = document.getElementById('str_gw_a_org'+mod_id).value;
	document.getElementById('temp_unit'+mod_id).value = 'SI';
	gw_sendData(mod_id, 'process=1&toC=1&gw_a='+escape(a));
}

function gw_sendData(mod_id, data) {
	var request = gw_getHTTPObject();
	if (request) {
		gw_displayLoading(mod_id, document.getElementById("gw_loading"+mod_id));
		request.onreadystatechange = function() {
			gw_parseResponse(request, mod_id);
		};
		url = eval('gw_lib_url'+mod_id)+"?"+data
		+"&joomla_root="+escape(eval('joomla_root'+mod_id))
		+"&label_city="+eval('label_city'+mod_id)
		+"&popup_city="+escape(eval('popup_city'+mod_id))
		+"&popup_deg_F="+escape(eval('popup_deg_F'+mod_id))
		+"&popup_deg_C="+escape(eval('popup_deg_C'+mod_id))
		+"&size_city="+eval('size_city'+mod_id)
		+"&hide_input="+eval('hide_input'+mod_id)
		+"&hide_humidity="+eval('hide_humidity'+mod_id)
		+"&hide_wind="+eval('hide_wind'+mod_id)
		+"&hide_forecast="+eval('hide_forecast'+mod_id)
		+"&lang="+eval('lang'+mod_id)
		+"&request_interval="+eval('request_interval'+mod_id)
		+"&mod_id="+mod_id
		+"&googleweather_unit="+eval('googleweather_unit'+mod_id)
		+"&use_curl="+eval('googleweather_use_curl'+mod_id)
		+"&api_key="+eval('api_key'+mod_id)
		+"&label_humidity="+eval('label_humidity'+mod_id)
		+"&default_country="+escape(eval('default_country'+mod_id))
		+"&default_location="+escape(eval('default_location'+mod_id))
		+"&refresh_time="+eval('refresh_time'+mod_id)
		+"&admin_mode="+eval('admin_mode'+mod_id)
		+"&joomla_ver="+eval('joomla_ver'+mod_id);
		//+"&label_city="+escape(eval('label_city'+mod_id))
		//+"&label_humidity="+escape(eval('label_humidity'+mod_id))

		request.open( "GET", url, true );
		request.send(null);
		return true;
	} else {
		return false;
	}
}

function gw_parseResponse(request, mod_id) {
	if (request.readyState == 4) {
		//if (request.status == 200 || request.status == 304 || (request.status == 500 && request.responseText.length > 0) ) {
		//if (request.status == 500) alert('status = 500!!!');
		if (request.status == 200 || request.status == 304) {
			//alert('status = '+request.status);
			//if (request.status == 500) alert('status = 500!!!');
			var container = document.getElementById("googleWeather_container"+mod_id);
			container.innerHTML = request.responseText;
			var myRegExp = /No such city/;
			var str = request.responseText;
			var matchPos1 = str.search(myRegExp);
			var a = document.getElementById('str_gw_a'+mod_id);
			var set_focus = eval('focus_on_city'+mod_id);
			if (set_focus==1) {
				if(a.type!='hidden') {
					if(matchPos1 == -1) {
						a.value = '';
						a.focus();
					} else {
						a.focus();
						a.select();
					}
				}
			}
			//fadeUpErrors(container);
			gw_prepareForm(mod_id);
		}
	}
}

function gw_getHTTPObject() {
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

function gw_displayLoading(mod_id, element) {
	if (element==null) return;
	var image = document.createElement("img");
	//image.setAttribute("src","progressbar.gif");
	image.setAttribute("src", eval('gw_progress_gif'+mod_id));
	image.setAttribute("alt","Loading...");
	//image.setAttribute("align","middle");
	element.appendChild(image);
}

// from http://techpatterns.com/downloads/javascript_cookies.php
function gw_Set_Cookie( name, value, expires, path, domain, secure )
{
// set time, it's in milliseconds
var today = new Date();
today.setTime( today.getTime() );

/*
if the expires variable is set, make the correct
expires time, the current script below will set
it for x number of days, to make it for hours,
delete * 24, for minutes, delete * 60 * 24
*/
if ( expires )
{
expires = expires * 1000 * 60 * 60 * 24;
}
var expires_date = new Date( today.getTime() + (expires) );

document.cookie = name + "=" +escape( value ) +
( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
( ( path ) ? ";path=" + path : "" ) +
( ( domain ) ? ";domain=" + domain : "" ) +
( ( secure ) ? ";secure" : "" );
}

// this fixes an issue with the old method, ambiguous values
// with this test document.cookie.indexOf( name + "=" );
function gw_Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );


		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}
