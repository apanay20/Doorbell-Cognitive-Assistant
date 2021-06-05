<?php
  	header('Access-Control-Allow-Origin: *');

  	$dir    = './faces';
	$allFiles = scandir($dir);
	$files = array_diff($allFiles, array('.', '..'));
	echo json_encode($files);
?>