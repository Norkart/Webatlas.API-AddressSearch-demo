<pre>

<?php
/**
* Eksempel på bruken av tjenesten via PHP. Typisk for server-server eller proxy.
*/
$ch = curl_init("http://www.webatlas.no/WAAPI-AddressSearch/simpleLookup/?format=json&query=Trondheimsveien");

//Token må endres til kunde/tjenestespesifikk token. Den får du ved å kontakte Norkart AS (norkart.no)
$header  = array(
	"X-WAAPI-TOKEN"=>"575589FB-8546-4AFD-A499-A50CB85345E3",
);
 
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

curl_setopt($ch, CURLOPT_HEADER, 0);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

curl_close($ch);

var_dump($result);
?>
