<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'admin'){
    header("location:../login.php");
    exit();
}
include '../koneksi.php';

$id = $_POST['id'];
$nama = $_POST['nama'];
$email = $_POST['email'];
$role = $_POST['role'];
$password = $_POST['password'];

if (empty($password)) {
    $stmt = $koneksi->prepare("UPDATE users SET nama=?, email=?, role=? WHERE id=?");
    $stmt->bind_param("sssi", $nama, $email, $role, $id);
} else {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $koneksi->prepare("UPDATE users SET nama=?, email=?, password=?, role=? WHERE id=?");
    $stmt->bind_param("ssssi", $nama, $email, $hashed_password, $role, $id);
}

if ($stmt->execute()) {
    header("location:index.php?pesan=update_berhasil");
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
mysqli_close($koneksi);
?>