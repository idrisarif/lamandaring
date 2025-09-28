<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
    <h2>Login</h2>
    <?php 
    if(isset($_GET['pesan'])){
        if($_GET['pesan'] == 'gagal'){
            echo "<p class='alert-message alert-danger'>Login gagal! Email atau password salah.</p>";
        } else if($_GET['pesan'] == 'registrasi_berhasil'){
            echo "<p class='alert-message alert-success'>Registrasi berhasil! Silakan login.</p>";
        }
    }
    ?>
    <form action="proses_login.php" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            
            <button type="submit">Login</button>
        </form>
    <p>Belum punya akun? <a href="register.php">Daftar di sini</a>.</p>
</div>
</body>
</html>