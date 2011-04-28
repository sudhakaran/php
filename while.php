<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<form id="form1" name="form1" method="post" action="">
  <label>
  <select name="select" id="select">
    <option value="-select-">-select-</option>
    <?php  
	for($i=1; $i<=10; $i++) { ?>
    <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
    <?php } ?>
  </select>
  </label>
</form>

</body>
</html>
