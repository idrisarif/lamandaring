<?php
session_start();
if(!isset($_SESSION['nama']) || $_SESSION['role'] != 'admin'){
    header("location:../login.php");
    exit();
}
include '../koneksi.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halaman Admin</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <div class="container">
        <h2>Halo, selamat datang <?php echo $_SESSION['nama']; ?>!</h2>
        <p>Anda memiliki akses sebagai administrator. Di sini Anda bisa mengelola data pengguna.</p>
        <a href="../logout.php">Logout</a>
        <hr>

        <h2>Manajemen Pengguna</h2>
        <a href="tambah.php" class="tambah-btn">Tambah Pengguna Baru</a>
        
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $no = 1;
                $query = mysqli_query($koneksi, "SELECT * FROM users");
                while($data = mysqli_fetch_array($query)){
                    echo "<tr>";
                    echo "<td>" . $no++ . "</td>";
                    echo "<td>" . $data['nama'] . "</td>";
                    echo "<td>" . $data['email'] . "</td>";
                    echo "<td>" . $data['role'] . "</td>";
                    echo "<td>";
                    echo "<a href='edit.php?id=" . $data['id'] . "'>Edit</a> | ";
                    echo "<a href='hapus.php?id=" . $data['id'] . "' onclick=\"return confirm('Yakin ingin menghapus data ini?')\">Hapus</a>";
                    echo "</td>";
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>