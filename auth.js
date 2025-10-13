// =========================================================================
// KONFIGURASI SUPABASE (LANGKAH 4.2.4.1)
// =========================================================================

// --- GANTI DENGAN KREDENSIAL PROYEK SUPABASE ANDA ---
const SUPABASE_URL = 'https://iwioqeqmljulcyiiuese.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aW9xZXFtbGp1bGN5aWl1ZXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTkxMTUsImV4cCI6MjA3NDY5NTExNX0.6MRxNgTtEldhHVKVMhM7kffH4qF-iPGYk2_xmULGBG8';

// Inisialisasi Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// =========================================================================

/**
 * Fungsi utilitas untuk menampilkan pesan notifikasi di halaman.
 */
function tampilkanNotifikasi(pesan, tipe) {
    const notifikasiDiv = document.getElementById('pesan-notifikasi');
    if (!notifikasiDiv) return;

    // Pastikan style.css sudah memiliki class alert-success dan alert-danger
    notifikasiDiv.innerHTML = `<p class="alert-message alert-${tipe}">${pesan}</p>`;
    setTimeout(() => {
        notifikasiDiv.innerHTML = '';
    }, 5000);
}

// ------------------------------------------------------------------------
// A. LOGIKA PENDAFTARAN (REGISTER) - Menggantikan proses_register.php
// ------------------------------------------------------------------------

const formRegister = document.getElementById('form-register');

if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 1. Daftar pengguna ke Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            tampilkanNotifikasi('Pendaftaran gagal: ' + error.message, 'danger');
        } else {
            // 2. Tambahkan data profile ke tabel 'pengguna' (role default: user)
            const { error: profileError } = await supabase
                .from('user')
                .insert([
                    { 
                        id: data.user.id, // Gunakan ID dari Supabase Auth
                        nama: nama, 
                        email: email, 
                        role: 'user' 
                    }
                ]);

            if (profileError) {
                tampilkanNotifikasi('Gagal menyimpan profil: ' + profileError.message, 'danger');
            } else {
                tampilkanNotifikasi('Pendaftaran berhasil! Silakan login.', 'success');
                // Alihkan ke halaman login setelah registrasi
                window.location.href = 'login.html'; 
            }
        }
    });
}

// ------------------------------------------------------------------------
// B. LOGIKA MASUK (LOGIN) - Menggantikan proses_login.php
// ------------------------------------------------------------------------

const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email: email, 
            password: password 
        });

        if (error) {
            tampilkanNotifikasi('Login gagal! Email atau password salah.', 'danger');
        } else {
            // Cek role pengguna dari tabel 'pengguna'
            const { data: userData, error: userError } = await supabase
                .from('user')
                .select('role')
                .eq('email', data.user.email)
                .single();

            if (userError || !userData) {
                // Jika data role tidak ditemukan, asumsikan sebagai user dan beri notif error
                window.location.href = 'user/index.html';
            } else {
                // Redirect berdasarkan role
                if (userData.role === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'user/index.html';
                }
            }
        }
    });
}

// ------------------------------------------------------------------------
// C. LOGIKA KELUAR (LOGOUT) - Menggantikan logout.php
// ------------------------------------------------------------------------

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        await supabase.auth.signOut();

        // Redirect ke halaman login setelah logout
        window.location.href = '../login.html'; 
    });
}

// ------------------------------------------------------------------------
// D. PENGECEKAN SESI DAN TAMPILAN DASHBOARD (Menggantikan if(!isset($_SESSION)))
// ------------------------------------------------------------------------

// Fungsi ini dijalankan saat halaman dashboard dimuat
window.addEventListener('load', async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Cek apakah pengguna sudah login
    if (!user) {
        // Jika belum login, redirect ke halaman login
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
            window.location.href = '../login.html';
            return;
        }
    }

    // 2. Jika login, ambil data profile (nama dan role)
    if (user) {
        const { data: userData, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error || !userData) {
            console.error('Gagal mengambil data pengguna:', error);
            await supabase.auth.signOut();
            window.location.href = '../login.html';
            return;
        }

        // 3. Tampilkan nama pengguna di dashboard
        const userNameElement = document.getElementById('user-nama');
        const adminNameElement = document.getElementById('admin-nama');

        if (userData.role === 'admin') {
            if (!window.location.pathname.includes('/admin/')) {
                // Mencegah user biasa mengakses halaman admin
                window.location.href = '../user/index.html'; 
                return;
            }
            if (adminNameElement) adminNameElement.textContent = userData.nama;
        } else {
            if (window.location.pathname.includes('/admin/')) {
                // Mencegah admin mengakses halaman user (opsional, bisa juga diarahkan ke dashboard admin)
                window.location.href = '../admin/index.html';
                return;
            }
            if (userNameElement) userNameElement.textContent = userData.nama;
        }
    }
});