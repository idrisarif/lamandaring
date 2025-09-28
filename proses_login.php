<?php
session_start();
include 'koneksi.php';

$email = $_POST['email'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE email='$email'";
$result = mysqli_query($koneksi, $query);
$data = mysqli_fetch_array($result);

if($data && password_verify($password, $data['password'])) {
    // Login berhasil, buat sesi
    $_SESSION['id'] = $data['id'];
    $_SESSION['nama'] = $data['nama'];
    $_SESSION['email'] = $data['email'];
    $_SESSION['role'] = $data['role'];

    // Cek role untuk redirect
    if($_SESSION['role'] == 'admin'){
        header("location:admin/index.php"); // Arahkan ke dashboard admin
    } else {
        header("location:user/index.php"); // Arahkan ke halaman user
    }
} else {
    header("location:login.php?pesan=gagal");
}
mysqli_close($koneksi);
?>