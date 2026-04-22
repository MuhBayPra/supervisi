import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════
//  DATA TEMPLATE A — 20 Indikator
// ══════════════════════════════════════════════════════════════════
const INDIKATOR_A = [
  {id:1,  kat:"A", katLabel:"PERENCANAAN PEMBELAJARAN",      judul:"Kesesuaian CP–ATP–Modul Ajar",           catatan:{1:"Modul ajar tidak sesuai dengan CP dan ATP; tujuan pembelajaran tidak terdefinisi.",2:"Modul ajar cukup sesuai CP dan ATP, namun tujuan pembelajaran masih kurang jelas.",3:"Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas namun perlu sedikit penyempurnaan.",4:"Modul ajar sesuai CP dan ATP, tujuan pembelajaran jelas dan runtut."}},
  {id:2,  kat:"A", katLabel:"PERENCANAAN PEMBELAJARAN",      judul:"Ketersediaan Media, LKPD, Alat Ajar",    catatan:{1:"Tidak tersedia media, LKPD, maupun alat ajar pendukung.",2:"Media dan LKPD tersedia sebagian, belum memadai untuk mendukung pembelajaran.",3:"Media dan LKPD tersedia namun kurang variatif; perlu dilengkapi.",4:"Guru menyiapkan slide, LKPD digital, dan video pembelajaran."}},
  {id:3,  kat:"A", katLabel:"PERENCANAAN PEMBELAJARAN",      judul:"Penilaian (rubrik & formatif)",           catatan:{1:"Tidak tersedia rubrik maupun instrumen penilaian formatif.",2:"Rubrik tersedia namun belum sesuai dengan tujuan pembelajaran yang ditetapkan.",3:"Rubrik sudah tersedia, namun perlu ditambahkan format refleksi siswa.",4:"Rubrik lengkap, penilaian formatif terencana, dan dilengkapi instrumen refleksi siswa."}},
  {id:4,  kat:"A", katLabel:"PERENCANAAN PEMBELAJARAN",      judul:"Diferensiasi dalam Perencanaan",          catatan:{1:"Tidak ada upaya diferensiasi dalam perencanaan pembelajaran.",2:"Diferensiasi belum tampak dalam perencanaan; tugas seragam untuk semua siswa.",3:"Sudah ada variasi tugas, tetapi belum maksimal untuk siswa dengan kemampuan rendah.",4:"Perencanaan mencakup diferensiasi konten, proses, dan produk untuk semua level kemampuan siswa."}},
  {id:5,  kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Pembukaan (Apersepsi & Tujuan)",          catatan:{1:"Tidak ada apersepsi; tujuan pembelajaran tidak disampaikan kepada siswa.",2:"Apersepsi dilakukan namun tidak relevan dengan materi yang akan diajarkan.",3:"Guru menyampaikan apersepsi dan tujuan pembelajaran namun kurang menarik minat siswa.",4:"Guru membuka pembelajaran dengan ice breaking dan mengaitkan materi dengan kehidupan sehari-hari."}},
  {id:6,  kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Penguasaan Kelas & Komunikasi",           catatan:{1:"Guru tidak mampu menguasai kelas; komunikasi tidak efektif dan kelas tidak kondusif.",2:"Guru cukup mampu menguasai kelas namun komunikasi masih perlu banyak ditingkatkan.",3:"Guru mampu menjaga kondusivitas kelas dengan komunikasi yang cukup baik.",4:"Guru komunikatif, suara jelas, dan mampu menjaga fokus siswa."}},
  {id:7,  kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Variasi Metode (PBL, Diskusi, Praktik)",  catatan:{1:"Pembelajaran hanya menggunakan satu metode ceramah tanpa variasi apapun.",2:"Menggunakan 2 metode namun transisi antar metode kurang lancar.",3:"Menggunakan beberapa metode namun belum sepenuhnya terintegrasi dengan baik.",4:"Menggunakan metode diskusi kelompok, praktik, dan presentasi."}},
  {id:8,  kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Aktivitas & Keterlibatan Siswa",          catatan:{1:"Siswa pasif; tidak ada interaksi aktif selama pembelajaran berlangsung.",2:"Hanya sedikit siswa yang terlibat aktif; sebagian besar tidak berpartisipasi.",3:"Sebagian besar siswa aktif, namun masih ada beberapa siswa pasif.",4:"Seluruh siswa terlibat aktif; guru berhasil memotivasi semua siswa untuk berpartisipasi."}},
  {id:9,  kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Penggunaan Media Digital/Alat Praktik",   catatan:{1:"Tidak menggunakan media digital atau alat praktik apapun dalam pembelajaran.",2:"Media digital digunakan namun tidak relevan atau tidak berfungsi secara optimal.",3:"Guru menggunakan media digital namun kurang bervariasi.",4:"Guru menggunakan proyektor, video, dan praktik langsung di laboratorium."}},
  {id:10, kat:"B", katLabel:"PELAKSANAAN PEMBELAJARAN",     judul:"Penutup (Refleksi & Rangkuman)",          catatan:{1:"Tidak ada kegiatan penutup; pembelajaran berakhir tanpa rangkuman maupun refleksi.",2:"Guru memberikan rangkuman singkat tanpa melibatkan siswa dalam refleksi.",3:"Guru memberikan rangkuman, tetapi refleksi siswa belum dilakukan secara menyeluruh.",4:"Guru melakukan rangkuman dan refleksi siswa secara menyeluruh dan bermakna."}},
  {id:11, kat:"C", katLabel:"PENILAIAN PEMBELAJARAN",       judul:"Penilaian sesuai Tujuan Pembelajaran",    catatan:{1:"Penilaian tidak sesuai dengan tujuan pembelajaran yang telah ditetapkan.",2:"Penilaian sebagian sesuai tujuan pembelajaran namun perlu banyak penyesuaian.",3:"Penilaian sebagian besar sesuai tujuan pembelajaran; perlu sedikit penyesuaian.",4:"Penilaian sudah sesuai dengan tujuan pembelajaran yang ditetapkan."}},
  {id:12, kat:"C", katLabel:"PENILAIAN PEMBELAJARAN",       judul:"Penggunaan Rubrik Penilaian",             catatan:{1:"Rubrik penilaian tidak digunakan sama sekali dalam proses penilaian.",2:"Rubrik digunakan namun tidak dikomunikasikan atau dijelaskan kepada siswa.",3:"Rubrik digunakan namun belum dijelaskan kepada siswa sebelum praktik.",4:"Rubrik digunakan secara konsisten dan dijelaskan kepada siswa sebelum praktik."}},
  {id:13, kat:"C", katLabel:"PENILAIAN PEMBELAJARAN",       judul:"Umpan Balik yang Diberikan ke Siswa",     catatan:{1:"Tidak ada umpan balik yang diberikan kepada siswa.",2:"Umpan balik diberikan namun bersifat umum dan kurang spesifik.",3:"Guru memberikan umpan balik kepada sebagian siswa; belum merata.",4:"Guru memberikan umpan balik langsung kepada siswa saat praktik."}},
  {id:14, kat:"C", katLabel:"PENILAIAN PEMBELAJARAN",       judul:"Administrasi Nilai Rapi",                 catatan:{1:"Administrasi nilai tidak tersedia atau tidak teratur sama sekali.",2:"Administrasi nilai tersedia namun belum lengkap dan perlu banyak perbaikan.",3:"Administrasi nilai cukup lengkap namun perlu perapian.",4:"Administrasi nilai lengkap dan tersusun dengan baik."}},
  {id:15, kat:"D", katLabel:"TUGAS TAMBAHAN & ADMINISTRASI",judul:"Kehadiran & Ketepatan Waktu",             catatan:{1:"Guru sering tidak hadir dan tidak tepat waktu dalam melaksanakan tugas.",2:"Kehadiran cukup namun guru sering terlambat masuk kelas.",3:"Kehadiran baik namun sesekali terlambat; perlu konsistensi.",4:"Guru hadir tepat waktu dan mengikuti seluruh jadwal KBM."}},
  {id:16, kat:"D", katLabel:"TUGAS TAMBAHAN & ADMINISTRASI",judul:"Kelengkapan Administrasi",                catatan:{1:"Administrasi pembelajaran tidak tersedia atau sangat tidak lengkap.",2:"Administrasi pembelajaran tersedia sebagian; banyak dokumen belum terpenuhi.",3:"Administrasi cukup lengkap; masih ada beberapa dokumen yang perlu dilengkapi.",4:"Semua administrasi pembelajaran tersedia lengkap."}},
  {id:17, kat:"D", katLabel:"TUGAS TAMBAHAN & ADMINISTRASI",judul:"Pelaksanaan Tugas Tambahan (Wali/Ekskul)",catatan:{1:"Tugas tambahan tidak dilaksanakan; tidak ada dokumentasi kegiatan.",2:"Tugas tambahan dilaksanakan namun tanpa dokumentasi yang memadai.",3:"Guru menjalankan tugas wali kelas dengan baik, namun dokumentasi kegiatan perlu ditingkatkan.",4:"Guru melaksanakan tugas tambahan dengan sangat baik disertai dokumentasi yang lengkap."}},
  {id:18, kat:"E", katLabel:"SIKAP PROFESIONAL & ETIKA",    judul:"Etika & Komunikasi",                      catatan:{1:"Guru kurang sopan dan komunikasi tidak profesional.",2:"Etika cukup baik namun komunikasi profesional masih perlu diperbaiki.",3:"Guru bersikap sopan dan profesional dalam sebagian besar situasi.",4:"Guru bersikap sopan, santun, dan profesional."}},
  {id:19, kat:"E", katLabel:"SIKAP PROFESIONAL & ETIKA",    judul:"Kerjasama & Kolaborasi",                  catatan:{1:"Guru tidak aktif berkolaborasi dan cenderung bekerja sendiri.",2:"Guru kadang berkolaborasi namun perlu lebih proaktif.",3:"Guru cukup aktif bekerja sama namun belum konsisten.",4:"Guru aktif bekerja sama dengan rekan guru dan wali kelas."}},
  {id:20, kat:"E", katLabel:"SIKAP PROFESIONAL & ETIKA",    judul:"Komitmen Terhadap Sekolah",               catatan:{1:"Guru kurang menunjukkan komitmen dan loyalitas terhadap sekolah.",2:"Komitmen cukup namun partisipasi dalam kegiatan sekolah masih rendah.",3:"Guru berkomitmen baik namun partisipasi dalam kegiatan sekolah perlu ditingkatkan.",4:"Guru memiliki loyalitas tinggi dan aktif dalam kegiatan sekolah."}},
];

// ══════════════════════════════════════════════════════════════════
//  DATA TEMPLATE B — 5 Aspek
// ══════════════════════════════════════════════════════════════════
const DEFAULT_ASPEK_B = [
  {id:1,aspek:"Perencanaan Pembelajaran",    indikator:["Memiliki RPP/Modul Ajar sesuai kurikulum","Tujuan pembelajaran jelas","Menyusun asesmen sesuai tujuan"],             catatan:{1:"Tidak memiliki RPP/modul ajar; tujuan dan asesmen tidak tersedia.",2:"RPP tersedia namun tujuan pembelajaran dan asesmen belum sesuai kurikulum.",3:"Modul ajar sudah tersedia dan sesuai kurikulum. Tujuan pembelajaran jelas, namun asesmen masih perlu lebih disesuaikan dengan tujuan pembelajaran.",4:"RPP/Modul ajar lengkap, tujuan jelas dan terukur, asesmen sepenuhnya sesuai tujuan pembelajaran."}},
  {id:2,aspek:"Pelaksanaan Pembelajaran",    indikator:["Membuka pelajaran dengan apersepsi","Menguasai materi dan kelas","Metode bervariasi (diskusi, praktik, media digital)","Melibatkan siswa aktif"], catatan:{1:"Guru tidak mampu membuka pelajaran, menguasai kelas, maupun melibatkan siswa secara aktif.",2:"Guru membuka pelajaran dan menguasai materi, namun metode kurang variatif dan siswa kurang aktif.",3:"Guru membuka pembelajaran dengan baik, menguasai materi, menggunakan media presentasi dan diskusi kelompok. Siswa terlihat aktif bertanya dan menjawab.",4:"Guru membuka pembelajaran dengan sangat baik, menguasai materi sepenuhnya, metode sangat bervariasi, dan seluruh siswa aktif terlibat."}},
  {id:3,aspek:"Pengelolaan Kelas",           indikator:["Menata kelas kondusif","Menangani siswa dengan adil dan positif","Mengelola waktu dengan baik"],                    catatan:{1:"Kelas tidak kondusif, guru tidak mampu mengelola waktu maupun menangani siswa secara adil.",2:"Kelas cukup kondusif namun pengelolaan waktu dan penanganan siswa masih perlu banyak perbaikan.",3:"Kelas tertata rapi dan kondusif. Guru mampu mengendalikan kelas dengan baik, namun pengelolaan waktu masih perlu ditingkatkan karena materi belum selesai tepat waktu.",4:"Kelas sangat kondusif, semua siswa ditangani secara adil dan positif, waktu dikelola dengan sangat baik."}},
  {id:4,aspek:"Penilaian dan Tindak Lanjut", indikator:["Menggunakan instrumen penilaian (tes/non tes)","Memberikan umpan balik","Ada tindak lanjut/remedial"],              catatan:{1:"Tidak ada instrumen penilaian, umpan balik, maupun tindak lanjut bagi siswa.",2:"Guru sudah memberikan penilaian tertulis, tetapi umpan balik kepada siswa masih terbatas dan belum ada program remedial yang jelas.",3:"Penilaian menggunakan instrumen yang cukup baik; umpan balik diberikan namun tindak lanjut/remedial masih perlu ditingkatkan.",4:"Instrumen penilaian lengkap (tes & non tes), umpan balik diberikan secara rinci, dan program remedial tersedia dengan jelas."}},
  {id:5,aspek:"Sikap dan Profesionalisme",   indikator:["Disiplin waktu","Penampilan rapi","Komunikasi santun","Kolaborasi dengan sejawat"],                                   catatan:{1:"Guru tidak disiplin waktu, penampilan tidak rapi, komunikasi kurang santun, dan tidak berkolaborasi.",2:"Guru cukup disiplin dan berpenampilan baik, namun komunikasi dan kolaborasi masih perlu ditingkatkan.",3:"Guru hadir tepat waktu, berpakaian rapi, berkomunikasi santun, dan aktif berkolaborasi dengan rekan guru lain.",4:"Guru hadir tepat waktu, berpakaian sangat rapi, berkomunikasi santun, dan sangat aktif berkolaborasi dengan rekan guru."}},
];

const SEKOLAH = "SMK Bhakti Insani Bogor";
const SC = ["","#ef4444","#f59e0b","#3b82f6","#10b981"];
const SKOR_MAX_A = 80, SKOR_MAX_B = 20;

function getPredA(persen){
  if(persen>=91) return {label:"Sangat Baik", bg:"#d1fae5",text:"#065f46"};
  if(persen>=81) return {label:"Baik",        bg:"#dbeafe",text:"#1e3a8a"};
  if(persen>=71) return {label:"Cukup",       bg:"#fef3c7",text:"#78350f"};
  return               {label:"Perlu Pembinaan",bg:"#fee2e2",text:"#7f1d1d"};
}
function getPredB(total){
  if(total>=17) return {label:"Sangat Baik", bg:"#d1fae5",text:"#065f46"};
  if(total>=13) return {label:"Baik",        bg:"#dbeafe",text:"#1e3a8a"};
  if(total>=9)  return {label:"Cukup",       bg:"#fef3c7",text:"#78350f"};
  return               {label:"Perlu Pembinaan",bg:"#fee2e2",text:"#7f1d1d"};
}
function getPred(g){ return g.template==="B"?getPredB(g.total):getPredA(g.persen); }

// ══════════════════════════════════════════════════════════════════
//  PDF LOADERS
// ══════════════════════════════════════════════════════════════════
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)){res();return;}
    const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });
}
async function ensurePDF(){
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js");
}

// ══════════════════════════════════════════════════════════════════
//  PDF TEMPLATE A — PERSIS SESUAI REAP_SUPERVISI.docx
// ══════════════════════════════════════════════════════════════════
async function exportPDF_A(guru, indikator){
  await ensurePDF();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();

  // ── JUDUL ──
  doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("LEMBAR SUPERVISI GURU", W/2, 16, {align:"center"});
  doc.setFontSize(11); doc.setFont("helvetica","bold");
  doc.text(SEKOLAH.toUpperCase(), W/2, 22, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Tahun Pelajaran 2025/2026", W/2, 28, {align:"center"});
  doc.setDrawColor(0); doc.setLineWidth(0.8); doc.line(14,31,W-14,31);

  // ── A. IDENTITAS GURU ──
  let y=37;
  doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("A. IDENTITAS GURU", 14, y); y+=4;
  doc.autoTable({
    startY:y,
    body:[
      [{content:"KOMPONEN",styles:{fontStyle:"bold",fillColor:[220,220,220]}},{content:"KETERANGAN",styles:{fontStyle:"bold",fillColor:[220,220,220]}}],
      ["Nama Guru",`${SEKOLAH} – ${guru.nama}`],
      ["Mata Pelajaran",guru.mapel||"-"],
      ["Kelas/Program",guru.kelas||"-"],
      ["Tanggal Supervisi",guru.tanggal||"-"],
      ["Supervisor",guru.supervisor||"-"],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:50,fontStyle:"bold",fillColor:[245,245,245]},1:{cellWidth:"auto"}},
    bodyStyles:{fontSize:9,cellPadding:3},
    theme:"grid",
  });

  // ── B. ASPEK PENILAIAN ──
  y=doc.lastAutoTable.finalY+5;
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("B. ASPEK PENILAIAN (Skala 1–4)", 14, y); y+=4;

  // Build rows: category header rows + data rows
  const katGroups={};
  indikator.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});
  const tableRows=[];
  Object.entries(katGroups).forEach(([kat,inds])=>{
    // Category header row
    tableRows.push({kat:kat,label:inds[0].katLabel,isHeader:true});
    inds.forEach(ind=>{
      const s=guru.skor[ind.id]||0;
      tableRows.push({id:ind.id,judul:ind.judul,skor:s,catatan:s?ind.catatan[s]:"",isHeader:false});
    });
  });

  doc.autoTable({
    startY:y,
    head:[[
      {content:"No",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Aspek / Indikator",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Skor",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Catatan",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
    ]],
    body:tableRows.map(r=>r.isHeader
      ? [{content:r.kat,styles:{fontStyle:"bold",halign:"center",fillColor:[200,200,200]}},{content:r.label,colSpan:3,styles:{fontStyle:"bold",fillColor:[200,200,200]}}]
      : [r.id,r.judul,{content:r.skor||"-",styles:{halign:"center",fontStyle:"bold"}},r.catatan]
    ),
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:10,halign:"center"},1:{cellWidth:62},2:{cellWidth:12,halign:"center"},3:{cellWidth:"auto"}},
    bodyStyles:{fontSize:8.5,cellPadding:2.5},
    headStyles:{fontSize:9},
    theme:"grid",
    didParseCell:(d)=>{
      if(d.section==="body"&&d.column.index===2&&!isNaN(parseInt(d.cell.raw?.content||d.cell.raw))){
        const s=parseInt(d.cell.raw?.content||d.cell.raw);
        if(s===1)d.cell.styles.textColor=[220,38,38];
        else if(s===2)d.cell.styles.textColor=[217,119,6];
        else if(s===3)d.cell.styles.textColor=[37,99,235];
        else if(s===4)d.cell.styles.textColor=[22,163,74];
      }
    },
  });

  // ── C. CATATAN SUPERVISOR ──
  y=doc.lastAutoTable.finalY+5;
  if(y>240){doc.addPage();y=16;}
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("C. CATATAN SUPERVISOR", 14, y); y+=4;
  doc.autoTable({
    startY:y,
    body:[
      [{content:"Keterangan",styles:{fontStyle:"bold",fillColor:[220,220,220]}},{content:"Isi",styles:{fontStyle:"bold",fillColor:[220,220,220]}}],
      [{content:"Kekuatan Guru",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.kekuatan||"-"],
      [{content:"Area Perbaikan",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.areaPerbaikan||"-"],
      [{content:"Rekomendasi/RTL",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.rekomendasi||"-"],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:45},1:{cellWidth:"auto"}},
    bodyStyles:{fontSize:9,cellPadding:3,minCellHeight:12},
    theme:"grid",
  });

  // ── D. TANDA TANGAN ──
  y=doc.lastAutoTable.finalY+5;
  if(y>260){doc.addPage();y=16;}
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("D. TANDA TANGAN", 14, y); y+=4;
  doc.autoTable({
    startY:y,
    body:[
      [{content:"Guru yang Disupervisi",styles:{fontStyle:"bold",halign:"center",fillColor:[220,220,220]}},{content:"Supervisor",styles:{fontStyle:"bold",halign:"center",fillColor:[220,220,220]}}],
      [{content:`\n\n\n(${guru.nama})`,styles:{halign:"center",minCellHeight:22}},{content:`\n\n\n(${guru.supervisor||"................................"})`,styles:{halign:"center",minCellHeight:22}}],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:"auto"},1:{cellWidth:"auto"}},
    bodyStyles:{fontSize:9,cellPadding:3},
    theme:"grid",
  });

  // footer
  const pages=doc.internal.getNumberOfPages();
  for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(7.5);doc.setTextColor(150);doc.setFont("helvetica","normal");doc.text(`${SEKOLAH} · Dicetak: ${new Date().toLocaleDateString("id-ID")} · Hal ${i}/${pages}`,W/2,292,{align:"center"});}
  doc.save(`LembarSupervisiA_${guru.nama.replace(/\s+/g,"_")}.pdf`);
}

// ══════════════════════════════════════════════════════════════════
//  PDF TEMPLATE B — PERSIS SESUAI Contoh_isi_form_supervisi.docx
// ══════════════════════════════════════════════════════════════════
async function exportPDF_B(guru, aspekB){
  await ensurePDF();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();

  // ── JUDUL ──
  doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("LEMBAR SUPERVISI GURU", W/2, 16, {align:"center"});
  doc.setFontSize(11);
  doc.text(SEKOLAH.toUpperCase(), W/2, 22, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Tahun Pelajaran 2025/2026", W/2, 28, {align:"center"});
  doc.setDrawColor(0); doc.setLineWidth(0.8); doc.line(14,31,W-14,31);

  // ── IDENTITAS (ringkas di atas) ──
  let y=37;
  doc.autoTable({
    startY:y,
    body:[
      [{content:"Nama Guru",styles:{fontStyle:"bold",cellWidth:40,fillColor:[245,245,245]}},guru.nama||"-",{content:"Tanggal Supervisi",styles:{fontStyle:"bold",cellWidth:40,fillColor:[245,245,245]}},guru.tanggal||"-"],
      [{content:"Mata Pelajaran",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.mapel||"-",{content:"Supervisor",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.supervisor||"-"],
      [{content:"Kelas/Program",styles:{fontStyle:"bold",fillColor:[245,245,245]}},guru.kelas||"-",{content:"",styles:{fillColor:[255,255,255]}},{content:"",styles:{fillColor:[255,255,255]}}],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:38},1:{cellWidth:55},2:{cellWidth:38},3:{cellWidth:55}},
    bodyStyles:{fontSize:9,cellPadding:2.5},
    theme:"grid",
  });

  // ── TABEL ASPEK SUPERVISI ──
  y=doc.lastAutoTable.finalY+5;
  doc.autoTable({
    startY:y,
    head:[[
      {content:"No",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Aspek Supervisi",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Indikator yang Diamati",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Skor (1–4)",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Catatan / Pengamat",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
    ]],
    body:aspekB.map(a=>{
      const s=guru.skor[a.id]||0;
      return[
        {content:a.id,styles:{halign:"center"}},
        {content:a.aspek,styles:{fontStyle:"bold"}},
        a.indikator.join("\n"),
        {content:s||"-",styles:{halign:"center",fontStyle:"bold",
          textColor:s===1?[220,38,38]:s===2?[217,119,6]:s===3?[37,99,235]:s===4?[22,163,74]:[0,0,0]
        }},
        a.catatan[s]||"-",
      ];
    }),
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:10,halign:"center"},1:{cellWidth:38},2:{cellWidth:52},3:{cellWidth:14,halign:"center"},4:{cellWidth:"auto"}},
    bodyStyles:{fontSize:8.5,cellPadding:3},
    headStyles:{fontSize:9},
    theme:"grid",
  });

  // ── REKAP NILAI SUPERVISI ──
  y=doc.lastAutoTable.finalY+5;
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("Rekap Nilai Supervisi", 14, y); y+=4;
  doc.autoTable({
    startY:y,
    head:[[
      {content:"Aspek",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Skor Maksimal",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Skor Diperoleh",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
    ]],
    body:[
      ...aspekB.map(a=>[a.aspek,{content:4,styles:{halign:"center"}},{content:guru.skor[a.id]||0,styles:{halign:"center"}}]),
      [{content:"Total",styles:{fontStyle:"bold",fillColor:[220,220,220]}},{content:SKOR_MAX_B,styles:{halign:"center",fontStyle:"bold",fillColor:[220,220,220]}},{content:guru.total,styles:{halign:"center",fontStyle:"bold",fillColor:[220,220,220]}}],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:80},1:{cellWidth:30,halign:"center"},2:{cellWidth:30,halign:"center"}},
    bodyStyles:{fontSize:9,cellPadding:3},
    headStyles:{fontSize:9},
    theme:"grid",
  });

  // ── KATEGORI HASIL ──
  y=doc.lastAutoTable.finalY+5;
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("Kategori Hasil Supervisi", 14, y); y+=4;
  const pred=getPredB(guru.total);
  doc.autoTable({
    startY:y,
    head:[[
      {content:"Total Nilai",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Kategori",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
    ]],
    body:[[
      {content:guru.total,styles:{halign:"center",fontStyle:"bold"}},
      {content:pred.label,styles:{halign:"center",fontStyle:"bold"}},
    ]],
    margin:{left:14,right:114},
    columnStyles:{0:{cellWidth:30,halign:"center"},1:{cellWidth:40,halign:"center"}},
    bodyStyles:{fontSize:9,cellPadding:3},
    headStyles:{fontSize:9},
    theme:"grid",
  });

  // ── CATATAN DAN SARAN ──
  y=doc.lastAutoTable.finalY+5;
  if(y>240){doc.addPage();y=16;}
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("Catatan dan Saran Supervisi", 14, y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  const catatanLines=doc.splitTextToSize(guru.catatanB||"-", W-28);
  doc.text(catatanLines, 14, y);
  y+=catatanLines.length*4.5+6;

  // ── KESIMPULAN ──
  if(y>255){doc.addPage();y=16;}
  doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("Kesimpulan", 14, y); y+=6;
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  const sudah=guru.kesimpulanB!=="perlu";
  doc.text(sudah?"☑":"☐", 14, y);
  doc.text("Guru sudah memenuhi standar supervisi", 20, y); y+=6;
  doc.text(!sudah?"☑":"☐", 14, y);
  doc.text("Guru perlu pembinaan pada aspek penilaian dan tindak lanjut", 20, y); y+=8;

  // ── TANDA TANGAN ──
  if(y>255){doc.addPage();y=16;}
  doc.autoTable({
    startY:y,
    body:[
      [{content:"Guru yang Disupervisi",styles:{fontStyle:"bold",halign:"center",fillColor:[220,220,220]}},{content:"Supervisor",styles:{fontStyle:"bold",halign:"center",fillColor:[220,220,220]}}],
      [{content:`\n\n\n(${guru.nama})`,styles:{halign:"center",minCellHeight:22}},{content:`\n\n\n(${guru.supervisor||"................................"})`,styles:{halign:"center",minCellHeight:22}}],
    ],
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:"auto"},1:{cellWidth:"auto"}},
    bodyStyles:{fontSize:9,cellPadding:3},
    theme:"grid",
  });

  const pages=doc.internal.getNumberOfPages();
  for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(7.5);doc.setTextColor(150);doc.setFont("helvetica","normal");doc.text(`${SEKOLAH} · Dicetak: ${new Date().toLocaleDateString("id-ID")} · Hal ${i}/${pages}`,W/2,292,{align:"center"});}
  doc.save(`LembarSupervisiB_${guru.nama.replace(/\s+/g,"_")}.pdf`);
}

// ══════════════════════════════════════════════════════════════════
//  PDF REKAP YAYASAN — PERSIS SESUAI REAP_SUPERVISI.docx (halaman 2)
// ══════════════════════════════════════════════════════════════════
async function exportRekapYayasan(guruList, globalState){
  await ensurePDF();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  const W=doc.internal.pageSize.getWidth();

  // ── JUDUL ──
  doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("REKAP PENILAIAN SUPERVISI GURU", W/2, 14, {align:"center"});
  doc.setFontSize(10);
  doc.text("Untuk Laporan Kepala Sekolah kepada Yayasan", W/2, 20, {align:"center"});
  doc.setFontSize(11);
  doc.text(SEKOLAH.toUpperCase(), W/2, 26, {align:"center"});
  doc.setDrawColor(0); doc.setLineWidth(0.8); doc.line(14,29,W-14,29);

  // ── TABEL REKAP SEMUA GURU ──
  let y=34;
  const guruRows=guruList.map((g,i)=>{
    const isB=g.template==="B";
    const maks=isB?SKOR_MAX_B:SKOR_MAX_A;
    const pct=isB?((g.total/SKOR_MAX_B)*100).toFixed(2):g.persen;
    const pred=getPred(g);
    return[
      i+1, g.nama, g.mapel,
      {content:g.total,styles:{halign:"center",fontStyle:"bold"}},
      {content:maks,styles:{halign:"center"}},
      {content:`${pct}%`,styles:{halign:"center"}},
      {content:pred.label,styles:{halign:"center",fontStyle:"bold"}},
      g.catatanSingkat||"-",
    ];
  });

  doc.autoTable({
    startY:y,
    head:[[
      {content:"No",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Nama Guru",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Mata Pelajaran",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Total Skor",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Skor Maksimal",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Persentase",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Predikat",styles:{halign:"center",fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
      {content:"Catatan Singkat Kepala Sekolah",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255}},
    ]],
    body:guruRows,
    margin:{left:14,right:14},
    columnStyles:{0:{cellWidth:9,halign:"center"},1:{cellWidth:48},2:{cellWidth:38},3:{cellWidth:18,halign:"center"},4:{cellWidth:20,halign:"center"},5:{cellWidth:20,halign:"center"},6:{cellWidth:25,halign:"center"},7:{cellWidth:"auto"}},
    bodyStyles:{fontSize:8.5,cellPadding:2.5},
    headStyles:{fontSize:8.5},
    alternateRowStyles:{fillColor:[248,250,252]},
    theme:"grid",
  });

  // ── KETENTUAN PENILAIAN & KRITERIA ──
  y=doc.lastAutoTable.finalY+6;
  if(y>165){doc.addPage();y=16;}

  // Kiri: Ketentuan + Rumus
  doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("Ketentuan Penilaian", 14, y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  const ketA=["Jumlah indikator: 20","Skor minimal per indikator: 1","Skor maksimal per indikator: 4","Skor maksimal keseluruhan: 80"];
  ketA.forEach(k=>{doc.text(`• ${k}`,18,y);y+=4.5;});
  y+=2;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text("Rumus Persentase",14,y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  doc.text("Persentase = (Total Skor / Skor Maksimal) × 100%",14,y); y+=6;

  // Kriteria Predikat table
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text("Kriteria Predikat",14,y); y+=4;
  doc.autoTable({
    startY:y,
    head:[[{content:"Persentase",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255,halign:"center"}},{content:"Predikat",styles:{fontStyle:"bold",fillColor:[51,51,51],textColor:255,halign:"center"}}]],
    body:[["91–100%","Sangat Baik"],["81–90%","Baik"],["71–80%","Cukup"],["≤70%","Perlu Pembinaan"]],
    margin:{left:14,right:W/2},
    columnStyles:{0:{cellWidth:35,halign:"center"},1:{cellWidth:35,halign:"center"}},
    bodyStyles:{fontSize:8.5,cellPadding:2.5,halign:"center"},
    headStyles:{fontSize:8.5},
    theme:"grid",
  });

  // ── REKAP UMUM ──
  const totalGuru=guruList.length;
  const avg=totalGuru?(guruList.reduce((a,g)=>a+(g.template==="B"?(g.total/SKOR_MAX_B)*100:g.persen),0)/totalGuru).toFixed(2):0;
  const cp={"Sangat Baik":0,"Baik":0,"Cukup":0,"Perlu Pembinaan":0};
  guruList.forEach(g=>{cp[getPred(g).label]++;});
  const mayoritas=Object.entries(cp).sort((a,b)=>b[1]-a[1])[0]?.[0]||"-";

  const rekapY=Math.max(doc.lastAutoTable.finalY+5, y-40);
  const rekapX=W/2+5;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(0);
  doc.text("Rekap Umum Kepala Sekolah kepada Yayasan",rekapX,doc.lastAutoTable?doc.lastAutoTable.startY||y:y); 

  // Calculate position for rekap umum — place it to the right of kriteria table
  const kStart=doc.lastAutoTable.startY||y;
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5);
  doc.text("Rekap Umum Kepala Sekolah kepada Yayasan",rekapX,kStart-4);
  doc.autoTable({
    startY:kStart,
    body:[
      [{content:"Komponen",styles:{fontStyle:"bold",fillColor:[220,220,220]}},{content:"Hasil",styles:{fontStyle:"bold",fillColor:[220,220,220]}}],
      ["Jumlah Guru Disupervisi",`${totalGuru} Guru`],
      ["Rata-rata Nilai Supervisi",`${avg}`],
      ["Predikat Mayoritas",mayoritas],
      ["Guru dengan Predikat Sangat Baik",`${cp["Sangat Baik"]} Guru`],
      ["Guru dengan Predikat Baik",`${cp["Baik"]} Guru`],
      ["Guru dengan Predikat Cukup",`${cp["Cukup"]} Guru`],
      ["Guru yang Memerlukan Pembinaan Khusus",`${cp["Perlu Pembinaan"]} Guru`],
    ],
    margin:{left:rekapX,right:14},
    columnStyles:{0:{cellWidth:72},1:{cellWidth:40,halign:"center"}},
    bodyStyles:{fontSize:8.5,cellPadding:2.5},
    theme:"grid",
  });

  // ── KESIMPULAN KEPALA SEKOLAH ──
  y=doc.lastAutoTable.finalY+5;
  if(y>190){doc.addPage();y=16;}
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(0);
  doc.text("Kesimpulan Kepala Sekolah",14,y); y+=5;
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
  const kesimpulan=globalState.kesimpulanKepsek||"Secara umum, hasil supervisi menunjukkan bahwa sebagian besar guru telah melaksanakan pembelajaran dengan baik, administrasi cukup lengkap, serta memiliki komitmen yang tinggi terhadap sekolah. Area yang masih perlu ditingkatkan meliputi diferensiasi pembelajaran, penggunaan refleksi siswa, variasi metode, dan penguatan rubrik penilaian.\n\nKe depan, sekolah akan melakukan tindak lanjut berupa pelatihan internal, coaching per bidang studi, supervisi lanjutan, dan pendampingan administrasi pembelajaran agar kualitas guru terus meningkat secara berkelanjutan.";
  const kLines=doc.splitTextToSize(kesimpulan, W-28);
  doc.text(kLines,14,y);

  const pages=doc.internal.getNumberOfPages();
  for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(7.5);doc.setTextColor(150);doc.setFont("helvetica","normal");doc.text(`${SEKOLAH} · Dicetak: ${new Date().toLocaleDateString("id-ID")} · Hal ${i}/${pages}`,W/2,207,{align:"center"});}
  doc.save(`RekapSupervisi_Yayasan_${SEKOLAH.replace(/\s+/g,"_")}.pdf`);
}

// ══════════════════════════════════════════════════════════════════
//  UI COMPONENTS
// ══════════════════════════════════════════════════════════════════
function Modal({onClose,children}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.78)",zIndex:50,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"16px",overflowY:"auto"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:900,boxShadow:"0 25px 60px rgba(0,0,0,0.35)",marginTop:16,marginBottom:16}}>{children}</div>
  </div>);
}

function Field({label,value,onChange,placeholder,full,rows}){
  const style={width:"100%",padding:"8px 11px",borderRadius:8,border:"1.5px solid #cbd5e1",outline:"none",boxSizing:"border-box",fontFamily:"inherit",fontSize:13,background:"#fff",resize:"vertical"};
  return(<div style={full?{gridColumn:"1/-1"}:{}}>
    <label style={{fontSize:11,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>{label}</label>
    {rows?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={style}/>
         :<input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={style}/>}
  </div>);
}

// ── Pilih Template ──
function PilihTemplate({onPilih,onClose}){
  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Langkah Pertama</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>Pilih Template Penilaian</div></div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕</button>
    </div>
    <div style={{padding:"24px",display:"flex",gap:18,flexWrap:"wrap"}}>
      {[
        {tmpl:"A",title:"Template A — 20 Indikator",sub:"Maks 80 · Rinci per indikator",desc:"20 indikator dalam 5 kategori. Dilengkapi kolom Kekuatan Guru, Area Perbaikan, dan Rekomendasi/RTL. Cocok untuk supervisi komprehensif.",tags:["A. Perencanaan","B. Pelaksanaan","C. Penilaian","D. Adm","E. Profesional"],bg:"#f0f7ff",border:"#bfdbfe",hborder:"#2563eb",tagBg:"#dbeafe",tagText:"#1e3a8a",btnBg:"#2563eb"},
        {tmpl:"B",title:"Template B — 5 Aspek",sub:"Maks 20 · Penilaian cepat",desc:"5 aspek utama sesuai format standar. Dilengkapi kolom indikator, catatan/saran, dan kesimpulan. Cocok untuk monitoring rutin.",tags:["Perencanaan","Pelaksanaan","Pengelolaan Kelas","Penilaian & TL","Profesionalisme"],bg:"#f0fdf4",border:"#bbf7d0",hborder:"#16a34a",tagBg:"#dcfce7",tagText:"#166534",btnBg:"#16a34a"},
      ].map(opt=>(
        <div key={opt.tmpl} onClick={()=>onPilih(opt.tmpl)}
          style={{flex:"1 1 260px",border:`2px solid ${opt.border}`,borderRadius:14,padding:20,cursor:"pointer",background:opt.bg,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=opt.hborder;e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,0,0,0.12)`;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=opt.border;e.currentTarget.style.boxShadow="";}}>
          <div style={{fontSize:12,fontWeight:700,color:"#1e293b",marginBottom:4}}>{opt.title}</div>
          <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>{opt.sub}</div>
          <div style={{fontSize:12,color:"#475569",lineHeight:1.6,marginBottom:12}}>{opt.desc}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
            {opt.tags.map(t=><span key={t} style={{background:opt.tagBg,color:opt.tagText,fontSize:10,padding:"2px 8px",borderRadius:5,fontWeight:600}}>{t}</span>)}
          </div>
          <div style={{background:opt.btnBg,color:"#fff",textAlign:"center",padding:"9px",borderRadius:9,fontWeight:700,fontSize:13}}>Pilih Template {opt.tmpl} →</div>
        </div>
      ))}
    </div>
  </Modal>);
}

// ── Form Template A ──
function FormA({guru,indikator,onSave,onClose}){
  const init={}; indikator.forEach(ind=>{init[ind.id]=guru?.skor?.[ind.id]||0;});
  const[skor,setSkor]=useState(init);
  const[info,setInfo]=useState({nama:guru?.nama||"",mapel:guru?.mapel||"",kelas:guru?.kelas||"",tanggal:guru?.tanggal||"",supervisor:guru?.supervisor||"",kekuatan:guru?.kekuatan||"",areaPerbaikan:guru?.areaPerbaikan||"",rekomendasi:guru?.rekomendasi||"",catatanSingkat:guru?.catatanSingkat||""});
  const total=Object.values(skor).reduce((a,b)=>a+(b||0),0);
  const persen=((total/SKOR_MAX_A)*100).toFixed(2);
  const pred=getPredA(parseFloat(persen));
  const done=indikator.every(ind=>skor[ind.id]>0);
  const katGroups={};
  indikator.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});

  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontWeight:800,fontSize:12,padding:"2px 10px",borderRadius:20}}>Template A</span>
          <span style={{color:"#93c5fd",fontSize:11}}>20 Indikator · Maks 80</span>
        </div>
        <div style={{color:"#fff",fontSize:17,fontWeight:700,marginTop:3}}>Form Supervisi Guru</div>
      </div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕ Tutup</button>
    </div>
    <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:16,maxHeight:"75vh",overflowY:"auto"}}>
      {/* A. Identitas */}
      <div style={{background:"#f8fafc",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:10,textTransform:"uppercase"}}>A. Identitas Guru</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <Field label="Nama Guru" value={info.nama} onChange={v=>setInfo({...info,nama:v})} placeholder="Nama lengkap + gelar"/>
          <Field label="Mata Pelajaran" value={info.mapel} onChange={v=>setInfo({...info,mapel:v})} placeholder="Nama mata pelajaran"/>
          <Field label="Kelas/Program" value={info.kelas} onChange={v=>setInfo({...info,kelas:v})} placeholder="Mis: X PPLG 1"/>
          <Field label="Tanggal Supervisi" value={info.tanggal} onChange={v=>setInfo({...info,tanggal:v})} placeholder="Mis: 7 April 2026"/>
          <Field label="Supervisor" value={info.supervisor} onChange={v=>setInfo({...info,supervisor:v})} placeholder="Nama supervisor" full/>
        </div>
      </div>
      {/* B. Aspek Penilaian */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:10,textTransform:"uppercase"}}>B. Aspek Penilaian (Skala 1–4)</div>
        {Object.entries(katGroups).map(([kat,inds])=>(
          <div key={kat} style={{marginBottom:12}}>
            <div style={{background:"#e2e8f0",padding:"6px 12px",borderRadius:7,marginBottom:7,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{background:"#1e3a5f",color:"#fff",fontWeight:700,width:22,height:22,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{kat}</span>
              <span style={{fontWeight:700,fontSize:12,color:"#1e293b"}}>{inds[0].katLabel}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {inds.map(ind=>{const s=skor[ind.id]; return(
                <div key={ind.id} style={{border:s>0?"1.5px solid #bfdbfe":"1.5px solid #e2e8f0",borderRadius:9,padding:"10px 13px",background:s>0?"#f0f7ff":"#fafafa"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}><span style={{fontSize:10,fontWeight:700,color:"#64748b",background:"#e2e8f0",padding:"2px 6px",borderRadius:4,marginRight:7}}>{ind.id}</span><span style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{ind.judul}</span></div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      {[1,2,3,4].map(n=>(<button key={n} onClick={()=>setSkor({...skor,[ind.id]:n})} style={{width:32,height:32,borderRadius:7,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",background:s===n?SC[n]:"#e2e8f0",color:s===n?"#fff":"#64748b",transform:s===n?"scale(1.1)":"scale(1)",transition:"all 0.15s"}}>{n}</button>))}
                    </div>
                  </div>
                  {s>0&&<div style={{marginTop:7,padding:"6px 10px",borderRadius:7,background:"#dbeafe",borderLeft:"3px solid #2563eb",fontSize:12,color:"#1e3a8a",lineHeight:1.5}}>💬 {ind.catatan[s]}</div>}
                </div>);
              })}
            </div>
          </div>
        ))}
      </div>
      {/* C. Catatan Supervisor */}
      <div style={{background:"#f8fafc",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:10,textTransform:"uppercase"}}>C. Catatan Supervisor</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <Field label="Kekuatan Guru" value={info.kekuatan} onChange={v=>setInfo({...info,kekuatan:v})} placeholder="Jelaskan hal-hal positif yang sudah dilakukan guru..." rows={2}/>
          <Field label="Area Perbaikan" value={info.areaPerbaikan} onChange={v=>setInfo({...info,areaPerbaikan:v})} placeholder="Jelaskan bagian yang masih perlu diperbaiki..." rows={2}/>
          <Field label="Rekomendasi/RTL" value={info.rekomendasi} onChange={v=>setInfo({...info,rekomendasi:v})} placeholder="Tindak lanjut yang disarankan untuk guru..." rows={2}/>
        </div>
      </div>
      {/* Catatan Singkat untuk Rekap Yayasan */}
      <div style={{background:"#fffbeb",borderRadius:12,padding:14,border:"1px solid #fde68a"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#78350f",marginBottom:8,textTransform:"uppercase"}}>Catatan Singkat Kepala Sekolah (untuk Rekap Yayasan)</div>
        <Field label="" value={info.catatanSingkat} onChange={v=>setInfo({...info,catatanSingkat:v})} placeholder="Mis: Pembelajaran aktif, media digital lengkap, perlu penguatan diferensiasi" rows={2}/>
      </div>
      {/* Footer Skor */}
      <div style={{background:"#f0f7ff",border:"2px solid #bfdbfe",borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div><div style={{fontSize:12,color:"#475569"}}>Total Skor</div><div style={{fontSize:28,fontWeight:800,color:"#1e3a5f"}}>{total}<span style={{fontSize:13,color:"#94a3b8"}}>/80</span></div><div style={{fontSize:12}}><strong>{done?persen+"%":"—"}</strong></div></div>
        {done?<div style={{background:pred.bg,color:pred.text,padding:"9px 16px",borderRadius:10,fontWeight:700,fontSize:14}}>{pred.label}</div>:<div style={{color:"#94a3b8",fontSize:12}}>Isi semua 20 indikator</div>}
        <button onClick={()=>{if(!info.nama.trim())return alert("Nama guru wajib diisi!");if(!done)return alert("Harap isi semua 20 indikator!");onSave({...info,skor,total,persen:parseFloat(persen),template:"A"});}}
          style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",fontWeight:700,fontSize:14,cursor:"pointer"}}>💾 Simpan</button>
      </div>
    </div>
  </Modal>);
}

// ── Form Template B ──
function FormB({guru,aspekB,onSave,onClose}){
  const init={}; aspekB.forEach(a=>{init[a.id]=guru?.skor?.[a.id]||0;});
  const[skor,setSkor]=useState(init);
  const[info,setInfo]=useState({nama:guru?.nama||"",mapel:guru?.mapel||"",kelas:guru?.kelas||"",tanggal:guru?.tanggal||"",supervisor:guru?.supervisor||"",catatanB:guru?.catatanB||"",kesimpulanB:guru?.kesimpulanB||"sudah",catatanSingkat:guru?.catatanSingkat||""});
  const total=Object.values(skor).reduce((a,b)=>a+(b||0),0);
  const pred=getPredB(total);
  const done=aspekB.every(a=>skor[a.id]>0);

  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#166534,#16a34a)",borderRadius:"16px 16px 0 0",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontWeight:800,fontSize:12,padding:"2px 10px",borderRadius:20}}>Template B</span>
          <span style={{color:"#bbf7d0",fontSize:11}}>5 Aspek · Maks 20</span>
        </div>
        <div style={{color:"#fff",fontSize:17,fontWeight:700,marginTop:3}}>Form Supervisi Guru</div>
      </div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕ Tutup</button>
    </div>
    <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:16,maxHeight:"75vh",overflowY:"auto"}}>
      {/* Identitas */}
      <div style={{background:"#f8fafc",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:10,textTransform:"uppercase"}}>Identitas Guru</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <Field label="Nama Guru" value={info.nama} onChange={v=>setInfo({...info,nama:v})} placeholder="Nama lengkap + gelar"/>
          <Field label="Mata Pelajaran" value={info.mapel} onChange={v=>setInfo({...info,mapel:v})} placeholder="Nama mata pelajaran"/>
          <Field label="Kelas/Program" value={info.kelas} onChange={v=>setInfo({...info,kelas:v})} placeholder="Mis: X PPLG 1"/>
          <Field label="Tanggal Supervisi" value={info.tanggal} onChange={v=>setInfo({...info,tanggal:v})} placeholder="Mis: 7 April 2026"/>
          <Field label="Supervisor" value={info.supervisor} onChange={v=>setInfo({...info,supervisor:v})} placeholder="Nama supervisor" full/>
        </div>
      </div>
      {/* 5 Aspek */}
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:10,textTransform:"uppercase"}}>Penilaian Aspek Supervisi (Skala 1–4)</div>
        {aspekB.map(a=>{const s=skor[a.id]; return(
          <div key={a.id} style={{border:s>0?"1.5px solid #bbf7d0":"1.5px solid #e2e8f0",borderRadius:11,padding:"13px 15px",background:s>0?"#f0fdf4":"#fafafa",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <span style={{background:"#16a34a",color:"#fff",fontWeight:700,fontSize:11,padding:"2px 8px",borderRadius:5}}>{a.id}</span>
                  <span style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{a.aspek}</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {a.indikator.map((ind,i)=><span key={i} style={{background:"#dcfce7",color:"#166534",fontSize:11,padding:"2px 7px",borderRadius:4}}>• {ind}</span>)}
                </div>
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                {[1,2,3,4].map(n=>(<button key={n} onClick={()=>setSkor({...skor,[a.id]:n})} style={{width:35,height:35,borderRadius:8,border:"none",fontWeight:700,fontSize:14,cursor:"pointer",background:s===n?SC[n]:"#e2e8f0",color:s===n?"#fff":"#64748b",transform:s===n?"scale(1.1)":"scale(1)",transition:"all 0.15s"}}>{n}</button>))}
              </div>
            </div>
            {s>0&&<div style={{marginTop:8,padding:"6px 10px",borderRadius:7,background:"#dcfce7",borderLeft:"3px solid #16a34a",fontSize:12,color:"#166534",lineHeight:1.5}}>💬 {a.catatan[s]}</div>}
          </div>);
        })}
      </div>
      {/* Rekap */}
      <div style={{background:"#f8fafc",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:8,textTransform:"uppercase"}}>Rekap Nilai Supervisi</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#e2e8f0"}}><th style={{padding:"6px 10px",textAlign:"left",color:"#475569"}}>Aspek</th><th style={{padding:"6px 10px",textAlign:"center",color:"#475569",width:80}}>Maks</th><th style={{padding:"6px 10px",textAlign:"center",color:"#475569",width:80}}>Skor</th></tr></thead>
          <tbody>
            {aspekB.map(a=><tr key={a.id} style={{borderTop:"1px solid #f1f5f9"}}><td style={{padding:"6px 10px",color:"#1e293b"}}>{a.aspek}</td><td style={{padding:"6px 10px",textAlign:"center",color:"#64748b"}}>4</td><td style={{padding:"6px 10px",textAlign:"center"}}>{skor[a.id]>0?<span style={{background:SC[skor[a.id]],color:"#fff",borderRadius:5,padding:"2px 8px",fontWeight:700}}>{skor[a.id]}</span>:<span style={{color:"#94a3b8"}}>—</span>}</td></tr>)}
            <tr style={{background:"#dcfce7",borderTop:"2px solid #86efac"}}><td style={{padding:"6px 10px",fontWeight:700,color:"#166534"}}>TOTAL</td><td style={{padding:"6px 10px",textAlign:"center",fontWeight:700,color:"#166534"}}>20</td><td style={{padding:"6px 10px",textAlign:"center",fontWeight:800,fontSize:17,color:"#166534"}}>{total}</td></tr>
          </tbody>
        </table>
        <div style={{marginTop:8,fontSize:12}}><strong>Kategori:</strong> {done?<span style={{background:pred.bg,color:pred.text,padding:"3px 10px",borderRadius:6,fontWeight:700}}>{pred.label}</span>:<span style={{color:"#94a3b8"}}>—</span>}</div>
      </div>
      {/* Catatan & Kesimpulan */}
      <div style={{background:"#f8fafc",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:8,textTransform:"uppercase"}}>Catatan dan Saran Supervisi</div>
        <Field label="" value={info.catatanB} onChange={v=>setInfo({...info,catatanB:v})} placeholder="Tuliskan catatan dan saran supervisi..." rows={3}/>
        <div style={{fontSize:11,fontWeight:700,color:"#166534",margin:"10px 0 7px",textTransform:"uppercase"}}>Kesimpulan</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{val:"sudah",txt:"☑ Guru sudah memenuhi standar supervisi"},{val:"perlu",txt:"☐ Guru perlu pembinaan pada aspek penilaian dan tindak lanjut"}].map(o=>(
            <label key={o.val} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"8px 14px",borderRadius:8,border:`2px solid ${info.kesimpulanB===o.val?"#16a34a":"#e2e8f0"}`,background:info.kesimpulanB===o.val?"#f0fdf4":"#fff",flex:1,transition:"all 0.15s"}}>
              <input type="radio" name="kes" value={o.val} checked={info.kesimpulanB===o.val} onChange={()=>setInfo({...info,kesimpulanB:o.val})} style={{display:"none"}}/>
              <span style={{fontSize:12,fontWeight:600,color:info.kesimpulanB===o.val?"#166534":"#475569"}}>{o.txt}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Catatan Singkat Yayasan */}
      <div style={{background:"#fffbeb",borderRadius:12,padding:14,border:"1px solid #fde68a"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#78350f",marginBottom:8,textTransform:"uppercase"}}>Catatan Singkat Kepala Sekolah (untuk Rekap Yayasan)</div>
        <Field label="" value={info.catatanSingkat} onChange={v=>setInfo({...info,catatanSingkat:v})} placeholder="Mis: Penguasaan kelas baik, perlu peningkatan variasi metode" rows={2}/>
      </div>
      {/* Footer */}
      <div style={{background:"#f0fdf4",border:"2px solid #bbf7d0",borderRadius:12,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div><div style={{fontSize:12,color:"#475569"}}>Total Skor</div><div style={{fontSize:28,fontWeight:800,color:"#166534"}}>{total}<span style={{fontSize:13,color:"#94a3b8"}}>/20</span></div></div>
        {done?<div style={{background:pred.bg,color:pred.text,padding:"9px 16px",borderRadius:10,fontWeight:700,fontSize:14}}>{pred.label}</div>:<div style={{color:"#94a3b8",fontSize:12}}>Isi semua 5 aspek</div>}
        <button onClick={()=>{if(!info.nama.trim())return alert("Nama guru wajib diisi!");if(!done)return alert("Harap isi semua 5 aspek!");onSave({...info,skor,total,persen:parseFloat(((total/SKOR_MAX_B)*100).toFixed(2)),template:"B"});}}
          style={{background:"linear-gradient(135deg,#166534,#16a34a)",color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",fontWeight:700,fontSize:14,cursor:"pointer"}}>💾 Simpan</button>
      </div>
    </div>
  </Modal>);
}

// ── Modal Kelola Rekap Yayasan ──
function ModalRekapYayasan({globalState,setGlobalState,guruList,aspekB,onClose}){
  const[kes,setKes]=useState(globalState.kesimpulanKepsek||"");
  const[exp,setExp]=useState(false);
  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{color:"#93c5fd",fontSize:11,fontWeight:600,textTransform:"uppercase"}}>Laporan Kepala Sekolah</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>Rekap Penilaian untuk Yayasan</div></div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer"}}>✕</button>
    </div>
    <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={{fontSize:12,color:"#475569",background:"#f1f5f9",borderRadius:9,padding:"10px 14px"}}>
        PDF ini akan berisi: tabel rekap semua guru · ketentuan penilaian · kriteria predikat · rekap umum · kesimpulan kepala sekolah
      </div>
      <div>
        <label style={{fontSize:12,fontWeight:700,color:"#1e293b",display:"block",marginBottom:6}}>Kesimpulan Kepala Sekolah</label>
        <textarea value={kes} onChange={e=>setKes(e.target.value)} rows={6}
          placeholder="Tuliskan kesimpulan kepala sekolah tentang hasil supervisi secara keseluruhan..."
          style={{width:"100%",padding:"10px 12px",borderRadius:9,border:"1.5px solid #cbd5e1",fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{padding:"9px 18px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontWeight:600}}>Batal</button>
        <button onClick={async()=>{
          setGlobalState({...globalState,kesimpulanKepsek:kes});
          setExp(true);
          try{await exportRekapYayasan(guruList,{...globalState,kesimpulanKepsek:kes});}
          catch(e){alert("Gagal export PDF. Coba lagi.");}
          setExp(false); onClose();
        }} disabled={exp}
          style={{background:exp?"#6b7280":"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",border:"none",borderRadius:9,padding:"9px 22px",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          {exp?"⏳ Proses...":"📄 Generate PDF Rekap Yayasan"}
        </button>
      </div>
    </div>
  </Modal>);
}

// ── Detail Guru ──
function DetailGuru({guru,indikatorA,aspekB,onClose,onEdit}){
  const[exp,setExp]=useState(false);
  const isB=guru.template==="B";
  const pred=getPred(guru);
  const katGroups={};
  if(!isB) indikatorA.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});

  return(<Modal onClose={onClose}>
    <div style={{background:isB?"linear-gradient(135deg,#166534,#16a34a)":"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"18px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
            <span style={{background:"rgba(255,255,255,0.25)",color:"#fff",fontWeight:800,fontSize:11,padding:"2px 9px",borderRadius:20}}>Template {guru.template}</span>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>{isB?"5 Aspek · /20":"20 Indikator · /80"}</span>
          </div>
          <div style={{color:"#fff",fontSize:17,fontWeight:700}}>{guru.nama}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{guru.mapel} · {guru.kelas}</div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button onClick={async()=>{setExp(true);try{isB?await exportPDF_B(guru,aspekB):await exportPDF_A(guru,indikatorA);}catch{alert("Gagal.");}setExp(false);}} disabled={exp}
            style={{background:exp?"#6b7280":"#dc2626",border:"none",color:"#fff",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:600,fontSize:12}}>
            {exp?"⏳...":"📄 Export PDF"}
          </button>
          <button onClick={onEdit} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontWeight:600,fontSize:12}}>✏️ Edit</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"6px 13px",cursor:"pointer",fontSize:12}}>✕</button>
        </div>
      </div>
      <div style={{display:"flex",gap:9,marginTop:10,flexWrap:"wrap"}}>
        {[{l:"Total Skor",v:`${guru.total}/${isB?20:80}`},{l:"Persentase",v:`${guru.persen}%`},{l:"Predikat",v:pred.label}].map(s=>(
          <div key={s.l} style={{background:"rgba(255,255,255,0.12)",borderRadius:9,padding:"5px 12px",textAlign:"center"}}>
            <div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{s.l}</div><div style={{color:"#fff",fontWeight:700,fontSize:14}}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:12,maxHeight:"65vh",overflowY:"auto"}}>
      {isB?(
        <>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
            <thead><tr style={{background:"#f1f5f9"}}>
              <th style={{padding:"7px 10px",textAlign:"left",color:"#64748b"}}>Aspek</th>
              <th style={{padding:"7px 10px",textAlign:"left",color:"#64748b"}}>Indikator</th>
              <th style={{padding:"7px 10px",textAlign:"center",color:"#64748b",width:50}}>Skor</th>
              <th style={{padding:"7px 10px",textAlign:"left",color:"#64748b"}}>Catatan</th>
            </tr></thead>
            <tbody>{aspekB.map((a,i)=>{const s=guru.skor[a.id]; return(
              <tr key={a.id} style={{borderTop:"1px solid #f1f5f9",background:i%2?"#fafafa":"#fff"}}>
                <td style={{padding:"7px 10px",fontWeight:700,color:"#1e293b"}}>{a.aspek}</td>
                <td style={{padding:"7px 10px",color:"#475569",fontSize:11}}>{a.indikator.map((x,j)=><div key={j}>• {x}</div>)}</td>
                <td style={{padding:"7px 10px",textAlign:"center"}}><span style={{background:SC[s],color:"#fff",borderRadius:5,padding:"2px 9px",fontWeight:700,fontSize:14}}>{s}</span></td>
                <td style={{padding:"7px 10px",color:"#475569",lineHeight:1.5,fontSize:12}}>{a.catatan[s]}</td>
              </tr>);
            })}</tbody>
          </table>
          {guru.catatanB&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:9,padding:"10px 13px"}}><div style={{fontSize:11,fontWeight:700,color:"#166534",marginBottom:4}}>CATATAN SUPERVISOR</div><div style={{fontSize:13,color:"#166534",lineHeight:1.6}}>{guru.catatanB}</div></div>}
          <div style={{fontSize:13,fontWeight:600,color:guru.kesimpulanB==="sudah"?"#166534":"#b45309"}}>{guru.kesimpulanB==="sudah"?"✅ Guru sudah memenuhi standar supervisi":"⚠️ Guru perlu pembinaan lanjut"}</div>
        </>
      ):(
        <>
          {Object.entries(katGroups).map(([kat,inds])=>(
            <div key={kat}>
              <div style={{background:"#e2e8f0",padding:"5px 10px",borderRadius:6,marginBottom:6,fontSize:12,fontWeight:700,color:"#1e293b"}}>{kat}. {inds[0].katLabel}</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                <thead><tr style={{background:"#f8fafc"}}><th style={{padding:"6px 10px",textAlign:"left",color:"#64748b"}}>Indikator</th><th style={{padding:"6px 10px",textAlign:"center",color:"#64748b",width:50}}>Skor</th><th style={{padding:"6px 10px",textAlign:"left",color:"#64748b"}}>Catatan</th></tr></thead>
                <tbody>{inds.map((ind,i)=>{const s=guru.skor[ind.id]; return(
                  <tr key={ind.id} style={{borderTop:"1px solid #f1f5f9",background:i%2?"#fafafa":"#fff"}}>
                    <td style={{padding:"6px 10px",color:"#1e293b"}}>{ind.judul}</td>
                    <td style={{padding:"6px 10px",textAlign:"center"}}><span style={{background:SC[s],color:"#fff",borderRadius:5,padding:"2px 8px",fontWeight:700,fontSize:13}}>{s}</span></td>
                    <td style={{padding:"6px 10px",color:"#475569",lineHeight:1.5,fontSize:12}}>{ind.catatan[s]}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          ))}
          {(guru.kekuatan||guru.areaPerbaikan||guru.rekomendasi)&&(
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>CATATAN SUPERVISOR</div>
              {[{l:"Kekuatan Guru",v:guru.kekuatan},{l:"Area Perbaikan",v:guru.areaPerbaikan},{l:"Rekomendasi/RTL",v:guru.rekomendasi}].map(r=>r.v?(
                <div key={r.l} style={{marginBottom:6}}><span style={{fontWeight:700,color:"#475569",fontSize:12}}>{r.l}: </span><span style={{fontSize:12,color:"#1e293b"}}>{r.v}</span></div>
              ):null)}
            </div>
          )}
        </>
      )}
    </div>
  </Modal>);
}

// ── Kelola Catatan A ──
function KelolaCatatanA({indikator,onSave,onClose}){
  const[data,setData]=useState(JSON.parse(JSON.stringify(indikator)));
  const[akt,setAkt]=useState("A");
  const kats=[...new Set(data.map(d=>d.kat))];
  const katLabel={A:"Perencanaan",B:"Pelaksanaan",C:"Penilaian",D:"Adm & Tugas",E:"Profesional"};
  const upd=(id,s,v)=>setData(p=>p.map(d=>d.id===id?{...d,catatan:{...d.catatan,[s]:v}}:d));
  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"16px 16px 0 0",padding:"15px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:"#93c5fd",fontSize:10,fontWeight:600}}>Editor Template A</div><div style={{color:"#fff",fontSize:16,fontWeight:700}}>Kelola Catatan 20 Indikator</div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>✕</button>
      </div>
      <div style={{display:"flex",gap:5,marginTop:9,flexWrap:"wrap"}}>
        {kats.map(k=><button key={k} onClick={()=>setAkt(k)} style={{border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontWeight:600,fontSize:11,background:akt===k?"#fff":"rgba(255,255,255,0.15)",color:akt===k?"#1e3a5f":"#fff"}}>{k}. {katLabel[k]}</button>)}
      </div>
    </div>
    <div style={{padding:"12px 22px",maxHeight:"62vh",overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
      {data.filter(d=>d.kat===akt).map(ind=>(
        <div key={ind.id} style={{border:"1.5px solid #e2e8f0",borderRadius:10,padding:12}}>
          <div style={{fontWeight:700,color:"#1e293b",marginBottom:8,fontSize:12}}><span style={{background:"#e2e8f0",padding:"2px 6px",borderRadius:4,marginRight:7,fontSize:10}}>{ind.id}</span>{ind.judul}</div>
          {[1,2,3,4].map(s=><div key={s} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:5}}>
            <div style={{width:24,height:24,borderRadius:5,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#fff",background:SC[s]}}>{s}</div>
            <textarea value={ind.catatan[s]} onChange={e=>upd(ind.id,s,e.target.value)} rows={2} style={{flex:1,padding:"5px 8px",borderRadius:6,border:"1.5px solid #e2e8f0",fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none"}}/>
          </div>)}
        </div>
      ))}
    </div>
    <div style={{padding:"10px 22px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:9}}>
      <button onClick={onClose} style={{padding:"8px 16px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>Batal</button>
      <button onClick={()=>onSave(data)} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Simpan</button>
    </div>
  </Modal>);
}

// ── Kelola Catatan B ──
function KelolaCatatanB({aspekB,onSave,onClose}){
  const[data,setData]=useState(JSON.parse(JSON.stringify(aspekB)));
  const updCat=(id,s,v)=>setData(p=>p.map(d=>d.id===id?{...d,catatan:{...d.catatan,[s]:v}}:d));
  const updInd=(id,i,v)=>setData(p=>p.map(d=>d.id===id?{...d,indikator:d.indikator.map((x,j)=>j===i?v:x)}:d));
  return(<Modal onClose={onClose}>
    <div style={{background:"linear-gradient(135deg,#166534,#16a34a)",borderRadius:"16px 16px 0 0",padding:"15px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{color:"#bbf7d0",fontSize:10,fontWeight:600}}>Editor Template B</div><div style={{color:"#fff",fontSize:16,fontWeight:700}}>Kelola Catatan 5 Aspek</div></div>
      <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>✕</button>
    </div>
    <div style={{padding:"12px 22px",maxHeight:"65vh",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
      {data.map(a=>(
        <div key={a.id} style={{border:"1.5px solid #bbf7d0",borderRadius:11,padding:13,background:"#f0fdf4"}}>
          <div style={{fontWeight:700,color:"#166534",marginBottom:9,fontSize:13}}><span style={{background:"#16a34a",color:"#fff",padding:"2px 7px",borderRadius:4,marginRight:7,fontSize:11}}>{a.id}</span>{a.aspek}</div>
          <div style={{fontSize:10,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase"}}>Indikator Pengamatan</div>
          {a.indikator.map((ind,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <span style={{color:"#16a34a",fontWeight:700}}>•</span>
            <input value={ind} onChange={e=>updInd(a.id,i,e.target.value)} style={{flex:1,padding:"4px 8px",borderRadius:6,border:"1.5px solid #bbf7d0",fontSize:12,fontFamily:"inherit",outline:"none",background:"#fff"}}/>
          </div>)}
          <div style={{fontSize:10,fontWeight:700,color:"#475569",margin:"8px 0 5px",textTransform:"uppercase"}}>Catatan per Skor</div>
          {[1,2,3,4].map(s=><div key={s} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:5}}>
            <div style={{width:24,height:24,borderRadius:5,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#fff",background:SC[s]}}>{s}</div>
            <textarea value={a.catatan[s]} onChange={e=>updCat(a.id,s,e.target.value)} rows={2} style={{flex:1,padding:"5px 8px",borderRadius:6,border:"1.5px solid #bbf7d0",fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",background:"#fff"}}/>
          </div>)}
        </div>
      ))}
    </div>
    <div style={{padding:"10px 22px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:9}}>
      <button onClick={onClose} style={{padding:"8px 16px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>Batal</button>
      <button onClick={()=>onSave(data)} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#166534,#16a34a)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Simpan</button>
    </div>
  </Modal>);
}

// ══════════════════════════════════════════════════════════════════
//  APP UTAMA
// ══════════════════════════════════════════════════════════════════
export default function App(){
  const[guruList,setGuruList]=useState([]);
  const[indikatorA,setIndikatorA]=useState(INDIKATOR_A);
  const[aspekB,setAspekB]=useState(DEFAULT_ASPEK_B);
  const[globalState,setGlobalState]=useState({kesimpulanKepsek:""});
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(null);
  const[selGuru,setSelGuru]=useState(null);
  const[filter,setFilter]=useState("");
  const[filterTmpl,setFilterTmpl]=useState("Semua");
  const[saved,setSaved]=useState(false);

  useEffect(()=>{(async()=>{
    try{const g=await window.storage.get("guru-list");if(g)setGuruList(JSON.parse(g.value));}catch{}
    try{const a=await window.storage.get("indikator-a");if(a)setIndikatorA(JSON.parse(a.value));}catch{}
    try{const b=await window.storage.get("aspek-b");if(b)setAspekB(JSON.parse(b.value));}catch{}
    try{const gs=await window.storage.get("global-state");if(gs)setGlobalState(JSON.parse(gs.value));}catch{}
    setLoading(false);
  })();},[]);

  const saveGuru=async(list)=>{setGuruList(list);try{await window.storage.set("guru-list",JSON.stringify(list));}catch{}};
  const saveA=async(d)=>{setIndikatorA(d);try{await window.storage.set("indikator-a",JSON.stringify(d));}catch{}};
  const saveB=async(d)=>{setAspekB(d);try{await window.storage.set("aspek-b",JSON.stringify(d));}catch{}};
  const saveGS=async(d)=>{setGlobalState(d);try{await window.storage.set("global-state",JSON.stringify(d));}catch{}};

  const handleSave=(data)=>{
    const newList=(modal==="formA"||modal==="formB")&&selGuru!==null?guruList.map((g,i)=>i===selGuru?data:g):[...guruList,data];
    saveGuru(newList);setSaved(true);setTimeout(()=>setSaved(false),2000);setModal(null);setSelGuru(null);
  };
  const handleDel=(idx)=>{if(!confirm("Hapus data guru ini?"))return;saveGuru(guruList.filter((_,i)=>i!==idx));};
  const openEdit=(idx)=>{setSelGuru(idx);setModal(guruList[idx].template==="B"?"formB":"formA");};

  const filtered=guruList.filter(g=>{
    const mt=g.nama.toLowerCase().includes(filter.toLowerCase())||g.mapel.toLowerCase().includes(filter.toLowerCase());
    const tp=filterTmpl==="Semua"||g.template===filterTmpl;
    return mt&&tp;
  });
  const totalGuru=guruList.length;
  const avg=totalGuru?(guruList.reduce((a,g)=>a+(g.template==="B"?(g.total/SKOR_MAX_B)*100:g.persen),0)/totalGuru).toFixed(1):0;
  const cp={"Sangat Baik":0,"Baik":0,"Cukup":0,"Perlu Pembinaan":0};
  guruList.forEach(g=>{cp[getPred(g).label]++;});
  const cntA=guruList.filter(g=>g.template==="A").length;
  const cntB=guruList.filter(g=>g.template==="B").length;

  if(loading)return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{textAlign:"center",color:"#64748b"}}><div style={{fontSize:32}}>⏳</div><div>Memuat...</div></div></div>);

  return(<div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#f1f5f9",minHeight:"100vh"}}>
    {/* HEADER */}
    <div style={{background:"linear-gradient(135deg,#0f2447,#1e3a5f,#2563eb)",padding:"16px 20px"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{color:"#93c5fd",fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{SEKOLAH}</div>
            <div style={{color:"#fff",fontSize:19,fontWeight:800}}>📋 Sistem Supervisi Guru</div>
            <div style={{color:"#bfdbfe",fontSize:11,marginTop:2}}>Template A (20 Indikator) · Template B (5 Aspek) · PDF sesuai format dokumen</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setModal("rekapYayasan")} style={{background:"#dc2626",border:"none",color:"#fff",borderRadius:9,padding:"8px 13px",cursor:"pointer",fontWeight:700,fontSize:12}}>📄 PDF Rekap Yayasan</button>
            <button onClick={()=>setModal("catatanA")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:9,padding:"8px 13px",cursor:"pointer",fontWeight:600,fontSize:12}}>⚙️ Catatan A</button>
            <button onClick={()=>setModal("catatanB")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:9,padding:"8px 13px",cursor:"pointer",fontWeight:600,fontSize:12}}>⚙️ Catatan B</button>
            <button onClick={()=>setModal("pilih")} style={{background:"#fff",border:"none",color:"#1e3a5f",borderRadius:9,padding:"8px 13px",cursor:"pointer",fontWeight:700,fontSize:12}}>+ Tambah Guru</button>
          </div>
        </div>
        <div style={{display:"flex",gap:7,marginTop:14,flexWrap:"wrap"}}>
          {[{l:"Total Guru",v:totalGuru,i:"👨‍🏫"},{l:"Rata-rata",v:`${avg}%`,i:"📊"},{l:"Tmpl A",v:cntA,i:"🔵"},{l:"Tmpl B",v:cntB,i:"🟢"},{l:"Sangat Baik",v:cp["Sangat Baik"],i:"⭐"},{l:"Baik",v:cp["Baik"],i:"✅"},{l:"Cukup",v:cp["Cukup"],i:"🟡"},{l:"Perlu Pembinaan",v:cp["Perlu Pembinaan"],i:"🔴"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,0.1)",borderRadius:9,padding:"7px 11px",textAlign:"center",flex:"1 1 60px"}}>
              <div style={{fontSize:14}}>{s.i}</div><div style={{color:"#fff",fontWeight:800,fontSize:16}}>{s.v}</div><div style={{color:"#93c5fd",fontSize:9}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* KONTEN */}
    <div style={{maxWidth:1120,margin:"0 auto",padding:"16px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input placeholder="🔍 Cari nama guru atau mata pelajaran..." value={filter} onChange={e=>setFilter(e.target.value)} style={{flex:1,minWidth:160,padding:"9px 13px",borderRadius:9,border:"1.5px solid #e2e8f0",fontSize:13,outline:"none",background:"#fff"}}/>
        {["Semua","A","B"].map(t=><button key={t} onClick={()=>setFilterTmpl(t)} style={{padding:"8px 14px",borderRadius:9,border:"2px solid",cursor:"pointer",fontWeight:700,fontSize:12,borderColor:filterTmpl===t?"#2563eb":"#e2e8f0",background:filterTmpl===t?"#eff6ff":"#fff",color:filterTmpl===t?"#2563eb":"#64748b"}}>
          {t==="Semua"?"Semua":t==="A"?"📋 Template A":"📝 Template B"}
        </button>)}
        {saved&&<span style={{color:"#10b981",fontWeight:600,fontSize:13}}>✅ Tersimpan!</span>}
      </div>

      {filtered.length===0?(
        <div style={{background:"#fff",borderRadius:14,padding:"50px 20px",textAlign:"center",border:"2px dashed #e2e8f0"}}>
          <div style={{fontSize:40}}>📝</div>
          <div style={{fontSize:16,fontWeight:700,color:"#1e293b",marginTop:10}}>Belum ada data guru</div>
          <div style={{color:"#94a3b8",marginTop:5,fontSize:13}}>Klik "+ Tambah Guru" dan pilih Template A atau B</div>
        </div>
      ):(
        <div style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:"#f8fafc",borderBottom:"2px solid #e2e8f0"}}>
              {["No","Nama Guru","Mata Pelajaran","Tmpl","Tgl Supervisi","Skor","Predikat","Aksi"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:["No","Tmpl","Skor","Predikat","Aksi"].includes(h)?"center":"left",color:"#64748b",fontWeight:600,fontSize:12}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filtered.map((g,i)=>{
              const isB=g.template==="B"; const pred=getPred(g); const ri=guruList.indexOf(g);
              return(<tr key={i} style={{borderBottom:"1px solid #f1f5f9"}} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"10px 12px",color:"#94a3b8",fontWeight:600,textAlign:"center"}}>{i+1}</td>
                <td style={{padding:"10px 12px",fontWeight:700,color:"#1e293b"}}>{g.nama}</td>
                <td style={{padding:"10px 12px",color:"#475569"}}>{g.mapel}<br/><span style={{fontSize:11,color:"#94a3b8"}}>{g.kelas}</span></td>
                <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{background:isB?"#dcfce7":"#dbeafe",color:isB?"#166534":"#1e3a8a",padding:"3px 9px",borderRadius:20,fontWeight:700,fontSize:11}}>Tmpl {g.template}</span></td>
                <td style={{padding:"10px 12px",color:"#64748b",fontSize:12}}>{g.tanggal||"—"}</td>
                <td style={{padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontWeight:700,color:"#1e293b"}}>{g.total}<span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>/{isB?20:80}</span></div>
                  <div style={{fontSize:11,color:"#64748b"}}>{g.persen}%</div>
                </td>
                <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{background:pred.bg,color:pred.text,padding:"3px 9px",borderRadius:20,fontWeight:700,fontSize:11}}>{pred.label}</span></td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",gap:4,justifyContent:"center"}}>
                    <button onClick={()=>{setSelGuru(ri);setModal("detail");}} style={{background:"#eff6ff",color:"#2563eb",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,fontWeight:600}}>👁</button>
                    <button onClick={()=>openEdit(ri)} style={{background:"#f0fdf4",color:"#16a34a",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,fontWeight:600}}>✏️</button>
                    <button onClick={()=>handleDel(ri)} style={{background:"#fef2f2",color:"#dc2626",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,fontWeight:600}}>🗑</button>
                  </div>
                </td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}

      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:11,color:"#64748b",fontWeight:600}}>Predikat A:</span>
        {[{l:"Sangat Baik ≥91%",bg:"#d1fae5",t:"#065f46"},{l:"Baik ≥81%",bg:"#dbeafe",t:"#1e3a8a"},{l:"Cukup ≥71%",bg:"#fef3c7",t:"#78350f"},{l:"Perlu Pembinaan",bg:"#fee2e2",t:"#7f1d1d"}].map(p=>(
          <span key={p.l} style={{background:p.bg,color:p.t,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:600}}>{p.l}</span>
        ))}
        <span style={{fontSize:11,color:"#64748b",fontWeight:600,marginLeft:8}}>Predikat B:</span>
        {[{l:"Sangat Baik ≥17",bg:"#d1fae5",t:"#065f46"},{l:"Baik ≥13",bg:"#dbeafe",t:"#1e3a8a"},{l:"Cukup ≥9",bg:"#fef3c7",t:"#78350f"},{l:"Perlu Pembinaan",bg:"#fee2e2",t:"#7f1d1d"}].map(p=>(
          <span key={p.l} style={{background:p.bg,color:p.t,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:600}}>{p.l}</span>
        ))}
      </div>
    </div>

    {/* MODALS */}
    {modal==="pilih"&&<PilihTemplate onPilih={t=>{setSelGuru(null);setModal(t==="A"?"formA":"formB");}} onClose={()=>setModal(null)}/>}
    {modal==="formA"&&<FormA guru={selGuru!==null?guruList[selGuru]:null} indikator={indikatorA} onSave={handleSave} onClose={()=>{setModal(null);setSelGuru(null);}}/>}
    {modal==="formB"&&<FormB guru={selGuru!==null?guruList[selGuru]:null} aspekB={aspekB} onSave={handleSave} onClose={()=>{setModal(null);setSelGuru(null);}}/>}
    {modal==="detail"&&selGuru!==null&&<DetailGuru guru={guruList[selGuru]} indikatorA={indikatorA} aspekB={aspekB} onClose={()=>{setModal(null);setSelGuru(null);}} onEdit={()=>openEdit(selGuru)}/>}
    {modal==="catatanA"&&<KelolaCatatanA indikator={indikatorA} onSave={d=>{saveA(d);setModal(null);setSaved(true);setTimeout(()=>setSaved(false),2000);}} onClose={()=>setModal(null)}/>}
    {modal==="catatanB"&&<KelolaCatatanB aspekB={aspekB} onSave={d=>{saveB(d);setModal(null);setSaved(true);setTimeout(()=>setSaved(false),2000);}} onClose={()=>setModal(null)}/>}
    {modal==="rekapYayasan"&&<ModalRekapYayasan globalState={globalState} setGlobalState={saveGS} guruList={guruList} aspekB={aspekB} onClose={()=>setModal(null)}/>}
  </div>);
}