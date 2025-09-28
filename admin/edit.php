<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'admin'){
    header("location:../login.php");
    exit();
}
include '../koneksi.php';

$id = $_GET['id'];
$query = mysqli_query($koneksi, "SELECT * FROM users WHERE id='$id'");
$data = mysqli_fetch_array($query);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Pengguna</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="container">
        <h2>Edit Data Pengguna</h2>
        <form action="update_aksi.php" method="POST">
            <input type="hidden" name="id" value="<?php echo $data['id']; ?>">
            
            <label for="nama">Nama:</label>
            <input type="text" id="nama" name="nama" value="<?php echo $data['nama']; ?>" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<?php echo $data['email']; ?>" required>

            <label for="role">Hak Akses (Role):</label>
            <select id="role" name="role" required>
                <option value="user" <?php echo ($data['role'] == 'user') ? 'selected' : ''; ?>>User</option>
                <option value="admin" <?php echo ($data['role'] == 'admin') ? 'selected' : ''; ?>>Admin</option>
            </select>
            
            <p>Kosongkan password jika tidak ingin mengubahnya.</p>
            <label for="password">Password (Opsional):</label>
            <input type="password" id="password" name="password">
            
            <button type="submit">Update</button>
        </form>
        <p><a href="index.php">Kembali ke halaman utama</a></p>
    </div>
</body>
</html>