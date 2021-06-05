<?php
	header('Content-Type: application/json');
	function addFacts($fileName){
		$fp = fopen($fileName, "a");
		fwrite($fp, "\n%Facts");
		$addedFacts = array();
		if (isset($_GET["user_busy"])) {
        	fwrite($fp, "\nuser_busy.");
			array_push($addedFacts, "user_busy.");
        }
		if (isset($_GET["user_meeting"])) {
        	fwrite($fp, "\nuser_meeting.");
			array_push($addedFacts, "user_meeting.");
        }
		if (isset($_GET["rec_message"])) {
        	fwrite($fp, "\nrec_message.");
			array_push($addedFacts, "rec_message.");
        }
		if (isset($_GET["known_guest"])) {
        	$guest = $_GET["known_guest"];
        	fwrite($fp, "\nknown_guest('".$guest."').");
			array_push($addedFacts, "known_guest('".$guest."').");
        }
		if (isset($_GET["negative_emotion"])) {
        	fwrite($fp, "\nnegative_emotion.");
			array_push($addedFacts, "negative_emotion.");
        }
		if (isset($_GET["agitation_emotion"])) {
        	fwrite($fp, "\nagitation_emotion.");
			array_push($addedFacts, "agitation_emotion.");
        }
		if (isset($_GET["mailman"])) {
        	fwrite($fp, "\nmailman.");
			array_push($addedFacts, "mailman.");
        }
        if (isset($_GET["notify"])) {
        	fwrite($fp, "\nnotify.");
			array_push($addedFacts, "notify.");
        }
		fclose($fp); 
		return $addedFacts;
	}

	function removeFacts($fileName, $addedFacts){
		$txt = "";
		if ($file = fopen($fileName, "r")) {
		    while(!feof($file)) {
		        $line = fgets($file);
		        if(strpos($line, "Facts") !== false){
		        	break;
		        }else
		        	$txt .= $line;
		    }
		    fclose($file);
		}
		file_put_contents($fileName, rtrim($txt)); 
	}

	function removeDuplicates($result){
		$lines = explode("\n", $result);
		$uniqueLines = array_unique($lines);
		return implode(' ',$uniqueLines);
	}

	function createObj($txt){
		$obj = new stdClass();
		$obj->text = $txt;
		if(strpos($txt, "notified") !== false)
		    $obj->notify = "true";
		else
			$obj->notify = "false";
		if(strpos($txt, "ringing") !== false)
		    $obj->ring = "true";
		else
			$obj->ring = "false";
		if(strpos($txt, "message") !== false)
		    $obj->message = "true";
		else
			$obj->message = "false";
		return $obj;
	}

	if(strcasecmp($_SERVER['REQUEST_METHOD'], 'GET') == 0){
		$gorgiasFile = './DoorBellGorgias.pl';
		$added = addFacts($gorgiasFile);
		$command = "java -jar ExecuteGorgiasMine.jar " . $gorgiasFile . " " . sizeof($added);
		$output = shell_exec(escapeshellcmd($command));
		removeFacts($gorgiasFile, $added);
		$export = removeDuplicates($output);
		echo json_encode(createObj($export));
	}
?>