# 📊 Fitur Rekap Gabungan - Guru dengan Nama Sama

## ✅ Fitur Baru: Penggabungan Data Supervisi

Aplikasi sekarang **otomatis menggabungkan** data guru dengan nama yang sama dan menghitung **rata-rata** dari semua supervisi yang dilakukan.

---

## 🎯 Cara Kerja

### Contoh Kasus:

**Guru A disupervisi 3 kali:**
- Supervisi 1: 50/60 (83.33%)
- Supervisi 2: 54/60 (90.00%)
- Supervisi 3: 48/60 (80.00%)

**Perhitungan di Rekap:**
```
Rata-rata Skor = (50 + 54 + 48) / 3 = 50.67
Persentase = (50.67 / 60) × 100% = 84.44%
Predikat = Baik (karena 84.44% berada di range 75%-89.9%)
```

**Hasil di Rekap Yayasan:**
- Nama: Guru A (muncul **1 kali** saja)
- Skor: 50.7 / 60
- Persentase: 84.44%
- Predikat: Baik
- Catatan: "Rata-rata dari 3x supervisi. [catatan terakhir]"

---

## 📋 Fitur Detail

### 1. **Penggabungan Otomatis**
- Sistem mendeteksi guru dengan **nama yang sama** (case-insensitive)
- Contoh: "Ahmad Fauzi", "ahmad fauzi", "AHMAD FAUZI" → dianggap sama

### 2. **Perhitungan Rata-Rata**
- **Template A**: Rata-rata dari total skor, lalu hitung persentase dari 80
- **Template B**: Rata-rata dari total skor, lalu hitung persentase dari 60

### 3. **Tampilan di Modal Rekap**
- Guru yang disupervisi lebih dari 1 kali akan menampilkan badge:
  ```
  📊 3x supervisi (rata-rata)
  ```

### 4. **Catatan Gabungan**
- Jika 1 supervisi: Catatan asli
- Jika >1 supervisi: "Rata-rata dari Nx supervisi. [catatan terakhir]"

---

## 🔍 Contoh Skenario

### Skenario 1: Guru Disupervisi 1 Kali
**Input:**
- Budi Santoso: 55/60 (91.67%)

**Output di Rekap:**
- Nama: Budi Santoso
- Skor: 55 / 60
- Persentase: 91.67%
- Predikat: Sangat Baik
- Catatan: [catatan asli]

---

### Skenario 2: Guru Disupervisi 2 Kali
**Input:**
- Siti Aminah (Supervisi 1): 45/60 (75%)
- Siti Aminah (Supervisi 2): 51/60 (85%)

**Output di Rekap:**
- Nama: Siti Aminah (muncul 1 kali)
- Skor: 48 / 60 (rata-rata dari 45 dan 51)
- Persentase: 80.0%
- Predikat: Baik
- Badge: 📊 2x supervisi (rata-rata)
- Catatan: "Rata-rata dari 2x supervisi. [catatan supervisi ke-2]"

---

### Skenario 3: Guru Disupervisi 4 Kali dengan Variasi
**Input:**
- Andi Wijaya (Supervisi 1): 40/60 (66.67%) - Cukup
- Andi Wijaya (Supervisi 2): 48/60 (80.00%) - Baik
- Andi Wijaya (Supervisi 3): 52/60 (86.67%) - Baik
- Andi Wijaya (Supervisi 4): 56/60 (93.33%) - Sangat Baik

**Output di Rekap:**
- Nama: Andi Wijaya (muncul 1 kali)
- Skor: 49 / 60 (rata-rata dari 40, 48, 52, 56)
- Persentase: 81.67%
- Predikat: Baik
- Badge: 📊 4x supervisi (rata-rata)
- Catatan: "Rata-rata dari 4x supervisi. [catatan supervisi ke-4]"

**Insight:** Meskipun supervisi pertama "Cukup", rata-rata keseluruhan menunjukkan peningkatan menjadi "Baik"!

---

## 📊 Statistik di Rekap

### Total Guru
- Menghitung **jumlah guru unik** (bukan jumlah supervisi)
- Contoh: 10 guru disupervisi total 25 kali → Total Guru: **10 Guru**

### Rata-Rata Nilai
- Menghitung rata-rata dari **nilai rata-rata setiap guru**
- Bukan rata-rata dari semua supervisi

### Distribusi Predikat
- Berdasarkan **predikat rata-rata** setiap guru
- Contoh:
  - Sangat Baik: 3 Guru
  - Baik: 5 Guru
  - Cukup: 2 Guru
  - Kurang: 0 Guru

---

## 🎨 Tampilan Visual

### Di Modal Rekap Yayasan:

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Rekap Template B                                         │
│ 10 guru · Maks 60 · Rata-rata: 82.5%                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 12345678901234                                      │   │
│ │ Ahmad Fauzi                                         │   │
│ │ Matematika                                          │   │
│ │ 📊 3x supervisi (rata-rata)                         │   │
│ │ [Baik]                                              │   │
│ │                                                     │   │
│ │ [Textarea: Catatan Kepala Sekolah]                 │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 98765432109876                                      │   │
│ │ Siti Aminah                                         │   │
│ │ Bahasa Indonesia                                    │   │
│ │ [Sangat Baik]                                       │   │
│ │                                                     │   │
│ │ [Textarea: Catatan Kepala Sekolah]                 │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Di File Word Rekap:

```
┌────┬──────────────┬─────────────────┬───────┬──────┬────────┬──────────┬──────────────────┐
│ No │ NUPTK        │ Nama Guru       │ Mapel │ Skor │ Maks   │ Persen   │ Predikat         │
├────┼──────────────┼─────────────────┼───────┼──────┼────────┼──────────┼──────────────────┤
│ 1  │ 123456789012 │ Ahmad Fauzi     │ MTK   │ 50.7 │ 60     │ 84.44%   │ Baik             │
│ 2  │ 987654321098 │ Siti Aminah     │ B.IND │ 55   │ 60     │ 91.67%   │ Sangat Baik      │
│ 3  │ 456789012345 │ Budi Santoso    │ IPA   │ 48   │ 60     │ 80.00%   │ Baik             │
└────┴──────────────┴─────────────────┴───────┴──────┴────────┴──────────┴──────────────────┘

Catatan Kepala Sekolah:
1. Ahmad Fauzi: Rata-rata dari 3x supervisi. Pembelajaran aktif, perlu peningkatan...
2. Siti Aminah: Guru sudah menunjukkan kemampuan yang sangat baik...
3. Budi Santoso: Rata-rata dari 2x supervisi. Penguasaan kelas baik...
```

---

## ⚙️ Implementasi Teknis

### Fungsi Grouping:
```javascript
const groupGuruByName = (guruList) => {
  const grouped = {};
  guruList.forEach((g) => {
    const namaKey = g.nama.trim().toLowerCase(); // Case-insensitive
    if (!grouped[namaKey]) {
      grouped[namaKey] = {
        nama: g.nama,
        supervisi: []
      };
    }
    grouped[namaKey].supervisi.push(g);
  });
  
  return Object.values(grouped).map(g => {
    const rataRataSkor = g.supervisi.reduce((acc, s) => acc + s.total, 0) / g.supervisi.length;
    return {
      ...g,
      total: rataRataSkor,
      persen: (rataRataSkor / 60) * 100,
      jumlahSupervisi: g.supervisi.length
    };
  });
};
```

---

## 💡 Keuntungan Fitur Ini

### 1. **Laporan Lebih Ringkas**
- Tidak ada duplikasi nama guru
- Fokus pada performa rata-rata

### 2. **Analisis Lebih Akurat**
- Melihat tren peningkatan/penurunan
- Menghindari bias dari satu supervisi saja

### 3. **Mudah Dipahami Yayasan**
- Satu guru = satu baris
- Nilai mencerminkan performa keseluruhan

### 4. **Tracking Progress**
- Badge menunjukkan berapa kali guru disupervisi
- Catatan terakhir menunjukkan kondisi terkini

---

## 🔄 Kompatibilitas

### Data Lama
- Guru yang hanya disupervisi 1 kali tetap ditampilkan normal
- Tidak ada perubahan pada data yang sudah ada

### Data Baru
- Otomatis menggabungkan jika nama sama
- Perhitungan rata-rata dilakukan real-time

---

## 📝 Catatan Penting

1. **Pencocokan Nama**: Berdasarkan nama lengkap (case-insensitive)
   - "Ahmad Fauzi" = "ahmad fauzi" = "AHMAD FAUZI"

2. **NUPTK**: Diambil dari data pertama yang ditemukan

3. **Mata Pelajaran**: Diambil dari data pertama yang ditemukan

4. **Catatan**: Menggunakan catatan dari supervisi terakhir

5. **Desimal**: Skor ditampilkan dengan 1 desimal (contoh: 50.7)
   - Jika bulat, desimal dihilangkan (contoh: 55 bukan 55.0)

---

## ✅ Checklist Fitur

- ✅ Penggabungan guru dengan nama sama
- ✅ Perhitungan rata-rata skor
- ✅ Perhitungan persentase dari rata-rata
- ✅ Predikat berdasarkan rata-rata
- ✅ Badge jumlah supervisi di modal
- ✅ Catatan gabungan dengan info jumlah supervisi
- ✅ Statistik berdasarkan guru unik
- ✅ Export Word dengan data gabungan
- ✅ Kompatibel dengan Template A dan B

---

## 🎯 Contoh Penggunaan

### Langkah 1: Input Data
1. Tambah supervisi untuk "Ahmad Fauzi" → 50/60
2. Tambah supervisi untuk "Siti Aminah" → 55/60
3. Tambah supervisi untuk "Ahmad Fauzi" lagi → 54/60
4. Tambah supervisi untuk "Ahmad Fauzi" lagi → 48/60

### Langkah 2: Buka Rekap Yayasan
1. Klik tombol "📊 Rekap Yayasan"
2. Lihat daftar guru:
   - Ahmad Fauzi (📊 3x supervisi) - Skor: 50.7/60 (84.44%) - Baik
   - Siti Aminah - Skor: 55/60 (91.67%) - Sangat Baik

### Langkah 3: Edit Catatan (Opsional)
1. Edit catatan untuk setiap guru di textarea
2. Catatan akan muncul di kolom "Catatan Kepala Sekolah" di Word

### Langkah 4: Download Rekap
1. Klik "📄 Unduh Rekap Template B"
2. File Word akan terdownload dengan data gabungan

---

Fitur ini membuat laporan rekap lebih profesional dan mudah dipahami! 🎉
