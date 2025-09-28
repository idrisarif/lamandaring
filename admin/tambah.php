<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'admin'){
    header("location:../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Tambah Pengguna Baru</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="container">
        <h2>Tambah Pengguna Baru</h2>
        <form action="tambah_aksi.php" method="POST">
            <label for="nama">Nama:</label>
            <input type="text" id="nama" name="nama" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <label for="role">Hak Akses (Role):</label>
            <select id="role" name="role" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            
            <button type="submit">Simpan</button>
        </form>
        <p><a href="index.php">Kembali ke halaman utama</a></p>
    </div>
</body>
</html>