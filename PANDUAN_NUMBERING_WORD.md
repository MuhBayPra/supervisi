# Panduan Setting Numbering Otomatis di Template Word

## Tujuan
Membuat numbering otomatis yang **restart di setiap aspek** sehingga setiap aspek mulai dari 1. 2. 3. lagi.

## Langkah-Langkah

### 1. Generate Template Baru
```bash
node create-templates.cjs
```

### 2. Buka Template di Word
- Buka file `public/template_b.docx` di Microsoft Word

### 3. Setting Numbering di Cell Indikator

**A. Aktifkan Numbering:**
1. Klik di dalam cell yang berisi `{indikator}`
2. Klik menu **Home** → Icon **Numbering** (1. 2. 3.)
3. Pilih format: **1. 2. 3.**

**B. Atur Paragraph Spacing:**
1. Masih di cell yang sama, klik kanan → **Paragraph**
2. Set **Line spacing**: Single atau 1.0
3. Set **Before**: 0 pt
4. Set **After**: 0 pt atau 3 pt
5. Klik **OK**

**C. Setting Restart Numbering (PENTING!):**

Untuk membuat numbering restart di setiap aspek, ada 2 cara:

#### Cara 1: Menggunakan Multi-Level List (Recommended)
1. Klik di cell `{indikator}`
2. Klik **Home** → **Multilevel List** (icon dengan 1. a. i.)
3. Pilih **Define New Multilevel List**
4. Pilih level 2 (indikator)
5. Set **Number format**: 1. 2. 3.
6. Set **Restart list after**: Level 1
7. Klik **OK**

#### Cara 2: Manual Restart (Alternatif)
1. Setelah mengaktifkan numbering di cell `{indikator}`
2. Klik kanan pada numbering → **Restart at 1**
3. Ini akan membuat setiap loop aspek restart dari 1

### 4. Simpan Template
- Tekan **Ctrl+S** untuk menyimpan

### 5. Test
- Buka aplikasi web
- Unduh laporan Template B
- Cek apakah numbering restart di setiap aspek

## Hasil yang Diharapkan

```
Aspek 1: Perencanaan Pembelajaran
1. Memiliki RPP/Modul Ajar sesuai kurikulum
2. Tujuan pembelajaran jelas
3. Menyusun asesmen sesuai tujuan

Aspek 2: Pelaksanaan Pembelajaran
1. Membuka pelajaran dengan apersepsi  ← Restart dari 1
2. Menguasai materi dan kelas
3. Metode bervariasi
4. Melibatkan siswa aktif

Aspek 3: Evaluasi Pembelajaran
1. Menata kelas kondusif  ← Restart dari 1
2. Menangani siswa dengan adil
3. Mengelola waktu dengan baik
```

## Troubleshooting

### Numbering Tidak Restart
- Pastikan Anda menggunakan **Multilevel List** dengan setting "Restart after Level 1"
- Atau gunakan **Restart at 1** di setiap loop

### Numbering Hilang Setelah Generate
- Pastikan numbering di-set di **template Word**, bukan di hasil generate
- Template harus disimpan dengan numbering aktif

### Spacing Tidak Rapi
- Atur **Paragraph spacing** ke 0 pt
- Set **Line spacing** ke Single

## Catatan Penting

⚠️ **Numbering otomatis Word TIDAK BISA dibuat dari kode JavaScript!**

Anda harus setting numbering **sekali saja** di template Word (`public/template_b.docx`), setelah itu semua laporan yang di-generate akan otomatis punya numbering yang sama.

✅ **Keuntungan:**
- Numbering rapi dan profesional
- Alignment sempurna
- Restart otomatis per aspek
- Hanya perlu setting sekali

## Kontak
Jika masih ada masalah, screenshot hasil Word dan tanyakan lagi.
