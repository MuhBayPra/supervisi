const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update fungsi cetak untuk menyertakan data dari 'ps' (pengaturanPDF)
code = code.replace(
  /async function cetakPDF_A\(guru, indikator, ps\) \{([\s\S]+?)generateDocx\("\/template_a\.docx", \{([\s\S]+?)\},/ ,
  `async function cetakPDF_A(guru, indikator, ps) {
  const dataIndikator = indikator.map((ind, i) => ({
    id: i + 1,
    judul: ind.judul,
    skor: guru.skor[ind.id] || 0,
    catatan: guru.skor[ind.id] ? ind.catatan[guru.skor[ind.id]] : ""
  }));

  generateDocx("/template_a.docx", {
    ...ps.umum,
    ...ps.lembA,
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    kekuatan: guru.kekuatan || "-",
    areaPerbaikan: guru.areaPerbaikan || "-",
    rekomendasi: guru.rekomendasi || "-",
    indikator: dataIndikator
  },`
);

code = code.replace(
  /async function cetakPDF_B\(guru, aspekB, ps\) \{([\s\S]+?)generateDocx\("\/template_b\.docx", \{([\s\S]+?)\},/ ,
  `async function cetakPDF_B(guru, aspekB, ps) {
  const dataAspek = aspekB.map((a, i) => ({
    id: i + 1,
    nama_aspek: a.aspek,
    skor: guru.skor[a.id] || 0,
    catatan: guru.skor[a.id] ? a.catatan[guru.skor[a.id]] : ""
  }));

  const pred = getPrediakatGuru(guru).label;

  generateDocx("/template_b.docx", {
    ...ps.umum,
    ...ps.instrB,
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    total: guru.total || 0,
    predikat: pred,
    catatanB: guru.catatanB || "-",
    kesimpulanB: guru.kesimpulanB === "sudah" 
        ? ps.instrB.teksKes1 
        : ps.instrB.teksKes2,
    aspek: dataAspek
  },`
);

// 2. Bersihkan ModalPengaturanPDF dari Color Picker dan Font Size
// Kita hapus InputColor dan InputFont agar user tidak bingung
const colorInputRegex = /<InputColor[\s\S]+?\/>/g;
const fontInputRegex = /<InputFont[\s\S]+?\/>/g;

code = code.replace(colorInputRegex, '<!-- Warna diatur di Word -->');
code = code.replace(fontInputRegex, '<!-- Font diatur di Word -->');

// Ganti subjudul modal
code = code.replace('subjudul="Ubah teks, label, warna, dan font tanpa edit kode"', 'subjudul="Ubah teks label dan identitas yang akan muncul di file Word"');

fs.writeFileSync('src/App.jsx', code);
console.log('Update sync settings completed');
