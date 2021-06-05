<?php
	header('Access-Control-Allow-Origin: *');
	
	$name = $_POST["name"];
	$path = "faces/".$name;

	//Delete photograph from folder "faces"
	if (!unlink($path))
	{
	    echo "You have an error!";
	}
	else
	{
	    echo("You have succesfully deleted your photo!"); 
	}

?>