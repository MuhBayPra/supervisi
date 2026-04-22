import { useState, useEffect } from "react";

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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
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

  doc.setFillColor(30,58,95); doc.rect(0,0,W,36,"F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(7); doc.setFont("helvetica","normal");
  doc.text("LAPORAN HASIL SUPERVISI GURU", W/2, 9, {align:"center"});
  doc.setFontSize(14); doc.setFont("helvetica","bold");
  doc.text(SEKOLAH, W/2, 17, {align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Tahun Pelajaran 2025/2026", W/2, 25, {align:"center"});

  let y = 44;
  doc.setTextColor(30,58,95); doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("A. IDENTITAS GURU", 14, y); y += 5;
  doc.setDrawColor(30,58,95); doc.setLineWidth(0.4); doc.line(14,y,W-14,y); y += 4;
  const info = [["Nama Guru",guru.nama],["Mata Pelajaran",guru.mapel],["Kelas / Program",guru.kelas||"-"],["Tanggal Supervisi",guru.tanggal||"-"],["Supervisor",guru.supervisor||"-"]];
  doc.setFontSize(9); doc.setTextColor(0);
  info.forEach(([k,v]) => { doc.setFont("helvetica","bold"); doc.text(k,14,y); doc.setFont("helvetica","normal"); doc.text(`: ${v}`,65,y); y+=5; });

  // Kotak skor kanan atas
  const bx=W-57, by=44, bw=43, bh=28;
  doc.setFillColor(240,247,255); doc.setDrawColor(30,58,95); doc.setLineWidth(0.8);
  doc.roundedRect(bx,by,bw,bh,3,3,"FD");
  doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica","normal");
  doc.text("Total Skor",bx+bw/2,by+7,{align:"center"});
  doc.setFontSize(22); doc.setFont("helvetica","bold"); doc.setTextColor(30,58,95);
  doc.text(`${guru.total}`,bx+bw/2,by+17,{align:"center"});
  doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica","normal");
  doc.text(`dari ${SKOR_MAX} (${guru.persen}%)`,bx+bw/2,by+24,{align:"center"});
  doc.setFillColor(...pred.c);
  doc.roundedRect(bx,by+30,bw,8,2,2,"F");
  doc.setTextColor(255); doc.setFontSize(9); doc.setFont("helvetica","bold");
  doc.text(pred.label,bx+bw/2,by+35.5,{align:"center"});

  y += 5;
  doc.setTextColor(30,58,95); doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("B. ASPEK PENILAIAN", 14, y); y += 5;
  doc.setDrawColor(30,58,95); doc.setLineWidth(0.4); doc.line(14,y,W-14,y); y += 3;

  const katGroups = {};
  indikator.forEach(ind => { if (!katGroups[ind.kat]) katGroups[ind.kat]=[]; katGroups[ind.kat].push(ind); });
  const katFill = { A:[219,234,254], B:[220,252,231], C:[254,243,199], D:[237,233,254], E:[255,228,230] };
  const katTextC = { A:[30,58,95], B:[6,78,59], C:[120,53,15], D:[76,29,149], E:[136,19,55] };

  Object.entries(katGroups).forEach(([kat, inds]) => {
    const rows = inds.map(ind => { const s=guru.skor[ind.id]; return [ind.id, ind.judul, s||"-", ind.catatan[s]||""]; });
    doc.autoTable({
      startY: y,
      head: [[{content:`${kat}. ${KAT_LABEL[kat]}`,colSpan:4,styles:{fillColor:katFill[kat],textColor:katTextC[kat],fontStyle:"bold",fontSize:9}}],["No","Indikator","Skor","Catatan"]],
      body: rows, margin:{left:14,right:14},
      columnStyles: { 0:{cellWidth:8,halign:"center",fontSize:8}, 1:{cellWidth:58,fontSize:8}, 2:{cellWidth:10,halign:"center",fontStyle:"bold",fontSize:10}, 3:{cellWidth:90,fontSize:7.5} },
      headStyles:{fillColor:[51,65,85],textColor:255,fontSize:8,fontStyle:"bold"},
      alternateRowStyles:{fillColor:[248,250,252]},
      didDrawCell:(data) => {
        if (data.section==="body" && data.column.index===2) {
          const s=parseInt(data.cell.text[0]);
          const sc=[[],[239,68,68],[245,158,11],[59,130,246],[16,185,129]];
          if (sc[s]) {
            doc.setFillColor(...sc[s]);
            doc.roundedRect(data.cell.x+1,data.cell.y+1,data.cell.width-2,data.cell.height-2,1.5,1.5,"F");
            doc.setTextColor(255); doc.setFontSize(10); doc.setFont("helvetica","bold");
            doc.text(String(s),data.cell.x+data.cell.width/2,data.cell.y+data.cell.height/2+1.5,{align:"center"});
          }
        }
      },
    });
    y = doc.lastAutoTable.finalY + 4;
  });

  if (y > 240) { doc.addPage(); y = 20; }
  y += 4;
  doc.setTextColor(30,58,95); doc.setFontSize(10); doc.setFont("helvetica","bold");
  doc.text("C. TANDA TANGAN", 14, y); y += 5;
  doc.setDrawColor(30,58,95); doc.line(14,y,W-14,y); y += 10;
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(0);
  doc.text("Guru yang Disupervisi,", 34, y, {align:"center"});
  doc.text("Supervisor,", W-38, y, {align:"center"});
  y += 22;
  doc.text(`(${guru.nama})`, 34, y, {align:"center"});
  doc.text(`(${guru.supervisor||"................................"})`, W-38, y, {align:"center"});

  const pages = doc.internal.getNumberOfPages();
  for (let i=1;i<=pages;i++) { doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(150); doc.setFont("helvetica","normal"); doc.text(`${SEKOLAH} · Dicetak: ${new Date().toLocaleDateString("id-ID")} · Hal ${i}/${pages}`, W/2, 292, {align:"center"}); }
  doc.save(`Supervisi_${guru.nama.replace(/\s+/g,"_")}.pdf`);
}

async function exportRekapPDF(guruList) {
  await ensureJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  const W = doc.internal.pageSize.getWidth();

  doc.setFillColor(30,58,95); doc.rect(0,0,W,32,"F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.text("REKAP PENILAIAN SUPERVISI GURU",W/2,9,{align:"center"});
  doc.setFontSize(14); doc.setFont("helvetica","bold"); doc.text(SEKOLAH,W/2,17,{align:"center"});
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.text(`Tahun Pelajaran 2025/2026  ·  Dicetak: ${new Date().toLocaleDateString("id-ID")}`,W/2,25,{align:"center"});

  const total=guruList.length;
  const avg=total?(guruList.reduce((a,b)=>a+b.persen,0)/total).toFixed(2):0;
  const cp={"Sangat Baik":0,"Baik":0,"Cukup":0,"Perlu Pembinaan":0};
  guruList.forEach(g=>{cp[getPred(g.persen).label]++;});

  let bx=14;
  [{label:"Total Guru",val:total},{label:"Rata-rata",val:`${avg}%`},{label:"Sangat Baik",val:cp["Sangat Baik"]},{label:"Baik",val:cp["Baik"]},{label:"Cukup",val:cp["Cukup"]},{label:"Perlu Pembinaan",val:cp["Perlu Pembinaan"]}].forEach(s=>{
    doc.setFillColor(240,247,255); doc.setDrawColor(191,219,254); doc.setLineWidth(0.4);
    doc.roundedRect(bx,36,38,14,2,2,"FD");
    doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(30,58,95);
    doc.text(String(s.val),bx+19,44,{align:"center"});
    doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(100);
    doc.text(s.label,bx+19,48,{align:"center"});
    bx+=42;
  });

  const rows=guruList.map((g,i)=>{const p=getPred(g.persen); return [i+1,g.nama,g.mapel,g.kelas||"-",g.tanggal||"-",g.total,`${g.persen}%`,p.label];});
  doc.autoTable({
    startY:54, head:[["No","Nama Guru","Mata Pelajaran","Kelas","Tgl Supervisi","Skor","Persentase","Predikat"]],
    body:rows, margin:{left:14,right:14},
    headStyles:{fillColor:[30,58,95],textColor:255,fontStyle:"bold",fontSize:9},
    columnStyles:{0:{cellWidth:10,halign:"center"},1:{cellWidth:55},2:{cellWidth:45},3:{cellWidth:22},4:{cellWidth:25},5:{cellWidth:15,halign:"center",fontStyle:"bold"},6:{cellWidth:22,halign:"center"},7:{cellWidth:30,halign:"center",fontStyle:"bold"}},
    bodyStyles:{fontSize:9}, alternateRowStyles:{fillColor:[248,250,252]},
    didDrawCell:(data)=>{
      if(data.section==="body"&&data.column.index===7){
        const pc={"Sangat Baik":[16,185,129],"Baik":[59,130,246],"Cukup":[245,158,11],"Perlu Pembinaan":[239,68,68]};
        const c=pc[data.cell.text[0]];
        if(c){doc.setFillColor(...c);doc.roundedRect(data.cell.x+1.5,data.cell.y+1.5,data.cell.width-3,data.cell.height-3,2,2,"F");doc.setTextColor(255);doc.setFontSize(8);doc.setFont("helvetica","bold");doc.text(data.cell.text[0],data.cell.x+data.cell.width/2,data.cell.y+data.cell.height/2+1.5,{align:"center"});}
      }
    },
  });

  let ky=doc.lastAutoTable.finalY+8;
  doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(30,58,95); doc.text("Keterangan Predikat:",14,ky); ky+=5;
  let kx=14;
  [{label:"Sangat Baik",range:"91–100%",c:[16,185,129]},{label:"Baik",range:"81–90%",c:[59,130,246]},{label:"Cukup",range:"71–80%",c:[245,158,11]},{label:"Perlu Pembinaan",range:"≤ 70%",c:[239,68,68]}].forEach(k=>{
    doc.setFillColor(...k.c); doc.roundedRect(kx,ky-3.5,55,7,1.5,1.5,"F");
    doc.setTextColor(255); doc.setFontSize(8); doc.setFont("helvetica","bold");
    doc.text(`${k.label}: ${k.range}`,kx+27.5,ky+1,{align:"center"}); kx+=58;
  });

  const pages=doc.internal.getNumberOfPages();
  for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(7.5);doc.setTextColor(150);doc.setFont("helvetica","normal");doc.text(`${SEKOLAH} · Hal ${i}/${pages}`,W/2,205,{align:"center"});}
  doc.save(`Rekap_Supervisi_${SEKOLAH.replace(/\s+/g,"_")}.pdf`);
}

function Modal({onClose,children}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.75)",zIndex:50,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:880,boxShadow:"0 25px 60px rgba(0,0,0,0.3)",marginTop:20,marginBottom:20}}>{children}</div>
  </div>);
}

function FormSupervisi({guru,indikator,onSave,onClose}){
  const initSkor={};
  indikator.forEach(ind=>{initSkor[ind.id]=guru?.skor?.[ind.id]||0;});
  const[skor,setSkor]=useState(initSkor);
  const[info,setInfo]=useState({nama:guru?.nama||"",mapel:guru?.mapel||"",kelas:guru?.kelas||"",tanggal:guru?.tanggal||"",supervisor:guru?.supervisor||""});
  const total=Object.values(skor).reduce((a,b)=>a+(b||0),0);
  const persen=((total/SKOR_MAX)*100).toFixed(2);
  const pred=getPred(parseFloat(persen));
  const selesai=Object.values(skor).every(v=>v>0);
  const katGroups={};
  indikator.forEach(ind=>{if(!katGroups[ind.kat])katGroups[ind.kat]=[];katGroups[ind.kat].push(ind);});

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

  useEffect(()=>{(async()=>{
    try{const g=await storageApi.get("guru-list");if(g)setGuruList(JSON.parse(g.value));}catch{}
    try{const ind=await storageApi.get("indikator-catatan");if(ind)setIndikator(JSON.parse(ind.value));}catch{}
    setLoading(false);
  })();},[]);

  const saveGuru=async(list)=>{setGuruList(list);try{await storageApi.set("guru-list",JSON.stringify(list));}catch{}};
  const saveInd=async(ind)=>{setIndikator(ind);try{await storageApi.set("indikator-catatan",JSON.stringify(ind));}catch{}};

  const handleSave=(data)=>{
    const newList=modal==="edit"&&selGuru!==null?guruList.map((g,i)=>i===selGuru?data:g):[...guruList,data];
    saveGuru(newList);setSaved(true);setTimeout(()=>setSaved(false),2000);setModal(null);setSelGuru(null);
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
            <button onClick={async()=>{if(!guruList.length)return alert("Belum ada data guru!");setExpRekap(true);try{await exportRekapPDF(guruList);}catch{alert("Gagal export PDF.");}setExpRekap(false);}} disabled={expRekap}
              style={{background:expRekap?"#4b5563":"#dc2626",border:"none",color:"#fff",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:700,fontSize:13}}>
              {expRekap?"⏳ Proses...":"📄 Export Rekap PDF"}
            </button>
            <button onClick={()=>setModal("catatan")} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:600,fontSize:13}}>⚙️ Kelola Catatan</button>
            <button onClick={()=>{setSelGuru(null);setModal("tambah");}} style={{background:"#fff",border:"none",color:"#1e3a5f",borderRadius:10,padding:"9px 15px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Tambah Guru</button>
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

    {(modal==="tambah"||modal==="edit")&&<FormSupervisi guru={modal==="edit"?guruList[selGuru]:null} indikator={indikator} onSave={handleSave} onClose={()=>{setModal(null);setSelGuru(null);}}/>}
    {modal==="detail"&&selGuru!==null&&<DetailGuru guru={guruList[selGuru]} indikator={indikator} onClose={()=>{setModal(null);setSelGuru(null);}} onEdit={()=>setModal("edit")}/>}
    {modal==="catatan"&&<KelolaCatatan indikator={indikator} onSave={(ind)=>{saveInd(ind);setModal(null);setSaved(true);setTimeout(()=>setSaved(false),2000);}} onClose={()=>setModal(null)}/>}
  </div>);
}
