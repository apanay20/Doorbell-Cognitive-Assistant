var flag = true;

function requestGorgias(videoParam){
	var parameters = getWorld() + videoParam;
	parameters = parameters.replace('&','?');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	  	if (xhr.readyState !== 4) return;
	   	if (xhr.status >= 200 && xhr.status < 300) {
	       	var res = JSON.parse(xhr.responseText);
	       	document.getElementById('explanation').value = 'Explanation:\n' + res.text;
	       	if(res.ring === "true"){
	       		document.getElementById("ring").innerHTML = "YES";
	       		document.getElementById("bellOn").style.display = "inline-block";
	       		document.getElementById("bellOff").style.display = "none";
	       	}
	       	else{
	       		document.getElementById("ring").innerHTML = "NO";
	       	    document.getElementById("bellOn").style.display = "none";
	       		document.getElementById("bellOff").style.display = "inline-block";
	       	}
	       	if(res.notify === "true")
	       		document.getElementById("notifyText").innerHTML = "YES";
	       	else
	       		document.getElementById("notifyText").innerHTML = "NO";
	       	if(res.message === "true")
	       		document.getElementById("messageText").innerHTML = "SHOW";
	       	else
	       		document.getElementById("messageText").innerHTML = "HIDE";
		   	document.getElementById('continueBtn').disabled = false;
	   	}
	}
	xhr.open('GET', domain + 'Gorgias/gorgiasAPI.php' + parameters);
  	xhr.send();
}

function getWorld(){
	var str = "";
	if($('#busy').prop("checked") == true)
		str += "&user_busy=1";
	if($('#meeting').prop("checked") == true)
		str += "&user_meeting=1";
	if($('#rec_message').prop("checked") == true)
		str += "&rec_message=1";
	if($('#notify').prop("checked") == true)
		str += "&notify=1";
	return str;
}