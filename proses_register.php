<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$email = $_POST['email'];
$password = $_POST['password'];

// Hashing password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$role = 'user'; // Default role untuk pengguna baru

// Menggunakan prepared statement untuk keamanan
$stmt = $koneksi->prepare("INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nama, $email, $hashed_password, $role);

if ($stmt->execute()) {
    header("location:login.php?pesan=registrasi_berhasil");
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
mysqli_close($koneksi);
?>