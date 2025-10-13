// Pastikan file ini dipanggil SETELAH auth.js di admin/index.html, tambah.html, dan edit.html
// Supabase client 'supabase' sudah tersedia dari auth.js

// ------------------------------------------------------------------------
// A. LOGIKA MENAMPILKAN PENGGUNA (Read) - Menggantikan SELECT di index.php
// ------------------------------------------------------------------------

/**
 * Fungsi untuk mengambil dan menampilkan semua data pengguna ke tabel.
 */
async function tampilkanPengguna() {
    const tableBody = document.getElementById('data-pengguna-body');
    if (!tableBody) return;
    
    // Pastikan user adalah admin
    const { data: userData } = await supabase.from('user').select('role').single();
    if (!userData || userData.role !== 'admin') return;

    // Ambil semua data pengguna dari tabel
    const { data: users, error } = await supabase
        .from('user')
        .select('*')
        .order('id', { ascending: true }); // Mengurutkan berdasarkan ID

    if (error) {
        tampilkanNotifikasi('Gagal memuat data pengguna: ' + error.message, 'danger');
        return;
    }

    tableBody.innerHTML = ''; // Kosongkan tabel
    let no = 1;
    users.forEach((user) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${no++}</td>
            <td>${user.nama}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <a href='edit.html?id=${user.id}'>Edit</a> | 
                <a href='#' onclick="hapusPengguna('${user.id}')">Hapus</a>
            </td>
        `;
    });
}

// Panggil fungsi tampilkanPengguna saat halaman admin/index.html dimuat
window.addEventListener('load', tampilkanPengguna);

// ------------------------------------------------------------------------
// B. LOGIKA TAMBAH PENGGUNA BARU (Create) - Menggantikan tambah_aksi.php
// ------------------------------------------------------------------------

const formTambahPengguna = document.getElementById('form-tambah-pengguna');

if (formTambahPengguna) {
    formTambahPengguna.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nama = document.getElementById('tambah-nama').value;
        const email = document.getElementById('tambah-email').value;
        const password = document.getElementById('tambah-password').value;
        const role = document.getElementById('tambah-role').value;

        // 1. Tambahkan user ke Supabase Auth (diperlukan untuk login)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            tampilkanNotifikasi('Gagal mendaftarkan user: ' + error.message, 'danger');
            return;
        }

        // 2. Tambahkan data profile ke tabel 'pengguna'
        const { error: profileError } = await supabase
            .from('user')
            .insert([
                { 
                    id: data.user.id,
                    nama: nama, 
                    email: email, 
                    role: role 
                }
            ]);

        if (profileError) {
            tampilkanNotifikasi('Gagal menyimpan profil: ' + profileError.message, 'danger');
        } else {
            tampilkanNotifikasi('Pengguna baru berhasil ditambahkan!', 'success');
            window.location.href = 'index.html';
        }
    });
}

// ------------------------------------------------------------------------
// C. LOGIKA UPDATE PENGGUNA (Update) - Menggantikan edit.php dan update_aksi.php
// ------------------------------------------------------------------------

// Fungsi untuk mengisi formulir edit saat halaman dimuat (Menggantikan PHP pada edit.php)
window.addEventListener('load', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId && document.getElementById('form-edit-pengguna')) {
        // Ambil data pengguna dari Supabase berdasarkan userId
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) {
            tampilkanNotifikasi('Data pengguna tidak ditemukan.', 'danger');
            return;
        }
        
        // Isi form dengan data yang diambil
        document.getElementById('edit-id').value = data.id;
        document.getElementById('edit-nama').value = data.nama;
        document.getElementById('edit-email').value = data.email;
        document.getElementById('edit-role').value = data.role;
    }
});

const formEditPengguna = document.getElementById('form-edit-pengguna');

if (formEditPengguna) {
    formEditPengguna.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-id').value;
        const nama = document.getElementById('edit-nama').value;
        const email = document.getElementById('edit-email').value;
        const role = document.getElementById('edit-role').value;
        const password = document.getElementById('edit-password').value;
        
        // 1. Update data di tabel 'pengguna'
        const { error } = await supabase
            .from('user')
            .update({ nama: nama, email: email, role: role })
            .eq('id', id);

        if (error) {
            tampilkanNotifikasi('Gagal update data: ' + error.message, 'danger');
            return;
        }

        // 2. Jika password diisi, lakukan update password di Supabase Auth
        if (password) {
            // Catatan: Update password Supabase Auth memerlukan API Key di sisi server, 
            // atau dilakukan oleh user yang sedang login sendiri. Untuk simplifikasi, 
            // kita asumsikan di sini hanya update profile yang akan sering dilakukan.
        }

        tampilkanNotifikasi('Data pengguna berhasil diperbarui!', 'success');
        window.location.href = 'index.html';
    });
}

// ------------------------------------------------------------------------
// D. LOGIKA HAPUS PENGGUNA (Delete) - Menggantikan hapus.php
// ------------------------------------------------------------------------

/**
 * Fungsi untuk menghapus pengguna. Dipanggil dari tombol aksi di admin/index.html
 */
async function hapusPengguna(userId) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    // 1. Hapus data dari tabel 'pengguna'
    const { error } = await supabase
        .from('user')
        .delete()
        .eq('id', userId);

    if (error) {
        tampilkanNotifikasi('Gagal menghapus data: ' + error.message, 'danger');
    } else {
        // 2. Jika berhasil, refresh tampilan tabel
        tampilkanPengguna(); 
    }
}