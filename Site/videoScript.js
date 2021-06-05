const video = document.getElementById('video');

var flag = true;

Promise.all([
  	faceapi.nets.tinyFaceDetector.loadFromUri(domain+'/models'),
  	faceapi.nets.faceLandmark68Net.loadFromUri(domain+'/models'),
  	faceapi.nets.faceRecognitionNet.loadFromUri(domain+'/models'),
  	faceapi.nets.faceExpressionNet.loadFromUri(domain+'/models'),
  	faceapi.nets.ssdMobilenetv1.loadFromUri(domain+'/models')
]).then(fetchLabels)

var labels = []

async function fetchLabels(){
  $.ajax({
    type: "GET",
    url: domain + '/getImageNames.php',
    success: function(data){
      	var tempData = JSON.parse(data);
      	for (var key in tempData) {
        	labels.push(tempData[key])
      	}
      	document.getElementById("startBtn").disabled = false;
    }
  });
}

function loadLabeledImages() {
  	var ret = Promise.all(
	    labels.map(async label => {
	      	const descriptions = []
	      	var img = new Image();
	      	img.setAttribute('crossOrigin', '');
	      	img.src = domain+`faces/${label}`;      
	      	const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
	      	descriptions.push(detections.descriptor)
	      	return new faceapi.LabeledFaceDescriptors(label, descriptions)
	    })
  	)
  	return ret;
}

async function startVideo() {
  	const labeledFaceDescriptors = await loadLabeledImages()
  	const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  	try {
	  	navigator.mediaDevices.getUserMedia({ video: true })
	    .then(function (stream) {
	        video.srcObject = stream;

	        video.addEventListener('play', () => {
	        	document.getElementById('videoTitle').innerHTML = "";
	          	const canvas = faceapi.createCanvasFromMedia(video)
	          	document.body.append(canvas)
	          	const displaySize = { width: video.width, height: video.height }
	          	faceapi.matchDimensions(canvas, displaySize)

	          	setInterval(async () => {
	          		if (flag) {
		            	const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		            	const resizedDetections = faceapi.resizeResults(detections, displaySize);
		            	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

			            var results;
			            if (detections) {
				            const canvas = document.createElement('canvas');
				            canvas.width = video.videoWidth;
				            canvas.height = video.videoHeight;
				            canvas.getContext('2d').drawImage(video, 0, 0);
				            // Other browsers will fall back to image/png
				            const img = await faceapi.fetchImage(canvas.toDataURL('image/webp'));
				            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withFaceExpressions();
				            const displaySize = { width: canvas.width, height: canvas.height }
				            if (detections !== undefined){
					            const resizedDetections = faceapi.resizeResults(detections, displaySize);
					            results = faceMatcher.findBestMatch(resizedDetections.descriptor)
					            var parameters = ""
					            if(results.label !== "unknown"){
					            	var nameTemp = results.label.split('.')[0];
					              	document.getElementById("name").innerHTML = nameTemp;
					              	if (nameTemp.toLowerCase() === 'mailman')
					              		parameters += "&mailman=1";
					              	else	
					              		parameters += "&known_guest=" + nameTemp;
					            }else{
					            	document.getElementById("name").innerHTML = "UNKNOWN PERSON";
					            	var nameTemp = "unknown";
					            }
					            try {
					            	if (nameTemp.toLowerCase() !== 'mailman'){
						              	if(detections.expressions.angry >= 0.4){
											document.getElementById("negative").innerHTML = "Yes";
											parameters += "&negative_emotion=1";
										}else
											document.getElementById("negative").innerHTML = "No";
										if(detections.expressions.sad >= 0.3){
											document.getElementById("sad").innerHTML = "Yes";
											parameters += "&agitation_emotion=1";
										}else
											document.getElementById("sad").innerHTML = "No";
									}
			              		}
					            catch(err) {
					            	console.log(err);
					              	document.getElementById("negative").innerHTML = "-";
					                document.getElementById("sad").innerHTML = "-";
					            }
					            requestGorgias(parameters);
					            flag = false;
					            document.getElementById("continueBtn").style.display = "block";
				            }
				            else{
				                document.getElementById("name").innerHTML = "NONE";
				                document.getElementById("negative").innerHTML = "-";
				                document.getElementById("sad").innerHTML = "-";
				            }
			            }
			        }
	          	}, 2000)
	        })        
	    })
	    .catch(function (error) {
	        console.log("Something went wrong!");
	    });
  	}catch(err){
  		document.getElementById('videoTitle').innerHTML = "Camera Unavailable!";
  		document.getElementById('videoTitle').setAttribute("style","color: #ff4700;");
  	}
}

function continueDetection() {
   flag = true;
   document.getElementById("continueBtn").style.display = "none";
   document.getElementById("continueBtn").disabled = true;
   document.getElementById("explanation").value = "Explanation";
   document.getElementById("ring").innerHTML = "NO";
   document.getElementById("notifyText").innerHTML = "NO";
   document.getElementById("messageText").innerHTML = "HIDE";
   document.getElementById("bellOn").style.display = "none";
   document.getElementById("bellOff").style.display = "inline-block";
}

function startAssistant(ele){
	document.getElementById("assistantCont").style.display = "block";
	ele.style.display = "none";
	startVideo();
}