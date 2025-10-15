// auth.js

// Pastikan Anda sudah menyertakan tag script Supabase CDN di semua file HTML yang memanggil file ini!
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://iwioqeqmljulcyiiuese.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aW9xZXFtbGp1bGN5aWl1ZXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTkxMTUsImV4cCI6MjA3NDY5NTExNX0.6MRxNgTtEldhHVKVMhM7kffH4qF-iPGYk2_xmULGBG8';

// Inisialisasi Supabase Client
export const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Mendaftarkan pengguna baru menggunakan email dan password.
 * Setelah sukses, menambahkan data awal ke tabel 'user' dengan role 'user'.
 * @param {string} nama - Nama pengguna.
 * @param {string} email - Email pengguna.
 * @param {string} password - Password pengguna.
 */
export async function handleRegister(nama, email, password) {
    // 1. Pendaftaran di Auth Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (authError) {
        throw new Error(authError.message);
    }

    // 2. Tambahkan data ke tabel 'user' (Setelah sukses mendaftar)
    if (authData.user) {
        const { error: userError } = await supabase
            .from('user')
            .insert([
                { 
                    id: authData.user.id, // Menggunakan UUID dari Auth Supabase
                    nama: nama, 
                    email: email, 
                    password: password, // TIDAK AMAN! Sebaiknya password tidak disimpan. Ini untuk kemudahan contoh CRUD.
                    role: 'user' 
                }
            ]);

        if (userError) {
             // Rollback: Hapus user dari Auth jika gagal masuk tabel 'user'
             await supabase.auth.admin.deleteUser(authData.user.id);
             throw new Error(`Gagal menyimpan data user: ${userError.message}`);
        }
    }

    return true;
}

/**
 * Melakukan login pengguna.
 * @param {string} email - Email pengguna.
 * @param {string} password - Password pengguna.
 */
export async function handleLogin(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw new Error(error.message);
    }

    // Jika sukses, redirect akan dilakukan di halaman login.html
    return true;
}

/**
 * Melakukan pengecekan sesi dan mengarahkan pengguna jika belum login.
 * Dipanggil di index.html dan admin.html.
 * @returns {object|null} Data user Supabase jika login, null jika belum.
 */
export async function checkAuthAndRedirect() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Belum login, arahkan ke login
        window.location.href = 'login.html';
        return null;
    }
    
    // Sudah login, kembalikan data user Supabase
    return session.user;
}

/**
 * Menghapus sesi pengguna dan mengarahkan ke login.html.
 */
export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logout:', error);
        alert('Gagal logout. Coba lagi.');
    } else {
        // Berhasil logout, alihkan ke login
        window.location.href = 'login.html';
    }
}