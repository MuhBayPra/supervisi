# 📄 Panduan Update Template B Word

## ✅ Perubahan yang Sudah Dilakukan

### 1. Format Skor Per Indikator
Skor individual per indikator menggunakan **double newline (`\n\n`)** untuk jarak yang sesuai, sehingga sejajar dengan indikator yang ditampilkan rapat.

**Format Indikator (rapat):**
```
1. Memiliki RPP/Modul Ajar sesuai kurikulum
2. Tujuan pembelajaran jelas
3. Menyusun asesmen sesuai tujuan
```

**Format Skor (dengan jarak):**
```
4

4

3
```

Dengan cara ini, indikator tetap rapat dan mudah dibaca, sementara skor memiliki jarak yang cukup untuk sejajar dengan masing-masing indikator.

---

## 📋 Cara Update Template Word (`public/template_b.docx`)

### Struktur Tabel yang Disarankan

Buat tabel dengan kolom berikut:

| No | Aspek | Indikator | Skor (1-4) | Total | Maks | Catatan |
|----|-------|-----------|------------|-------|------|---------|
| {#aspek}{id}{/aspek} | {#aspek}{nama_aspek}{/aspek} | {#aspek}{indikator}{/aspek} | {#aspek}{skor_per_indikator}{/aspek} | {#aspek}{skor}{/aspek} | {#aspek}{skor_maks_aspek}{/aspek} | {#aspek}{catatan}{/aspek} |

### Placeholder yang Tersedia

Dalam loop `{#aspek}...{/aspek}`, Anda dapat menggunakan:

1. **{id}** - Nomor urut aspek (1-5)
2. **{nama_aspek}** - Nama aspek (contoh: "Perencanaan Pembelajaran")
3. **{indikator}** - Daftar indikator dengan nomor, dipisah double newline
4. **{skor_per_indikator}** - ⭐ **BARU!** Skor individual per indikator (1-4), dipisah double newline
5. **{skor}** - Total skor aspek (penjumlahan semua indikator)
6. **{skor_maks_aspek}** - Skor maksimal aspek (jumlah indikator × 4)
7. **{catatan}** - Catatan untuk aspek tersebut

### Contoh Implementasi di Word

#### Opsi 1: Tabel Sederhana (Skor di Kolom Terpisah)

```
┌────┬─────────────────────┬──────────────────────┬────────────┬───────┬──────────────┐
│ No │ Aspek               │ Indikator            │ Skor (1-4) │ Total │ Catatan      │
├────┼─────────────────────┼──────────────────────┼────────────┼───────┼──────────────┤
│{#aspek}                                                                              │
│{id}│{nama_aspek}         │{indikator}           │{skor_per_  │{skor}/│{catatan}     │
│    │                     │                      │indikator}  │{skor_ │              │
│    │                     │                      │            │maks_  │              │
│    │                     │                      │            │aspek} │              │
│{/aspek}                                                                              │
└────┴─────────────────────┴──────────────────────┴────────────┴───────┴──────────────┘
```

#### Opsi 2: Tabel Detail (Dengan Maks)

```
┌────┬─────────────────┬──────────────────┬──────┬───────┬──────┬──────────┐
│ No │ Aspek           │ Indikator        │ Skor │ Total │ Maks │ Catatan  │
├────┼─────────────────┼──────────────────┼──────┼───────┼──────┼──────────┤
│{#aspek}                                                                   │
│{id}│{nama_aspek}     │{indikator}       │{skor_│{skor} │{skor_│{catatan} │
│    │                 │                  │per_  │       │maks_ │          │
│    │                 │                  │indi- │       │aspek}│          │
│    │                 │                  │kator}│       │      │          │
│{/aspek}                                                                   │
└────┴─────────────────┴──────────────────┴──────┴───────┴──────┴──────────┘
```

---

## 🎯 Contoh Data yang Akan Muncul

### Aspek 1: Perencanaan Pembelajaran (3 indikator)

**Kolom Indikator (rapat):**
```
1. Memiliki RPP/Modul Ajar sesuai kurikulum
2. Tujuan pembelajaran jelas
3. Menyusun asesmen sesuai tujuan
```

**Kolom Skor Per Indikator (dengan jarak):**
```
4

4

3
```

**Kolom Total:** `11`

**Kolom Maks:** `12`

---

### Aspek 4: Penilaian dan Tindak Lanjut (2 indikator)

**Kolom Indikator (rapat):**
```
1. Menggunakan instrumen penilaian dan memberikan umpan balik
2. Melaksanakan program tindak lanjut/remedial bagi siswa
```

**Kolom Skor Per Indikator (dengan jarak):**
```
3

3
```

**Kolom Total:** `6`

**Kolom Maks:** `8`

---

## 💡 Tips Formatting di Word

### 1. Alignment Vertikal
- Set alignment sel ke **Top** agar teks dimulai dari atas
- Ini penting agar skor sejajar dengan indikator pertama

### 2. Line Spacing
- Gunakan line spacing **1.5** atau **2.0** di kolom Indikator dan Skor
- Ini membantu agar jarak antar baris lebih jelas

### 3. Cell Padding
- Tambahkan padding 5-10pt di semua sisi sel
- Ini membuat tabel lebih rapi dan mudah dibaca

### 4. Font Size
- Indikator: 10-11pt
- Skor: 11-12pt (bold)
- Total: 12-14pt (bold)

### 5. Border
- Gunakan border tipis (0.5pt) untuk garis dalam
- Gunakan border tebal (1-1.5pt) untuk garis luar dan header

---

## 🔍 Cara Test Template

1. **Buka aplikasi** dan isi data supervisi Template B
2. **Klik "Unduh Word"** untuk download laporan
3. **Buka file Word** dan periksa:
   - ✅ Apakah skor sejajar dengan indikatornya?
   - ✅ Apakah jarak antar skor sama dengan jarak antar indikator?
   - ✅ Apakah total skor benar?
   - ✅ Apakah semua data terisi dengan benar?

---

## 📊 Data Placeholder Lengkap Template B

### Data Umum
- `{nuptk}` - NUPTK guru
- `{nama}` - Nama guru
- `{mapel}` - Mata pelajaran/jurusan
- `{kelas}` - Kelas
- `{tanggal}` - Tanggal supervisi
- `{supervisor}` - Nama supervisor

### Data Skor
- `{total}` - Total skor (0-60)
- `{skor_maks_total}` - Skor maksimal (60)
- `{persen}` - Persentase (total/60 × 100)
- `{predikat}` - Predikat (Sangat Baik/Baik/Cukup/Kurang)

### Data Catatan
- `{catatanB}` - Catatan dan saran supervisi (Section E)
- `{catatan_sudahB}` - Catatan jika sudah memenuhi standar
- `{catatan_perluB}` - Catatan jika perlu pembinaan
- `{kesimpulan_sudahB}` - Checkbox + teks "Guru sudah memenuhi standar"
- `{kesimpulan_perluB}` - Checkbox + teks "Guru perlu pembinaan"

### Data Aspek (Loop)
Loop: `{#aspek}...{/aspek}`

Dalam loop tersedia:
- `{id}` - Nomor aspek (1-5)
- `{nama_aspek}` - Nama aspek
- `{indikator}` - Daftar indikator (dengan double newline)
- `{skor_per_indikator}` - ⭐ Skor per indikator (dengan double newline)
- `{skor}` - Total skor aspek
- `{skor_maks_aspek}` - Skor maksimal aspek
- `{catatan}` - Catatan aspek

---

## ✅ Checklist Update Template

- [ ] Buka `public/template_b.docx` di Microsoft Word
- [ ] Tambahkan kolom "Skor (1-4)" di tabel aspek
- [ ] Masukkan placeholder `{skor_per_indikator}` di kolom tersebut
- [ ] Set alignment sel ke **Top**
- [ ] Set line spacing ke **1.5** atau **2.0**
- [ ] Tambahkan padding 5-10pt di semua sel
- [ ] Simpan template
- [ ] Test dengan download laporan dari aplikasi
- [ ] Verifikasi skor sejajar dengan indikator

---

## 🎨 Contoh Visual

```
┌─────────────────────────────────────────────────────────────────┐
│ Aspek: Perencanaan Pembelajaran                                 │
├──────────────────────────────────┬──────────┬──────────────────┤
│ Indikator                        │ Skor     │ Catatan          │
├──────────────────────────────────┼──────────┼──────────────────┤
│ 1. Memiliki RPP/Modul Ajar       │    4     │ RPP/Modul ajar   │
│    sesuai kurikulum              │          │ lengkap, tujuan  │
│ 2. Tujuan pembelajaran jelas     │          │ jelas dan        │
│ 3. Menyusun asesmen sesuai       │    4     │ terukur,         │
│    tujuan                        │          │ asesmen          │
│                                  │    3     │ sepenuhnya       │
│                                  │          │ sesuai tujuan    │
│                                  │          │ pembelajaran.    │
├──────────────────────────────────┼──────────┼──────────────────┤
│ Total Skor                       │ 11 / 12  │                  │
└──────────────────────────────────┴──────────┴──────────────────┘
```

Dengan format ini:
- **Indikator tetap rapat** dan mudah dibaca
- **Skor memiliki jarak vertikal** yang cukup untuk sejajar dengan indikatornya
- Anda bisa menyesuaikan line spacing di Word untuk hasil optimal! 🎯
