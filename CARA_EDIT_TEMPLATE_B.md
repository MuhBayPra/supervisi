# Cara Edit Template B di Word (Numbering Otomatis)

## File yang Perlu Diedit
📁 `public/template_b.docx`

## Langkah-Langkah (2-3 Menit)

### 1. Buka Template di Word
- Buka file `public/template_b.docx` di Microsoft Word

### 2. Lihat Struktur Tabel
Tabel sudah punya 5 baris aspek dengan variabel:

| Aspek Supervisi | Indikator yang Diamati | Skor (1-4) | Skor Maks | Catatan |
|-----------------|------------------------|------------|-----------|---------|
| {aspek1_nama}   | {aspek1_indikator}     | {aspek1_skor} | {aspek1_maks} | {aspek1_catatan} |
| {aspek2_nama}   | {aspek2_indikator}     | {aspek2_skor} | {aspek2_maks} | {aspek2_catatan} |
| {aspek3_nama}   | {aspek3_indikator}     | {aspek3_skor} | {aspek3_maks} | {aspek3_catatan} |
| {aspek4_nama}   | {aspek4_indikator}     | {aspek4_skor} | {aspek4_maks} | {aspek4_catatan} |
| {aspek5_nama}   | {aspek5_indikator}     | {aspek5_skor} | {aspek5_maks} | {aspek5_catatan} |

### 3. Setting Numbering di Cell Indikator

**Untuk setiap cell `{aspek1_indikator}` sampai `{aspek5_indikator}`:**

#### A. Aktifkan Numbering
1. **Klik** di dalam cell `{aspek1_indikator}`
2. Klik tab **Home** → Icon **Numbering** (ikon 1. 2. 3.)
3. Pilih format: **1. 2. 3.**

#### B. Atur Hanging Indent (PENTING!)
1. Masih di cell yang sama, klik kanan → **Paragraph**
2. Di bagian **Indentation**:
   - **Special**: Pilih **Hanging**
   - **By**: Set **0.5"** atau **1.27 cm**
3. Di bagian **Spacing**:
   - **Before**: 0 pt
   - **After**: 0 pt atau 3 pt
   - **Line spacing**: Single
4. Klik **OK**

#### C. Ulangi untuk Aspek Lainnya
- Ulangi langkah A dan B untuk:
  - `{aspek2_indikator}`
  - `{aspek3_indikator}`
  - `{aspek4_indikator}`
  - `{aspek5_indikator}`

### 4. Simpan Template
- Tekan **Ctrl+S** untuk menyimpan
- **Tutup Word**

### 5. Test di Aplikasi
1. **Refresh aplikasi web** (F5)
2. **Download laporan** Template B
3. **Buka di Word** - lihat hasilnya!

---

## Hasil yang Diharapkan

Setelah di-generate, indikator akan tampil seperti ini:

```
1. Memiliki RPP/Modul Ajar sesuai kurikulum
2. Tujuan pembelajaran jelas
3. Menyusun asesmen sesuai tujuan yang sangat panjang
   dan akan wrap ke baris kedua dengan rapi (menjorok)
```

**Baris kedua otomatis menjorok** karena hanging indent! ✅

---

## Tips Cepat

### Cara Tercepat (Copy Format)
1. Setting numbering + hanging indent di `{aspek1_indikator}`
2. Klik di cell tersebut
3. Klik **Format Painter** (icon kuas di toolbar)
4. Klik di `{aspek2_indikator}` → format otomatis ter-copy!
5. Ulangi untuk aspek 3, 4, 5

### Jika Numbering Tidak Restart
Jika numbering tidak restart per aspek (aspek 2 mulai dari 4. bukan 1.):
1. Klik kanan pada angka numbering di aspek 2
2. Pilih **Restart at 1**
3. Ulangi untuk aspek 3, 4, 5

---

## Troubleshooting

### ❌ Text Tidak Menjorok
- Pastikan **Hanging indent** sudah di-set di Paragraph settings
- Cek **Special**: harus **Hanging**, bukan **First line**

### ❌ Numbering Hilang Setelah Generate
- Pastikan numbering di-set di **template Word**, bukan di hasil generate
- Template harus disimpan dengan numbering aktif

### ❌ Spacing Terlalu Renggang
- Set **Line spacing** ke **Single**
- Set **Before** dan **After** ke **0 pt**

---

## Catatan Penting

⚠️ **Edit template SEKALI SAJA**, setelah itu semua laporan yang di-generate akan otomatis punya numbering yang sama!

✅ **Keuntungan:**
- Numbering rapi dan profesional
- Hanging indent sempurna
- Restart otomatis per aspek
- Hanya perlu setting sekali

---

## Kontak
Jika ada masalah, screenshot hasil Word dan tanyakan lagi.
