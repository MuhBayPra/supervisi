import { useState, useEffect, useRef } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { InfoPengguna } from "./Login.jsx";

// ============================================================
//  FILE: supervisi-guru.jsx
//  DESKRIPSI: Aplikasi Supervisi Guru SMKS Bhakti Insani Bogor
//
//  STRUKTUR FILE (cari bagian dengan Ctrl+F):
//  [SECTION 1] KONFIGURASI & DATA UTAMA
//  [SECTION 2] FUNGSI HELPER
//  [SECTION 3] FUNGSI PDF
//  [SECTION 4] KOMPONEN UI DASAR
//  [SECTION 5] KOMPONEN FORM
//  [SECTION 6] KOMPONEN MODAL REKAP YAYASAN
//  [SECTION 7] KOMPONEN DETAIL & EDITOR
//  [SECTION 8] APP UTAMA
// ============================================================


// ============================================================
// [SECTION 1] KONFIGURASI & DATA UTAMA
// ============================================================

// ── Ubah nama sekolah di sini ──
const NAMA_SEKOLAH = "SMKS Bhakti Insani Bogor";
const NAMA_SEKOLAH_UP = "SMKS BHAKTI INSANI BOGOR";
const NAMA_SEKOLAH_TTD = "SMKS Bhakti Insani Bogor";

// ── Skor maksimal masing-masing template ──
const MAKS_A = 80;
const MAKS_B = 60; // Max default B changed to 60 as per new rules

// ── Warna tombol skor 1-4 ──
const WARNA_SKOR = {
  1: "#ef4444", // merah  = kurang
  2: "#f59e0b", // kuning = cukup
  3: "#3b82f6", // biru   = baik
  4: "#10b981", // hijau  = sangat baik
};

// ── Nama bulan bahasa Indonesia (untuk date picker) ──
const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];


// ============================================================
// PENGATURAN PDF — semua teks, warna, font bisa diubah dari UI
// Struktur ini disimpan di storage dan dipakai semua fungsi PDF
// ============================================================
const DEFAULT_PENGATURAN_PDF = {

  // ── A. Umum: dipakai di semua PDF ──
  umum: {
    logo: "/logo.png",
    logoWidth: 60,  // Lebar logo dalam pixel
    logoHeight: 60, // Tinggi logo dalam pixel
    namaSekolah: "SMKS Bhakti Insani Bogor",      // nama di footer
    namaSekolahUP: "SMKS BHAKTI INSANI BOGOR",      // nama kapital di judul
    namaSekolahTTD: "SMKS Bhakti Insani Bogor",     // nama di area TTD template B
    tahunPelajaran: "2025/2026",
    kota: "Bogor",                         // dipakai di "Bogor, ..."
  },

  // ── B. Lembar Supervisi Template A (A4 Portrait) ──
  lembA: {
    // Teks judul & seksi
    judul: "LEMBAR SUPERVISI GURU",
    seksiIdentitas: "A. IDENTITAS GURU",
    seksiPenilaian: "B. ASPEK PENILAIAN (Skala 1–4)",
    seksiCatatan: "C. CATATAN SUPERVISOR",
    seksiTtd: "D. TANDA TANGAN",
    // Label baris identitas
    lblNamaGuru: "Nama Guru",
    lblMapel: "Mata Pelajaran",
    lblKelas: "Kelas/Program",
    lblTanggal: "Tanggal Supervisi",
    lblSupervisor: "Supervisor",
    // Label catatan supervisor
    lblKekuatan: "Kekuatan Guru",
    lblPerbaikan: "Area Perbaikan",
    lblRTL: "Rekomendasi/RTL",
    // Label tanda tangan
    lblGuruTtd: "Guru yang Disupervisi",
    lblSpvTtd: "Supervisor",
    // Warna (format hex #rrggbb)
    warnaHeaderTabel: "#333333",   // header kolom tabel (hitam gelap)
    warnaKategori: "#c8c8c8",   // baris header kategori A/B/C/D/E
    warnaBgIdentitas: "#f5f5f5",   // background kolom label identitas
    warnaBgHeader: "#d2d2d2",   // background header KOMPONEN/KETERANGAN
    // Ukuran font (angka, satuan pt)
    fontJudul: 13,
    fontTabel: 8.5,
    fontCatatan: 9,
  },

  // ── C. Instrumen Supervisi Template B (A4 Portrait) ──
  instrB: {
    // Teks judul & seksi
    judul: "INSTRUMEN SUPERVISI GURU",
    seksiIdentitas: "A. Identitas",
    seksiAspek: "B. Aspek Supervisi (Skala 1-4)",
    teksSkala: "1 = Kurang          2 = Cukup          3 = Baik          4 = Sangat Baik",
    seksiRekap: "C. Rekap Nilai Supervisi",
    seksiKategori: "D. Kategori Hasil Supervisi",
    seksiCatatan: "E. Catatan dan Saran Supervisi",
    seksiKesimpulan: "F. Kesimpulan",
    // Label identitas
    lblNamaGuru: "Nama Guru",
    lblMapel: "Mapel/Jurusan",
    lblTanggal: "Tanggal Supervisi",
    lblKelas: "Kelas",
    lblSupervisor: "Supervisor",
    // Teks kesimpulan (2 pilihan checkbox)
    teksKes1: "Guru sudah memenuhi standar supervisi",
    teksKes2: "Guru perlu pembinaan pada aspek",
    // Area tanda tangan
    lblMengetahui: "Mengetahui,",
    lblKepala: "Kepala SMKS Bhakti Insani Bogor",
    lblSpvTtd: "Supervisor",
    // Warna
    warnaHeaderTabel: "#333333",
    // Ukuran font
    fontJudul: 14,
    fontTabel: 8.5,
  },

  // ── D. Rekap Yayasan Template A (A4 Landscape) ──
  rekapA: {
    judul: "REKAP PENILAIAN SUPERVISI GURU — TEMPLATE A",
    subjudul: "Untuk Laporan Kepala Sekolah kepada Yayasan",
    judulKetentuan: "Ketentuan Penilaian (Template A)",
    judulRumus: "Rumus Persentase",
    teksRumus: "Persentase = (Total Skor / 80) × 100%",
    judulKriteria: "Kriteria Predikat",
    judulRekap: "Rekap Umum Kepala Sekolah kepada Yayasan",
    judulKesimpulan: "Kesimpulan Kepala Sekolah",
    // Label kolom tabel
    lblNomor: "No",
    lblNamaGuru: "Nama Guru",
    lblMapel: "Mata Pelajaran",
    lblTotalSkor: "Total Skor",
    lblSkorMaks: "Skor Maksimal",
    lblPersentase: "Persentase",
    lblPredikat: "Predikat",
    lblCatatanKs: "Catatan Singkat Kepala Sekolah",
    // Warna
    warnaHeaderTabel: "#333333",
    // Font
    fontJudul: 13,
    fontTabel: 8.5,
  },

  // ── E. Rekap Yayasan Template B (A4 Landscape) ──
  rekapB: {
    judul: "REKAP PENILAIAN SUPERVISI GURU — TEMPLATE B",
    subjudul: "Untuk Laporan Kepala Sekolah kepada Yayasan",
    judulKetentuan: "Ketentuan Penilaian (Template B)",
    judulRumus: "Rumus Persentase",
    teksRumus: "Persentase = (Total Skor / 60) × 100%",
    judulKriteria: "Kriteria Predikat",
    judulRekap: "Rekap Umum Kepala Sekolah kepada Yayasan",
    judulKesimpulan: "Kesimpulan Kepala Sekolah",
    // Label kolom
    lblNomor: "No",
    lblNamaGuru: "Nama Guru",
    lblMapel: "Mata Pelajaran",
    lblTotalSkor: "Total Skor",
    lblSkorMaks: "Skor Maksimal",
    lblPersentase: "Persentase",
    lblPredikat: "Predikat",
    lblCatatanKs: "Catatan Singkat Kepala Sekolah",
    // Warna
    warnaHeaderTabel: "#333333",
    // Font
    fontJudul: 13,
    fontTabel: 8.5,
  },
};


// ── Catatan otomatis berdasarkan predikat ──
// Edit teks di sini untuk mengubah isi otomatis saat klik "Isi Otomatis"
const DATA_PREDIKAT = {
  "Sangat Baik": {
    // Untuk Template A
    kekuatan: "Guru mampu mengelola kelas dengan baik, menggunakan media digital secara optimal, administrasi lengkap, dan siswa terlihat aktif selama pembelajaran berlangsung.",
    areaPerbaikan: "Perlu memperkuat diferensiasi pembelajaran agar siswa dengan kemampuan beragam dapat lebih terlayani.",
    rekomendasi: "Guru dapat dijadikan model atau mentor bagi rekan guru lain dalam penggunaan media digital dan pembelajaran aktif.",
    // Untuk Template B
    catatanB: "Guru sudah menunjukkan kemampuan yang sangat baik dalam pelaksanaan pembelajaran dan pengelolaan kelas. Guru dapat dipertimbangkan sebagai model atau mentor bagi rekan sejawat dalam penggunaan media digital dan pembelajaran aktif.",
    kesimpulanB: "sudah",
    // Untuk Rekap Yayasan
    catatanSingkat: "Pembelajaran aktif, media digital dimanfaatkan optimal, administrasi lengkap, perlu penguatan diferensiasi.",
  },
  "Baik": {
    kekuatan: "Guru memiliki penguasaan materi yang baik, hadir tepat waktu, dan mampu menjaga suasana kelas tetap kondusif.",
    areaPerbaikan: "Variasi metode pembelajaran dan refleksi siswa di akhir pembelajaran masih perlu ditingkatkan agar siswa lebih aktif.",
    rekomendasi: "Guru mengikuti coaching internal terkait metode pembelajaran aktif, PBL, dan penggunaan LKPD digital.",
    catatanB: "Guru sudah menunjukkan kemampuan yang baik dalam pelaksanaan pembelajaran. Ke depan, guru perlu memperkuat tindak lanjut hasil penilaian dan memberikan remedial yang lebih detail agar hasil belajar semakin optimal.",
    kesimpulanB: "sudah",
    catatanSingkat: "Penguasaan kelas baik, perlu peningkatan variasi metode dan refleksi siswa.",
  },
  "Cukup": {
    kekuatan: "Guru telah berupaya menyampaikan materi sesuai modul ajar dan menjaga kehadiran dengan baik.",
    areaPerbaikan: "Penggunaan media pembelajaran, administrasi, penguasaan kelas, serta keterlibatan siswa perlu diperbaiki agar pembelajaran lebih efektif.",
    rekomendasi: "Kepala sekolah dan waka kurikulum melakukan pendampingan intensif, supervisi ulang, serta memberikan contoh perangkat ajar yang sesuai.",
    catatanB: "Guru sudah berupaya melaksanakan pembelajaran dengan baik. Ke depan, perlu peningkatan pada penggunaan media pembelajaran, pengelolaan waktu, dan keterlibatan siswa secara aktif.",
    kesimpulanB: "perlu",
    catatanSingkat: "Berupaya baik, perlu peningkatan media pembelajaran, pengelolaan kelas, dan keterlibatan siswa.",
  },
  "Kurang": {
    kekuatan: "Guru memiliki kemauan untuk memperbaiki dan mengikuti arahan sekolah.",
    areaPerbaikan: "Kehadiran, administrasi pembelajaran, metode mengajar, pengelolaan kelas, dan penilaian masih perlu ditingkatkan secara menyeluruh.",
    rekomendasi: "Dilakukan coaching khusus, supervisi lanjutan, observasi kelas ulang, dan monitoring mingguan oleh kepala sekolah serta waka kurikulum.",
    catatanB: "Guru memerlukan bimbingan dan pendampingan lebih lanjut. Diperlukan perbaikan menyeluruh pada aspek kehadiran, administrasi, metode mengajar, pengelolaan kelas, dan penilaian.",
    kesimpulanB: "perlu",
    catatanSingkat: "Diperlukan pembinaan menyeluruh pada administrasi, metode mengajar, dan pengelolaan kelas.",
  },
};


// ── 20 Indikator Template A ──
// Untuk menambah/edit indikator: ubah array di bawah
// kat: kategori (A/B/C/D/E), katLabel: nama kategori, judul: nama indikator
// catatan: teks yang muncul saat skor 1/2/3/4 dipilih
const DATA_INDIKATOR_A = [
  // === KATEGORI A: PERENCANAAN PEMBELAJARAN ===
  {
    id: 1, kat: "A", katLabel: "PERENCANAAN PEMBELAJARAN",
    judul: "Kesesuaian CP–ATP–Modul Ajar",
    catatan: {
      1: "Modul ajar tidak sesuai dengan CP dan ATP; tujuan pembelajaran tidak terdefinisi.",
      2: "Modul ajar cukup sesuai CP dan ATP, namun tujuan pembelajaran masih kurang jelas.",
      3: "Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas namun perlu sedikit penyempurnaan.",
      4: "Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas dan runtut.",
    },
  },
  {
    id: 2, kat: "A", katLabel: "PERENCANAAN PEMBELAJARAN",
    judul: "Ketersediaan Media, LKPD, Alat Ajar",
    catatan: {
      1: "Tidak tersedia media, LKPD, maupun alat ajar pendukung.",
      2: "Media dan LKPD tersedia sebagian, belum memadai.",
      3: "Media dan LKPD tersedia namun kurang variatif; perlu dilengkapi.",
      4: "Guru menyiapkan slide, LKPD digital, dan video pembelajaran.",
    },
  },
  {
    id: 3, kat: "A", katLabel: "PERENCANAAN PEMBELAJARAN",
    judul: "Penilaian (Rubrik & Formatif)",
    catatan: {
      1: "Tidak tersedia rubrik maupun instrumen penilaian formatif.",
      2: "Rubrik tersedia namun belum sesuai dengan tujuan pembelajaran.",
      3: "Rubrik sudah tersedia, namun perlu ditambahkan format refleksi siswa.",
      4: "Rubrik lengkap, penilaian formatif terencana, dilengkapi instrumen refleksi siswa.",
    },
  },
  {
    id: 4, kat: "A", katLabel: "PERENCANAAN PEMBELAJARAN",
    judul: "Diferensiasi dalam Perencanaan",
    catatan: {
      1: "Tidak ada upaya diferensiasi dalam perencanaan pembelajaran.",
      2: "Diferensiasi belum tampak; tugas seragam untuk semua siswa.",
      3: "Sudah ada variasi tugas, tetapi belum maksimal untuk siswa berkemampuan rendah.",
      4: "Perencanaan mencakup diferensiasi konten, proses, dan produk untuk semua level.",
    },
  },
  // === KATEGORI B: PELAKSANAAN PEMBELAJARAN ===
  {
    id: 5, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Pembukaan (Apersepsi & Tujuan)",
    catatan: {
      1: "Tidak ada apersepsi; tujuan pembelajaran tidak disampaikan kepada siswa.",
      2: "Apersepsi dilakukan namun tidak relevan dengan materi yang akan diajarkan.",
      3: "Guru menyampaikan apersepsi dan tujuan namun kurang menarik minat siswa.",
      4: "Guru membuka pembelajaran dengan ice breaking dan mengaitkan materi dengan kehidupan sehari-hari.",
    },
  },
  {
    id: 6, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Penguasaan Kelas & Komunikasi",
    catatan: {
      1: "Guru tidak mampu menguasai kelas; komunikasi tidak efektif dan kelas tidak kondusif.",
      2: "Guru cukup mampu menguasai kelas namun komunikasi masih perlu banyak ditingkatkan.",
      3: "Guru mampu menjaga kondusivitas kelas dengan komunikasi yang cukup baik.",
      4: "Guru komunikatif, suara jelas, dan mampu menjaga fokus siswa.",
    },
  },
  {
    id: 7, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Variasi Metode (PBL, Diskusi, Praktik)",
    catatan: {
      1: "Pembelajaran hanya menggunakan satu metode ceramah tanpa variasi.",
      2: "Menggunakan 2 metode namun transisi antar metode kurang lancar.",
      3: "Menggunakan beberapa metode namun belum sepenuhnya terintegrasi.",
      4: "Menggunakan metode diskusi kelompok, praktik, dan presentasi.",
    },
  },
  {
    id: 8, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Aktivitas & Keterlibatan Siswa",
    catatan: {
      1: "Siswa pasif; tidak ada interaksi aktif selama pembelajaran berlangsung.",
      2: "Hanya sedikit siswa yang terlibat aktif; sebagian besar tidak berpartisipasi.",
      3: "Sebagian besar siswa aktif, namun masih ada beberapa siswa pasif.",
      4: "Seluruh siswa terlibat aktif; guru berhasil memotivasi semua siswa.",
    },
  },
  {
    id: 9, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Penggunaan Media Digital / Alat Praktik",
    catatan: {
      1: "Tidak menggunakan media digital atau alat praktik dalam pembelajaran.",
      2: "Media digital digunakan namun tidak relevan atau tidak berfungsi optimal.",
      3: "Guru menggunakan media digital namun kurang bervariasi.",
      4: "Guru menggunakan proyektor, video, dan praktik langsung di laboratorium.",
    },
  },
  {
    id: 10, kat: "B", katLabel: "PELAKSANAAN PEMBELAJARAN",
    judul: "Penutup (Refleksi & Rangkuman)",
    catatan: {
      1: "Tidak ada kegiatan penutup; pembelajaran berakhir tanpa rangkuman maupun refleksi.",
      2: "Guru memberikan rangkuman singkat tanpa melibatkan siswa dalam refleksi.",
      3: "Guru memberikan rangkuman, tetapi refleksi siswa belum dilakukan secara menyeluruh.",
      4: "Guru melakukan rangkuman dan refleksi siswa secara menyeluruh dan bermakna.",
    },
  },
  // === KATEGORI C: PENILAIAN PEMBELAJARAN ===
  {
    id: 11, kat: "C", katLabel: "PENILAIAN PEMBELAJARAN",
    judul: "Penilaian sesuai Tujuan Pembelajaran",
    catatan: {
      1: "Penilaian tidak sesuai dengan tujuan pembelajaran yang telah ditetapkan.",
      2: "Penilaian sebagian sesuai tujuan pembelajaran namun perlu banyak penyesuaian.",
      3: "Penilaian sebagian besar sesuai tujuan; perlu sedikit penyesuaian.",
      4: "Penilaian sudah sesuai dengan tujuan pembelajaran yang ditetapkan.",
    },
  },
  {
    id: 12, kat: "C", katLabel: "PENILAIAN PEMBELAJARAN",
    judul: "Penggunaan Rubrik Penilaian",
    catatan: {
      1: "Rubrik penilaian tidak digunakan sama sekali dalam proses penilaian.",
      2: "Rubrik digunakan namun tidak dikomunikasikan atau dijelaskan kepada siswa.",
      3: "Rubrik digunakan namun belum dijelaskan kepada siswa sebelum praktik.",
      4: "Rubrik digunakan secara konsisten dan dijelaskan kepada siswa sebelum praktik.",
    },
  },
  {
    id: 13, kat: "C", katLabel: "PENILAIAN PEMBELAJARAN",
    judul: "Umpan Balik yang Diberikan ke Siswa",
    catatan: {
      1: "Tidak ada umpan balik yang diberikan kepada siswa.",
      2: "Umpan balik diberikan namun bersifat umum dan kurang spesifik.",
      3: "Guru memberikan umpan balik kepada sebagian siswa; belum merata.",
      4: "Guru memberikan umpan balik langsung kepada siswa saat praktik.",
    },
  },
  {
    id: 14, kat: "C", katLabel: "PENILAIAN PEMBELAJARAN",
    judul: "Administrasi Nilai Rapi",
    catatan: {
      1: "Administrasi nilai tidak tersedia atau tidak teratur sama sekali.",
      2: "Administrasi nilai tersedia namun belum lengkap dan perlu banyak perbaikan.",
      3: "Administrasi nilai cukup lengkap namun perlu perapian.",
      4: "Administrasi nilai lengkap dan tersusun dengan baik.",
    },
  },
  // === KATEGORI D: TUGAS TAMBAHAN & ADMINISTRASI ===
  {
    id: 15, kat: "D", katLabel: "TUGAS TAMBAHAN & ADMINISTRASI",
    judul: "Kehadiran & Ketepatan Waktu",
    catatan: {
      1: "Guru sering tidak hadir dan tidak tepat waktu dalam melaksanakan tugas.",
      2: "Kehadiran cukup namun guru sering terlambat masuk kelas.",
      3: "Kehadiran baik namun sesekali terlambat; perlu konsistensi.",
      4: "Guru hadir tepat waktu dan mengikuti seluruh jadwal KBM.",
    },
  },
  {
    id: 16, kat: "D", katLabel: "TUGAS TAMBAHAN & ADMINISTRASI",
    judul: "Kelengkapan Administrasi",
    catatan: {
      1: "Administrasi pembelajaran tidak tersedia atau sangat tidak lengkap.",
      2: "Administrasi pembelajaran tersedia sebagian; banyak dokumen belum terpenuhi.",
      3: "Administrasi cukup lengkap; masih ada beberapa dokumen yang perlu dilengkapi.",
      4: "Semua administrasi pembelajaran tersedia lengkap.",
    },
  },
  {
    id: 17, kat: "D", katLabel: "TUGAS TAMBAHAN & ADMINISTRASI",
    judul: "Pelaksanaan Tugas Tambahan (Wali/Ekskul)",
    catatan: {
      1: "Tugas tambahan tidak dilaksanakan; tidak ada dokumentasi kegiatan.",
      2: "Tugas tambahan dilaksanakan namun tanpa dokumentasi yang memadai.",
      3: "Guru menjalankan tugas wali kelas dengan baik, namun dokumentasi perlu ditingkatkan.",
      4: "Guru melaksanakan tugas tambahan dengan sangat baik disertai dokumentasi lengkap.",
    },
  },
  // === KATEGORI E: SIKAP PROFESIONAL & ETIKA ===
  {
    id: 18, kat: "E", katLabel: "SIKAP PROFESIONAL & ETIKA",
    judul: "Etika & Komunikasi",
    catatan: {
      1: "Guru kurang sopan dan komunikasi tidak profesional.",
      2: "Etika cukup baik namun komunikasi profesional masih perlu diperbaiki.",
      3: "Guru bersikap sopan dan profesional dalam sebagian besar situasi.",
      4: "Guru bersikap sopan, santun, dan profesional.",
    },
  },
  {
    id: 19, kat: "E", katLabel: "SIKAP PROFESIONAL & ETIKA",
    judul: "Kerjasama & Kolaborasi",
    catatan: {
      1: "Guru tidak aktif berkolaborasi dan cenderung bekerja sendiri.",
      2: "Guru kadang berkolaborasi namun perlu lebih proaktif.",
      3: "Guru cukup aktif bekerja sama namun belum konsisten.",
      4: "Guru aktif bekerja sama dengan rekan guru dan wali kelas.",
    },
  },
  {
    id: 20, kat: "E", katLabel: "SIKAP PROFESIONAL & ETIKA",
    judul: "Komitmen Terhadap Sekolah",
    catatan: {
      1: "Guru kurang menunjukkan komitmen dan loyalitas terhadap sekolah.",
      2: "Komitmen cukup namun partisipasi dalam kegiatan sekolah masih rendah.",
      3: "Guru berkomitmen baik namun partisipasi dalam kegiatan sekolah perlu ditingkatkan.",
      4: "Guru memiliki loyalitas tinggi dan aktif dalam kegiatan sekolah.",
    },
  },
];


// ── 5 Aspek Template B ──
// Untuk menambah/edit aspek: ubah array di bawah
// indikator: poin-poin yang diamati (tampil sebagai badge)
// catatan: teks yang muncul saat skor 1/2/3/4 dipilih
const DATA_ASPEK_B = [
  {
    id: 1,
    aspek: "Perencanaan Pembelajaran",
    indikator: [
      "Memiliki RPP/Modul Ajar sesuai kurikulum",
      "Tujuan pembelajaran jelas",
      "Menyusun asesmen sesuai tujuan",
    ],
    catatan: {
      1: "Tidak memiliki RPP/modul ajar; tujuan dan asesmen tidak tersedia.",
      2: "RPP tersedia namun tujuan pembelajaran dan asesmen belum sesuai kurikulum.",
      3: "Modul ajar sudah tersedia dan sesuai kurikulum. Tujuan pembelajaran jelas, namun asesmen masih perlu lebih disesuaikan dengan tujuan pembelajaran.",
      4: "RPP/Modul ajar lengkap, tujuan jelas dan terukur, asesmen sepenuhnya sesuai tujuan pembelajaran.",
    },
  },
  {
    id: 2,
    aspek: "Pelaksanaan Pembelajaran",
    indikator: [
      "Membuka pelajaran dengan apersepsi dan tujuan yang jelas",
      "Menguasai materi dan mengelola kelas dengan efektif",
      "Menggunakan metode bervariasi dan melibatkan siswa aktif",
    ],
    catatan: {
      1: "Guru tidak mampu membuka pelajaran, menguasai kelas, maupun melibatkan siswa secara aktif.",
      2: "Guru membuka pelajaran dan menguasai materi, namun metode kurang variatif dan siswa kurang aktif.",
      3: "Guru membuka pembelajaran dengan baik, menguasai materi, menggunakan media presentasi dan diskusi kelompok. Siswa terlihat aktif bertanya dan menjawab.",
      4: "Guru membuka pembelajaran dengan sangat baik, menguasai materi sepenuhnya, metode sangat bervariasi, dan seluruh siswa aktif terlibat.",
    },
  },
  {
    id: 3,
    aspek: "Pengelolaan Kelas",
    indikator: [
      "Menata kelas kondusif",
      "Menangani siswa dengan adil dan positif",
      "Mengelola waktu dengan baik",
    ],
    catatan: {
      1: "Kelas tidak kondusif, guru tidak mampu mengelola waktu maupun menangani siswa secara adil.",
      2: "Kelas cukup kondusif namun pengelolaan waktu dan penanganan siswa masih perlu banyak perbaikan.",
      3: "Kelas tertata rapi dan kondusif. Guru mampu mengendalikan kelas dengan baik, namun pengelolaan waktu masih perlu ditingkatkan karena materi belum selesai tepat waktu.",
      4: "Kelas sangat kondusif, semua siswa ditangani secara adil dan positif, waktu dikelola dengan sangat baik.",
    },
  },
  {
    id: 4,
    aspek: "Penilaian dan Tindak Lanjut",
    indikator: [
      "Menggunakan instrumen penilaian dan memberikan umpan balik",
      "Melaksanakan program tindak lanjut/remedial bagi siswa",
    ],
    catatan: {
      1: "Tidak ada instrumen penilaian, umpan balik, maupun tindak lanjut bagi siswa.",
      2: "Guru sudah memberikan penilaian tertulis, tetapi umpan balik kepada siswa masih terbatas dan belum ada program remedial yang jelas.",
      3: "Penilaian menggunakan instrumen yang cukup baik; umpan balik diberikan namun tindak lanjut/remedial masih perlu ditingkatkan.",
      4: "Instrumen penilaian lengkap (tes & non tes), umpan balik diberikan secara rinci, dan program remedial tersedia dengan jelas.",
    },
  },
  {
    id: 5,
    aspek: "Sikap dan Profesionalisme",
    indikator: [
      "Disiplin waktu",
      "Penampilan rapi",
      "Komunikasi santun",
      "Kolaborasi dengan sejawat",
    ],
    catatan: {
      1: "Guru tidak disiplin waktu, penampilan tidak rapi, komunikasi kurang santun, dan tidak berkolaborasi.",
      2: "Guru cukup disiplin dan berpenampilan baik, namun komunikasi dan kolaborasi masih perlu ditingkatkan.",
      3: "Guru hadir tepat waktu, berpakaian rapi, berkomunikasi santun, dan aktif berkolaborasi dengan rekan guru lain.",
      4: "Guru hadir tepat waktu, berpakaian sangat rapi, berkomunikasi santun, dan sangat aktif berkolaborasi dengan rekan guru.",
    },
  },
];


// ============================================================
// [SECTION 2] FUNGSI HELPER
// ============================================================

// ── Menghitung predikat Template A (berdasarkan persentase) ──
function getPrediakatA(persen) {
  if (persen >= 91) return { label: "Sangat Baik", bg: "#d1fae5", text: "#065f46" };
  if (persen >= 81) return { label: "Baik", bg: "#dbeafe", text: "#1e3a8a" };
  if (persen >= 71) return { label: "Cukup", bg: "#fef3c7", text: "#78350f" };
  return { label: "Kurang", bg: "#fee2e2", text: "#7f1d1d" };
}

// ── Menghitung predikat Template B (berdasarkan total skor, maks 60) ──
function getPrediakatB(total) {
  if (total >= 54) return { label: "Sangat Baik", bg: "#d1fae5", text: "#065f46" }; // 90%
  if (total >= 45) return { label: "Baik", bg: "#dbeafe", text: "#1e3a8a" }; // 75%
  if (total >= 36) return { label: "Cukup", bg: "#fef3c7", text: "#78350f" }; // 60%
  return { label: "Kurang", bg: "#fee2e2", text: "#7f1d1d" }; // <59.9% (0-35)
}

// ── Mendapatkan predikat dari data guru (A atau B) ──
function getPrediakatGuru(guru) {
  return guru.template === "B"
    ? getPrediakatB(guru.total)
    : getPrediakatA(guru.persen);
}

// ── Membuat teks kesimpulan kepala sekolah otomatis ──
function buatKesimpulanKepsek(rataRata, hitungPredikat) {
  if (rataRata >= 91) {
    return `Secara umum, hasil supervisi sangat memuaskan. Sebanyak ${hitungPredikat["Sangat Baik"]} guru meraih predikat Sangat Baik. Seluruh guru menunjukkan kompetensi yang tinggi dalam pembelajaran. Sekolah akan terus mendukung pengembangan profesional guru agar kualitas pembelajaran makin meningkat.`;
  }
  if (rataRata >= 81) {
    return `Secara umum, hasil supervisi menunjukkan bahwa guru telah melaksanakan pembelajaran dengan baik. Namun, masih diperlukan peningkatan pada beberapa aspek pembelajaran. Sekolah akan melakukan pembimbingan, pendampingan administrasi, dan supervisi lanjutan untuk membantu guru mencapai standar yang diharapkan.`;
  }
  if (rataRata >= 71) {
    return `Secara umum, hasil supervisi menunjukkan bahwa guru masih memerlukan peningkatan di berbagai aspek pembelajaran. Sekolah akan melakukan pembimbingan intensif, pendampingan administrasi, dan supervisi lanjutan untuk membantu guru mencapai standar yang diharapkan.`;
  }
  return `Hasil supervisi menunjukkan bahwa sejumlah guru masih memerlukan pembinaan khusus. Kepala sekolah bersama wakil kepala sekolah bidang kurikulum akan melakukan pendampingan intensif, pemantauan mingguan, dan supervisi ulang untuk memastikan peningkatan kualitas pembelajaran secara menyeluruh.`;
}




// ============================================================
// [SECTION 3] FUNGSI CETAK LAPORAN (WORD DOCX)
// ============================================================

const loadFile = (url, callback) => {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Gagal mengambil template " + url);
      return res.arrayBuffer();
    })
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
};

const base64Parser = (dataURL) => {
  if (!dataURL || !dataURL.includes("base64,")) return dataURL;
  const base64 = dataURL.split(",")[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const generateDocx = (templateUrl, data, outputName, returnBlob = false) => {
  return new Promise((resolve, reject) => {
    loadFile(templateUrl, async (error, content) => {
      if (error) {
        alert("Error memuat template. Pastikan file " + templateUrl + " ada di folder public.");
        return reject(error);
      }

    // PENTING: Jangan pre-resolve logo ke buffer!
    // Library image-module-free mengecek typeof tagValue === 'object',
    // jika true (ArrayBuffer/Uint8Array adalah object), ia menganggapnya
    // sebagai hasil resolve internal {rId, sizePixel} dan langsung crash.
    // Solusi: simpan logo sebagai string, konversi di dalam getImage.

    // Simpan referensi logo asli dan ukuran, lalu hapus dari data agar bisa dikontrol
    const logoRef = data.logo || null;
    const logoWidth = data.logoWidth || 60;
    const logoHeight = data.logoHeight || 60;
    delete data.logo; // Hapus dulu, akan di-set ulang sebagai string di bawah
    delete data.logoWidth;
    delete data.logoHeight;

    // Siapkan buffer logo untuk dipakai di getImage
    let logoBuffer = null;
    if (logoRef) {
      try {
        if (typeof logoRef === "string" && logoRef.startsWith("data:image")) {
          logoBuffer = base64Parser(logoRef);
        } else if (typeof logoRef === "string" && (logoRef.startsWith("http") || logoRef.startsWith("/"))) {
          const res = await fetch(logoRef);
          if (res.ok) {
            logoBuffer = await res.arrayBuffer();
          }
        }
      } catch (e) {
        console.error("Gagal memuat logo:", e);
      }
    }

    // Set data.logo sebagai string identifier (bukan buffer!)
    // agar library tidak menganggapnya sebagai objek resolve internal
    if (logoBuffer) {
      data.logo = "logo_image";
    }

    // Konversi content template ke Uint8Array agar PizZip lebih stabil di browser
    const zip = new PizZip(new Uint8Array(content));

    const imageOptions = {
      centered: false,
      getImage: (tagValue) => {
        // tagValue akan berisi string "logo_image"
        if (tagValue === "logo_image" && logoBuffer) {
          return logoBuffer;
        }
        return logoBuffer || new Uint8Array([]);
      },
      getSize: () => {
        // Gunakan ukuran dari pengaturan user
        return [logoWidth, logoHeight];
      }
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(imageOptions)],
      nullGetter() { return ""; }
    });

      try {
        doc.render(data);
      } catch (e) {
        console.error(e);
        const errorMsg = e.properties && e.properties.errors ? JSON.stringify(e.properties.errors) : e.message;
        alert("Kesalahan Template: " + errorMsg);
        return reject(e);
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      if (returnBlob) {
        resolve({ blob: out, filename: outputName });
      } else {
        saveAs(out, outputName);
        resolve(true);
      }
    });
  });
};

// ── Cetak Template A ──
async function cetakPDF_A(guru, indikator, ps, returnBlob = false) {
  const dataIndikator = indikator.map((ind, i) => ({
    id: i + 1,
    aspek: ind.katLabel,
    judul: ind.judul,
    skor: guru.skor[ind.id] || 0,
    catatan: guru.catatanKhusus?.[ind.id] !== undefined ? guru.catatanKhusus[ind.id] : (guru.skor[ind.id] ? ind.catatan[guru.skor[ind.id]] : "")
  }));

  return generateDocx("/template_a.docx", {
    ...ps.umum,
    ...ps.lembA,
    nuptk: guru.nuptk || "-",
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    kekuatan: guru.kekuatan || "-",
    areaPerbaikan: guru.areaPerbaikan || "-",
    rekomendasi: guru.rekomendasi || "-",
    indikator: dataIndikator
  }, `LembarSupervisiA_${guru.nama.replace(/\s+/g, "_")}.docx`, returnBlob);
}

// ── Cetak Template B ──
async function cetakPDF_B(guru, aspekB, ps, returnBlob = false) {
  // Helper untuk ambil skor per indikator
  const getSkor = (aspekId, indikatorIdx) => {
    let val = guru.skor[`${aspekId}_${indikatorIdx}`];
    if (val === undefined || val === "") return "-";
    return String(val).replace(".", ",");
  };

  // Helper untuk ambil catatan per aspek
  const getCatatanAspek = (aspekId) => {
    // Catatan custom per aspek
    if (guru.catatanKhusus?.[aspekId] !== undefined) {
      return guru.catatanKhusus[aspekId];
    }
    // Default catatan dari data aspek (jika ada)
    const aspek = aspekB.find(a => a.id === aspekId);
    if (aspek && guru.skor[aspekId]) {
      return aspek.catatan[guru.skor[aspekId]] || "";
    }
    return "";
  };

  // Data aspek untuk loop (untuk tabel Rekap Nilai Supervisi)
  const dataAspek = aspekB.map((a, i) => {
    // Hitung total skor aspek
    let totalSkor = 0;
    if (a.indikator) {
      a.indikator.forEach((_, idx) => {
        let val = guru.skor[`${a.id}_${idx}`];
        if (val === undefined || val === "") val = 0;
        let num = parseFloat(String(val).replace(",", "."));
        if (!isNaN(num)) totalSkor += num;
      });
    }
    
    return {
      nama_aspek: a.aspek,
      skor_maks_aspek: a.indikator ? a.indikator.length * 4 : 4,
      skor: totalSkor
    };
  });

  const pred = getPrediakatGuru(guru).label;
  const persen = parseFloat(((guru.total / 60) * 100).toFixed(2));

  return generateDocx("/template_b.docx", {
    ...ps.umum,
    ...ps.instrB,
    nuptk: guru.nuptk || "-",
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    total: guru.total || 0,
    skor_maks_total: 60,
    persen: persen,
    predikat: pred,
    catatanB: guru.catatanB || "-",
    catatan_sudahB: guru.catatanSudahB || "",
    catatan_perluB: guru.catatanPerluB || "",
    kesimpulan_sudahB: (guru.checkSudahB ? "☑ " : "[] ") + "Guru sudah memenuhi standar supervisi",
    kesimpulan_perluB: (guru.checkPerluB ? "☑ " : "[] ") + "Guru perlu pembinaan pada aspek",
    
    // Data untuk loop (tabel Rekap Nilai Supervisi)
    aspek: dataAspek,
    
    // Aspek 1: Perencanaan Pembelajaran (3 indikator)
    aspek1_nama: aspekB[0].aspek,
    ind1_1: aspekB[0].indikator[0],
    skor1_1: getSkor(1, 0),
    ind1_2: aspekB[0].indikator[1],
    skor1_2: getSkor(1, 1),
    ind1_3: aspekB[0].indikator[2],
    skor1_3: getSkor(1, 2),
    catatan1: getCatatanAspek(1),
    
    // Aspek 2: Pelaksanaan Pembelajaran (3 indikator)
    aspek2_nama: aspekB[1].aspek,
    ind2_1: aspekB[1].indikator[0],
    skor2_1: getSkor(2, 0),
    ind2_2: aspekB[1].indikator[1],
    skor2_2: getSkor(2, 1),
    ind2_3: aspekB[1].indikator[2],
    skor2_3: getSkor(2, 2),
    catatan2: getCatatanAspek(2),
    
    // Aspek 3: Pengelolaan Kelas (3 indikator)
    aspek3_nama: aspekB[2].aspek,
    ind3_1: aspekB[2].indikator[0],
    skor3_1: getSkor(3, 0),
    ind3_2: aspekB[2].indikator[1],
    skor3_2: getSkor(3, 1),
    ind3_3: aspekB[2].indikator[2],
    skor3_3: getSkor(3, 2),
    catatan3: getCatatanAspek(3),
    
    // Aspek 4: Penilaian dan Tindak Lanjut (2 indikator)
    aspek4_nama: aspekB[3].aspek,
    ind4_1: aspekB[3].indikator[0],
    skor4_1: getSkor(4, 0),
    ind4_2: aspekB[3].indikator[1],
    skor4_2: getSkor(4, 1),
    catatan4: getCatatanAspek(4),
    
    // Aspek 5: Sikap dan Profesionalisme (4 indikator)
    aspek5_nama: aspekB[4].aspek,
    ind5_1: aspekB[4].indikator[0],
    skor5_1: getSkor(5, 0),
    ind5_2: aspekB[4].indikator[1],
    skor5_2: getSkor(5, 1),
    ind5_3: aspekB[4].indikator[2],
    skor5_3: getSkor(5, 2),
    ind5_4: aspekB[4].indikator[3],
    skor5_4: getSkor(5, 3),
    catatan5: getCatatanAspek(5),
  }, `InstrumenSupervisiGuru_${guru.nama.replace(/\s+/g, "_")}.docx`, returnBlob);
}

// ── Cetak Rekap Yayasan Template A ──
async function cetakRekapA(guruListA, catatanPerGuru, kesimpulan, ps) {
  if (!guruListA.length) {
    alert("Belum ada data guru dengan Template A.");
    return;
  }

  // Data guru sudah diproses (gabung atau lengkap) dari modal
  const dataGuru = guruListA.map((g, i) => ({
    no: i + 1,
    nuptk: g.nuptk || "-",
    nama: g.nama,
    mapel: g.mapel,
    total: typeof g.total === 'number' ? g.total.toFixed(1).replace(/\.0$/, '') : g.total,
    persen: typeof g.persen === 'number' ? g.persen.toFixed(2) : g.persen,
    predikat: typeof g.persen === 'number' 
      ? (g.persen >= 91 ? "Sangat Baik" : g.persen >= 81 ? "Baik" : g.persen >= 71 ? "Cukup" : "Kurang")
      : getPrediakatA(g.persen).label,
    catatan_ks: catatanPerGuru[i] || "-"
  }));

  // Hitung Statistik
  const totalGuru = dataGuru.length;
  const rataRata = (dataGuru.reduce((acc, g) => acc + parseFloat(g.persen), 0) / totalGuru).toFixed(2);
  const hitung = { "Sangat Baik": 0, "Baik": 0, "Cukup": 0, "Kurang": 0 };
  dataGuru.forEach(g => { hitung[g.predikat]++; });
  const mayoritas = Object.keys(hitung).reduce((a, b) => hitung[a] > hitung[b] ? a : b);

  generateDocx("/rekap_a.docx", {
    ...ps.umum,
    ...ps.rekapA,
    guru: dataGuru,
    kesimpulan_ks: kesimpulan || "-",
    stat_total: `${totalGuru} Guru`,
    stat_rata: rataRata,
    stat_mayoritas: mayoritas,
    stat_sangat_baik: `${hitung["Sangat Baik"]} Guru`,
    stat_baik: `${hitung["Baik"]} Guru`,
    stat_cukup: `${hitung["Cukup"]} Guru`,
    stat_pembinaan: `${hitung["Kurang"]} Guru`,
  }, `RekapYayasan_TemplateA.docx`);
}

// ── Cetak Rekap Yayasan Template B ──
async function cetakRekapB(guruListB, catatanPerGuru, kesimpulan, ps) {
  if (!guruListB.length) {
    alert("Belum ada data guru dengan Template B.");
    return;
  }

  // Data guru sudah diproses (gabung atau lengkap) dari modal
  const dataGuru = guruListB.map((g, i) => ({
    no: i + 1,
    nuptk: g.nuptk || "-",
    nama: g.nama,
    mapel: g.mapel,
    total: typeof g.total === 'number' ? g.total.toFixed(1).replace(/\.0$/, '') : g.total,
    skor_maksimal: 60,
    persen: typeof g.total === 'number' 
      ? ((g.total / 60) * 100).toFixed(2).replace(/\.00$/, '')
      : ((g.total / 60) * 100).toFixed(2).replace(/\.00$/, ''),
    predikat: getPrediakatB(g.total).label,
    catatan_ks: catatanPerGuru[i] || "-"
  }));

  // Hitung Statistik
  const totalGuru = dataGuru.length;
  const rataRata = (dataGuru.reduce((acc, g) => acc + parseFloat(g.persen), 0) / totalGuru).toFixed(2);
  const hitung = { "Sangat Baik": 0, "Baik": 0, "Cukup": 0, "Kurang": 0 };
  dataGuru.forEach(g => { hitung[g.predikat]++; });
  const mayoritas = Object.keys(hitung).reduce((a, b) => hitung[a] > hitung[b] ? a : b);

  generateDocx("/rekap_b.docx", {
    ...ps.umum,
    ...ps.rekapB,
    guru: dataGuru,
    kesimpulan_ks: kesimpulan || "-",
    stat_total: `${totalGuru} Guru`,
    stat_rata: rataRata,
    stat_mayoritas: mayoritas,
    stat_sangat_baik: `${hitung["Sangat Baik"]} Guru`,
    stat_baik: `${hitung["Baik"]} Guru`,
    stat_cukup: `${hitung["Cukup"]} Guru`,
    stat_pembinaan: `${hitung["Kurang"]} Guru`,
  }, `RekapYayasan_TemplateB.docx`);
}

// ============================================================
// [SECTION 4] KOMPONEN UI DASAR
// ============================================================

// ── Gaya CSS Responsif ──
// Anda bisa mengubah warna, ukuran, dan tampilan dari sini
const GAYA = {
  // Warna utama
  birTua: "#1e3a5f",
  biru: "#2563eb",
  hijauTua: "#166534",
  hijau: "#16a34a",

  // Input teks biasa
  input: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },

  // Textarea
  textarea: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1.5px solid #cbd5e1",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    resize: "vertical",
  },

  // Tombol primer (biru)
  btnPrimer: {
    background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
  },

  // Tombol sekunder (outline)
  btnSekunder: {
    background: "#fff",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
};


// ── Komponen: Modal Overlay ──
// Digunakan sebagai pembungkus semua modal dialog
function Modal({ onClose, children, lebarMaks = 920 }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(15,23,42,0.78)",
      zIndex: 50,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "12px",
      overflowY: "auto",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: `${lebarMaks}px`,
        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        marginTop: "12px",
        marginBottom: "12px",
      }}>
        {children}
      </div>
    </div>
  );
}


// ── Komponen: Header Modal (strip berwarna di atas) ──
function HeaderModal({ warna = "biru", judul, subjudul, badge, onClose }) {
  const gradien = warna === "hijau"
    ? "linear-gradient(135deg, #166534, #16a34a)"
    : warna === "gelap"
      ? "linear-gradient(135deg, #374151, #1f2937)"
      : "linear-gradient(135deg, #1e3a5f, #2563eb)";

  return (
    <div style={{
      background: gradien,
      borderRadius: "16px 16px 0 0",
      padding: "16px 22px",
      display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px",
    }}>
      <div>
        {badge && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
            <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 800, fontSize: "11px", padding: "2px 9px", borderRadius: "20px" }}>
              {badge}
            </span>
            {subjudul && <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>{subjudul}</span>}
          </div>
        )}
        {!badge && subjudul && (
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", marginBottom: "3px" }}>{subjudul}</div>
        )}
        <div style={{ color: "#fff", fontSize: "17px", fontWeight: 700 }}>{judul}</div>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "8px", padding: "5px 13px", cursor: "pointer", flexShrink: 0 }}>
          ✕
        </button>
      )}
    </div>
  );
}


// ── Komponen: Input Teks dengan Label ──
function InputField({ label, value, onChange, placeholder, full, tipe = "text" }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      {label && (
        <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "4px" }}>
          {label}
        </label>
      )}
      <input
        type={tipe}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={GAYA.input}
      />
    </div>
  );
}


// ── Komponen: Textarea dengan Label ──
function TextareaField({ label, value, onChange, placeholder, baris = 3, full }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : {}}>
      {label && (
        <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "4px" }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={baris}
        style={GAYA.textarea}
      />
    </div>
  );
}


// ── Komponen: Date Picker (ketik manual ATAU pilih kalender) ──
function DatePicker({ value, onChange }) {
  const refInput = useRef(null);

  // Buka kalender native browser
  const bukaKalender = () => {
    try { refInput.current.showPicker(); } catch { refInput.current.click(); }
  };

  // Saat tanggal dipilih dari kalender → format ke "D Bulan YYYY"
  const handlePilihTanggal = (e) => {
    const d = new Date(e.target.value);
    if (!isNaN(d)) {
      onChange(`${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`);
    }
    e.target.value = ""; // reset agar bisa pilih lagi
  };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {/* Input teks (ketik manual) */}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ketik manual atau klik 📅"
        style={{ ...GAYA.input, paddingRight: "40px" }}
      />
      {/* Tombol buka kalender */}
      <button
        type="button"
        onClick={bukaKalender}
        style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: 0, lineHeight: 1 }}
      >
        📅
      </button>
      {/* Input date tersembunyi untuk memunculkan picker native */}
      <input
        type="date"
        ref={refInput}
        onChange={handlePilihTanggal}
        style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none", top: 0, left: 0 }}
      />
    </div>
  );
}


// ── Komponen: Banner Predikat + Tombol Isi Otomatis ──
function BannerPredikat({ label, onIsotomatis }) {
  // Warna banner berubah sesuai predikat
  const warnaMap = {
    "Sangat Baik": { bg: "#f0fdf4", bd: "#86efac", btn: "#16a34a", tx: "#166534" },
    "Baik": { bg: "#eff6ff", bd: "#93c5fd", btn: "#2563eb", tx: "#1e3a8a" },
    "Cukup": { bg: "#fffbeb", bd: "#fcd34d", btn: "#d97706", tx: "#78350f" },
    "Kurang": { bg: "#fef2f2", bd: "#fca5a5", btn: "#dc2626", tx: "#7f1d1d" },
  };
  const w = warnaMap[label] || warnaMap["Baik"];

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: w.bg, border: `1.5px solid ${w.bd}`,
      borderRadius: "9px", padding: "9px 14px", marginBottom: "10px",
      flexWrap: "wrap", gap: "8px",
    }}>
      <span style={{ fontSize: "12px", fontWeight: 700, color: w.tx }}>
        ⭐ Predikat saat ini: <strong>{label}</strong> — klik tombol untuk isi otomatis
      </span>
      <button
        onClick={onIsotomatis}
        style={{ background: w.btn, color: "#fff", border: "none", borderRadius: "7px", padding: "5px 14px", cursor: "pointer", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}
      >
        🔄 Isi Otomatis
      </button>
    </div>
  );
}


// ── Komponen: Badge Predikat (dipakai di tabel) ──
function BadgePredikat({ label, ukuran = "normal" }) {
  const WARNA_PREDIKAT = {
    "Sangat Baik": { bg: "#d1fae5", text: "#065f46" },
    "Baik": { bg: "#dbeafe", text: "#1e3a8a" },
    "Cukup": { bg: "#fef3c7", text: "#78350f" },
    "Kurang": { bg: "#fee2e2", text: "#7f1d1d" },
  };
  const warna = WARNA_PREDIKAT[label] || { bg: "#e2e8f0", text: "#475569" };

  return (
    <span style={{
      background: warna.bg,
      color: warna.text,
      padding: ukuran === "kecil" ? "2px 8px" : "3px 10px",
      borderRadius: "20px",
      fontWeight: 700,
      fontSize: ukuran === "kecil" ? "10px" : "11px",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}


// ── Komponen: Tombol Skor (1/2/3/4) ──
function TombolSkor({ nilai, aktif, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "34px", height: "34px",
        borderRadius: "8px",
        border: "none",
        fontWeight: 700,
        fontSize: "14px",
        cursor: "pointer",
        background: aktif ? WARNA_SKOR[nilai] : "#e2e8f0",
        color: aktif ? "#fff" : "#64748b",
        transform: aktif ? "scale(1.12)" : "scale(1)",
        transition: "all 0.12s",
        flexShrink: 0,
      }}
    >
      {nilai}
    </button>
  );
}


// ── Komponen: Kartu Indikator (dipakai di Form A) ──
function KartuIndikator({ indikator, skorSaat, onSkorPilih, catatanManual, onCatatanUbah }) {
  const s = skorSaat;
  const teksCatatan = catatanManual !== undefined ? catatanManual : (s > 0 ? indikator.catatan[s] : "");
  return (
    <div style={{
      border: `1.5px solid ${s > 0 ? "#bfdbfe" : "#e2e8f0"}`,
      borderRadius: "10px",
      padding: "10px 13px",
      background: s > 0 ? "#f0f7ff" : "#fafafa",
      marginBottom: "5px",
      transition: "all 0.2s",
    }}>
      {/* Baris atas: nomor + judul + tombol skor */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", marginRight: "7px" }}>
            {indikator.id}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
            {indikator.judul}
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          {[1, 2, 3, 4].map(n => (
            <TombolSkor key={n} nilai={n} aktif={s === n} onClick={() => onSkorPilih(n)} />
          ))}
        </div>
      </div>
      {/* Catatan otomatis / manual (muncul saat skor dipilih) */}
      {s > 0 && (
        <div style={{ marginTop: "7px" }}>
          <textarea
            value={teksCatatan}
            onChange={(e) => onCatatanUbah(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "7px",
              background: "#dbeafe",
              border: "1px solid #bfdbfe",
              borderLeft: "3px solid #2563eb",
              fontSize: "11.5px",
              color: "#1e3a8a",
              lineHeight: 1.5,
              resize: "vertical",
              minHeight: "45px",
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box"
            }}
            placeholder="Ketik catatan khusus untuk skor ini..."
          />
        </div>
      )}
    </div>
  );
}


// ── Komponen: Kartu Aspek (dipakai di Form B) ──
function KartuAspek({ aspek, skorSaat, onSkorPilih, catatanManual, onCatatanUbah, onSetSemua }) {
  // skorSaat here is an object mapping indicator index to its string value
  // let's calculate if any indicator is filled
  const anyFilled = Object.values(skorSaat || {}).some(v => v !== "" && v !== undefined);
  const teksCatatan = catatanManual !== undefined ? catatanManual : "";

  return (
    <div style={{
      border: `1.5px solid ${anyFilled ? "#bbf7d0" : "#e2e8f0"}`,
      borderRadius: "11px",
      padding: "12px 14px",
      background: anyFilled ? "#f0fdf4" : "#fafafa",
      marginBottom: "7px",
      transition: "all 0.2s",
    }}>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "11px", padding: "2px 8px", borderRadius: "5px" }}>
            {aspek.id}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
            {aspek.aspek}
          </span>
        </div>

        {/* Set Semua Tombol per Aspek */}
        {onSetSemua && (
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#64748b", marginRight: "2px" }}>Set semua:</span>
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={(e) => {
                  e.preventDefault();
                  onSetSemua(n);
                }}
                style={{
                  background: "#e2e8f0", border: "none", borderRadius: "5px", width: "22px", height: "22px",
                  fontSize: "11px", fontWeight: "bold", color: "#0f172a", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Setiap Indikator & Input Skor */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {aspek.indikator.map((ind, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "#fff", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
            <span style={{ fontSize: "12px", color: "#334155" }}>• {ind}</span>
            <input 
              type="text"
              value={skorSaat[i] !== undefined ? skorSaat[i] : ""}
              onChange={(e) => {
                let val = e.target.value;
                // allow numbers and comma/dot
                if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                  onSkorPilih(i, val);
                }
              }}
              placeholder="0.0"
              style={{
                width: "48px",
                padding: "4px",
                border: "1.5px solid #94a3b8",
                borderRadius: "5px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#0f172a"
              }}
            />
          </div>
        ))}
      </div>

      {/* Catatan manual */}
      {anyFilled && (
        <div style={{ marginTop: "12px" }}>
          <textarea
            value={teksCatatan}
            onChange={(e) => onCatatanUbah(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "7px",
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderLeft: "3px solid #16a34a",
              fontSize: "11.5px",
              color: "#166534",
              lineHeight: 1.5,
              resize: "vertical",
              minHeight: "45px",
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box"
            }}
            placeholder="Ketik catatan khusus untuk aspek ini..."
          />
        </div>
      )}
    </div>
  );
}


// ── Komponen: Section Card (kotak abu tipis) ──
function SectionCard({ judul, warna = "biru", children }) {
  const warnaTeks = warna === "hijau" ? "#166534" : warna === "kuning" ? "#78350f" : "#1e3a5f";
  const warnaBg = warna === "hijau" ? "#f0fdf4" : warna === "kuning" ? "#fffbeb" : "#f8fafc";
  const warnaBd = warna === "hijau" ? "#bbf7d0" : warna === "kuning" ? "#fde68a" : "#e2e8f0";
  return (
    <div style={{ background: warnaBg, borderRadius: "12px", padding: "14px", border: `1px solid ${warnaBd}` }}>
      {judul && (
        <div style={{ fontSize: "10px", fontWeight: 700, color: warnaTeks, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {judul}
        </div>
      )}
      {children}
    </div>
  );
}


// ── Komponen: Footer Skor (bawah form) ──
function FooterSkor({ total, maks, persen, predikat, label, sudah, onSimpan, warna = "biru" }) {
  const gradien = warna === "hijau"
    ? "linear-gradient(135deg, #166534, #16a34a)"
    : "linear-gradient(135deg, #1e3a5f, #2563eb)";

  return (
    <div style={{
      background: warna === "hijau" ? "#f0fdf4" : "#f0f7ff",
      border: `2px solid ${warna === "hijau" ? "#bbf7d0" : "#bfdbfe"}`,
      borderRadius: "12px",
      padding: "14px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
    }}>
      <div>
        <div style={{ fontSize: "12px", color: "#475569" }}>Total Skor</div>
        <div style={{ fontSize: "27px", fontWeight: 800, color: warna === "hijau" ? "#166534" : "#1e3a5f" }}>
          {total}
          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 400 }}>/{maks}</span>
        </div>
        {sudah && predikat && (
          <BadgePredikat label={predikat} />
        )}
        {sudah && persen && (
          <span style={{ fontSize: "11px", color: "#64748b", marginLeft: "6px" }}>{persen}%</span>
        )}
        {!sudah && (
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Isi semua {label} untuk melihat predikat</div>
        )}
      </div>
      <button onClick={onSimpan} style={{ ...GAYA.btnPrimer, background: gradien }}>
        💾 Simpan
      </button>
    </div>
  );
}


// ============================================================
// [SECTION 5] KOMPONEN FORM
// ============================================================

// ── Modal: Pilih Template ──
function ModalPilihTemplate({ onPilih, onClose }) {
  const opsi = [
    {
      tmpl: "A",
      judul: "Template A",
      sub: "20 Indikator · Maks 80",
      desk: "20 indikator dalam 5 kategori (A–E). Catatan supervisor otomatis dari predikat. Cocok untuk supervisi komprehensif.",
      tag: ["A. Perencanaan", "B. Pelaksanaan", "C. Penilaian", "D. Adm", "E. Profesional"],
      bdWarna: "#bfdbfe", bdHover: "#2563eb", tagBg: "#dbeafe", tagTeks: "#1e3a8a", btnBg: "#2563eb", bgKartu: "#f0f7ff",
    },
    {
      tmpl: "B",
      judul: "Template B",
      sub: "15 Indikator · Maks 60",
      desk: "15 indikator utama sesuai format Instrumen Supervisi Guru. Catatan & kesimpulan otomatis dari predikat. Cocok untuk monitoring rutin.",
      tag: ["Perencanaan", "Pelaksanaan", "Pengelolaan Kelas", "Penilaian & TL", "Profesionalisme"],
      bdWarna: "#bbf7d0", bdHover: "#16a34a", tagBg: "#dcfce7", tagTeks: "#166534", btnBg: "#16a34a", bgKartu: "#f0fdf4",
    },
  ];

  return (
    <Modal onClose={onClose}>
      <HeaderModal judul="Pilih Template Penilaian" subjudul="Langkah Pertama" onClose={onClose} />
      <div style={{ padding: "22px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {opsi.map(o => (
          <div
            key={o.tmpl}
            onClick={() => onPilih(o.tmpl)}
            style={{
              flex: "1 1 260px",
              border: `2px solid ${o.bdWarna}`,
              borderRadius: "13px",
              padding: "18px",
              cursor: "pointer",
              background: o.bgKartu,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = o.bdHover; e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = o.bdWarna; e.currentTarget.style.boxShadow = ""; }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "3px" }}>{o.judul}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "9px" }}>{o.sub}</div>
            <div style={{ fontSize: "12px", color: "#475569", lineHeight: 1.6, marginBottom: "11px" }}>{o.desk}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
              {o.tag.map(t => (
                <span key={t} style={{ background: o.tagBg, color: o.tagTeks, fontSize: "10px", padding: "2px 7px", borderRadius: "5px", fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ background: o.btnBg, color: "#fff", textAlign: "center", padding: "9px", borderRadius: "8px", fontWeight: 700, fontSize: "13px" }}>
              Pilih Template {o.tmpl} →
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}


// ── Modal: Form Template A ──
function FormA({ guru, indikator, onSimpan, onClose, dataPredikat }) {
  // Inisialisasi skor (dari data guru jika edit, atau 0 jika baru)
  const initSkor = {};
  const initCatatan = {};
  indikator.forEach(ind => { 
    initSkor[ind.id] = guru?.skor?.[ind.id] || 0; 
    if (guru?.catatanKhusus?.[ind.id] !== undefined) {
      initCatatan[ind.id] = guru.catatanKhusus[ind.id];
    }
  });

  const [skor, setSkor] = useState(initSkor);
  const [catatanKhusus, setCatatanKhusus] = useState(initCatatan);
  const [info, setInfo] = useState({
    nuptk: guru?.nuptk || "",
    nama: guru?.nama || "",
    mapel: guru?.mapel || "",
    kelas: guru?.kelas || "",
    tanggal: guru?.tanggal || "",
    supervisor: guru?.supervisor || "",
    kekuatan: guru?.kekuatan || "",
    areaPerbaikan: guru?.areaPerbaikan || "",
    rekomendasi: guru?.rekomendasi || "",
    catatanSingkat: guru?.catatanSingkat || "",
  });

  // Hitung total & predikat
  const total = Object.values(skor).reduce((a, b) => a + (b || 0), 0);
  const persen = ((total / MAKS_A) * 100).toFixed(2);
  const pred = getPrediakatA(parseFloat(persen));
  const selesai = indikator.every(ind => skor[ind.id] > 0);

  // Kelompokkan indikator per kategori
  const kelompok = {};
  indikator.forEach(ind => {
    if (!kelompok[ind.kat]) kelompok[ind.kat] = [];
    kelompok[ind.kat].push(ind);
  });

  // Isi otomatis catatan berdasarkan predikat
  const isiOtomatis = () => {
    const pc = dataPredikat[pred.label];
    if (pc) setInfo(v => ({ ...v, kekuatan: pc.kekuatan, areaPerbaikan: pc.areaPerbaikan, rekomendasi: pc.rekomendasi, catatanSingkat: pc.catatanSingkat }));
  };

  // Simpan data
  const handleSimpan = () => {
    if (!info.nama.trim()) return alert("Nama guru wajib diisi!");
    if (!selesai) return alert("Harap isi semua 20 indikator terlebih dahulu!");
    onSimpan({ ...info, skor, catatanKhusus, total, persen: parseFloat(persen), template: "A" });
  };

  return (
    <Modal onClose={onClose}>
      <HeaderModal
        badge="Template A"
        subjudul="20 Indikator · Maks 80"
        judul="Form Supervisi Guru"
        onClose={onClose}
      />
      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "78vh", overflowY: "auto" }}>

        {/* A. Identitas */}
        <SectionCard judul="A. Identitas Guru">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "9px" }}>
            <InputField label="NUPTK" value={info.nuptk} onChange={v => setInfo({ ...info, nuptk: v })} placeholder="Nomor Unik Pendidik" />
            <InputField label="Nama Guru" value={info.nama} onChange={v => setInfo({ ...info, nama: v })} placeholder="Nama lengkap + gelar" />
            <InputField label="Mata Pelajaran" value={info.mapel} onChange={v => setInfo({ ...info, mapel: v })} placeholder="Nama mata pelajaran" />
            <InputField label="Kelas/Program" value={info.kelas} onChange={v => setInfo({ ...info, kelas: v })} placeholder="Mis: X PPLG 1" />
            <InputField label="Supervisor" value={info.supervisor} onChange={v => setInfo({ ...info, supervisor: v })} placeholder="Nama supervisor" />
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "4px" }}>Tanggal Supervisi</label>
              <DatePicker value={info.tanggal} onChange={v => setInfo({ ...info, tanggal: v })} />
            </div>
          </div>
        </SectionCard>

        {/* B. Aspek Penilaian */}
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#1e3a5f", marginBottom: "10px", textTransform: "uppercase" }}>
            B. Aspek Penilaian (Skala 1–4)
          </div>
          {Object.entries(kelompok).map(([kat, inds]) => (
            <div key={kat} style={{ marginBottom: "11px" }}>
              {/* Header kategori */}
              <div style={{ background: "#e2e8f0", padding: "6px 12px", borderRadius: "7px", marginBottom: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ background: "#1e3a5f", color: "#fff", fontWeight: 700, width: "22px", height: "22px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", flexShrink: 0 }}>
                  {kat}
                </span>
                <span style={{ fontWeight: 700, fontSize: "12px", color: "#1e293b" }}>
                  {inds[0].katLabel}
                </span>
              </div>
              {/* Kartu per indikator */}
              {inds.map(ind => (
                <KartuIndikator
                  key={ind.id}
                  indikator={ind}
                  skorSaat={skor[ind.id]}
                  onSkorPilih={n => {
                    setSkor({ ...skor, [ind.id]: n });
                    setCatatanKhusus({ ...catatanKhusus, [ind.id]: ind.catatan[n] });
                  }}
                  catatanManual={catatanKhusus[ind.id]}
                  onCatatanUbah={teks => setCatatanKhusus({ ...catatanKhusus, [ind.id]: teks })}
                />
              ))}
            </div>
          ))}
        </div>

        {/* C. Catatan Supervisor */}
        <SectionCard judul="C. Catatan Supervisor">
          {selesai && <BannerPredikat label={pred.label} onIsotomatis={isiOtomatis} />}
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            <TextareaField label="Kekuatan Guru" value={info.kekuatan} onChange={v => setInfo({ ...info, kekuatan: v })} placeholder="Hal-hal positif yang sudah dilakukan guru..." baris={2} />
            <TextareaField label="Area Perbaikan" value={info.areaPerbaikan} onChange={v => setInfo({ ...info, areaPerbaikan: v })} placeholder="Bagian yang masih perlu diperbaiki..." baris={2} />
            <TextareaField label="Rekomendasi / RTL" value={info.rekomendasi} onChange={v => setInfo({ ...info, rekomendasi: v })} placeholder="Tindak lanjut yang disarankan..." baris={2} />
          </div>
        </SectionCard>

        {/* Catatan Singkat untuk Rekap Yayasan */}
        <SectionCard judul="Catatan Singkat untuk Rekap" warna="kuning">
          <TextareaField value={info.catatanSingkat} onChange={v => setInfo({ ...info, catatanSingkat: v })} placeholder="Terisi otomatis dari predikat, atau ketik manual..." baris={2} />
        </SectionCard>

        {/* Footer Skor */}
        <FooterSkor
          total={total} maks={MAKS_A} persen={persen}
          predikat={selesai ? pred.label : null}
          label="20 indikator" sudah={selesai}
          onSimpan={handleSimpan}
        />
      </div>
    </Modal>
  );
}


// ── Modal: Form Template B ──
function FormB({ guru, aspekB, onSimpan, onClose, dataPredikat }) {
  const initSkor = {};
  const initCatatan = {};
  aspekB.forEach(a => { 
    a.indikator.forEach((ind, i) => {
      let oldVal = guru?.skor?.[`${a.id}_${i}`];
      if (oldVal === undefined) {
         oldVal = guru?.skor?.[a.id] || ""; // fallback from old data struct
      }
      initSkor[`${a.id}_${i}`] = oldVal !== "" ? String(oldVal).replace(".", ",") : "";
    });

    if (guru?.catatanKhusus?.[a.id] !== undefined) {
      initCatatan[a.id] = guru.catatanKhusus[a.id];
    }
  });

  const [skor, setSkor] = useState(initSkor);
  const [catatanKhusus, setCatatanKhusus] = useState(initCatatan);
  const [info, setInfo] = useState({
    nuptk: guru?.nuptk || "",
    nama: guru?.nama || "",
    mapel: guru?.mapel || "",
    kelas: guru?.kelas || "",
    tanggal: guru?.tanggal || "",
    supervisor: guru?.supervisor || "",
    catatanB: guru?.catatanB || "",
    checkSudahB: guru?.checkSudahB ?? true,
    checkPerluB: guru?.checkPerluB ?? false,
    catatanSudahB: guru?.catatanSudahB || "",
    catatanPerluB: guru?.catatanPerluB || "",
    catatanSingkat: guru?.catatanSingkat || "",
  });

  const totalCalc = Object.values(skor).reduce((a, b) => {
    let f = parseFloat(String(b || "0").replace(",", "."));
    return a + (isNaN(f) ? 0 : f);
  }, 0);
  const total = Math.round(totalCalc * 10) / 10;
  const pred = getPrediakatB(total);
  const selesai = aspekB.every(a => a.indikator.every((ind, i) => {
    let strVal = String(skor[`${a.id}_${i}`] || "");
    return strVal.trim() !== "";
  }));

  const isiOtomatis = () => {
    const pc = dataPredikat[pred.label];
    if (pc) {
      setInfo(v => ({
        ...v,
        catatanB: pc.catatanB,
        checkSudahB: pc.kesimpulanB === "sudah",
        checkPerluB: pc.kesimpulanB === "perlu",
        catatanSingkat: pc.catatanSingkat
      }));
    }
  };

  const handleSimpan = () => {
    if (!info.nama.trim()) return alert("Nama guru wajib diisi!");
    if (!selesai) return alert("Harap isi semua 5 aspek terlebih dahulu!");
    onSimpan({ ...info, skor, catatanKhusus, total, persen: parseFloat(((total / MAKS_B) * 100).toFixed(2)), template: "B" });
  };

  return (
    <Modal onClose={onClose}>
      <HeaderModal badge="Template B" subjudul="15 Indikator · Maks 60" judul="Instrumen Supervisi Guru" onClose={onClose} warna="hijau" />
      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "78vh", overflowY: "auto" }}>

        {/* A. Identitas */}
        <SectionCard judul="A. Identitas" warna="hijau">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "9px" }}>
            <InputField label="NUPTK" value={info.nuptk} onChange={v => setInfo({ ...info, nuptk: v })} placeholder="Nomor Unik Pendidik" />
            <InputField label="Nama Guru" value={info.nama} onChange={v => setInfo({ ...info, nama: v })} placeholder="Nama lengkap + gelar" />
            <InputField label="Mapel/Jurusan" value={info.mapel} onChange={v => setInfo({ ...info, mapel: v })} placeholder="Nama mapel/jurusan" />
            <InputField label="Kelas" value={info.kelas} onChange={v => setInfo({ ...info, kelas: v })} placeholder="Mis: X PPLG 1" />
            <InputField label="Supervisor" value={info.supervisor} onChange={v => setInfo({ ...info, supervisor: v })} placeholder="Nama supervisor" />
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "4px" }}>Tanggal Supervisi</label>
              <DatePicker value={info.tanggal} onChange={v => setInfo({ ...info, tanggal: v })} />
            </div>
          </div>
        </SectionCard>

        {/* B. Aspek Supervisi */}
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#166534", marginBottom: "4px", textTransform: "uppercase" }}>
            B. Aspek Supervisi (Skala 1-4)
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "9px" }}>
            Poin dapat berupa desimal (contoh: 2,5). &nbsp;Maks total: 60.
          </div>

          {aspekB.map(a => {
            const skorAspek = {};
            a.indikator.forEach((ind, i) => {
              skorAspek[i] = skor[`${a.id}_${i}`];
            });

            return (
              <KartuAspek
                key={a.id}
                aspek={a}
                skorSaat={skorAspek}
                onSkorPilih={(indexIndikator, val) => {
                  setSkor({ ...skor, [`${a.id}_${indexIndikator}`]: val });
                }}
                onSetSemua={(val) => {
                  const newSkor = { ...skor };
                  a.indikator.forEach((ind, i) => {
                    newSkor[`${a.id}_${i}`] = String(val);
                  });
                  setSkor(newSkor);
                  setCatatanKhusus({ ...catatanKhusus, [a.id]: a.catatan[val] });
                }}
                catatanManual={catatanKhusus[a.id]}
                onCatatanUbah={teks => setCatatanKhusus({ ...catatanKhusus, [a.id]: teks })}
              />
            );
          })}
        </div>

        {/* C. Rekap Nilai */}
        <SectionCard judul="C. Rekap Nilai Supervisi" warna="hijau">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ padding: "6px 9px", textAlign: "left", color: "#475569", fontSize: "12px" }}>Aspek</th>
                <th style={{ padding: "6px 9px", textAlign: "center", color: "#475569", width: "65px", fontSize: "12px" }}>Maks</th>
                <th style={{ padding: "6px 9px", textAlign: "center", color: "#475569", width: "65px", fontSize: "12px" }}>Skor</th>
              </tr>
            </thead>
            <tbody>
              {aspekB.map(a => {
                const maksAspek = a.indikator.length * 4;
                const skorAspek = a.indikator.reduce((acc, ind, i) => {
                  let str = String(skor[`${a.id}_${i}`] || "0").replace(",", ".");
                  let f = parseFloat(str);
                  return acc + (isNaN(f) ? 0 : f);
                }, 0);
                const skorRounded = Math.round(skorAspek * 10) / 10;
                
                return (
                  <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px 9px", color: "#1e293b" }}>{a.aspek}</td>
                    <td style={{ padding: "6px 9px", textAlign: "center", color: "#64748b" }}>{maksAspek}</td>
                    <td style={{ padding: "6px 9px", textAlign: "center" }}>
                      {skorRounded > 0
                        ? <span style={{ background: "#22c55e", color: "#fff", borderRadius: "5px", padding: "2px 9px", fontWeight: 700 }}>{skorRounded}</span>
                        : <span style={{ color: "#94a3b8" }}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: "#dcfce7", borderTop: "2px solid #86efac" }}>
                <td style={{ padding: "6px 9px", fontWeight: 700, color: "#166534" }}>Total</td>
                <td style={{ padding: "6px 9px", textAlign: "center", fontWeight: 700, color: "#166534" }}>60</td>
                <td style={{ padding: "6px 9px", textAlign: "center", fontWeight: 800, fontSize: "17px", color: "#166534" }}>{total}</td>
              </tr>
            </tbody>
          </table>
          {/* D. Kategori */}
          {selesai && (
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <strong>D. Kategori: </strong><BadgePredikat label={pred.label} />
            </div>
          )}
        </SectionCard>

        {/* E. Catatan & F. Kesimpulan */}
        <SectionCard judul="E. Catatan dan Saran Supervisi" warna="hijau">
          {selesai && <BannerPredikat label={pred.label} onIsotomatis={isiOtomatis} />}
          <TextareaField
            value={info.catatanB}
            onChange={v => setInfo({ ...info, catatanB: v })}
            placeholder="Catatan dan saran supervisi (terisi otomatis dari predikat, atau ketik manual)..."
            baris={3}
          />
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#166534", margin: "12px 0 7px", textTransform: "uppercase" }}>
            F. Kesimpulan
          </div>
          {/* Dua radio button kesimpulan */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Opsi 1: Sudah Memenuhi */}
            <div style={{ border: "1.5px solid #bbf7d0", borderRadius: "10px", padding: "10px", background: info.checkSudahB ? "#f0fdf4" : "#fff" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
                <input type="checkbox" checked={info.checkSudahB} onChange={e => setInfo({ ...info, checkSudahB: e.target.checked })} />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#166534" }}>☑ Guru sudah memenuhi standar supervisi</span>
              </label>
              <TextareaField
                label="Catatan (Sudah Memenuhi)"
                value={info.catatanSudahB}
                onChange={v => setInfo({ ...info, catatanSudahB: v })}
                placeholder="Tulis catatan jika guru sudah memenuhi standar..."
                baris={2}
              />
            </div>

            {/* Opsi 2: Perlu Pembinaan */}
            <div style={{ border: "1.5px solid #fecdd3", borderRadius: "10px", padding: "10px", background: info.checkPerluB ? "#fff1f2" : "#fff" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
                <input type="checkbox" checked={info.checkPerluB} onChange={e => setInfo({ ...info, checkPerluB: e.target.checked })} />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#991b1b" }}>☑ Guru perlu pembinaan pada aspek</span>
              </label>
              <TextareaField
                label="Catatan (Perlu Pembinaan)"
                value={info.catatanPerluB}
                onChange={v => setInfo({ ...info, catatanPerluB: v })}
                placeholder="Tulis catatan/aspek apa yang perlu dibina..."
                baris={2}
              />
            </div>
          </div>
        </SectionCard>

        {/* Catatan Singkat Yayasan */}
        <SectionCard judul="Catatan Singkat untuk Rekap" warna="kuning">
          <TextareaField value={info.catatanSingkat} onChange={v => setInfo({ ...info, catatanSingkat: v })} placeholder="Terisi otomatis dari predikat, atau ketik manual..." baris={2} />
        </SectionCard>

        {/* Footer */}
        <FooterSkor
          total={total} maks={MAKS_B}
          persen={parseFloat(((total / MAKS_B) * 100).toFixed(2))}
          predikat={selesai ? pred.label : null}
          label="5 aspek" sudah={selesai}
          onSimpan={handleSimpan} warna="hijau"
        />
      </div>
    </Modal>
  );
}


// ============================================================
// [SECTION 6] KOMPONEN MODAL REKAP YAYASAN
// ============================================================

// ── Modal: Rekap Yayasan (2 PDF terpisah: A & B) ──
function ModalRekapYayasan({ semuaGuru, dataPredikat, pengaturanPDF, onClose, onSimpanCatatan }) {
  // State untuk toggle mode rekap
  const [modeGabung, setModeGabung] = useState(true); // true = gabung (guru unik), false = lengkap (semua supervisi)
  
  // Fungsi helper untuk mengelompokkan guru berdasarkan nama
  const groupGuruByName = (guruList) => {
    const grouped = {};
    guruList.forEach((g) => {
      const namaKey = g.nama.trim().toLowerCase();
      if (!grouped[namaKey]) {
        grouped[namaKey] = {
          nama: g.nama,
          nuptk: g.nuptk || "-",
          mapel: g.mapel,
          template: g.template,
          supervisi: [],
          catatanSingkat: g.catatanSingkat || ""
        };
      }
      grouped[namaKey].supervisi.push(g);
    });
    
    // Hitung rata-rata untuk setiap guru
    return Object.values(grouped).map(g => {
      const jumlahSupervisi = g.supervisi.length;
      if (g.template === "A") {
        const totalSkor = g.supervisi.reduce((acc, s) => acc + s.total, 0);
        const rataRataSkor = totalSkor / jumlahSupervisi;
        const rataRataPersen = ((rataRataSkor / 80) * 100);
        return {
          ...g,
          total: rataRataSkor,
          persen: rataRataPersen,
          jumlahSupervisi: jumlahSupervisi,
          // Ambil catatan singkat dari supervisi terakhir jika ada
          catatanSingkat: g.supervisi[g.supervisi.length - 1].catatanSingkat || g.catatanSingkat
        };
      } else {
        const totalSkor = g.supervisi.reduce((acc, s) => acc + s.total, 0);
        const rataRataSkor = totalSkor / jumlahSupervisi;
        return {
          ...g,
          total: rataRataSkor,
          persen: ((rataRataSkor / 60) * 100),
          jumlahSupervisi: jumlahSupervisi,
          catatanSingkat: g.supervisi[g.supervisi.length - 1].catatanSingkat || g.catatanSingkat
        };
      }
    });
  };

  // Pisahkan guru berdasarkan template
  const guruALengkap = semuaGuru.filter(g => g.template === "A");
  const guruBLengkap = semuaGuru.filter(g => g.template === "B");
  
  // Kelompokkan berdasarkan nama (untuk mode gabung)
  const guruAGabung = groupGuruByName(guruALengkap);
  const guruBGabung = groupGuruByName(guruBLengkap);
  
  // Pilih data berdasarkan mode
  const guruA = modeGabung ? guruAGabung : guruALengkap;
  const guruB = modeGabung ? guruBGabung : guruBLengkap;

  // Inisialisasi catatan singkat per guru (dari data guru atau dari predikat)
  const [catatanA, setCatatanA] = useState(
    guruA.map(g => g.catatanSingkat || dataPredikat[getPrediakatA(g.persen).label]?.catatanSingkat || "")
  );
  const [catatanB, setCatatanB] = useState(
    guruB.map(g => g.catatanSingkat || dataPredikat[getPrediakatB(g.total).label]?.catatanSingkat || "")
  );
  
  // Update catatan saat mode berubah
  useEffect(() => {
    setCatatanA(guruA.map(g => g.catatanSingkat || dataPredikat[getPrediakatA(g.persen).label]?.catatanSingkat || ""));
    setCatatanB(guruB.map(g => g.catatanSingkat || dataPredikat[getPrediakatB(g.total).label]?.catatanSingkat || ""));
  }, [modeGabung]);

  // Hitung rata-rata dan jumlah predikat
  const rataA = guruA.length ? guruA.reduce((a, g) => a + g.persen, 0) / guruA.length : 0;
  const rataB = guruB.length ? guruB.reduce((a, g) => a + (g.total / MAKS_B) * 100, 0) / guruB.length : 0;
  const cpA = { "Sangat Baik": 0, "Baik": 0, "Cukup": 0, "Kurang": 0 };
  const cpB = { "Sangat Baik": 0, "Baik": 0, "Cukup": 0, "Kurang": 0 };
  guruA.forEach(g => { cpA[getPrediakatA(g.persen).label]++; });
  guruB.forEach(g => { cpB[getPrediakatB(g.total).label]++; });

  const [kesimpulanA, setKesimpulanA] = useState(buatKesimpulanKepsek(rataA, cpA));
  const [kesimpulanB, setKesimpulanB] = useState(buatKesimpulanKepsek(rataB, cpB));
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const styleTextarea = { width: "100%", padding: "8px 11px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" };

  // Komponen baris catatan per guru
  const BarisCatatanGuru = ({ guru, pred, catatan, onUbah }) => (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 10px", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "6px" }}>
      <div style={{ flex: "0 0 165px" }}>
        <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 500 }}>{guru.nuptk || "—"}</div>
        <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#1e293b" }}>{guru.nama}</div>
        <div style={{ fontSize: "10.5px", color: "#64748b" }}>{guru.mapel}</div>
        {modeGabung && guru.jumlahSupervisi > 1 && (
          <div style={{ fontSize: "9px", color: "#f59e0b", fontWeight: 600, marginTop: "2px" }}>
            📊 {guru.jumlahSupervisi}x supervisi (rata-rata)
          </div>
        )}
        <BadgePredikat label={pred.label} ukuran="kecil" />
      </div>
      <textarea value={catatan} onChange={e => onUbah(e.target.value)} rows={2} style={{ ...styleTextarea, flex: 1 }} />
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <HeaderModal judul="Rekap Penilaian" subjudul="Laporan Kepala Sekolah — 2 Laporan Word" onClose={onClose} />
      
      {/* Toggle Mode Rekap */}
      <div style={{ padding: "12px 22px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Mode Rekap</div>
            <div style={{ fontSize: "10px", color: "#64748b" }}>
              {modeGabung 
                ? `📊 Guru Unik: ${guruAGabung.length + guruBGabung.length} guru (rata-rata dari ${guruALengkap.length + guruBLengkap.length} supervisi)`
                : `📋 Data Lengkap: ${guruALengkap.length + guruBLengkap.length} supervisi (semua data ditampilkan)`
              }
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setModeGabung(true)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: modeGabung ? "2px solid #2563eb" : "1px solid #e2e8f0",
                background: modeGabung ? "#eff6ff" : "#fff",
                color: modeGabung ? "#1e3a8a" : "#64748b",
                fontSize: "11px",
                fontWeight: modeGabung ? 700 : 600,
                cursor: "pointer"
              }}
            >
              🔗 Gabung (Guru Unik)
            </button>
            <button
              onClick={() => setModeGabung(false)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: !modeGabung ? "2px solid #2563eb" : "1px solid #e2e8f0",
                background: !modeGabung ? "#eff6ff" : "#fff",
                color: !modeGabung ? "#1e3a8a" : "#64748b",
                fontSize: "11px",
                fontWeight: !modeGabung ? 700 : 600,
                cursor: "pointer"
              }}
            >
              📋 Lengkap (Semua Data)
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "78vh", overflowY: "auto" }}>

        {/* ── Rekap Template A ── */}
        <div style={{ border: "2px solid #bfdbfe", borderRadius: "12px", padding: "14px", background: "#f0f7ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: "14px" }}>📋 Rekap Template A</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>{guruA.length} {modeGabung ? 'guru' : 'supervisi'} · Maks 80 · Rata-rata: {rataA.toFixed(1)}%</div>
            </div>
            <button
              onClick={async () => {
                if (!guruA.length) return alert("Belum ada data Template A!");
                setLoadingA(true);
                try { await cetakRekapA(modeGabung ? guruA : guruALengkap, catatanA, kesimpulanA, pengaturanPDF); } catch { alert("Gagal unduh laporan A."); }
                setLoadingA(false);
              }}
              disabled={loadingA}
              style={{ ...GAYA.btnPrimer, background: loadingA ? "#6b7280" : "#2563eb" }}
            >
              {loadingA ? "⏳ Proses..." : "📄 Unduh Word Template A"}
            </button>
          </div>

          {/* Catatan singkat per guru A */}
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a5f", marginBottom: "7px" }}>
            Catatan Singkat Kepala Sekolah per Guru: <span style={{ fontWeight: 400, color: "#64748b" }}>(otomatis dari predikat, bisa diedit)</span>
          </div>
          {guruA.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: "12px" }}>Tidak ada guru Template A.</div>
            : guruA.map((g, i) => (
              <BarisCatatanGuru key={i} guru={g} pred={getPrediakatA(g.persen)} catatan={catatanA[i]} onUbah={v => { const n = [...catatanA]; n[i] = v; setCatatanA(n); }} />
            ))
          }

          {/* Kesimpulan A */}
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a5f", marginBottom: "5px", marginTop: "10px" }}>
            Kesimpulan Kepala Sekolah: <span style={{ fontWeight: 400, color: "#64748b" }}>(otomatis, bisa diedit)</span>
          </div>
          <textarea value={kesimpulanA} onChange={e => setKesimpulanA(e.target.value)} rows={4} style={styleTextarea} />
          <button onClick={() => setKesimpulanA(buatKesimpulanKepsek(rataA, cpA))} style={{ marginTop: "5px", background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: "6px", padding: "4px 11px", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}>
            🔄 Reset ke teks otomatis
          </button>
        </div>

        {/* ── Rekap Template B ── */}
        <div style={{ border: "2px solid #bbf7d0", borderRadius: "12px", padding: "14px", background: "#f0fdf4" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#166534", fontSize: "14px" }}>📝 Rekap Template B</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>{guruB.length} {modeGabung ? 'guru' : 'supervisi'} · Maks 60 · Rata-rata: {rataB.toFixed(1)}%</div>
            </div>
            <button
              onClick={async () => {
                if (!guruB.length) return alert("Belum ada data Template B!");
                setLoadingB(true);
                try { await cetakRekapB(modeGabung ? guruB : guruBLengkap, catatanB, kesimpulanB, pengaturanPDF); } catch { alert("Gagal unduh laporan B."); }
                setLoadingB(false);
              }}
              disabled={loadingB}
              style={{ ...GAYA.btnPrimer, background: loadingB ? "#6b7280" : "#16a34a" }}
            >
              {loadingB ? "⏳ Proses..." : "📄 Unduh Word Template B"}
            </button>
          </div>

          <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", marginBottom: "7px" }}>
            Catatan Singkat Kepala Sekolah per Guru: <span style={{ fontWeight: 400, color: "#64748b" }}>(otomatis dari predikat, bisa diedit)</span>
          </div>
          {guruB.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: "12px" }}>Tidak ada guru Template B.</div>
            : guruB.map((g, i) => (
              <BarisCatatanGuru key={i} guru={g} pred={getPrediakatB(g.total)} catatan={catatanB[i]} onUbah={v => { const n = [...catatanB]; n[i] = v; setCatatanB(n); }} />
            ))
          }

          <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534", marginBottom: "5px", marginTop: "10px" }}>
            Kesimpulan Kepala Sekolah: <span style={{ fontWeight: 400, color: "#64748b" }}>(otomatis, bisa diedit)</span>
          </div>
          <textarea value={kesimpulanB} onChange={e => setKesimpulanB(e.target.value)} rows={4} style={styleTextarea} />
          <button onClick={() => setKesimpulanB(buatKesimpulanKepsek(rataB, cpB))} style={{ marginTop: "5px", background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0", borderRadius: "6px", padding: "4px 11px", cursor: "pointer", fontWeight: 600, fontSize: "11px" }}>
            🔄 Reset ke teks otomatis
          </button>
        </div>

        {/* Info dan tombol aksi */}
        <div style={{ background: "#fef3c7", border: "1.5px solid #fbbf24", borderRadius: "8px", padding: "10px 14px", fontSize: "11px", color: "#78350f" }}>
          💡 <strong>Catatan:</strong> Perubahan catatan singkat dan kesimpulan hanya akan tersimpan jika Anda klik tombol <strong>"Simpan Perubahan Catatan"</strong> di bawah. Jika langsung unduh Word tanpa simpan, catatan hanya akan muncul di laporan Word tersebut.
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
          <button 
            onClick={() => {
              // Simpan catatan singkat ke data guru
              if (onSimpanCatatan) {
                onSimpanCatatan(guruA, catatanA, guruB, catatanB);
              }
              alert("✅ Catatan berhasil disimpan!");
            }}
            style={{ 
              background: "#16a34a", 
              color: "#fff", 
              border: "none", 
              borderRadius: "8px", 
              padding: "8px 16px", 
              cursor: "pointer", 
              fontWeight: 700, 
              fontSize: "12px" 
            }}
          >
            💾 Simpan Perubahan Catatan
          </button>
          <button onClick={onClose} style={{ ...GAYA.btnSekunder }}>Tutup</button>
        </div>
      </div>
    </Modal>
  );
}


// ============================================================
// [SECTION 7] KOMPONEN DETAIL & EDITOR
// ============================================================

// ── Modal: Detail Guru ──
function ModalDetailGuru({ guru, indikatorA, aspekB, onClose, onEdit, pengaturanPDF }) {
  const [loading, setLoading] = useState(false);
  const isB = guru.template === "B";
  const pred = getPrediakatGuru(guru);

  // Kelompokkan indikator A per kategori
  const kelompok = {};
  if (!isB) indikatorA.forEach(ind => {
    if (!kelompok[ind.kat]) kelompok[ind.kat] = [];
    kelompok[ind.kat].push(ind);
  });

  return (
    <Modal onClose={onClose}>
      <HeaderModal
        badge={`Template ${guru.template}`}
        subjudul={isB ? "15 Indikator · /60" : "20 Indikator · /80"}
        judul={guru.nama}
        onClose={onClose}
        warna={isB ? "hijau" : "biru"}
      />
      {/* Sub-header: skor & tombol aksi */}
      <div style={{
        background: isB ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#1e3a5f,#2563eb)",
        padding: "10px 22px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { l: "Skor", v: `${guru.total}/${isB ? 60 : 80}` },
            { l: "Persentase", v: `${guru.persen}%` },
            { l: "Predikat", v: pred.label },
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: "8px", padding: "4px 12px", textAlign: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px" }}>{s.l}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={async () => {
              setLoading(true);
              try { isB ? await cetakPDF_B(guru, aspekB, pengaturanPDF) : await cetakPDF_A(guru, indikatorA, pengaturanPDF); }
              catch { alert("Gagal unduh laporan."); }
              setLoading(false);
            }}
            disabled={loading}
            style={{ background: loading ? "#6b7280" : "#dc2626", border: "none", color: "#fff", borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}
          >
            {loading ? "⏳..." : "📄 Unduh Word"}
          </button>
          <button onClick={onEdit} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>✏️ Edit</button>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontSize: "12px" }}>✕</button>
        </div>
      </div>

      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: "11px", maxHeight: "62vh", overflowY: "auto" }}>
        {/* Info dasar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "6px" }}>
          {[["Mata Pelajaran", guru.mapel], ["Kelas", guru.kelas], ["Tanggal", guru.tanggal], ["Supervisor", guru.supervisor]].map(([k, v]) => (
            <div key={k} style={{ background: "#f8fafc", borderRadius: "7px", padding: "7px 10px" }}>
              <div style={{ fontSize: "10px", color: "#64748b" }}>{k}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>{v || "-"}</div>
            </div>
          ))}
        </div>

        {/* Tabel nilai Template B */}
        {isB && (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "6px 9px", textAlign: "left", color: "#64748b" }}>Aspek</th>
                  <th style={{ padding: "6px 9px", textAlign: "left", color: "#64748b" }}>Indikator</th>
                  <th style={{ padding: "6px 9px", textAlign: "center", color: "#64748b", width: "50px" }}>Skor</th>
                  <th style={{ padding: "6px 9px", textAlign: "left", color: "#64748b" }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {aspekB.map((a, i) => {
                  // Hitung total skor per aspek dari semua indikator
                  let totalSkorAspek = 0;
                  if (a.indikator) {
                    a.indikator.forEach((_, idx) => {
                      let val = guru.skor[`${a.id}_${idx}`];
                      if (val === undefined || val === "") val = guru.skor[a.id] || 0;
                      let num = parseFloat(String(val).replace(",", "."));
                      if (!isNaN(num)) totalSkorAspek += num;
                    });
                  }
                  const skorMaksAspek = a.indikator ? a.indikator.length * 4 : 4;
                  
                  return (
                    <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 ? "#fafafa" : "#fff" }}>
                      {/* 1. Aspek */}
                      <td style={{ padding: "10px 9px", fontWeight: 700, color: "#1e293b", verticalAlign: "top", width: "140px" }}>
                        {a.aspek}
                      </td>
                      {/* 2. Indikator */}
                      <td style={{ padding: "10px 9px", color: "#475569", fontSize: "11px", verticalAlign: "top", minWidth: "200px" }}>
                        {a.indikator.map((x, j) => {
                          const skorInd = guru.skor[`${a.id}_${j}`] || guru.skor[a.id] || "-";
                          return (
                            <div key={j} style={{ marginBottom: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>• {x}</span>
                              <span style={{ 
                                background: skorInd !== "-" ? WARNA_SKOR[skorInd] : "#e2e8f0", 
                                color: "#fff", 
                                borderRadius: "4px", 
                                padding: "1px 6px", 
                                fontWeight: 700, 
                                fontSize: "10px",
                                marginLeft: "8px"
                              }}>
                                {skorInd}
                              </span>
                            </div>
                          );
                        })}
                      </td>
                      {/* 3. Skor Total Aspek */}
                      <td style={{ padding: "10px 9px", textAlign: "center", verticalAlign: "top", width: "60px" }}>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: "#1e293b" }}>
                          {totalSkorAspek}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                          /{skorMaksAspek}
                        </div>
                      </td>
                      {/* 4. Catatan */}
                      <td style={{ padding: "10px 9px", color: "#475569", lineHeight: 1.5, fontSize: "11px", verticalAlign: "top" }}>
                        {guru.catatanKhusus?.[a.id] || (guru.skor[a.id] ? a.catatan[guru.skor[a.id]] : "-")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* E. Catatan Saran */}
            {guru.catatanB && (
              <SectionCard warna="hijau">
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#166534", marginBottom: "4px" }}>CATATAN SARAN</div>
                <div style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.6 }}>{guru.catatanB}</div>
              </SectionCard>
            )}

            {/* F. Kesimpulan & Catatan Tambahan */}
            <SectionCard judul="KESIMPULAN">
              {/* Baris Sudah Memenuhi */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#166534" }}>
                  {guru.checkSudahB ? "✅" : "⬜"} Guru sudah memenuhi standar supervisi
                </div>
                {guru.catatanSudahB && (
                  <div style={{ fontSize: "12px", color: "#475569", fontStyle: "italic", paddingLeft: "24px" }}>"{guru.catatanSudahB}"</div>
                )}
              </div>

              {/* Baris Perlu Pembinaan */}
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#991b1b" }}>
                  {guru.checkPerluB ? "✅" : "⬜"} Guru perlu pembinaan pada aspek
                </div>
                {guru.catatanPerluB && (
                  <div style={{ fontSize: "12px", color: "#475569", fontStyle: "italic", paddingLeft: "24px" }}>"{guru.catatanPerluB}"</div>
                )}
              </div>
            </SectionCard>
          </>
        )}

        {/* Tabel nilai Template A */}
        {!isB && (
          <>
            {Object.entries(kelompok).map(([kat, inds]) => (
              <div key={kat}>
                <div style={{ background: "#e2e8f0", padding: "5px 10px", borderRadius: "5px", marginBottom: "5px", fontSize: "11.5px", fontWeight: 700, color: "#1e293b" }}>
                  {kat}. {inds[0].katLabel}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "5px 9px", textAlign: "left", color: "#64748b" }}>Indikator</th>
                      <th style={{ padding: "5px 9px", textAlign: "center", color: "#64748b", width: "50px" }}>Skor</th>
                      <th style={{ padding: "5px 9px", textAlign: "left", color: "#64748b" }}>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inds.map((ind, i) => {
                      const s = guru.skor[ind.id];
                      return (
                        <tr key={ind.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 ? "#fafafa" : "#fff" }}>
                          <td style={{ padding: "5px 9px", color: "#1e293b" }}>{ind.judul}</td>
                          <td style={{ padding: "5px 9px", textAlign: "center" }}>
                            <span style={{ background: WARNA_SKOR[s], color: "#fff", borderRadius: "5px", padding: "2px 7px", fontWeight: 700, fontSize: "12px" }}>{s}</span>
                          </td>
                          <td style={{ padding: "5px 9px", color: "#475569", lineHeight: 1.5, fontSize: "11.5px" }}>{ind.catatan[s]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
            {(guru.kekuatan || guru.areaPerbaikan || guru.rekomendasi) && (
              <SectionCard judul="Catatan Supervisor">
                {[{ l: "Kekuatan Guru", v: guru.kekuatan }, { l: "Area Perbaikan", v: guru.areaPerbaikan }, { l: "Rekomendasi/RTL", v: guru.rekomendasi }]
                  .filter(r => r.v)
                  .map(r => (
                    <div key={r.l} style={{ marginBottom: "5px" }}>
                      <span style={{ fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>{r.l}: </span>
                      <span style={{ fontSize: "11.5px", color: "#1e293b" }}>{r.v}</span>
                    </div>
                  ))
                }
              </SectionCard>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}


// ── Modal: Edit Catatan Indikator A ──
function ModalEditCatatanA({ indikator, onSimpan, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(indikator)));
  const [kat, setKat] = useState("A");

  const daftarKat = [...new Set(data.map(d => d.kat))];
  const namaKat = { A: "Perencanaan", B: "Pelaksanaan", C: "Penilaian", D: "Adm", E: "Profesional" };

  const ubahCatatan = (id, skor, nilai) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, catatan: { ...d.catatan, [skor]: nilai } } : d));
  };

  return (
    <Modal onClose={onClose}>
      <HeaderModal subjudul="Editor Template A" judul="Kelola Catatan 20 Indikator" onClose={onClose} />
      {/* Tab kategori */}
      <div style={{ padding: "10px 22px 0", display: "flex", gap: "5px", flexWrap: "wrap" }}>
        {daftarKat.map(k => (
          <button key={k} onClick={() => setKat(k)} style={{
            border: "none", borderRadius: "6px", padding: "5px 11px", cursor: "pointer",
            fontWeight: 600, fontSize: "11px",
            background: kat === k ? "#2563eb" : "#e2e8f0",
            color: kat === k ? "#fff" : "#475569",
          }}>
            {k}. {namaKat[k]}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 22px", maxHeight: "62vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.filter(d => d.kat === kat).map(ind => (
          <div key={ind.id} style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
            <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "8px", fontSize: "12px" }}>
              <span style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", marginRight: "7px", fontSize: "10px" }}>{ind.id}</span>
              {ind.judul}
            </div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "5px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "5px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "#fff", background: WARNA_SKOR[s] }}>
                  {s}
                </div>
                <textarea
                  value={ind.catatan[s]}
                  onChange={e => ubahCatatan(ind.id, s, e.target.value)}
                  rows={2}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: "6px", border: "1.5px solid #e2e8f0", fontSize: "11.5px", fontFamily: "inherit", resize: "vertical", outline: "none" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 22px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { if (confirm("Reset semua catatan Template A ke pengaturan awal?")) setData(JSON.parse(JSON.stringify(DATA_INDIKATOR_A))); }} style={{ ...GAYA.btnSekunder, background: "#fff1f2", color: "#e11d48", border: "1.5px solid #fecdd3" }}>
          🔄 Reset ke Default
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} style={GAYA.btnSekunder}>Batal</button>
          <button onClick={() => onSimpan(data)} style={GAYA.btnPrimer}>💾 Simpan</button>
        </div>
      </div>
    </Modal>
  );
}


// ── Modal: Edit Catatan Aspek B ──
function ModalEditCatatanB({ aspekB, onSimpan, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(aspekB)));

  const ubahCatatan = (id, s, v) => setData(p => p.map(d => d.id === id ? { ...d, catatan: { ...d.catatan, [s]: v } } : d));
  const ubahIndikator = (id, i, v) => setData(p => p.map(d => d.id === id ? { ...d, indikator: d.indikator.map((x, j) => j === i ? v : x) } : d));

  return (
    <Modal onClose={onClose}>
      <HeaderModal subjudul="Editor Template B" judul="Kelola Catatan 5 Aspek" onClose={onClose} warna="hijau" />
      <div style={{ padding: "12px 22px", maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map(a => (
          <div key={a.id} style={{ border: "1.5px solid #bbf7d0", borderRadius: "11px", padding: "13px", background: "#f0fdf4" }}>
            <div style={{ fontWeight: 700, color: "#166534", marginBottom: "9px", fontSize: "13px" }}>
              <span style={{ background: "#16a34a", color: "#fff", padding: "2px 7px", borderRadius: "4px", marginRight: "8px", fontSize: "11px" }}>{a.id}</span>
              {a.aspek}
            </div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Indikator Pengamatan</div>
            {a.indikator.map((ind, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>•</span>
                <input value={ind} onChange={e => ubahIndikator(a.id, i, e.target.value)} style={{ ...GAYA.input, flex: 1, border: "1.5px solid #bbf7d0" }} />
              </div>
            ))}
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", margin: "8px 0 4px", textTransform: "uppercase" }}>Catatan per Skor</div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "5px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "5px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", color: "#fff", background: WARNA_SKOR[s] }}>
                  {s}
                </div>
                <textarea
                  value={a.catatan[s]}
                  onChange={e => ubahCatatan(a.id, s, e.target.value)}
                  rows={2}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: "6px", border: "1.5px solid #bbf7d0", fontSize: "11.5px", fontFamily: "inherit", resize: "vertical", outline: "none", background: "#fff" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 22px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { if (confirm("Reset semua catatan Template B ke pengaturan awal?")) setData(JSON.parse(JSON.stringify(DATA_ASPEK_B))); }} style={{ ...GAYA.btnSekunder, background: "#f0fdf4", color: "#166534", border: "1.5px solid #bbf7d0" }}>
          🔄 Reset ke Default
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} style={GAYA.btnSekunder}>Batal</button>
          <button onClick={() => onSimpan(data)} style={{ ...GAYA.btnPrimer, background: "linear-gradient(135deg,#166534,#16a34a)" }}>💾 Simpan</button>
        </div>
      </div>
    </Modal>
  );
}


// ── Modal: Edit Teks per Predikat ──
function ModalEditPredikat({ dataPredikat, onSimpan, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(dataPredikat)));
  const [aktif, setAktif] = useState("Sangat Baik");

  const daftarPred = ["Sangat Baik", "Baik", "Cukup", "Kurang"];
  const warnaPred = { "Sangat Baik": "#16a34a", "Baik": "#2563eb", "Cukup": "#d97706", "Kurang": "#dc2626" };
  const cur = data[aktif] || {};

  const ubah = (kunci, nilai) => setData(d => ({ ...d, [aktif]: { ...d[aktif], [kunci]: nilai } }));

  return (
    <Modal onClose={onClose}>
      <HeaderModal subjudul="Editor Predikat" judul="Kelola Teks per Predikat (A & B)" onClose={onClose} warna="gelap" />
      {/* Tombol pilih predikat */}
      <div style={{ padding: "10px 22px 0", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {daftarPred.map(p => (
          <button key={p} onClick={() => setAktif(p)} style={{
            border: "none", borderRadius: "7px", padding: "5px 12px", cursor: "pointer",
            fontWeight: 700, fontSize: "11px",
            background: aktif === p ? warnaPred[p] : "#e2e8f0",
            color: aktif === p ? "#fff" : "#475569",
          }}>
            {p}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 22px", maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "11px" }}>
        {/* Template A */}
        <SectionCard judul="🔵 Template A — Catatan Supervisor">
          {[
            { k: "kekuatan", l: "Kekuatan Guru" },
            { k: "areaPerbaikan", l: "Area yang Perlu Ditingkatkan" },
            { k: "rekomendasi", l: "Rekomendasi / Tindak Lanjut" },
          ].map(f => (
            <TextareaField key={f.k} label={f.l} value={cur[f.k] || ""} onChange={v => ubah(f.k, v)} baris={2} />
          ))}
        </SectionCard>

        {/* Template B */}
        <SectionCard judul="🟢 Template B — Catatan Saran & Kesimpulan">
          <TextareaField label="Catatan dan Saran Supervisi" value={cur.catatanB || ""} onChange={v => ubah("catatanB", v)} baris={2} />
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", margin: "9px 0 6px" }}>Kesimpulan (otomatis terceklis)</div>
          <div style={{ display: "flex", gap: "9px" }}>
            {[{ val: "sudah", teks: "✅ Sudah memenuhi standar" }, { val: "perlu", teks: "⚠️ Kurang" }].map(o => (
              <label key={o.val} style={{
                display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                padding: "7px 12px", borderRadius: "7px",
                border: `2px solid ${cur.kesimpulanB === o.val ? "#2563eb" : "#e2e8f0"}`,
                background: cur.kesimpulanB === o.val ? "#eff6ff" : "#fff", flex: 1,
              }}>
                <input type="radio" name={`kes_${aktif}`} checked={cur.kesimpulanB === o.val} onChange={() => ubah("kesimpulanB", o.val)} style={{ display: "none" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: cur.kesimpulanB === o.val ? "#1e3a8a" : "#475569" }}>{o.teks}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* Rekap Yayasan */}
        <SectionCard judul="📄 Rekap — Catatan Singkat Kepala Sekolah">
          <TextareaField value={cur.catatanSingkat || ""} onChange={v => ubah("catatanSingkat", v)} baris={2} />
        </SectionCard>
      </div>
      <div style={{ padding: "10px 22px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={onClose} style={GAYA.btnSekunder}>Batal</button>
        <button onClick={() => onSimpan(data)} style={{ ...GAYA.btnPrimer, background: "linear-gradient(135deg,#374151,#1f2937)" }}>💾 Simpan</button>
      </div>
    </Modal>
  );
}


// ============================================================
// [SECTION 8] MODAL PENGATURAN PDF
// Semua teks, label, warna, font PDF bisa diubah dari sini
// ============================================================

// ── Komponen: Color Picker (input warna + preview) ──
function ColorField({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Color swatch - klik untuk buka native color picker */}
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: "36px", height: "32px", border: "1.5px solid #cbd5e1", borderRadius: "7px", cursor: "pointer", padding: "2px" }}
        />
        {/* Teks hex yang bisa diketik manual */}
        <input
          type="text"
          value={value}
          onChange={e => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          style={{ flex: 1, padding: "6px 10px", borderRadius: "7px", border: "1.5px solid #cbd5e1", fontSize: "12px", fontFamily: "monospace", outline: "none" }}
        />
      </div>
    </div>
  );
}

// ── Komponen: Number input untuk font size ──
function FontField({ label, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "4px" }}>{label}</label>
      <input
        type="number"
        min={6} max={24}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "80px", padding: "6px 10px", borderRadius: "7px", border: "1.5px solid #cbd5e1", fontSize: "13px", outline: "none" }}
      />
      <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "6px" }}>pt</span>
    </div>
  );
}

// ── Komponen: Section untuk Panduan Variabel ──
function GuideSection({ judul, children }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e3a5f", marginBottom: "8px", borderLeft: "4px solid #2563eb", paddingLeft: "10px" }}>{judul}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "6px" }}>{children}</div>
    </div>
  );
}

// ── Komponen: Item Penanda Variabel ──
function GuideItem({ tag, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 10px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
      <code style={{ fontSize: "11.5px", fontWeight: 800, color: "#2563eb", background: "#fff", padding: "2px 6px", borderRadius: "5px", border: "1px solid #dbeafe", minWidth: "100px", textAlign: "center" }}>
        {tag}
      </code>
      <span style={{ fontSize: "11px", color: "#475569" }}>{desc}</span>
    </div>
  );
}

// ── Modal Pengaturan PDF lengkap ──
function ModalPengaturanPDF({ pengaturan, onSimpan, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(pengaturan)));
  // Tab aktif: "umum" | "lembA" | "instrB" | "rekapA" | "rekapB"
  const [tab, setTab] = useState("umum");

  // Helper untuk update nested key
  const set = (bagian, kunci, nilai) => {
    setData(prev => ({
      ...prev,
      [bagian]: { ...prev[bagian], [kunci]: nilai },
    }));
  };

  const tabs = [
    { id: "umum", label: "🌐 Umum" },
    { id: "lembA", label: "📋 Lembar A" },
    { id: "instrB", label: "📝 Instrumen B" },
    { id: "rekapA", label: "📊 Rekap A" },
    { id: "rekapB", label: "📊 Rekap B" },
    { id: "panduan", label: "📖 Panduan Variabel" },
  ];

  // Style reusable
  const gridDua = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" };
  const gridTiga = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" };

  const SubJudul = ({ children }) => (
    <div style={{
      fontSize: "11px", fontWeight: 700, color: "#374151", textTransform: "uppercase",
      letterSpacing: "0.5px", padding: "6px 10px", background: "#f1f5f9",
      borderRadius: "6px", marginBottom: "2px"
    }}>
      {children}
    </div>
  );

  return (
    <Modal onClose={onClose} lebarMaks={860}>
      <HeaderModal
        judul="Pengaturan Tampilan Word"
        subjudul="Ubah teks label dan identitas yang akan muncul di file Word"
        onClose={onClose}
        warna="gelap"
      />

      {/* Tab navigasi */}
      <div style={{ display: "flex", gap: "4px", padding: "12px 20px 0", flexWrap: "wrap", borderBottom: "2px solid #f1f5f9" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              border: "none", borderRadius: "7px 7px 0 0", padding: "7px 14px",
              cursor: "pointer", fontWeight: 700, fontSize: "12px",
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#1e3a5f" : "#64748b",
              borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Konten tab */}
      <div style={{ padding: "16px 20px", maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* ═══ TAB: UMUM ═══ */}
        {tab === "umum" && (
          <>
            <SubJudul>Identitas Sekolah (dipakai di semua laporan Word)</SubJudul>
            <div style={gridDua}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "6px" }}>Logo Sekolah</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                  {data.umum.logo && <img src={data.umum.logo} style={{ height: "40px", width: "40px", borderRadius: "6px", border: "1px solid #e2e8f0", objectFit: "contain" }} />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => set("umum", "logo", reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: "11px" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "3px" }}>Lebar (px)</label>
                    <input
                      type="number"
                      value={data.umum.logoWidth || 60}
                      onChange={e => set("umum", "logoWidth", parseInt(e.target.value) || 60)}
                      min="20"
                      max="200"
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1.5px solid #e2e8f0", fontSize: "11px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "3px" }}>Tinggi (px)</label>
                    <input
                      type="number"
                      value={data.umum.logoHeight || 60}
                      onChange={e => set("umum", "logoHeight", parseInt(e.target.value) || 60)}
                      min="20"
                      max="200"
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1.5px solid #e2e8f0", fontSize: "11px" }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px" }}>
                  💡 Ukuran default: 60×60 px. Range: 20-200 px
                </div>
              </div>
              <InputField label="Nama Sekolah (footer)" value={data.umum.namaSekolah} onChange={v => set("umum", "namaSekolah", v)} placeholder="SMKS Bhakti Insani Bogor" />
              <InputField label="Nama Sekolah (KAPITAL)" value={data.umum.namaSekolahUP} onChange={v => set("umum", "namaSekolahUP", v)} placeholder="SMKS BHAKTI INSANI BOGOR" />
              <InputField label="Nama Sekolah (TTD Template B)" value={data.umum.namaSekolahTTD} onChange={v => set("umum", "namaSekolahTTD", v)} placeholder="SMKS Bhakti Insani Bogor" />
              <InputField label="Tahun Pelajaran" value={data.umum.tahunPelajaran} onChange={v => set("umum", "tahunPelajaran", v)} placeholder="2025/2026" />
              <InputField label="Nama Kota (untuk TTD)" value={data.umum.kota} onChange={v => set("umum", "kota", v)} placeholder="Bogor" />
            </div>
          </>
        )}

        {/* ═══ TAB: LEMBAR A ═══ */}
        {tab === "lembA" && (
          <>
            <SubJudul>Teks Judul & Nama Seksi</SubJudul>
            <div style={gridDua}>
              <InputField label="Judul Dokumen" value={data.lembA.judul} onChange={v => set("lembA", "judul", v)} placeholder="LEMBAR SUPERVISI GURU" />
              <InputField label="Seksi A — Identitas" value={data.lembA.seksiIdentitas} onChange={v => set("lembA", "seksiIdentitas", v)} placeholder="A. IDENTITAS GURU" />
              <InputField label="Seksi B — Penilaian" value={data.lembA.seksiPenilaian} onChange={v => set("lembA", "seksiPenilaian", v)} placeholder="B. ASPEK PENILAIAN (Skala 1–4)" />
              <InputField label="Seksi C — Catatan" value={data.lembA.seksiCatatan} onChange={v => set("lembA", "seksiCatatan", v)} placeholder="C. CATATAN SUPERVISOR" />
              <InputField label="Seksi D — TTD" value={data.lembA.seksiTtd} onChange={v => set("lembA", "seksiTtd", v)} placeholder="D. TANDA TANGAN" />
            </div>

            <SubJudul>Label Baris Identitas</SubJudul>
            <div style={gridDua}>
              <InputField label="Label Nama Guru" value={data.lembA.lblNamaGuru} onChange={v => set("lembA", "lblNamaGuru", v)} placeholder="Nama Guru" />
              <InputField label="Label Mata Pelajaran" value={data.lembA.lblMapel} onChange={v => set("lembA", "lblMapel", v)} placeholder="Mata Pelajaran" />
              <InputField label="Label Kelas/Program" value={data.lembA.lblKelas} onChange={v => set("lembA", "lblKelas", v)} placeholder="Kelas/Program" />
              <InputField label="Label Tanggal" value={data.lembA.lblTanggal} onChange={v => set("lembA", "lblTanggal", v)} placeholder="Tanggal Supervisi" />
              <InputField label="Label Supervisor" value={data.lembA.lblSupervisor} onChange={v => set("lembA", "lblSupervisor", v)} placeholder="Supervisor" />
            </div>

            <SubJudul>Label Catatan Supervisor</SubJudul>
            <div style={gridDua}>
              <InputField label="Label Kekuatan Guru" value={data.lembA.lblKekuatan} onChange={v => set("lembA", "lblKekuatan", v)} placeholder="Kekuatan Guru" />
              <InputField label="Label Area Perbaikan" value={data.lembA.lblPerbaikan} onChange={v => set("lembA", "lblPerbaikan", v)} placeholder="Area Perbaikan" />
              <InputField label="Label Rekomendasi/RTL" value={data.lembA.lblRTL} onChange={v => set("lembA", "lblRTL", v)} placeholder="Rekomendasi/RTL" />
            </div>

            <SubJudul>Label Tanda Tangan</SubJudul>
            <div style={gridDua}>
              <InputField label="Label Guru TTD" value={data.lembA.lblGuruTtd} onChange={v => set("lembA", "lblGuruTtd", v)} placeholder="Guru yang Disupervisi" />
              <InputField label="Label Supervisor TTD" value={data.lembA.lblSpvTtd} onChange={v => set("lembA", "lblSpvTtd", v)} placeholder="Supervisor" />
            </div>

            <SubJudul>Warna & Ukuran Font</SubJudul>
            <div style={gridTiga}>
              <ColorField label="Warna Header Tabel" value={data.lembA.warnaHeaderTabel} onChange={v => set("lembA", "warnaHeaderTabel", v)} />
              <ColorField label="Warna Baris Kategori" value={data.lembA.warnaKategori} onChange={v => set("lembA", "warnaKategori", v)} />
              <ColorField label="Warna BG Label Ident." value={data.lembA.warnaBgIdentitas} onChange={v => set("lembA", "warnaBgIdentitas", v)} />
              <ColorField label="Warna BG Header Ident." value={data.lembA.warnaBgHeader} onChange={v => set("lembA", "warnaBgHeader", v)} />
              <FontField label="Font Judul" value={data.lembA.fontJudul} onChange={v => set("lembA", "fontJudul", v)} />
              <FontField label="Font Isi Tabel" value={data.lembA.fontTabel} onChange={v => set("lembA", "fontTabel", v)} />
              <FontField label="Font Catatan" value={data.lembA.fontCatatan} onChange={v => set("lembA", "fontCatatan", v)} />
            </div>
          </>
        )}

        {/* ═══ TAB: INSTRUMEN B ═══ */}
        {tab === "instrB" && (
          <>
            <SubJudul>Teks Judul & Nama Seksi</SubJudul>
            <div style={gridDua}>
              <InputField label="Judul Dokumen" value={data.instrB.judul} onChange={v => set("instrB", "judul", v)} placeholder="INSTRUMEN SUPERVISI GURU" />
              <InputField label="Seksi A — Identitas" value={data.instrB.seksiIdentitas} onChange={v => set("instrB", "seksiIdentitas", v)} placeholder="A. Identitas" />
              <InputField label="Seksi B — Aspek" value={data.instrB.seksiAspek} onChange={v => set("instrB", "seksiAspek", v)} placeholder="B. Aspek Supervisi (Skala 1-4)" />
              <InputField label="Seksi C — Rekap" value={data.instrB.seksiRekap} onChange={v => set("instrB", "seksiRekap", v)} placeholder="C. Rekap Nilai Supervisi" />
              <InputField label="Seksi D — Kategori" value={data.instrB.seksiKategori} onChange={v => set("instrB", "seksiKategori", v)} placeholder="D. Kategori Hasil Supervisi" />
              <InputField label="Seksi E — Catatan" value={data.instrB.seksiCatatan} onChange={v => set("instrB", "seksiCatatan", v)} placeholder="E. Catatan dan Saran Supervisi" />
              <InputField label="Seksi F — Kesimpulan" value={data.instrB.seksiKesimpulan} onChange={v => set("instrB", "seksiKesimpulan", v)} placeholder="F. Kesimpulan" />
            </div>

            <SubJudul>Teks Skala & Keterangan</SubJudul>
            <TextareaField label="Teks keterangan skala (di bawah header tabel)" value={data.instrB.teksSkala} onChange={v => set("instrB", "teksSkala", v)} baris={2} />

            <SubJudul>Label Identitas</SubJudul>
            <div style={gridDua}>
              <InputField label="Label Nama Guru" value={data.instrB.lblNamaGuru} onChange={v => set("instrB", "lblNamaGuru", v)} placeholder="Nama Guru" />
              <InputField label="Label Mapel/Jurusan" value={data.instrB.lblMapel} onChange={v => set("instrB", "lblMapel", v)} placeholder="Mapel/Jurusan" />
              <InputField label="Label Tanggal" value={data.instrB.lblTanggal} onChange={v => set("instrB", "lblTanggal", v)} placeholder="Tanggal Supervisi" />
              <InputField label="Label Kelas" value={data.instrB.lblKelas} onChange={v => set("instrB", "lblKelas", v)} placeholder="Kelas" />
              <InputField label="Label Supervisor" value={data.instrB.lblSupervisor} onChange={v => set("instrB", "lblSupervisor", v)} placeholder="Supervisor" />
            </div>

            <SubJudul>Teks Kesimpulan (2 Checkbox)</SubJudul>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <TextareaField label="Teks pilihan 1 (sudah memenuhi)" value={data.instrB.teksKes1} onChange={v => set("instrB", "teksKes1", v)} baris={2} />
              <TextareaField label="Teks pilihan 2 (Kurang)" value={data.instrB.teksKes2} onChange={v => set("instrB", "teksKes2", v)} baris={2} />
            </div>

            <SubJudul>Area Tanda Tangan</SubJudul>
            <div style={gridDua}>
              <InputField label="Teks 'Mengetahui'" value={data.instrB.lblMengetahui} onChange={v => set("instrB", "lblMengetahui", v)} placeholder="Mengetahui," />
              <InputField label="Label Kepala Sekolah" value={data.instrB.lblKepala} onChange={v => set("instrB", "lblKepala", v)} placeholder="Kepala SMKS Bhakti Insani Bogor" />
              <InputField label="Label Supervisor TTD" value={data.instrB.lblSpvTtd} onChange={v => set("instrB", "lblSpvTtd", v)} placeholder="Supervisor" />
            </div>

            <SubJudul>Warna & Ukuran Font</SubJudul>
            <div style={gridTiga}>
              <ColorField label="Warna Header Tabel" value={data.instrB.warnaHeaderTabel} onChange={v => set("instrB", "warnaHeaderTabel", v)} />
              <FontField label="Font Judul" value={data.instrB.fontJudul} onChange={v => set("instrB", "fontJudul", v)} />
              <FontField label="Font Isi Tabel" value={data.instrB.fontTabel} onChange={v => set("instrB", "fontTabel", v)} />
            </div>
          </>
        )}

        {/* ═══ TAB: REKAP A ═══ */}
        {tab === "rekapA" && (
          <>
            <SubJudul>Judul & Subjudul</SubJudul>
            <div style={gridDua}>
              <InputField label="Judul Utama" value={data.rekapA.judul} onChange={v => set("rekapA", "judul", v)} placeholder="REKAP PENILAIAN SUPERVISI GURU — TEMPLATE A" />
              <InputField label="Subjudul" value={data.rekapA.subjudul} onChange={v => set("rekapA", "subjudul", v)} placeholder="Untuk Laporan Kepala Sekolah kepada Yayasan" />
              <InputField label="Judul Ketentuan" value={data.rekapA.judulKetentuan} onChange={v => set("rekapA", "judulKetentuan", v)} placeholder="Ketentuan Penilaian (Template A)" />
              <InputField label="Judul Rumus" value={data.rekapA.judulRumus} onChange={v => set("rekapA", "judulRumus", v)} placeholder="Rumus Persentase" />
              <InputField label="Judul Kriteria" value={data.rekapA.judulKriteria} onChange={v => set("rekapA", "judulKriteria", v)} placeholder="Kriteria Predikat" />
              <InputField label="Judul Rekap Umum" value={data.rekapA.judulRekap} onChange={v => set("rekapA", "judulRekap", v)} placeholder="Rekap Umum Kepala Sekolah kepada Yayasan" />
              <InputField label="Judul Kesimpulan" value={data.rekapA.judulKesimpulan} onChange={v => set("rekapA", "judulKesimpulan", v)} placeholder="Kesimpulan Kepala Sekolah" />
            </div>

            <SubJudul>Teks Rumus</SubJudul>
            <InputField label="Rumus persentase" value={data.rekapA.teksRumus} onChange={v => set("rekapA", "teksRumus", v)} placeholder="Persentase = (Total Skor / 80) × 100%" full />

            <SubJudul>Label Kolom Tabel</SubJudul>
            <div style={gridDua}>
              <InputField label="Kolom No" value={data.rekapA.lblNomor} onChange={v => set("rekapA", "lblNomor", v)} placeholder="No" />
              <InputField label="Kolom Nama Guru" value={data.rekapA.lblNamaGuru} onChange={v => set("rekapA", "lblNamaGuru", v)} placeholder="Nama Guru" />
              <InputField label="Kolom Mapel" value={data.rekapA.lblMapel} onChange={v => set("rekapA", "lblMapel", v)} placeholder="Mata Pelajaran" />
              <InputField label="Kolom Total Skor" value={data.rekapA.lblTotalSkor} onChange={v => set("rekapA", "lblTotalSkor", v)} placeholder="Total Skor" />
              <InputField label="Kolom Skor Maks" value={data.rekapA.lblSkorMaks} onChange={v => set("rekapA", "lblSkorMaks", v)} placeholder="Skor Maksimal" />
              <InputField label="Kolom Persentase" value={data.rekapA.lblPersentase} onChange={v => set("rekapA", "lblPersentase", v)} placeholder="Persentase" />
              <InputField label="Kolom Predikat" value={data.rekapA.lblPredikat} onChange={v => set("rekapA", "lblPredikat", v)} placeholder="Predikat" />
              <InputField label="Kolom Catatan KS" value={data.rekapA.lblCatatanKs} onChange={v => set("rekapA", "lblCatatanKs", v)} placeholder="Catatan Singkat Kepala Sekolah" />
            </div>

            <SubJudul>Warna & Font</SubJudul>
            <div style={gridTiga}>
              <ColorField label="Warna Header Tabel" value={data.rekapA.warnaHeaderTabel} onChange={v => set("rekapA", "warnaHeaderTabel", v)} />
              <FontField label="Font Judul" value={data.rekapA.fontJudul} onChange={v => set("rekapA", "fontJudul", v)} />
              <FontField label="Font Isi Tabel" value={data.rekapA.fontTabel} onChange={v => set("rekapA", "fontTabel", v)} />
            </div>
          </>
        )}

        {/* ═══ TAB: REKAP B ═══ */}
        {tab === "rekapB" && (
          <>
            <SubJudul>Judul & Subjudul</SubJudul>
            <div style={gridDua}>
              <InputField label="Judul Utama" value={data.rekapB.judul} onChange={v => set("rekapB", "judul", v)} placeholder="REKAP PENILAIAN SUPERVISI GURU — TEMPLATE B" />
              <InputField label="Subjudul" value={data.rekapB.subjudul} onChange={v => set("rekapB", "subjudul", v)} placeholder="Untuk Laporan Kepala Sekolah kepada Yayasan" />
              <InputField label="Judul Ketentuan" value={data.rekapB.judulKetentuan} onChange={v => set("rekapB", "judulKetentuan", v)} placeholder="Ketentuan Penilaian (Template B)" />
              <InputField label="Judul Rumus" value={data.rekapB.judulRumus} onChange={v => set("rekapB", "judulRumus", v)} placeholder="Rumus Persentase" />
              <InputField label="Judul Kriteria" value={data.rekapB.judulKriteria} onChange={v => set("rekapB", "judulKriteria", v)} placeholder="Kriteria Predikat" />
              <InputField label="Judul Rekap Umum" value={data.rekapB.judulRekap} onChange={v => set("rekapB", "judulRekap", v)} placeholder="Rekap Umum Kepala Sekolah kepada Yayasan" />
              <InputField label="Judul Kesimpulan" value={data.rekapB.judulKesimpulan} onChange={v => set("rekapB", "judulKesimpulan", v)} placeholder="Kesimpulan Kepala Sekolah" />
            </div>

            <SubJudul>Teks Rumus</SubJudul>
            <InputField label="Rumus persentase" value={data.rekapB.teksRumus} onChange={v => set("rekapB", "teksRumus", v)} placeholder="Persentase = (Total Skor / 60) × 100%" full />

            <SubJudul>Label Kolom Tabel</SubJudul>
            <div style={gridDua}>
              <InputField label="Kolom No" value={data.rekapB.lblNomor} onChange={v => set("rekapB", "lblNomor", v)} placeholder="No" />
              <InputField label="Kolom Nama Guru" value={data.rekapB.lblNamaGuru} onChange={v => set("rekapB", "lblNamaGuru", v)} placeholder="Nama Guru" />
              <InputField label="Kolom Mapel" value={data.rekapB.lblMapel} onChange={v => set("rekapB", "lblMapel", v)} placeholder="Mata Pelajaran" />
              <InputField label="Kolom Total Skor" value={data.rekapB.lblTotalSkor} onChange={v => set("rekapB", "lblTotalSkor", v)} placeholder="Total Skor" />
              <InputField label="Kolom Skor Maks" value={data.rekapB.lblSkorMaks} onChange={v => set("rekapB", "lblSkorMaks", v)} placeholder="Skor Maksimal" />
              <InputField label="Kolom Persentase" value={data.rekapB.lblPersentase} onChange={v => set("rekapB", "lblPersentase", v)} placeholder="Persentase" />
              <InputField label="Kolom Predikat" value={data.rekapB.lblPredikat} onChange={v => set("rekapB", "lblPredikat", v)} placeholder="Predikat" />
              <InputField label="Kolom Catatan KS" value={data.rekapB.lblCatatanKs} onChange={v => set("rekapB", "lblCatatanKs", v)} placeholder="Catatan Singkat Kepala Sekolah" />
            </div>

            <SubJudul>Warna & Font</SubJudul>
            <div style={gridTiga}>
              <ColorField label="Warna Header Tabel" value={data.rekapB.warnaHeaderTabel} onChange={v => set("rekapB", "warnaHeaderTabel", v)} />
              <FontField label="Font Judul" value={data.rekapB.fontJudul} onChange={v => set("rekapB", "fontJudul", v)} />
              <FontField label="Font Isi Tabel" value={data.rekapB.fontTabel} onChange={v => set("rekapB", "fontTabel", v)} />
            </div>
          </>
        )}

        {/* ═══ TAB: PANDUAN VARIABEL ═══ */}
        {tab === "panduan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "10px", color: "#1e40af", fontSize: "12.5px", lineHeight: 1.6 }}>
              <strong>Cara Menggunakan:</strong> Salin kode di bawah (termasuk kurung kurawal) dan tempelkan ke posisi yang diinginkan di dalam file <strong>.docx</strong> (Microsoft Word) Anda.
            </div>

            <GuideSection judul="1. Identitas & Umum (Semua Template)">
              <GuideItem tag="{%logo}" desc="Logo Sekolah (Gunakan simbol % untuk gambar)" />
              <GuideItem tag="{namaSekolah}" desc="Nama Sekolah (untuk footer)" />
              <GuideItem tag="{namaSekolahUP}" desc="Nama Sekolah (KAPITAL)" />
              <GuideItem tag="{namaSekolahTTD}" desc="Nama Sekolah (Untuk TTD)" />
              <GuideItem tag="{tahunPelajaran}" desc="Tahun Pelajaran (Mis: 2025/2026)" />
              <GuideItem tag="{kota}" desc="Nama Kota untuk Tanda Tangan" />
              <GuideItem tag="{nuptk}" desc="NUPTK Guru" />
              <GuideItem tag="{nama}" desc="Nama Guru" />
              <GuideItem tag="{mapel}" desc="Mata Pelajaran" />
              <GuideItem tag="{kelas}" desc="Kelas/Program" />
              <GuideItem tag="{tanggal}" desc="Tanggal Supervisi" />
              <GuideItem tag="{supervisor}" desc="Nama Supervisor" />
            </GuideSection>

            <GuideSection judul="2. Khusus Template A (20 Indikator)">
              <GuideItem tag="{kekuatan}" desc="Teks Kekuatan Guru" />
              <GuideItem tag="{areaPerbaikan}" desc="Teks Area Perbaikan" />
              <GuideItem tag="{rekomendasi}" desc="Teks Rekomendasi/RTL" />
              <div style={{ marginTop: "8px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "5px" }}>Tabel Indikator (Gunakan loop)</div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", background: "#f8fafc", padding: "6px", borderRadius: "4px" }}>
                  <strong>{"{#indikator}"}</strong> ... {"{id} | {aspek} | {judul} | {skor} | {catatan}"} ... <strong>{"{/indikator}"}</strong>
                </div>
              </div>
            </GuideSection>

            <GuideSection judul="3. Khusus Template B (5 Aspek)">
              <GuideItem tag="{total}" desc="Total Skor Diperoleh" />
              <GuideItem tag="{skor_maks_total}" desc="Skor Maksimal (Angka 60)" />
              <GuideItem tag="{persen}" desc="Persentase (dari total/60 × 100)" />
              <GuideItem tag="{predikat}" desc="Predikat (Sangat Baik/dll)" />
              <GuideItem tag="{catatanB}" desc="Catatan & Saran Supervisi (Section E)" />
              <GuideItem tag="{catatan_sudahB}" desc="Catatan Kesimpulan (Opsi: Sudah)" />
              <GuideItem tag="{catatan_perluB}" desc="Catatan Kesimpulan (Opsi: Perlu)" />
              <GuideItem tag="{kesimpulan_sudahB}" desc="Teks Opsi 1 (Sudah Memenuhi) + Simbol" />
              <GuideItem tag="{kesimpulan_perluB}" desc="Teks Opsi 2 (Perlu Pembinaan) + Simbol" />
              <div style={{ marginTop: "8px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "5px" }}>Tabel Aspek (Gunakan loop)</div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", background: "#f8fafc", padding: "6px", borderRadius: "4px", marginBottom: "6px" }}>
                  <strong>{"{#aspek}"}</strong> ... {"{id} | {nama_aspek} | {indikator} | {skor} | {skor_maks_aspek} | {catatan}"} ... <strong>{"{/aspek}"}</strong>
                </div>
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>
                  <strong>💡 Tip:</strong> Gunakan <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: "3px" }}>{"{skor_per_indikator}"}</code> untuk menampilkan skor individual per indikator (1-4) dalam kolom terpisah. Format: skor dipisah dengan double newline agar sejajar dengan indikator yang ditampilkan rapat.
                </div>
              </div>
            </GuideSection>

            <GuideSection judul="4. Rekap Yayasan (Statistik)">
              <GuideItem tag="{stat_total}" desc="Total Guru Disupervisi" />
              <GuideItem tag="{stat_rata}" desc="Rata-rata Nilai Semua Guru" />
              <GuideItem tag="{stat_mayoritas}" desc="Predikat Paling Banyak Muncul" />
              <GuideItem tag="{stat_sangat_baik}" desc="Jumlah Guru Sangat Baik" />
              <GuideItem tag="{stat_baik}" desc="Jumlah Guru Baik" />
              <GuideItem tag="{stat_cukup}" desc="Jumlah Guru Cukup" />
              <GuideItem tag="{stat_pembinaan}" desc="Jumlah Guru Kurang" />
              <GuideItem tag="{kesimpulan_ks}" desc="Teks Kesimpulan Kepala Sekolah" />
              <div style={{ marginTop: "8px", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "5px" }}>Tabel Daftar Guru (Gunakan loop)</div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", background: "#f8fafc", padding: "6px", borderRadius: "4px" }}>
                  <strong>{"{#guru}"}</strong> ... {"{no} | {nuptk} | {nama} | {total} | {persen} | {predikat} | {catatan_ks}"} ... <strong>{"{/guru}"}</strong>
                </div>
              </div>
            </GuideSection>
          </div>
        )}
      </div>

      {/* Footer tombol */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        {/* Tombol reset ke default */}
        <button
          onClick={() => {
            if (confirm("Reset semua pengaturan PDF ke nilai awal?")) {
              setData(JSON.parse(JSON.stringify(DEFAULT_PENGATURAN_PDF)));
            }
          }}
          style={{ ...GAYA.btnSekunder, color: "#dc2626", borderColor: "#fca5a5" }}
        >
          🔄 Reset ke Default
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} style={GAYA.btnSekunder}>Batal</button>
          <button onClick={() => onSimpan(data)} style={GAYA.btnPrimer}>💾 Simpan Pengaturan</button>
        </div>
      </div>
    </Modal>
  );
}


// ============================================================
// [SECTION 9] APP UTAMA
// ============================================================
export default function App({ sesi, onLogout }) {

  // ── State data ──
  const [daftarGuru, setDaftarGuru] = useState([]);
  const [indikatorA, setIndikatorA] = useState(DATA_INDIKATOR_A);
  const [aspekB, setAspekB] = useState(DATA_ASPEK_B);
  const [predikat, setPredikat] = useState(DATA_PREDIKAT);
  const [pengaturanPDF, setPengaturanPDF] = useState(DEFAULT_PENGATURAN_PDF);
  const [loading, setLoading] = useState(true);

  // ── State UI ──
  // modal: null | "pilih" | "formA" | "formB" | "detail" | "rekapYayasan" | "editA" | "editB" | "editPredikat" | "pengaturanPDF"
  const [modal, setModal] = useState(null);
  const [indexGuru, setIndexGuru] = useState(null); // index guru yang dipilih
  const [cariTeks, setCariTeks] = useState("");
  const [filterTmpl, setFilterTmpl] = useState("Semua");
  const [notifSimpan, setNotifSimpan] = useState(false);
  const [halaman, setHalaman] = useState(1);

  // ── Load data dari storage saat pertama kali & Polling Real-Time ──
  useEffect(() => {
    let dipasang = true;

    const muatData = async () => {
      try { 
        const g = await window.storage.get("guru-list"); 
        if (g && dipasang) {
          let guruList = JSON.parse(g.value);
          
          // Auto-fix: Tambahkan field template jika tidak ada
          let needFix = false;
          guruList = guruList.map(guru => {
            if (!guru.template) {
              needFix = true;
              // Deteksi berdasarkan total skor
              return { ...guru, template: guru.total <= 60 ? "B" : "A" };
            }
            return guru;
          });
          
          // Simpan kembali jika ada perbaikan
          if (needFix) {
            await window.storage.set("guru-list", JSON.stringify(guruList));
            console.log("✅ Auto-fix: Field template ditambahkan ke data lama");
          }
          
          setDaftarGuru(guruList);
        }
      } catch { }
      try { const a = await window.storage.get("indikator-a"); if (a && dipasang) setIndikatorA(JSON.parse(a.value)); } catch { }
      try { const b = await window.storage.get("aspek-b"); if (b && dipasang) setAspekB(JSON.parse(b.value)); } catch { }
      try { const p = await window.storage.get("predikat-cat"); if (p && dipasang) setPredikat(JSON.parse(p.value)); } catch { }
      try { const ps = await window.storage.get("pengaturan-pdf"); if (ps && dipasang) setPengaturanPDF(JSON.parse(ps.value)); } catch { }
      if (dipasang) setLoading(false);
    };

    muatData();

    // Polling Otomatis: Ambil data guru terbaru setiap 2 detik (Pseudo Real-Time)
    const interval = setInterval(async () => {
      try {
        const g = await window.storage.get("guru-list");
        if (g && dipasang) {
          const listBaru = JSON.parse(g.value);
          setDaftarGuru(prev => {
            // Hindari re-render jika data masih sama persis
            if (JSON.stringify(prev) !== JSON.stringify(listBaru)) {
              return listBaru;
            }
            return prev;
          });
        }
      } catch (e) { }
    }, 2000);

    return () => {
      dipasang = false;
      clearInterval(interval);
    };
  }, []);

  // ── Fungsi simpan ke storage ──
  const simpanGuru = async (list) => { setDaftarGuru(list); try { await window.storage.set("guru-list", JSON.stringify(list)); } catch { } };
  const simpanIndikatorA = async (d) => { setIndikatorA(d); try { await window.storage.set("indikator-a", JSON.stringify(d)); } catch { } };
  const simpanAspekB = async (d) => { setAspekB(d); try { await window.storage.set("aspek-b", JSON.stringify(d)); } catch { } };
  const simpanPredikat = async (d) => { setPredikat(d); try { await window.storage.set("predikat-cat", JSON.stringify(d)); } catch { } };
  const simpanPengaturanPDF = async (d) => { setPengaturanPDF(d); try { await window.storage.set("pengaturan-pdf", JSON.stringify(d)); } catch { } };

  // ── Sinkronkan Catatan Template B ke Semua Guru ──
  const sinkronkanCatatanB = async () => {
    if (!confirm("Sinkronkan catatan Template B terbaru ke semua guru?\n\nIni akan mengupdate catatan default untuk guru yang belum punya catatan custom.")) return;
    
    let jumlahUpdate = 0;
    const guruBaru = daftarGuru.map(guru => {
      // Hanya update guru Template B
      if (guru.template !== "B") return guru;
      
      // Update catatan khusus per aspek jika masih pakai default lama
      const catatanKhususBaru = { ...guru.catatanKhusus };
      let adaPerubahan = false;
      
      aspekB.forEach(aspek => {
        // Cek apakah guru punya catatan custom untuk aspek ini
        if (!guru.catatanKhusus || guru.catatanKhusus[aspek.id] === undefined) {
          // Belum ada catatan custom, pakai catatan default terbaru
          // Ambil catatan berdasarkan skor yang dipilih
          if (guru.skor && guru.skor[aspek.id]) {
            const skorAspek = guru.skor[aspek.id];
            if (aspek.catatan[skorAspek]) {
              catatanKhususBaru[aspek.id] = aspek.catatan[skorAspek];
              adaPerubahan = true;
            }
          }
        }
      });
      
      if (adaPerubahan) {
        jumlahUpdate++;
        return { ...guru, catatanKhusus: catatanKhususBaru };
      }
      
      return guru;
    });
    
    await simpanGuru(guruBaru);
    alert(`✅ Berhasil sinkronkan catatan ke ${jumlahUpdate} guru Template B!`);
  };

  // ── Tampilkan notifikasi tersimpan ──
  const tampilNotif = () => {
    setNotifSimpan(true);
    setTimeout(() => setNotifSimpan(false), 2500);
  };

  // ── Simpan data guru (tambah atau edit) ──
  const handleSimpanGuru = async (data) => {
    // 1. Ambil data paling baru dari server untuk menghindari tertimpa
    let listTerbaru = [...daftarGuru]; // COPY array agar tidak mutasi
    try {
      const res = await window.storage.get("guru-list");
      if (res && res.value) {
        listTerbaru = JSON.parse(res.value);
      }
    } catch (e) {
      console.warn("Gagal mengambil data terbaru, menggunakan data lokal.");
    }

    const sedangEdit = (modal === "formA" || modal === "formB") && indexGuru !== null;
    
    // Pastikan data punya ID unik (berguna untuk multi-user)
    if (!data.id) {
      data.id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    }

    if (sedangEdit) {
      const guruAsliLokal = daftarGuru[indexGuru];
      // Cari posisi asli di server berdasarkan ID, atau fallback ke Nama+Tanggal
      let idxDiServer = listTerbaru.findIndex(g => g.id && g.id === guruAsliLokal.id);
      
      if (idxDiServer === -1) {
        idxDiServer = listTerbaru.findIndex(g => g.nama === guruAsliLokal.nama && g.tanggal === guruAsliLokal.tanggal);
      }

      if (idxDiServer !== -1) {
        // Pertahankan ID lama jika ada, tanpa memodifikasi daftarGuru asli
        const updatedItem = { ...data, id: guruAsliLokal.id || data.id };
        listTerbaru[idxDiServer] = updatedItem;
      } else {
        listTerbaru.push(data);
      }
    } else {
      listTerbaru.push(data);
    }

    await simpanGuru(listTerbaru);
    tampilNotif();
    setModal(null);
    setIndexGuru(null);
  };

  // ── Hapus guru ──
  const hapusGuru = async (idx) => {
    if (!confirm("Hapus data guru ini?")) return;
    
    const guruDihapus = daftarGuru[idx];
    
    // Ambil data terbaru dari server
    let listTerbaru = daftarGuru;
    try {
      const res = await window.storage.get("guru-list");
      if (res && res.value) listTerbaru = JSON.parse(res.value);
    } catch (e) {}

    // Hapus data yang tepat berdasarkan ID (atau nama+tanggal untuk data lama)
    const listBaru = listTerbaru.filter(g => {
      if (g.id && guruDihapus.id) return g.id !== guruDihapus.id;
      return !(g.nama === guruDihapus.nama && g.tanggal === guruDihapus.tanggal);
    });

    await simpanGuru(listBaru);
  };

  // ── Simpan catatan rekap ke data guru ──
  const simpanCatatanRekap = async (guruA, catatanA, guruB, catatanB) => {
    // Ambil data terbaru dari server
    let listTerbaru = daftarGuru;
    try {
      const res = await window.storage.get("guru-list");
      if (res && res.value) listTerbaru = JSON.parse(res.value);
    } catch (e) {}

    // Update catatan untuk guru Template A
    guruA.forEach((guru, idx) => {
      // Jika mode gabung, update semua supervisi guru tersebut
      if (guru.supervisi && guru.supervisi.length > 0) {
        guru.supervisi.forEach(supervisi => {
          const guruIdx = listTerbaru.findIndex(g => 
            (g.id && g.id === supervisi.id) || 
            (g.nama === supervisi.nama && g.tanggal === supervisi.tanggal)
          );
          if (guruIdx !== -1) {
            listTerbaru[guruIdx].catatanSingkat = catatanA[idx];
          }
        });
      } else {
        // Mode lengkap, update langsung
        const guruIdx = listTerbaru.findIndex(g => 
          (g.id && g.id === guru.id) || 
          (g.nama === guru.nama && g.tanggal === guru.tanggal)
        );
        if (guruIdx !== -1) {
          listTerbaru[guruIdx].catatanSingkat = catatanA[idx];
        }
      }
    });

    // Update catatan untuk guru Template B
    guruB.forEach((guru, idx) => {
      if (guru.supervisi && guru.supervisi.length > 0) {
        guru.supervisi.forEach(supervisi => {
          const guruIdx = listTerbaru.findIndex(g => 
            (g.id && g.id === supervisi.id) || 
            (g.nama === supervisi.nama && g.tanggal === supervisi.tanggal)
          );
          if (guruIdx !== -1) {
            listTerbaru[guruIdx].catatanSingkat = catatanB[idx];
          }
        });
      } else {
        const guruIdx = listTerbaru.findIndex(g => 
          (g.id && g.id === guru.id) || 
          (g.nama === guru.nama && g.tanggal === guru.tanggal)
        );
        if (guruIdx !== -1) {
          listTerbaru[guruIdx].catatanSingkat = catatanB[idx];
        }
      }
    });

    await simpanGuru(listTerbaru);
  };

  // ── Unduh Semua File sebagai ZIP ──
  const unduhSemuaZip = async () => {
    if (guruTerfilter.length === 0) return alert("Tidak ada data guru untuk diunduh!");
    
    setLoading(true);
    try {
      const zip = new JSZip();
      const folderA = zip.folder("Template A");
      const folderB = zip.folder("Template B");

      for (const guru of guruTerfilter) {
        if (guru.template === "A") {
          const res = await cetakPDF_A(guru, indikatorA, pengaturanPDF, true);
          if (res && res.blob) folderA.file(res.filename, res.blob);
        } else if (guru.template === "B") {
          const res = await cetakPDF_B(guru, aspekB, pengaturanPDF, true);
          if (res && res.blob) folderB.file(res.filename, res.blob);
        }
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Rekap_Semua_Supervisi.zip");
    } catch (e) {
      alert("Terjadi kesalahan saat membuat ZIP: " + e.message);
      console.error(e);
    }
    setLoading(false);
  };

  // ── Buka form edit guru ──
  const bukaEdit = (idx) => {
    setIndexGuru(idx);
    setModal(daftarGuru[idx].template === "B" ? "formB" : "formA");
  };

  // ── Filter data guru ──
  const guruTerfilter = [...daftarGuru].reverse().filter(g => {
    const cocokTeks = g.nama.toLowerCase().includes(cariTeks.toLowerCase())
      || g.mapel.toLowerCase().includes(cariTeks.toLowerCase())
      || (g.nuptk && g.nuptk.toLowerCase().includes(cariTeks.toLowerCase()));
    const cocokTmpl = filterTmpl === "Semua" || g.template === filterTmpl;
    return cocokTeks && cocokTmpl;
  });

  // ── Logika Pagination ──
  const ITEM_PER_HALAMAN = 10;
  const jumlahHalaman = Math.ceil(guruTerfilter.length / ITEM_PER_HALAMAN);
  const indexAwal = (halaman - 1) * ITEM_PER_HALAMAN;
  const guruHalamanIni = guruTerfilter.slice(indexAwal, indexAwal + ITEM_PER_HALAMAN);

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setHalaman(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cariTeks, filterTmpl]);

  // ── Fungsi helper untuk mengelompokkan guru berdasarkan nama (untuk statistik) ──
  const getGuruUnik = (guruList) => {
    const grouped = {};
    guruList.forEach((g) => {
      const namaKey = g.nama.trim().toLowerCase();
      if (!grouped[namaKey]) {
        grouped[namaKey] = {
          nama: g.nama,
          template: g.template,
          supervisi: []
        };
      }
      grouped[namaKey].supervisi.push(g);
    });
    
    return Object.values(grouped).map(g => {
      const jumlahSupervisi = g.supervisi.length;
      if (g.template === "A") {
        const totalSkor = g.supervisi.reduce((acc, s) => acc + s.total, 0);
        const rataRataSkor = totalSkor / jumlahSupervisi;
        const rataRataPersen = ((rataRataSkor / 80) * 100);
        return { ...g.supervisi[0], total: rataRataSkor, persen: rataRataPersen };
      } else {
        const totalSkor = g.supervisi.reduce((acc, s) => acc + s.total, 0);
        const rataRataSkor = totalSkor / jumlahSupervisi;
        return { ...g.supervisi[0], total: rataRataSkor, persen: ((rataRataSkor / 60) * 100) };
      }
    });
  };

  // ── Statistik header (berdasarkan guru unik) ──
  const guruUnik = getGuruUnik(daftarGuru);
  const totalGuru = guruUnik.length;
  const totalSupervisi = daftarGuru.length; // Total semua supervisi
  const rataRata = totalGuru
    ? (guruUnik.reduce((a, g) => a + (g.template === "B" ? (g.total / MAKS_B) * 100 : g.persen), 0) / totalGuru).toFixed(1)
    : 0;
  const hitungPred = { "Sangat Baik": 0, "Baik": 0, "Cukup": 0, "Kurang": 0 };
  guruUnik.forEach(g => { hitungPred[getPrediakatGuru(g).label]++; });


  // ── Tampilan Loading ──
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>⏳</div>
        <div style={{ fontSize: "14px" }}>Memuat data...</div>
      </div>
    </div>
  );


  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ================================================
          HEADER APLIKASI
          ================================================ */}
      <div style={{ background: "linear-gradient(135deg, #0f2447, #1e3a5f, #2563eb)", padding: "16px 18px" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 1%" }}>

          {/* Baris judul + tombol-tombol aksi */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {pengaturanPDF.umum.logo && (
                <img src={pengaturanPDF.umum.logo} alt="Logo" style={{ height: "45px", width: "45px", objectFit: "contain", borderRadius: "8px", background: "#fff", padding: "4px" }} />
              )}
              <div>
                <div style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  {NAMA_SEKOLAH}
                </div>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginTop: "2px" }}>
                  📋 Supervisi Guru
                </div>
              </div>
            </div>

            {/* Tombol-tombol aksi di kanan */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {/* Unduh Semua ZIP */}
              <button onClick={unduhSemuaZip} style={{ background: "#059669", border: "none", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
                📦 Download ZIP
              </button>
              {/* PDF Rekap */}
              <button onClick={() => setModal("rekapYayasan")} style={{ background: "#dc2626", border: "none", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
                📄 Rekap
              </button>
              {/* Pengaturan PDF */}
              <button onClick={() => setModal("pengaturanPDF")} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                🎨 Atur Word
              </button>
              {/* Edit Predikat */}
              <button onClick={() => setModal("editPredikat")} style={{ background: "rgba(255,200,50,0.22)", border: "1px solid rgba(255,200,50,0.4)", color: "#fde68a", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                ⭐ Predikat
              </button>
              {/* Edit Catatan A */}
              <button onClick={() => setModal("editA")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                ⚙️ Catatan A
              </button>
              {/* Edit Catatan B */}
              <button onClick={() => setModal("editB")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                ⚙️ Catatan B
              </button>
              {/* Sinkronkan Catatan B */}
              <button onClick={sinkronkanCatatanB} style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#fff", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                🔄 Sync Catatan B
              </button>
              {/* Tambah Guru */}
              <button onClick={() => { setIndexGuru(null); setModal("pilih"); }} style={{ background: "#fff", border: "none", color: "#1e3a5f", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
                + Tambah Guru
              </button>

              {/* Info Profil (Logout) */}
              <InfoPengguna sesi={sesi} onLogout={onLogout} />
            </div>
          </div>

          {/* Statistik ringkas */}
          <div style={{ display: "flex", gap: "7px", marginTop: "14px", flexWrap: "wrap" }}>
            {[
              { label: "Guru Unik", nilai: totalGuru, ikon: "👨‍🏫", tooltip: `${totalSupervisi} total supervisi` },
              { label: "Rata-rata", nilai: `${rataRata}%`, ikon: "📊" },
              { label: "Tmpl A", nilai: daftarGuru.filter(g => g.template === "A").length, ikon: "🔵", tooltip: "Total supervisi Template A" },
              { label: "Tmpl B", nilai: daftarGuru.filter(g => g.template === "B").length, ikon: "🟢", tooltip: "Total supervisi Template B" },
              { label: "Sangat Baik", nilai: hitungPred["Sangat Baik"], ikon: "⭐" },
              { label: "Baik", nilai: hitungPred["Baik"], ikon: "✅" },
              { label: "Cukup", nilai: hitungPred["Cukup"], ikon: "🟡" },
              { label: "Kurang", nilai: hitungPred["Kurang"], ikon: "🔴" },
            ].map(s => (
              <div key={s.label} title={s.tooltip || s.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "7px 11px", textAlign: "center", flex: "1 1 65px", cursor: s.tooltip ? "help" : "default" }}>
                <div style={{ fontSize: "14px" }}>{s.ikon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>{s.nilai}</div>
                <div style={{ color: "#93c5fd", fontSize: "9px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          
          {/* Info tambahan jika ada supervisi ganda */}
          {totalSupervisi > totalGuru && (
            <div style={{ marginTop: "8px", padding: "6px 10px", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.3)", borderRadius: "6px", fontSize: "10px", color: "#fde68a" }}>
              💡 <strong>{totalSupervisi} total supervisi</strong> dari <strong>{totalGuru} guru unik</strong>. Statistik predikat dihitung berdasarkan rata-rata per guru.
            </div>
          )}
        </div>
      </div>


      {/* ================================================
          KONTEN UTAMA: TABEL GURU
          ================================================ */}
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "15px 2%" }}>

        {/* Baris pencarian + filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <input
            placeholder="🔍 Cari nama guru atau mata pelajaran..."
            value={cariTeks}
            onChange={e => setCariTeks(e.target.value)}
            style={{ flex: 1, minWidth: "160px", padding: "9px 14px", borderRadius: "9px", border: "1.5px solid #e2e8f0", fontSize: "13px", outline: "none", background: "#fff" }}
          />
          {/* Tombol filter template */}
          {["Semua", "A", "B"].map(t => (
            <button
              key={t}
              onClick={() => setFilterTmpl(t)}
              style={{
                padding: "8px 14px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "12px",
                border: `2px solid ${filterTmpl === t ? "#2563eb" : "#e2e8f0"}`,
                background: filterTmpl === t ? "#eff6ff" : "#fff",
                color: filterTmpl === t ? "#2563eb" : "#64748b",
              }}
            >
              {t === "Semua" ? "Semua" : t === "A" ? "📋 Tmpl A" : "📝 Tmpl B"}
            </button>
          ))}
          {/* Notifikasi tersimpan */}
          {notifSimpan && (
            <span style={{ color: "#10b981", fontWeight: 600, fontSize: "13px" }}>✅ Tersimpan!</span>
          )}
        </div>

        {/* Tabel atau pesan kosong */}
        {guruTerfilter.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "13px", padding: "50px 20px", textAlign: "center", border: "2px dashed #e2e8f0" }}>
            <div style={{ fontSize: "40px" }}>📝</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginTop: "10px" }}>
              {cariTeks || filterTmpl !== "Semua" ? "Tidak ada guru yang cocok" : "Belum ada data guru"}
            </div>
            <div style={{ color: "#94a3b8", marginTop: "5px", fontSize: "12px" }}>
              {cariTeks || filterTmpl !== "Semua" ? "Coba ubah filter atau kata kunci pencarian" : "Klik '+ Tambah Guru' dan pilih Template A atau B"}
            </div>
          </div>
        ) : (
          /* Tabel responsif — pada layar kecil bisa di-scroll horizontal */
          <div style={{ background: "#fff", borderRadius: "13px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", minWidth: "680px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["No", "Nama Guru", "Mata Pelajaran", "Tmpl", "Tgl Supervisi", "Skor", "Predikat", "Aksi"].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px",
                      textAlign: ["No", "Tmpl", "Skor", "Predikat", "Aksi"].includes(h) ? "center" : "left",
                      color: "#64748b", fontWeight: 600, fontSize: "11.5px",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guruHalamanIni.map((g, i) => {
                  const isB = g.template === "B";
                  const pred = getPrediakatGuru(g);
                  const riGuru = daftarGuru.indexOf(g); // index asli di daftarGuru
                  
                  // Fallback: jika template tidak ada tapi total <= 60, anggap Template B
                  const maksimal = isB ? 60 : 80;

                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}
                    >
                      <td style={{ padding: "10px 12px", color: "#94a3b8", fontWeight: 600, textAlign: "center" }}>{indexAwal + i + 1}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>
                        <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 500, marginBottom: "1px" }}>{g.nuptk || "—"}</div>
                        {g.nama}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>
                        {g.mapel}
                        <br />
                        <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>{g.kelas}</span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span style={{ background: isB ? "#dcfce7" : "#dbeafe", color: isB ? "#166534" : "#1e3a8a", padding: "2px 8px", borderRadius: "20px", fontWeight: 700, fontSize: "10.5px" }}>
                          Tmpl {g.template}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#64748b", fontSize: "11.5px" }}>{g.tanggal || "—"}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "13px" }}>
                          {g.total}
                          <span style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 400 }}>/{maksimal}</span>
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748b" }}>{g.persen}%</div>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <BadgePredikat label={pred.label} />
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                          {/* Detail */}
                          <button onClick={() => { setIndexGuru(riGuru); setModal("detail"); }} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            👁
                          </button>
                          {/* Edit */}
                          <button onClick={() => bukaEdit(riGuru)} style={{ background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            ✏️
                          </button>
                          {/* Hapus */}
                          <button onClick={() => hapusGuru(riGuru)} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Navigasi Pagination */}
            {jumlahHalaman > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Menampilkan <b>{indexAwal + 1}</b> - <b>{Math.min(indexAwal + ITEM_PER_HALAMAN, guruTerfilter.length)}</b> dari <b>{guruTerfilter.length}</b> data
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => {
                      if (halaman > 1) {
                        console.log("Sebelumnya clicked, halaman:", halaman);
                        setHalaman(prev => Math.max(prev - 1, 1));
                      }
                    }}
                    onMouseEnter={e => { if (halaman !== 1) e.currentTarget.style.background = "#f1f5f9"; }}
                    onMouseLeave={e => { if (halaman !== 1) e.currentTarget.style.background = "#fff"; }}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
                      background: halaman === 1 ? "#f1f5f9" : "#fff",
                      color: halaman === 1 ? "#94a3b8" : "#1e3a5f",
                      cursor: halaman === 1 ? "not-allowed" : "pointer",
                      fontSize: "12px", fontWeight: 700, transition: "all 0.2s",
                      opacity: halaman === 1 ? 0.6 : 1,
                      pointerEvents: "auto"
                    }}
                  >
                    Sebelumnya
                  </button>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 10px", fontSize: "12px", fontWeight: 700, color: "#1e3a5f" }}>
                    Halaman {halaman} dari {jumlahHalaman}
                  </div>
                  <button
                    onClick={() => {
                      if (halaman < jumlahHalaman) {
                        console.log("Selanjutnya clicked, halaman:", halaman, "jumlahHalaman:", jumlahHalaman);
                        setHalaman(prev => Math.min(prev + 1, jumlahHalaman));
                      }
                    }}
                    onMouseEnter={e => { if (halaman < jumlahHalaman) e.currentTarget.style.background = "#f1f5f9"; }}
                    onMouseLeave={e => { if (halaman < jumlahHalaman) e.currentTarget.style.background = "#fff"; }}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
                      background: halaman >= jumlahHalaman ? "#f1f5f9" : "#fff",
                      color: halaman >= jumlahHalaman ? "#94a3b8" : "#1e3a5f",
                      cursor: halaman >= jumlahHalaman ? "not-allowed" : "pointer",
                      fontSize: "12px", fontWeight: 700, transition: "all 0.2s",
                      opacity: halaman >= jumlahHalaman ? 0.6 : 1,
                      pointerEvents: "auto"
                    }}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keterangan predikat A & B */}
        <div style={{ display: "flex", gap: "5px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 600 }}>A (% dari 80):</span>
          {[["SB ≥91%", "#d1fae5", "#065f46"], ["B ≥81%", "#dbeafe", "#1e3a8a"], ["C ≥71%", "#fef3c7", "#78350f"], ["K <71%", "#fee2e2", "#7f1d1d"]].map(([l, bg, t]) => (
            <span key={l} style={{ background: bg, color: t, borderRadius: "5px", padding: "2px 7px", fontSize: "10.5px", fontWeight: 600 }}>{l}</span>
          ))}
          <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 600, marginLeft: "8px" }}>B (skor dari 60):</span>
          {[["SB ≥54", "#d1fae5", "#065f46"], ["B ≥45", "#dbeafe", "#1e3a8a"], ["C ≥36", "#fef3c7", "#78350f"], ["K <36", "#fee2e2", "#7f1d1d"]].map(([l, bg, t]) => (
            <span key={l} style={{ background: bg, color: t, borderRadius: "5px", padding: "2px 7px", fontSize: "10.5px", fontWeight: 600 }}>{l}</span>
          ))}
        </div>
      </div>


      {/* ================================================
          MODALS
          ================================================ */}

      {/* Pilih Template */}
      {modal === "pilih" && (
        <ModalPilihTemplate
          onPilih={t => { setIndexGuru(null); setModal(t === "A" ? "formA" : "formB"); }}
          onClose={() => setModal(null)}
        />
      )}

      {/* Form Template A */}
      {modal === "formA" && (
        <FormA
          guru={indexGuru !== null ? daftarGuru[indexGuru] : null}
          indikator={indikatorA}
          onSimpan={handleSimpanGuru}
          onClose={() => { setModal(null); setIndexGuru(null); }}
          dataPredikat={predikat}
        />
      )}

      {/* Form Template B */}
      {modal === "formB" && (
        <FormB
          guru={indexGuru !== null ? daftarGuru[indexGuru] : null}
          aspekB={aspekB}
          onSimpan={handleSimpanGuru}
          onClose={() => { setModal(null); setIndexGuru(null); }}
          dataPredikat={predikat}
        />
      )}

      {/* Detail Guru */}
      {modal === "detail" && indexGuru !== null && (
        <ModalDetailGuru
          guru={daftarGuru[indexGuru]}
          indikatorA={indikatorA}
          aspekB={aspekB}
          onClose={() => { setModal(null); setIndexGuru(null); }}
          onEdit={() => bukaEdit(indexGuru)}
          pengaturanPDF={pengaturanPDF}
        />
      )}

      {/* Rekap Yayasan */}
      {modal === "rekapYayasan" && (
        <ModalRekapYayasan
          semuaGuru={daftarGuru}
          dataPredikat={predikat}
          pengaturanPDF={pengaturanPDF}
          onClose={() => setModal(null)}
          onSimpanCatatan={simpanCatatanRekap}
        />
      )}

      {/* Edit Catatan A */}
      {modal === "editA" && (
        <ModalEditCatatanA
          indikator={indikatorA}
          onSimpan={d => { simpanIndikatorA(d); setModal(null); tampilNotif(); }}
          onClose={() => setModal(null)}
        />
      )}

      {/* Edit Catatan B */}
      {modal === "editB" && (
        <ModalEditCatatanB
          aspekB={aspekB}
          onSimpan={d => { simpanAspekB(d); setModal(null); tampilNotif(); }}
          onClose={() => setModal(null)}
        />
      )}

      {/* Edit Predikat */}
      {modal === "editPredikat" && (
        <ModalEditPredikat
          dataPredikat={predikat}
          onSimpan={d => { simpanPredikat(d); setModal(null); tampilNotif(); }}
          onClose={() => setModal(null)}
        />
      )}

      {/* Pengaturan PDF */}
      {modal === "pengaturanPDF" && (
        <ModalPengaturanPDF
          pengaturan={pengaturanPDF}
          onSimpan={d => { simpanPengaturanPDF(d); setModal(null); tampilNotif(); }}
          onClose={() => setModal(null)}
        />
      )}

    </div>
  );
}