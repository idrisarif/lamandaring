// crud.js
// Catatan: File ini harus diimpor dari admin.html bersamaan dengan auth.js
// Import supabase client dari auth.js

import { supabase } from './auth.js';

/**
 * Mengambil semua data pengguna dari tabel 'user'.
 * @returns {Array} Daftar objek pengguna.
 */
export async function getUsers() {
    const { data, error } = await supabase
        .from('user')
        .select('*')
        .order('nama', { ascending: true }); 
    
    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }
    return data;
}

/**
 * Memperbarui data pengguna (nama dan role) berdasarkan ID.
 * @param {string} userId - UUID dari pengguna yang akan diperbarui.
 * @param {string} newNama - Nama baru.
 * @param {string} newRole - Role baru ('admin' atau 'user').
 */
export async function updateUser(userId, newNama, newRole) {
    const { data, error } = await supabase
        .from('user')
        .update({ nama: newNama, role: newRole })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user:', error);
        throw new Error('Gagal memperbarui data pengguna.');
    }
    return data;
}

/**
 * Menghapus pengguna dari tabel 'user' berdasarkan ID.
 * @param {string} userId - UUID dari pengguna yang akan dihapus.
 */
export async function deleteUser(userId) {
    // Catatan: Jika Anda ingin menghapus pengguna secara permanen dari Supabase Auth juga,
    // Anda perlu menggunakan fungsi admin: `await supabase.auth.admin.deleteUser(userId);`
    // Tapi untuk keperluan CRUD sederhana di tabel 'user', kita hanya hapus dari tabel:

    const { error } = await supabase
        .from('user')
        .delete()
        .eq('id', userId); 

    if (error) {
        console.error('Error deleting user:', error);
        throw new Error('Gagal menghapus data pengguna.');
    }
    return true;
}