<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'admin'){
    header("location:../login.php");
    exit();
}
include '../koneksi.php';

$id = $_GET['id'];

$query = "DELETE FROM users WHERE id='$id'";

if (mysqli_query($koneksi, $query)) {
    header("location:index.php?pesan=hapus_berhasil");
} else {
    echo "Error: " . mysqli_error($koneksi);
}

mysqli_close($koneksi);
?>