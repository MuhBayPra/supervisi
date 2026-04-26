const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Tambah imports
if (!code.includes('docxtemplater')) {
  code = code.replace(
    'import { useState, useEffect, useRef } from "react";',
    'import { useState, useEffect, useRef } from "react";\nimport PizZip from "pizzip";\nimport Docxtemplater from "docxtemplater";\nimport { saveAs } from "file-saver";'
  );
}

// 2. Ganti SECTION 3
const sec3Start = code.indexOf('// ============================================================\n// [SECTION 3] FUNGSI PDF');
const sec4Start = code.indexOf('// ============================================================\n// [SECTION 4] KOMPONEN UI DASAR');

const newSec3 = `// ============================================================
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

const generateDocx = (templateUrl, data, outputName) => {
  loadFile(templateUrl, (error, content) => {
    if (error) {
      alert("Error memuat template. Pastikan file " + templateUrl + " ada di folder public.");
      return;
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    doc.setData(data);
    
    try {
      doc.render();
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat mengisi template Word.");
      return;
    }
    
    const out = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    
    saveAs(out, outputName);
  });
};

// ── Cetak Template A ──
async function cetakPDF_A(guru, indikator, ps) {
  const dataIndikator = indikator.map((ind, i) => ({
    id: i + 1,
    judul: ind.judul,
    skor: guru.skor[ind.id] || 0,
    catatan: guru.skor[ind.id] ? ind.catatan[guru.skor[ind.id]] : ""
  }));

  generateDocx("/template_a.docx", {
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    kekuatan: guru.kekuatan || "-",
    areaPerbaikan: guru.areaPerbaikan || "-",
    rekomendasi: guru.rekomendasi || "-",
    indikator: dataIndikator
  }, \`LembarSupervisiA_\${guru.nama.replace(/\\s+/g, "_")}.docx\`);
}

// ── Cetak Template B ──
async function cetakPDF_B(guru, aspekB, ps) {
  const dataAspek = aspekB.map((a, i) => ({
    id: i + 1,
    nama_aspek: a.aspek,
    skor: guru.skor[a.id] || 0,
    catatan: guru.skor[a.id] ? a.catatan[guru.skor[a.id]] : ""
  }));

  // Hitung ulang jika diperlukan, tapi kita asumsikan getPrediakatB sudah ada di atasnya
  const pred = guru.template === "B" ? (guru.total >= 17 ? "Sangat Baik" : guru.total >= 13 ? "Baik" : guru.total >= 9 ? "Cukup" : "Perlu Pembinaan") : "";

  generateDocx("/template_b.docx", {
    nama: guru.nama || "-",
    mapel: guru.mapel || "-",
    kelas: guru.kelas || "-",
    tanggal: guru.tanggal || "-",
    supervisor: guru.supervisor || "-",
    total: guru.total || 0,
    predikat: pred,
    catatanB: guru.catatanB || "-",
    kesimpulanB: guru.kesimpulanB === "sudah" 
        ? "Guru sudah memenuhi standar supervisi" 
        : "Guru perlu pembinaan pada aspek penilaian dan tindak lanjut",
    aspek: dataAspek
  }, \`InstrumenSupervisiB_\${guru.nama.replace(/\\s+/g, "_")}.docx\`);
}

// ── Cetak Rekap Yayasan Template A ──
async function cetakRekapA(guruListA, catatanPerGuru, kesimpulan, ps) {
  if (!guruListA.length) {
    alert("Belum ada data guru dengan Template A.");
    return;
  }
  
  const dataGuru = guruListA.map((g, i) => ({
    no: i + 1,
    nama: g.nama,
    mapel: g.mapel,
    total: g.total,
    persen: g.persen,
    predikat: g.persen >= 91 ? "Sangat Baik" : g.persen >= 81 ? "Baik" : g.persen >= 71 ? "Cukup" : "Perlu Pembinaan",
    catatan_ks: catatanPerGuru[i] || "-"
  }));

  generateDocx("/rekap_a.docx", {
    guru: dataGuru,
    kesimpulan_ks: kesimpulan || "-"
  }, \`RekapYayasan_TemplateA.docx\`);
}

// ── Cetak Rekap Yayasan Template B ──
async function cetakRekapB(guruListB, catatanPerGuru, kesimpulan, ps) {
  if (!guruListB.length) {
    alert("Belum ada data guru dengan Template B.");
    return;
  }
  
  const dataGuru = guruListB.map((g, i) => ({
    no: i + 1,
    nama: g.nama,
    mapel: g.mapel,
    total: g.total,
    persen: ((g.total / 20) * 100).toFixed(2),
    predikat: g.total >= 17 ? "Sangat Baik" : g.total >= 13 ? "Baik" : g.total >= 9 ? "Cukup" : "Perlu Pembinaan",
    catatan_ks: catatanPerGuru[i] || "-"
  }));

  generateDocx("/rekap_b.docx", {
    guru: dataGuru,
    kesimpulan_ks: kesimpulan || "-"
  }, \`RekapYayasan_TemplateB.docx\`);
}

`;

if (sec3Start !== -1 && sec4Start !== -1) {
  code = code.substring(0, sec3Start) + newSec3 + code.substring(sec4Start);
}

// 3. Ganti text UI
code = code.replace(/📄 Export PDF/g, "📄 Unduh Word");
code = code.replace(/Gagal export PDF A\./g, "Gagal unduh laporan A.");
code = code.replace(/Gagal export PDF B\./g, "Gagal unduh laporan B.");
code = code.replace(/Gagal export PDF\./g, "Gagal unduh laporan.");

fs.writeFileSync('src/App.jsx', code);
console.log('Refactor completed');
