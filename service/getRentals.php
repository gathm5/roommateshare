<?php
class Rental {
    public $name;
    public $price;
    public $avail_date;
    public $desc;
    public $img_link;
}
class Rentals {
    public $rentals;
}
$val1 = new Rental();
$val1->name = "Sunnyvale";
$val1->price = "$1580";
$val1->avail_date = "08/03/2013";
$val1->desc = "Wonderful apartment with full washer drier";
$val1->img_link = "/user/rentals/room1.jpg";

$val2 = new Rental();
$val2->name = "San Francisco";
$val2->price = "$2450";
$val2->avail_date = "09/04/2013";
$val2->desc = "Closer to Bart Station";
$val2->img_link = "/user/rentals/room2.jpg";

$val3 = new Rental();
$val3->name = "Mountain View";
$val3->price = "$1980";
$val3->avail_date = "08/16/2013";
$val3->desc = "Safeway Closeby..";
$val3->img_link = "/user/rentals/room3.jpg";

$val4 = new Rental();
$val4->name = "El Camino Real";
$val4->price = "$1770";
$val4->avail_date = "08/11/2013";
$val4->desc = "Shopping malls and groceries closer..";
$val4->img_link = "/user/rentals/room4.jpg";

$val5 = new Rental();
$val5->name = "lake county";
$val5->price = "$500";
$val5->avail_date = "08/03/2013";
$val5->desc = "share 3 bd 2bath house with single male $500 a month utilities included...";
$val5->img_link = "/user/rentals/room5.jpg";

$val6 = new Rental();
$val6->name = "san jose north";
$val6->price = "$600";
$val6->avail_date = "09/15/2013";
$val6->desc = " Now for one person, I'm looking for a SINGLE person who is quiet, respectful, well behave and considerate. Drama free is a must and this is not a party house! An ideal candidate should be a working professional or a student";
$val6->img_link = "/user/rentals/room6.jpg";

$val7 = new Rental();
$val7->name = "santa cruz";
$val7->price = "$510";
$val7->avail_date = "08/03/2013";
$val7->desc = "Close to UCSC/ Available now";
$val7->img_link = "/user/rentals/room7.jpg";

$data = array($val1, $val2, $val3, $val4, $val5, $val6, $val7);
$rentals = new Rentals();
$rentals->rentals = $data;
header('Content-Type: application/json');
echo json_encode($rentals);
?>