<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'user'){
    header("location:../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halaman Pengguna</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="container">
        <h2>Halo, selamat datang <?php echo $_SESSION['nama']; ?>!</h2>
        <p>Ini adalah halaman khusus untuk Anda sebagai pengguna biasa.</p>
        <a href="../logout.php">Logout</a>
    </div>
</body>
</html>