import { useState, useEffect, useRef } from "react";

const DEFAULT_INDIKATOR = [
  { id: 1, kat: "A", judul: "Kesesuaian CP–ATP–Modul Ajar", catatan: { 1: "Modul ajar tidak sesuai dengan CP dan ATP; tujuan pembelajaran tidak terdefinisi.", 2: "Modul ajar cukup sesuai CP dan ATP, namun tujuan pembelajaran masih kurang jelas.", 3: "Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas namun perlu sedikit penyempurnaan.", 4: "Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas, runtut, dan terukur." }},
  { id: 2, kat: "A", judul: "Ketersediaan Media, LKPD, Alat Ajar", catatan: { 1: "Tidak tersedia media, LKPD, maupun alat ajar pendukung.", 2: "Media dan LKPD tersedia sebagian, belum memadai untuk mendukung pembelajaran.", 3: "Media dan LKPD tersedia namun kurang variatif; perlu dilengkapi.", 4: "Guru menyiapkan slide, LKPD digital, dan video pembelajaran secara lengkap dan variatif." }},
  { id: 3, kat: "A", judul: "Penilaian (Rubrik & Formatif)", catatan: { 1: "Tidak tersedia rubrik maupun instrumen penilaian formatif.", 2: "Rubrik tersedia namun belum sesuai dengan tujuan pembelajaran yang ditetapkan.", 3: "Rubrik sudah tersedia namun perlu ditambahkan format refleksi dan penilaian formatif.", 4: "Rubrik lengkap, penilaian formatif terencana, dan dilengkapi instrumen refleksi siswa." }},
  { id: 4, kat: "A", judul: "Diferensiasi dalam Perencanaan", catatan: { 1: "Tidak ada upaya diferensiasi; semua siswa diperlakukan sama tanpa mempertimbangkan keberagaman.", 2: "Diferensiasi belum tampak dalam perencanaan; tugas seragam untuk semua siswa.", 3: "Sudah ada variasi tugas, tetapi belum maksimal untuk siswa dengan kemampuan beragam.", 4: "Perencanaan mencakup diferensiasi konten, proses, dan produk untuk semua level kemampuan siswa." }},
  { id: 5, kat: "B", judul: "Pembukaan (Apersepsi & Tujuan)", catatan: { 1: "Tidak ada apersepsi; tujuan pembelajaran tidak disampaikan kepada siswa.", 2: "Apersepsi dilakukan namun tidak relevan dengan materi yang akan diajarkan.", 3: "Guru menyampaikan apersepsi dan tujuan pembelajaran namun kurang menarik minat siswa.", 4: "Guru membuka pembelajaran dengan ice breaking dan mengaitkan materi dengan kehidupan sehari-hari." }},
  { id: 6, kat: "B", judul: "Penguasaan Kelas & Komunikasi", catatan: { 1: "Guru tidak mampu menguasai kelas; komunikasi tidak efektif dan kelas tidak kondusif.", 2: "Guru cukup mampu menguasai kelas namun komunikasi masih perlu banyak ditingkatkan.", 3: "Guru mampu menjaga kondusivitas kelas dengan komunikasi yang cukup baik.", 4: "Guru komunikatif, suara jelas, dan mampu menjaga fokus serta antusiasme siswa sepanjang pembelajaran." }},
  { id: 7, kat: "B", judul: "Variasi Metode (PBL, Diskusi, Praktik)", catatan: { 1: "Pembelajaran hanya menggunakan satu metode ceramah tanpa variasi apapun.", 2: "Menggunakan 2 metode namun transisi antar metode kurang lancar dan terencana.", 3: "Menggunakan beberapa metode namun belum sepenuhnya terintegrasi dengan baik.", 4: "Menggunakan metode diskusi kelompok, praktik, dan presentasi secara terpadu dan efektif." }},
  { id: 8, kat: "B", judul: "Aktivitas & Keterlibatan Siswa", catatan: { 1: "Siswa pasif; tidak ada interaksi aktif selama pembelajaran berlangsung.", 2: "Hanya sedikit siswa yang terlibat aktif; sebagian besar tidak berpartisipasi.", 3: "Sebagian besar siswa aktif, namun masih ada beberapa siswa yang pasif.", 4: "Seluruh siswa terlibat aktif; guru berhasil memotivasi semua siswa untuk berpartisipasi." }},
  { id: 9, kat: "B", judul: "Penggunaan Media Digital / Alat Praktik", catatan: { 1: "Tidak menggunakan media digital atau alat praktik apapun dalam pembelajaran.", 2: "Media digital digunakan namun tidak relevan atau tidak berfungsi secara optimal.", 3: "Guru menggunakan media digital namun kurang bervariasi dan belum dimanfaatkan maksimal.", 4: "Guru menggunakan proyektor, video, dan praktik langsung di laboratorium secara efektif." }},
  { id: 10, kat: "B", judul: "Penutup (Refleksi & Rangkuman)", catatan: { 1: "Tidak ada kegiatan penutup; pembelajaran berakhir tanpa rangkuman maupun refleksi.", 2: "Guru memberikan rangkuman singkat tanpa melibatkan siswa dalam refleksi.", 3: "Guru memberikan rangkuman, tetapi refleksi siswa belum dilakukan secara menyeluruh.", 4: "Guru melakukan rangkuman dan refleksi siswa secara menyeluruh, interaktif, dan bermakna." }},
  { id: 11, kat: "C", judul: "Penilaian sesuai Tujuan Pembelajaran", catatan: { 1: "Penilaian tidak sesuai dengan tujuan pembelajaran yang telah ditetapkan.", 2: "Penilaian sebagian sesuai tujuan pembelajaran namun perlu banyak penyesuaian.", 3: "Penilaian sebagian besar sesuai tujuan pembelajaran; perlu sedikit penyesuaian.", 4: "Penilaian sepenuhnya sesuai dengan tujuan pembelajaran yang ditetapkan secara menyeluruh." }},
  { id: 12, kat: "C", judul: "Penggunaan Rubrik Penilaian", catatan: { 1: "Rubrik penilaian tidak digunakan sama sekali dalam proses penilaian.", 2: "Rubrik digunakan namun tidak dikomunikasikan atau dijelaskan kepada siswa.", 3: "Rubrik digunakan namun belum dijelaskan kepada siswa sebelum kegiatan praktik dimulai.", 4: "Rubrik digunakan secara konsisten dan dijelaskan kepada siswa sebelum praktik dimulai." }},
  { id: 13, kat: "C", judul: "Umpan Balik kepada Siswa", catatan: { 1: "Tidak ada umpan balik yang diberikan kepada siswa selama maupun setelah pembelajaran.", 2: "Umpan balik diberikan namun bersifat umum dan kurang spesifik bagi setiap siswa.", 3: "Guru memberikan umpan balik kepada sebagian siswa; belum merata ke seluruh kelas.", 4: "Guru memberikan umpan balik langsung dan spesifik kepada setiap siswa saat praktik berlangsung." }},
  { id: 14, kat: "C", judul: "Administrasi Nilai Rapi", catatan: { 1: "Administrasi nilai tidak tersedia atau tidak teratur sama sekali.", 2: "Administrasi nilai tersedia namun belum lengkap dan perlu banyak perbaikan.", 3: "Administrasi nilai cukup lengkap namun perlu perapian dan pelengkapan data.", 4: "Administrasi nilai lengkap, akurat, dan tersusun dengan sangat baik." }},
  { id: 15, kat: "D", judul: "Kehadiran & Ketepatan Waktu", catatan: { 1: "Guru sering tidak hadir dan tidak tepat waktu dalam melaksanakan tugas.", 2: "Kehadiran cukup namun guru sering terlambat masuk kelas.", 3: "Kehadiran baik namun sesekali terlambat; perlu konsistensi yang lebih baik.", 4: "Guru hadir tepat waktu dan mengikuti seluruh jadwal KBM dengan penuh tanggung jawab." }},
  { id: 16, kat: "D", judul: "Kelengkapan Administrasi", catatan: { 1: "Administrasi pembelajaran tidak tersedia atau sangat tidak lengkap.", 2: "Administrasi pembelajaran tersedia sebagian; banyak dokumen yang belum terpenuhi.", 3: "Administrasi cukup lengkap; masih ada beberapa dokumen yang perlu dilengkapi.", 4: "Semua administrasi pembelajaran tersedia lengkap dan terorganisir dengan sangat baik." }},
  { id: 17, kat: "D", judul: "Pelaksanaan Tugas Tambahan (Wali/Ekskul)", catatan: { 1: "Tugas tambahan tidak dilaksanakan; tidak ada dokumentasi kegiatan.", 2: "Tugas tambahan dilaksanakan namun tanpa dokumentasi yang memadai.", 3: "Guru menjalankan tugas tambahan dengan baik, namun dokumentasi perlu ditingkatkan.", 4: "Guru melaksanakan tugas tambahan dengan sangat baik disertai dokumentasi yang lengkap." }},
  { id: 18, kat: "E", judul: "Etika & Komunikasi", catatan: { 1: "Guru kurang sopan dan komunikasi tidak profesional dalam lingkungan sekolah.", 2: "Etika cukup baik namun komunikasi profesional masih perlu diperbaiki.", 3: "Guru bersikap sopan dan profesional dalam sebagian besar situasi.", 4: "Guru senantiasa bersikap sopan, santun, dan profesional dalam semua situasi." }},
  { id: 19, kat: "E", judul: "Kerjasama & Kolaborasi", catatan: { 1: "Guru tidak aktif berkolaborasi dan cenderung bekerja sendiri.", 2: "Guru kadang berkolaborasi namun perlu lebih proaktif dalam kegiatan bersama.", 3: "Guru cukup aktif bekerja sama namun belum konsisten dalam berkolaborasi.", 4: "Guru aktif bekerja sama dengan rekan guru, wali kelas, dan seluruh warga sekolah." }},
  { id: 20, kat: "E", judul: "Komitmen Terhadap Sekolah", catatan: { 1: "Guru kurang menunjukkan komitmen dan loyalitas terhadap sekolah.", 2: "Komitmen cukup namun partisipasi dalam kegiatan sekolah masih rendah.", 3: "Guru berkomitmen baik namun partisipasi dalam kegiatan sekolah perlu ditingkatkan.", 4: "Guru memiliki loyalitas tinggi dan aktif berpartisipasi dalam seluruh kegiatan sekolah." }},
];

const KAT_LABEL = { A:"Perencanaan Pembelajaran", B:"Pelaksanaan Pembelajaran", C:"Penilaian Pembelajaran", D:"Tugas Tambahan & Administrasi", E:"Sikap Profesional & Etika" };
const SKOR_MAX = 80;
const SEKOLAH = "SMK Bhakti Insani Bogor";
const SKOR_COLOR = ["","#ef4444","#f59e0b","#3b82f6","#10b981"];

const storageApi = {
  async get(key) {
    if (window.storage?.get) return window.storage.get(key);
    const value = window.localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    if (window.storage?.set) {
      await window.storage.set(key, value);
      return;
    }
    window.localStorage.setItem(key, value);
  },
};

function getPred(p) {
  if (p >= 91) return { label:"Sangat Baik",  bg:"#d1fae5", text:"#065f46", c:[16,185,129] };
  if (p >= 81) return { label:"Baik",          bg:"#dbeafe", text:"#1e3a8a", c:[59,130,246] };
  if (p >= 71) return { label:"Cukup",         bg:"#fef3c7", text:"#78350f", c:[245,158,11] };
  return        { label:"Perlu Pembinaan",      bg:"#fee2e2", text:"#7f1d1d", c:[239,68,68] };
}

function getPredRange(label) {
  if (label === "Sangat Baik") return "91-100%";
  if (label === "Baik") return "81-90%";
  if (label === "Cukup") return "71-80%";
  return "<= 70%";
}

function getSortedIndicatorsByScore(guru, indikator) {
  const mapped = indikator.map((ind) => ({
    id: ind.id,
    judul: ind.judul,
    skor: Number(guru.skor?.[ind.id] || 0),
  }));
  return mapped.sort((a, b) => b.skor - a.skor || a.id - b.id);
}

function buildFeedbackSummary(guru, indikator) {
  const sorted = getSortedIndicatorsByScore(guru, indikator);
  const strengths = sorted.filter((x) => x.skor >= 4).slice(0, 3);
  const improve = [...sorted].reverse().filter((x) => x.skor > 0 && x.skor <= 3).slice(0, 3);

  const strengthText = strengths.length
    ? `Kekuatan utama terlihat pada: ${strengths.map((x) => x.judul).join(", ")}.`
    : "Guru telah menunjukkan upaya baik selama proses pembelajaran dan supervisi.";

  const improveText = improve.length
    ? `Area yang perlu ditingkatkan: ${improve.map((x) => x.judul).join(", ")}.`
    : "Belum ada area kritis; pertahankan kualitas dan konsistensi pembelajaran.";

  let rtl = "Lakukan coaching terarah, pendampingan perangkat ajar, dan supervisi lanjutan secara berkala.";
  const pred = getPred(guru.persen).label;
  if (pred === "Sangat Baik") {
    rtl = "Pertahankan praktik baik, bagikan praktik pembelajaran ke guru lain, dan jadikan model internal sekolah.";
  } else if (pred === "Baik") {
    rtl = "Perkuat refleksi siswa, variasi metode, dan diferensiasi melalui coaching internal 1 bulan ke depan.";
  } else if (pred === "Cukup") {
    rtl = "Diperlukan pendampingan intensif 2-4 minggu pada perencanaan, media ajar, dan strategi keterlibatan siswa.";
  }

  return { strengthText, improveText, rtl };
}

function buildRekapCatatan(guru, indikator) {
  const pred = getPred(guru.persen).label;
  const weakAreas = getSortedIndicatorsByScore(guru, indikator)
    .reverse()
    .filter((x) => x.skor > 0 && x.skor <= 3)
    .slice(0, 2)
    .map((x) => x.judul.toLowerCase());

  if (pred === "Sangat Baik") {
    return weakAreas.length
      ? `Kinerja sangat baik, perlu penguatan pada ${weakAreas.join(" dan ")}.`
      : "Kinerja sangat baik dan konsisten pada seluruh aspek supervisi.";
  }
  if (pred === "Baik") {
    return weakAreas.length
      ? `Kinerja baik, perlu peningkatan pada ${weakAreas.join(" dan ")}.`
      : "Kinerja baik, lanjutkan perbaikan berkelanjutan pada proses pembelajaran.";
  }
  if (pred === "Cukup") {
    return weakAreas.length
      ? `Perlu pendampingan pada ${weakAreas.join(" dan ")} agar hasil supervisi meningkat.`
      : "Perlu pendampingan terarah agar kualitas pembelajaran meningkat.";
  }
  return "Memerlukan pembinaan khusus, coaching rutin, dan monitoring mingguan.";
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
async function ensureTesseract() {
  if (window.Tesseract) return window.Tesseract;
  await loadScript("https://unpkg.com/tesseract.js@4.1.3/dist/tesseract.min.js");
  if (!window.Tesseract) throw new Error("Tesseract tidak tersedia");
  return window.Tesseract;
}
async function recognizeTextFromFile(file, onProgress) {
  const T = await ensureTesseract();
  const worker = T.createWorker({
    logger: (m) => {
      if (onProgress) onProgress(m.progress || 0, m.status || "Memproses gambar...");
    },
  });
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const { data } = await worker.recognize(file);
  await worker.terminate();
  return data.text;
}
function normalizeOcrText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/–/g, "-")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}
function findFieldValue(text, labels) {
  for (const label of labels) {
    const regex = new RegExp(label + "\\s*[:\\-]?\\s*([^\\n\\r]+)", "i");
    const match = text.match(regex);
    if (match && match[1]) return match[1].trim();
  }
  return "";
}
function parseScoresFromText(text) {
  const skor = {};
  DEFAULT_INDIKATOR.forEach((ind) => { skor[ind.id] = 0; });
  const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const matches = [];

  for (const line of lines) {
    const exact = line.match(/^\s*(\d{1,2})\D*([1-4])\b/);
    if (exact) {
      matches.push({ id: Number(exact[1]), score: Number(exact[2]) });
      continue;
    }
    const loose = line.match(/\b([1-4])\b/);
    if (loose) {
      matches.push({ score: Number(loose[1]) });
    }
  }

  if (matches.length >= 20 && matches.every((item) => item.score >= 1 && item.score <= 4)) {
    matches.slice(0, 20).forEach((item, index) => {
      const id = item.id >= 1 && item.id <= 20 ? item.id : DEFAULT_INDIKATOR[index].id;
      skor[id] = item.score;
    });
    return skor;
  }

  const found = [...text.matchAll(/\b([1-4])\b/g)].map((m) => Number(m[1]));
  found.slice(0, 20).forEach((score, index) => {
    skor[DEFAULT_INDIKATOR[index].id] = score;
  });
  return skor;
}
function parseScanText(rawText) {
  const text = normalizeOcrText(rawText);
  const info = {
    nama: findFieldValue(text, ["Nama Guru", "Nama"].map((t) => t.replace(/ /g, "\\s*"))),
    mapel: findFieldValue(text, ["Mata Pelajaran", "Mapel"].map((t) => t.replace(/ /g, "\\s*"))),
    kelas: findFieldValue(text, ["Kelas / Program", "Kelas", "Program"].map((t) => t.replace(/ /g, "\\s*"))),
    tanggal: findFieldValue(text, ["Tanggal Supervisi", "Tanggal"].map((t) => t.replace(/ /g, "\\s*"))),
    supervisor: findFieldValue(text, ["Supervisor", "Pengawas"].map((t) => t.replace(/ /g, "\\s*"))),
  };
  const skor = parseScoresFromText(text);
  const scoreCount = Object.values(skor).filter((value) => value > 0).length;
  const fieldCount = Object.values(info).filter(Boolean).length;
  const confidence = Math.round(((scoreCount / 20) * 0.7 + (fieldCount / 5) * 0.3) * 100);
  return { info, skor, confidence, text };
}
async function ensureJsPDF() {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js");
}

async function exportGuruPDF(guru, indikator) {
  await ensureJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.getWidth();
  const pred = getPred(guru.persen);
  const now = new Date().toLocaleDateString("id-ID");
  const { strengthText, improveText, rtl } = buildFeedbackSummary(guru, indikator);

  doc.setTextColor(0);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("LAPORAN HASIL SUPERVISI GURU", W/2, 14, { align:"center" });
  doc.setFontSize(11);
  doc.text(SEKOLAH.toUpperCase(), W/2, 20, { align:"center" });
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Untuk Laporan Kepala Sekolah kepada Yayasan", W/2, 25, { align:"center" });

  let y = 32;
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("A. IDENTITAS GURU", 14, y);
  y += 2;

  doc.autoTable({
    startY: y + 1,
    margin: { left:14, right:14 },
    head: [["KOMPONEN", "KETERANGAN"]],
    body: [
      ["Nama Guru", `: ${guru.nama || "-"}`],
      ["Mata Pelajaran", `: ${guru.mapel || "-"}`],
      ["Kelas / Program", `: ${guru.kelas || "-"}`],
      ["Tanggal Supervisi", `: ${guru.tanggal || "-"}`],
      ["Supervisor", `: ${guru.supervisor || "-"}`],
    ],
    theme: "grid",
    styles: { font:"times", fontSize:9.5, cellPadding:2 },
    headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
    columnStyles: {
      0: { cellWidth:50, fontStyle:"bold" },
      1: { cellWidth:W - 28 - 50 },
    },
  });

  y = doc.lastAutoTable.finalY + 3;
  doc.setFont("times", "normal");
  doc.setFontSize(9.5);
  doc.text(`Total Skor: ${guru.total} dari ${SKOR_MAX}`, 14, y);
  doc.text(`Persentase: ${guru.persen}%`, 75, y);
  doc.text(`Predikat: ${pred.label} (${getPredRange(pred.label)})`, 122, y);

  y += 7;
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("B. ASPEK PENILAIAN (Skala 1-4)", 14, y);

  const katGroups = {};
  indikator.forEach(ind => { if (!katGroups[ind.kat]) katGroups[ind.kat] = []; katGroups[ind.kat].push(ind); });

  const aspectRows = [];
  Object.entries(katGroups).forEach(([kat, inds]) => {
    aspectRows.push([{ content: `${kat}. ${KAT_LABEL[kat].toUpperCase()}`, colSpan:4, styles: { fontStyle:"bold", fillColor:[245,245,245], textColor:20 } }]);
    inds.forEach((ind) => {
      const s = Number(guru.skor?.[ind.id] || 0);
      aspectRows.push([String(ind.id), ind.judul, s ? String(s) : "-", s ? (ind.catatan[s] || "-") : "-"]);
    });
  });

  doc.autoTable({
    startY: y + 1,
    margin: { left:14, right:14 },
    head: [["No", "Aspek / Indikator", "Skor", "Catatan"]],
    body: aspectRows,
    theme: "grid",
    styles: { font:"times", fontSize:8.8, cellPadding:1.6, valign:"middle", lineColor:[120,120,120], lineWidth:0.1 },
    headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
    columnStyles: {
      0: { cellWidth:10, halign:"center" },
      1: { cellWidth:58 },
      2: { cellWidth:12, halign:"center", fontStyle:"bold" },
      3: { cellWidth:W - 28 - 10 - 58 - 12 },
    },
  });

  y = doc.lastAutoTable.finalY + 5;
  if (y > 240) { doc.addPage(); y = 18; }

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("C. CATATAN SUPERVISOR", 14, y);

  doc.autoTable({
    startY: y + 1,
    margin: { left:14, right:14 },
    head: [["Keterangan", "Isi"]],
    body: [
      ["Kekuatan Guru", strengthText],
      ["Area Perbaikan", improveText],
      ["Rekomendasi / RTL", rtl],
    ],
    theme: "grid",
    styles: { font:"times", fontSize:9, cellPadding:2 },
    headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
    columnStyles: {
      0: { cellWidth:45, fontStyle:"bold" },
      1: { cellWidth:W - 28 - 45 },
    },
  });

  y = doc.lastAutoTable.finalY + 5;
  if (y > 240) { doc.addPage(); y = 18; }

  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("D. TANDA TANGAN", 14, y);

  doc.autoTable({
    startY: y + 1,
    margin: { left:14, right:14 },
    head: [["Guru yang Disupervisi", "Supervisor"]],
    body: [[`( ${guru.nama || "..............................."} )`, `( ${guru.supervisor || "..............................."} )`]],
    theme: "grid",
    styles: { font:"times", fontSize:10, cellPadding:2, halign:"center", valign:"bottom" },
    headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold" },
    bodyStyles: { minCellHeight:20 },
    columnStyles: {
      0: { cellWidth:(W - 28) / 2 },
      1: { cellWidth:(W - 28) / 2 },
    },
  });

  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`${SEKOLAH} - Dicetak: ${now} - Hal ${i}/${pages}`, W/2, 292, { align:"center" });
  }

  doc.save(`Supervisi_${guru.nama.replace(/\s+/g,"_")}.pdf`);
}

  async function exportRekapPDF(guruList, indikatorRef = DEFAULT_INDIKATOR) {
    await ensureJsPDF();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
    const W = doc.internal.pageSize.getWidth();
    const now = new Date().toLocaleDateString("id-ID");

    doc.setTextColor(0);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("REKAP PENILAIAN SUPERVISI GURU", W/2, 14, { align:"center" });
    doc.setFontSize(10.5);
    doc.text("Untuk Laporan Kepala Sekolah kepada Yayasan", W/2, 20, { align:"center" });
    doc.text(SEKOLAH, W/2, 26, { align:"center" });

    const total = guruList.length;
    const avg = total ? (guruList.reduce((a,b)=>a+b.persen,0) / total).toFixed(2) : "0.00";
    const cp = { "Sangat Baik":0, "Baik":0, "Cukup":0, "Perlu Pembinaan":0 };
    guruList.forEach((g) => { cp[getPred(g.persen).label]++; });

    let y = 34;
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Ketentuan Penilaian", 14, y);
    doc.setFont("times", "normal");
    doc.setFontSize(9.2);
    y += 5;
    doc.text("- Jumlah indikator: 20", 16, y);
    y += 4;
    doc.text("- Skor minimal per indikator: 1", 16, y);
    y += 4;
    doc.text("- Skor maksimal per indikator: 4", 16, y);
    y += 4;
    doc.text(`- Skor maksimal keseluruhan: ${SKOR_MAX}`, 16, y);
    y += 5;
    doc.setFont("times", "bold");
    doc.text("Rumus Persentase", 14, y);
    doc.setFont("times", "normal");
    y += 4;
    doc.text(`Persentase = (Total Skor / ${SKOR_MAX}) x 100%`, 16, y);

    y += 8;
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Rekap Umum Kepala Sekolah kepada Yayasan", 14, y);

    const rows = guruList.map((g, i) => {
      const pred = getPred(g.persen).label;
      return [
        i + 1,
        g.nama,
        g.mapel,
        g.total,
        SKOR_MAX,
        `${Number(g.persen).toFixed(2)}%`,
        pred,
        buildRekapCatatan(g, indikatorRef),
      ];
    });

    doc.autoTable({
      startY: y + 1,
      margin: { left:14, right:14 },
      head: [["No", "Nama Guru", "Mata Pelajaran", "Total Skor", "Skor Maksimal", "Persentase", "Predikat", "Catatan Singkat Kepala Sekolah"]],
      body: rows,
      theme: "grid",
      styles: { font:"times", fontSize:8.6, cellPadding:1.5, lineColor:[120,120,120], lineWidth:0.1 },
      headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
      columnStyles: {
        0: { cellWidth:10, halign:"center" },
        1: { cellWidth:45 },
        2: { cellWidth:35 },
        3: { cellWidth:16, halign:"center" },
        4: { cellWidth:19, halign:"center" },
        5: { cellWidth:18, halign:"center" },
        6: { cellWidth:26, halign:"center", fontStyle:"bold" },
        7: { cellWidth:W - 28 - 10 - 45 - 35 - 16 - 19 - 18 - 26 },
      },
    });

    y = doc.lastAutoTable.finalY + 5;
    if (y > 180) { doc.addPage(); y = 16; }

    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Kriteria Predikat", 14, y);
    doc.autoTable({
      startY: y + 1,
      margin: { left:14 },
      head: [["Persentase", "Predikat"]],
      body: [
        ["91-100%", "Sangat Baik"],
        ["81-90%", "Baik"],
        ["71-80%", "Cukup"],
        ["<= 70%", "Perlu Pembinaan"],
      ],
      theme: "grid",
      styles: { font:"times", fontSize:9, cellPadding:2 },
      headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
      columnStyles: {
        0: { cellWidth:35, halign:"center" },
        1: { cellWidth:45, halign:"center" },
      },
    });

    doc.autoTable({
      startY: y + 1,
      margin: { left:105 },
      head: [["Komponen", "Hasil"]],
      body: [
        ["Jumlah Guru Disupervisi", `${total} Guru`],
        ["Rata-rata Nilai Supervisi", `${avg}%`],
        ["Predikat Mayoritas", Object.entries(cp).sort((a,b) => b[1] - a[1])[0]?.[0] || "-"],
        ["Guru dengan Predikat Sangat Baik", `${cp["Sangat Baik"]} Guru`],
        ["Guru dengan Predikat Baik", `${cp["Baik"]} Guru`],
        ["Guru dengan Predikat Cukup", `${cp["Cukup"]} Guru`],
        ["Guru yang Memerlukan Pembinaan Khusus", `${cp["Perlu Pembinaan"]} Guru`],
      ],
      theme: "grid",
      styles: { font:"times", fontSize:9, cellPadding:2 },
      headStyles: { fillColor:[240,240,240], textColor:20, fontStyle:"bold", halign:"center" },
      columnStyles: {
        0: { cellWidth:70 },
        1: { cellWidth:55 },
      },
    });

    y = doc.lastAutoTable.finalY + 6;
    if (y > 180) { doc.addPage(); y = 16; }

    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("Kesimpulan Kepala Sekolah", 14, y);

    doc.setFont("times", "normal");
    doc.setFontSize(9.2);
    const p1 = "Secara umum, hasil supervisi menunjukkan bahwa sebagian besar guru telah melaksanakan pembelajaran dengan baik, administrasi cukup lengkap, serta memiliki komitmen yang tinggi terhadap sekolah. Area yang masih perlu ditingkatkan meliputi diferensiasi pembelajaran, penggunaan refleksi siswa, variasi metode, dan penguatan rubrik penilaian.";
    const p2 = "Ke depan, sekolah akan melakukan tindak lanjut berupa pelatihan internal, coaching per bidang studi, supervisi lanjutan, dan pendampingan administrasi pembelajaran agar kualitas guru terus meningkat secara berkelanjutan.";

    const t1 = doc.splitTextToSize(p1, W - 28);
    const t2 = doc.splitTextToSize(p2, W - 28);
    y += 4.5;
    doc.text(t1, 14, y);
    y += (t1.length * 4.2) + 2.5;
    doc.text(t2, 14, y);

    const pages = doc.internal.getNumberOfPages();
    for (let i=1; i<=pages; i++) {
      doc.setPage(i);
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`${SEKOLAH} - Dicetak: ${now} - Hal ${i}/${pages}`, W/2, 205, { align:"center" });
    }

    doc.save(`Rekap_Supervisi_${SEKOLAH.replace(/\s+/g,"_")}.pdf`);
}

function Modal({onClose,children}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.75)",zIndex:50,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:880,boxShadow:"0 25px 60px rgba(0,0,0,0.3)",marginTop:20,marginBottom:20}}>{children}</div>
  </div>);
}

function ScanSupervisiModal({onClose,onApply}){
  const fileRef=useRef(null);
  const[file,setFile]=useState(null);
  const[previewUrl,setPreviewUrl]=useState("");
  const[processing,setProcessing]=useState(false);
  const[progress,setProgress]=useState(0);
  const[status,setStatus]=useState("Siap memproses foto supervisi.");
  const[result,setResult]=useState(null);
  const[errMsg,setErrMsg]=useState("");

  useEffect(()=>()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);},[previewUrl]);

  const onFileSelected=(nextFile)=>{
    if(!nextFile)return;
    setResult(null);
    setErrMsg("");
    setProgress(0);
    setStatus("Foto dipilih, siap diproses.");
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setFile(nextFile);
  };

  const runOcr=async()=>{
    if(!file)return alert("Pilih foto terlebih dahulu.");
    setProcessing(true);
    setErrMsg("");
    setResult(null);
    try{
      const text=await recognizeTextFromFile(file,(p,s)=>{
        setProgress(Math.round((p||0)*100));
        if(s)setStatus(s);
      });
      const parsed=parseScanText(text);
      setResult(parsed);
      setStatus("Scan selesai. Silakan cek hasilnya sebelum lanjut.");
      if(parsed.confidence<45)setErrMsg("Akurasi scan masih rendah. Coba foto lebih terang dan tegak lurus.");
    }catch{
      setErrMsg("Gagal memproses foto. Pastikan koneksi internet stabil lalu coba lagi.");
    }finally{
      setProcessing(false);
    }
  };

  const scoreCount=result?Object.values(result.skor).filter(v=>v>0).length:0;

  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#0f2447,#2563eb)",borderRadius:"16px 16px 0 0",padding:"18px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div>
          <div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Input Cepat via Kamera HP</div>
          <div style={{color:"#fff",fontSize:18,fontWeight:700}}>Scan Kertas Supervisi Guru</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"7px 14px",cursor:"pointer"}}>Tutup</button>
      </div>
    </div>

    <div style={{padding:"20px 22px",display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:14}}>
      <div style={{border:"1.5px solid #dbeafe",borderRadius:12,padding:14,background:"#f8fbff"}}>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={e=>onFileSelected(e.target.files?.[0])} style={{display:"none"}}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          <button onClick={()=>fileRef.current?.click()} style={{border:"none",background:"#2563eb",color:"#fff",borderRadius:8,padding:"9px 14px",fontWeight:700,cursor:"pointer",fontSize:13}}>Ambil/Pilih Foto</button>
          <button onClick={runOcr} disabled={!file||processing} style={{border:"none",background:!file||processing?"#94a3b8":"#0f766e",color:"#fff",borderRadius:8,padding:"9px 14px",fontWeight:700,cursor:!file||processing?"not-allowed":"pointer",fontSize:13}}>{processing?"Memproses...":"Proses OCR"}</button>
        </div>

        {!previewUrl?(
          <div style={{border:"2px dashed #bfdbfe",borderRadius:10,minHeight:220,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",color:"#64748b",padding:16,fontSize:13}}>
            Foto lembar supervisi akan tampil di sini.
            <br/>Gunakan kamera HP agar teks lebih jelas.
          </div>
        ):(
          <img src={previewUrl} alt="Preview supervisi" style={{width:"100%",borderRadius:10,border:"1px solid #cbd5e1",maxHeight:360,objectFit:"contain",background:"#fff"}}/>
        )}

        <div style={{marginTop:10,fontSize:12,color:"#475569"}}>Status: <strong>{status}</strong></div>
        <div style={{marginTop:8,height:8,borderRadius:999,background:"#dbeafe",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#2563eb,#0ea5e9)",transition:"width 0.2s"}}/>
        </div>
      </div>

      <div style={{border:"1.5px solid #e2e8f0",borderRadius:12,padding:14,background:"#fff"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",marginBottom:10}}>Hasil Ekstraksi</div>
        {!result?(
          <div style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>Setelah OCR selesai, sistem akan menampilkan data guru dan jumlah skor yang berhasil dibaca.</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{k:"nama",l:"Nama Guru"},{k:"mapel",l:"Mapel"},{k:"kelas",l:"Kelas"},{k:"tanggal",l:"Tanggal"},{k:"supervisor",l:"Supervisor"}].map(item=>(
                <div key={item.k} style={item.k==="supervisor"?{gridColumn:"1/-1"}:{}}>
                  <div style={{fontSize:11,color:"#64748b"}}>{item.l}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#0f172a"}}>{result.info[item.k]||"-"}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#1e3a8a"}}>
              Skor terbaca: <strong>{scoreCount} / 20</strong><br/>
              Estimasi akurasi: <strong>{result.confidence}%</strong>
            </div>
            <button onClick={()=>onApply(result)} style={{border:"none",background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",borderRadius:10,padding:"10px 14px",fontWeight:700,cursor:"pointer"}}>Gunakan Hasil Scan</button>
          </div>
        )}
        {errMsg&&<div style={{marginTop:10,fontSize:12,color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"8px 10px"}}>{errMsg}</div>}
      </div>
    </div>
  </Modal>);
}

function FormSupervisi({guru,indikator,onSave,onClose,seedData}){
  const initSkor={};
  indikator.forEach(ind=>{initSkor[ind.id]=0;});
  if(seedData?.skor){indikator.forEach(ind=>{initSkor[ind.id]=seedData.skor?.[ind.id]||0;});}
  if(guru?.skor){indikator.forEach(ind=>{initSkor[ind.id]=guru.skor?.[ind.id]||0;});}
  const[skor,setSkor]=useState(initSkor);
  const[info,setInfo]=useState({
    nama:guru?.nama||seedData?.info?.nama||"",
    mapel:guru?.mapel||seedData?.info?.mapel||"",
    kelas:guru?.kelas||seedData?.info?.kelas||"",
    tanggal:guru?.tanggal||seedData?.info?.tanggal||"",
    supervisor:guru?.supervisor||seedData?.info?.supervisor||""
  });
  const total=Object.values(skor).reduce((a,b)=>a+(b||0),0);
  const persen=((total/SKOR_MAX)*100).toFixed(2);
  const pred=getPred(parseFloat(persen));
  const selesai=Object.values(skor).every(v=>v>0);
  const katGroups={};
  indikator.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});
  const scanCount=seedData?Object.values(seedData.skor||{}).filter(v=>v>0).length:0;

  useEffect(()=>{
    if(!seedData)return;
    setInfo(prev=>({...prev,...(seedData.info||{})}));
    setSkor(prev=>{
      const next={...prev};
      indikator.forEach(ind=>{
        const v=Number(seedData.skor?.[ind.id]||0);
        if(v>=1&&v<=4)next[ind.id]=v;
      });
      return next;
    });
  },[seedData,indikator]);

  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Form Supervisi Guru</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>{SEKOLAH}</div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕ Tutup</button>
      </div>
    </div>
    <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:20}}>
      <div style={{background:"#f8fafc",borderRadius:12,padding:16,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:10,textTransform:"uppercase"}}>Identitas Guru</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{key:"nama",label:"Nama Guru",ph:"Nama lengkap + gelar"},{key:"mapel",label:"Mata Pelajaran",ph:"Nama mata pelajaran"},{key:"kelas",label:"Kelas / Program",ph:"Mis: X PPLG 1"},{key:"tanggal",label:"Tanggal Supervisi",ph:"DD/MM/YYYY"},{key:"supervisor",label:"Supervisor",ph:"Nama supervisor"}].map(f=>(
            <div key={f.key} style={f.key==="supervisor"?{gridColumn:"1/-1"}:{}}>
              <label style={{fontSize:11,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>{f.label}</label>
              <input value={info[f.key]} onChange={e=>setInfo({...info,[f.key]:e.target.value})} placeholder={f.ph}
                style={{width:"100%",padding:"8px 12px",borderRadius:8,fontSize:13,border:"1.5px solid #cbd5e1",outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#fff"}}/>
            </div>
          ))}
        </div>
      </div>
      {seedData&&<div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:10,padding:"10px 12px",color:"#1e3a8a",fontSize:12}}>
        Data terisi dari hasil scan: <strong>{scanCount}/20 skor</strong> terdeteksi, estimasi akurasi <strong>{seedData.confidence||0}%</strong>. Periksa kembali sebelum menyimpan.
      </div>}
      {Object.entries(katGroups).map(([kat,inds])=>(
        <div key={kat}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
            <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{kat}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{KAT_LABEL[kat]}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {inds.map(ind=>{
              const s=skor[ind.id];
              return(<div key={ind.id} style={{border:s>0?"1.5px solid #bfdbfe":"1.5px solid #e2e8f0",borderRadius:10,padding:"12px 14px",background:s>0?"#f0f7ff":"#fafafa",transition:"all 0.2s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                  <div style={{flex:1}}><span style={{fontSize:10,fontWeight:700,color:"#64748b",background:"#e2e8f0",padding:"2px 6px",borderRadius:4,marginRight:7}}>{ind.id}</span><span style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{ind.judul}</span></div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    {[1,2,3,4].map(n=>(<button key={n} onClick={()=>setSkor({...skor,[ind.id]:n})} style={{width:34,height:34,borderRadius:8,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",background:s===n?SKOR_COLOR[n]:"#e2e8f0",color:s===n?"#fff":"#64748b",transform:s===n?"scale(1.1)":"scale(1)",transition:"all 0.15s"}}>{n}</button>))}
                  </div>
                </div>
                {s>0&&<div style={{marginTop:8,padding:"7px 11px",borderRadius:7,background:"#dbeafe",borderLeft:"3px solid #2563eb",fontSize:12,color:"#1e3a8a",lineHeight:1.55}}>💬 {ind.catatan[s]}</div>}
              </div>);
            })}
          </div>
        </div>
      ))}
      <div style={{background:"linear-gradient(135deg,#f0f7ff,#eff6ff)",border:"2px solid #bfdbfe",borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:12,color:"#475569"}}>Total Skor / Maks</div>
          <div style={{fontSize:28,fontWeight:800,color:"#1e3a5f"}}>{total} <span style={{fontSize:13,color:"#94a3b8"}}>/ {SKOR_MAX}</span></div>
          <div style={{fontSize:12,color:"#475569"}}>Persentase: <strong>{selesai?persen+"%":"—"}</strong></div>
        </div>
        {selesai?<div style={{background:pred.bg,color:pred.text,padding:"10px 18px",borderRadius:10,fontWeight:700,fontSize:15,border:`2px solid rgba(0,0,0,0.1)`}}>{pred.label}</div>:<div style={{color:"#94a3b8",fontSize:12}}>Isi semua skor<br/>untuk melihat predikat</div>}
        <button onClick={()=>{if(!info.nama)return alert("Nama guru wajib diisi!");if(!selesai)return alert("Harap isi semua 20 indikator!");onSave({...info,skor,total,persen:parseFloat(persen)});}} style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontWeight:700,fontSize:14,cursor:"pointer"}}>💾 Simpan</button>
      </div>
    </div>
  </Modal>);
}

function DetailGuru({guru,indikator,onClose,onEdit}){
  const[exp,setExp]=useState(false);
  const pred=getPred(guru.persen);
  const katGroups={};
  indikator.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});

  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
        <div><div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Hasil Supervisi</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>{guru.nama}</div><div style={{color:"#bfdbfe",fontSize:12}}>{guru.mapel} · {guru.kelas}</div></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={async()=>{setExp(true);try{await exportGuruPDF(guru,indikator);}catch{alert("Gagal export PDF.");}setExp(false);}} disabled={exp}
            style={{background:exp?"#6b7280":"#dc2626",border:"none",color:"#fff",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontWeight:600,fontSize:13}}>
            {exp?"⏳ Proses...":"📄 Export PDF"}
          </button>
          <button onClick={onEdit} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontWeight:600}}>✏️ Edit</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"7px 14px",cursor:"pointer"}}>✕</button>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
        {[{label:"Total Skor",val:`${guru.total} / ${SKOR_MAX}`},{label:"Persentase",val:`${guru.persen}%`},{label:"Predikat",val:pred.label}].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 14px",textAlign:"center"}}>
            <div style={{color:"#93c5fd",fontSize:10}}>{s.label}</div><div style={{color:"#fff",fontWeight:700,fontSize:15}}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,maxHeight:"60vh",overflowY:"auto"}}>
      {Object.entries(katGroups).map(([kat,inds])=>(
        <div key={kat}>
          <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",marginBottom:8,textTransform:"uppercase"}}>{kat}. {KAT_LABEL[kat]}</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f1f5f9"}}>
              <th style={{padding:"8px 12px",textAlign:"left",color:"#64748b"}}>Indikator</th>
              <th style={{padding:"8px 12px",textAlign:"center",color:"#64748b",width:55}}>Skor</th>
              <th style={{padding:"8px 12px",textAlign:"left",color:"#64748b"}}>Catatan</th>
            </tr></thead>
            <tbody>{inds.map((ind,i)=>{const s=guru.skor[ind.id]; return(
              <tr key={ind.id} style={{borderTop:"1px solid #f1f5f9",background:i%2?"#fafafa":"#fff"}}>
                <td style={{padding:"8px 12px",color:"#1e293b"}}>{ind.judul}</td>
                <td style={{padding:"8px 12px",textAlign:"center"}}><span style={{background:SKOR_COLOR[s],color:"#fff",borderRadius:6,padding:"3px 10px",fontWeight:700,fontSize:14}}>{s}</span></td>
                <td style={{padding:"8px 12px",color:"#475569",lineHeight:1.5}}>{ind.catatan[s]}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      ))}
    </div>
  </Modal>);
}

function KelolaCatatan({indikator,onSave,onClose}){
  const[data,setData]=useState(JSON.parse(JSON.stringify(indikator)));
  const[akt,setAkt]=useState("A");
  const kats=[...new Set(data.map(d=>d.kat))];
  const upd=(id,s,v)=>setData(p=>p.map(d=>d.id===id?{...d,catatan:{...d.catatan,[s]:v}}:d));
  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"18px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Editor</div><div style={{color:"#fff",fontSize:17,fontWeight:700}}>Kelola Catatan Per Indikator</div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
        {kats.map(k=>(<button key={k} onClick={()=>setAkt(k)} style={{border:"none",borderRadius:8,padding:"5px 11px",cursor:"pointer",fontWeight:600,fontSize:11,background:akt===k?"#fff":"rgba(255,255,255,0.15)",color:akt===k?"#1e3a5f":"#fff"}}>{k}. {KAT_LABEL[k]}</button>))}
      </div>
    </div>
    <div style={{padding:"16px 22px",maxHeight:"60vh",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
      {data.filter(d=>d.kat===akt).map(ind=>(
        <div key={ind.id} style={{border:"1.5px solid #e2e8f0",borderRadius:12,padding:14}}>
          <div style={{fontWeight:700,color:"#1e293b",marginBottom:9,fontSize:13}}><span style={{background:"#e2e8f0",padding:"2px 7px",borderRadius:4,marginRight:7,fontSize:11}}>{ind.id}</span>{ind.judul}</div>
          {[1,2,3,4].map(s=>(<div key={s} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:6}}>
            <div style={{width:26,height:26,borderRadius:6,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#fff",background:SKOR_COLOR[s]}}>{s}</div>
            <textarea value={ind.catatan[s]} onChange={e=>upd(ind.id,s,e.target.value)} rows={2} style={{flex:1,padding:"6px 10px",borderRadius:7,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none"}}/>
          </div>))}
        </div>
      ))}
    </div>
    <div style={{padding:"12px 22px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:10}}>
      <button onClick={onClose} style={{padding:"9px 18px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontWeight:600}}>Batal</button>
      <button onClick={()=>onSave(data)} style={{padding:"9px 22px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",fontWeight:700,cursor:"pointer"}}>💾 Simpan Catatan</button>
    </div>
  </Modal>);
}

export default function App(){
  const[guruList,setGuruList]=useState([]);
  const[indikator,setIndikator]=useState(DEFAULT_INDIKATOR);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(null);
  const[selGuru,setSelGuru]=useState(null);
  const[filter,setFilter]=useState("");
  const[saved,setSaved]=useState(false);
  const[expRekap,setExpRekap]=useState(false);
  const[scanSeed,setScanSeed]=useState(null);

  useEffect(()=>{(async()=>{
    try{const g=await storageApi.get("guru-list");if(g)setGuruList(JSON.parse(g.value));}catch{}
    try{const ind=await storageApi.get("indikator-catatan");if(ind)setIndikator(JSON.parse(ind.value));}catch{}
    setLoading(false);
  })();},[]);

  const saveGuru=async(list)=>{setGuruList(list);try{await storageApi.set("guru-list",JSON.stringify(list));}catch{}};
  const saveInd=async(ind)=>{setIndikator(ind);try{await storageApi.set("indikator-catatan",JSON.stringify(ind));}catch{}};

  const handleSave=(data)=>{
    const newList=modal==="edit"&&selGuru!==null?guruList.map((g,i)=>i===selGuru?data:g):[...guruList,data];
    saveGuru(newList);setSaved(true);setTimeout(()=>setSaved(false),2000);setModal(null);setSelGuru(null);setScanSeed(null);
  };
  const handleDel=(idx)=>{if(!confirm("Hapus data guru ini?"))return;saveGuru(guruList.filter((_,i)=>i!==idx));};

  const filtered=guruList.filter(g=>g.nama.toLowerCase().includes(filter.toLowerCase())||g.mapel.toLowerCase().includes(filter.toLowerCase()));
  const totalGuru=guruList.length;
  const avg=totalGuru?(guruList.reduce((a,b)=>a+b.persen,0)/totalGuru).toFixed(2):0;
  const cp={"Sangat Baik":0,"Baik":0,"Cukup":0,"Perlu Pembinaan":0};
  guruList.forEach(g=>{cp[getPred(g.persen).label]++;});

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{textAlign:"center",color:"#64748b"}}><div style={{fontSize:32}}>⏳</div><div>Memuat data...</div></div></div>);

  return(<div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f1f5f9",minHeight:"100vh"}}>
    <div style={{background:"linear-gradient(135deg,#0f2447,#1e3a5f,#2563eb)",padding:"18px 24px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{SEKOLAH}</div>
            <div style={{color:"#fff",fontSize:20,fontWeight:800}}>📋 Rekap Supervisi Guru</div>
            <div style={{color:"#bfdbfe",fontSize:12,marginTop:2}}>Sistem penilaian supervisi 20 indikator · Skala 1–4</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={async()=>{if(!guruList.length)return alert("Belum ada data guru!");setExpRekap(true);try{await exportRekapPDF(guruList, indikator);}catch{alert("Gagal export PDF.");}setExpRekap(false);}} disabled={expRekap}
              style={{background:expRekap?"#4b5563":"#dc2626",border:"none",color:"#fff",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:700,fontSize:13}}>
              {expRekap?"⏳ Proses...":"📄 Export Rekap PDF"}
            </button>
            <button onClick={()=>{setSelGuru(null);setModal("scan");}} style={{background:"#0f766e",border:"none",color:"#fff",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:700,fontSize:13}}>📷 Scan Kertas</button>
            <button onClick={()=>setModal("catatan")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:600,fontSize:13}}>⚙️ Kelola Catatan</button>
            <button onClick={()=>{setScanSeed(null);setSelGuru(null);setModal("tambah");}} style={{background:"#fff",border:"none",color:"#1e3a5f",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Tambah Guru</button>
          </div>
        </div>
        <div style={{display:"flex",gap:9,marginTop:16,flexWrap:"wrap"}}>
          {[{label:"Total Guru",val:totalGuru,icon:"👨‍🏫"},{label:"Rata-rata",val:`${avg}%`,icon:"📊"},{label:"Sangat Baik",val:cp["Sangat Baik"],icon:"🟢"},{label:"Baik",val:cp["Baik"],icon:"🔵"},{label:"Cukup",val:cp["Cukup"],icon:"🟡"},{label:"Perlu Pembinaan",val:cp["Perlu Pembinaan"],icon:"🔴"}].map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 13px",textAlign:"center",flex:"1 1 70px"}}>
              <div style={{fontSize:16}}>{s.icon}</div><div style={{color:"#fff",fontWeight:800,fontSize:17}}>{s.val}</div><div style={{color:"#93c5fd",fontSize:10}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <input placeholder="🔍 Cari nama guru atau mata pelajaran..." value={filter} onChange={e=>setFilter(e.target.value)} style={{flex:1,padding:"10px 16px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:14,outline:"none",background:"#fff"}}/>
        {saved&&<span style={{color:"#10b981",fontWeight:600,fontSize:13}}>✅ Tersimpan!</span>}
      </div>

      {filtered.length===0?(
        <div style={{background:"#fff",borderRadius:16,padding:"60px 20px",textAlign:"center",border:"2px dashed #e2e8f0"}}>
          <div style={{fontSize:42,marginBottom:10}}>📝</div>
          <div style={{fontSize:17,fontWeight:700,color:"#1e293b"}}>Belum ada data guru</div>
          <div style={{color:"#94a3b8",marginTop:5}}>Klik tombol "+ Tambah Guru" untuk mulai input supervisi</div>
        </div>
      ):(
        <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc",borderBottom:"2px solid #e2e8f0"}}>
              {["No","Nama Guru","Mata Pelajaran","Tanggal","Total","%","Predikat","Aksi"].map(h=>(
                <th key={h} style={{padding:"11px 13px",textAlign:["No","Total","%","Predikat","Aksi"].includes(h)?"center":"left",color:"#64748b",fontWeight:600}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filtered.map((g,i)=>{
              const pred=getPred(g.persen); const ri=guruList.indexOf(g);
              return(<tr key={i} style={{borderBottom:"1px solid #f1f5f9"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"11px 13px",color:"#94a3b8",fontWeight:600,textAlign:"center"}}>{i+1}</td>
                <td style={{padding:"11px 13px",fontWeight:700,color:"#1e293b"}}>{g.nama}</td>
                <td style={{padding:"11px 13px",color:"#475569"}}>{g.mapel}<br/><span style={{fontSize:11,color:"#94a3b8"}}>{g.kelas}</span></td>
                <td style={{padding:"11px 13px",color:"#64748b",fontSize:12}}>{g.tanggal||"—"}</td>
                <td style={{padding:"11px 13px",textAlign:"center",fontWeight:700,color:"#1e293b"}}>{g.total}</td>
                <td style={{padding:"11px 13px",textAlign:"center",fontWeight:700,color:"#1e293b"}}>{g.persen}%</td>
                <td style={{padding:"11px 13px",textAlign:"center"}}><span style={{background:pred.bg,color:pred.text,padding:"4px 10px",borderRadius:20,fontWeight:700,fontSize:11}}>{pred.label}</span></td>
                <td style={{padding:"11px 13px"}}>
                  <div style={{display:"flex",gap:4,justifyContent:"center"}}>
                    <button onClick={()=>{setSelGuru(ri);setModal("detail");}} style={{background:"#eff6ff",color:"#2563eb",border:"none",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:600}}>👁 Detail</button>
                    <button onClick={()=>{setSelGuru(ri);setModal("edit");}} style={{background:"#f0fdf4",color:"#16a34a",border:"none",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:600}}>✏️ Edit</button>
                    <button onClick={()=>handleDel(ri)} style={{background:"#fef2f2",color:"#dc2626",border:"none",borderRadius:7,padding:"5px 9px",cursor:"pointer",fontSize:11,fontWeight:600}}>🗑</button>
                  </div>
                </td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}
      <div style={{display:"flex",gap:7,marginTop:12,flexWrap:"wrap"}}>
        {[{l:"Sangat Baik",r:"91–100%",bg:"#d1fae5",t:"#065f46"},{l:"Baik",r:"81–90%",bg:"#dbeafe",t:"#1e3a8a"},{l:"Cukup",r:"71–80%",bg:"#fef3c7",t:"#78350f"},{l:"Perlu Pembinaan",r:"≤ 70%",bg:"#fee2e2",t:"#7f1d1d"}].map(p=>(
          <div key={p.l} style={{background:p.bg,color:p.t,borderRadius:8,padding:"5px 11px",fontSize:11,fontWeight:600}}>{p.l}: {p.r}</div>
        ))}
      </div>
    </div>

    {modal==="scan"&&<ScanSupervisiModal onClose={()=>setModal(null)} onApply={(parsed)=>{setScanSeed(parsed);setSelGuru(null);setModal("tambah");}}/>}
    {(modal==="tambah"||modal==="edit")&&<FormSupervisi guru={modal==="edit"?guruList[selGuru]:null} indikator={indikator} seedData={modal==="tambah"?scanSeed:null} onSave={handleSave} onClose={()=>{setModal(null);setSelGuru(null);}}/>}
    {modal==="detail"&&selGuru!==null&&<DetailGuru guru={guruList[selGuru]} indikator={indikator} onClose={()=>{setModal(null);setSelGuru(null);}} onEdit={()=>setModal("edit")}/>}
    {modal==="catatan"&&<KelolaCatatan indikator={indikator} onSave={(ind)=>{saveInd(ind);setModal(null);setSaved(true);setTimeout(()=>setSaved(false),2000);}} onClose={()=>setModal(null)}/>}
  </div>);
}
