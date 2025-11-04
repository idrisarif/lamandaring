// auth.js

// Import yang benar untuk ES Modules
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Centralized Supabase Initialization
const SUPABASE_URL = 'https://iwioqeqmljulcyiiuese.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aW9xZXFtbGp1bGN5aWl1ZXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTkxMTUsImV4cCI6MjA3NDY5NTExNX0.6MRxNgTtEldhHVKVMhM7kffH4qF-iPGYk2_xmULGBG8';

// Export klien Supabase agar bisa digunakan di file lain (crud.js, halaman HTML)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Fungsi Otentikasi yang Diekspor (Re-usable) ---

/**
 * Melakukan pengecekan sesi. Jika tidak ada, redirect ke login.html.
 * @returns {object|null} Objek User Supabase jika login, null jika tidak.
 */
export async function checkAuthAndRedirect() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session.user;
}

/**
 * Melakukan proses logout, menghapus data lokal, dan mengalihkan ke login.
 */
export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        // Hanya menampilkan error di console, tidak perlu alert di sini
        console.error('Gagal logout:', error.message);
        return;
    }
    // Hapus semua data sesi di localStorage
    localStorage.clear();
    window.location.href = 'login.html';
}

/**
 * Mendaftarkan pengguna baru dan menambahkan data ke tabel 'user'.
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

    // 2. Tambahkan data ke tabel 'user'
    if (authData.user) {
        const { error: userError } = await supabase
            .from('user')
            .insert([
                { 
                    id: authData.user.id,
                    nama: nama, 
                    email: email, 
                    password: password, // TIDAK AMAN!
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
 */
export async function handleLogin(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw new Error(error.message);
    }
    return true;
}

// --- Fungsi Pengambilan Nama (Disimpan di auth.js karena berkaitan dengan sesi) ---

/**
 * Mengambil nama pengguna dan menyimpannya di localStorage.
 * Ini HANYA dipanggil dari halaman yang membutuhkan nama (index.html, admin.html).
 * @param {string} userId - UUID dari pengguna yang sedang login.
 * @returns {string|null} Nama pengguna jika ditemukan.
 */
export async function fetchAndStoreUserName(userId) {
    const { data, error } = await supabase
        .from('user')
        .select('nama, role')
        .eq('id', userId) 
        .single();
        
    if (data) {
        localStorage.setItem('nama', data.nama);
        localStorage.setItem('role', data.role); // Simpan role juga, penting untuk admin!
        return data;
    } else {
        console.error('Gagal mengambil data user (nama/role):', error);
        return null;
    }
}

// Catatan: Kode DOMContentLoaded dan pencarian elemen (logoutBtn, userName)
// telah dihapus dari sini. Logika tersebut dipindahkan ke file HTML.