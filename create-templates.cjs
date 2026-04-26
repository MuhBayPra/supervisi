const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } = require('docx');

// Pastikan folder public ada
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Helper to make cells
const tc = (text, isHeader = false) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: isHeader })] })]
});

// 1. Template A
const docA = new Document({
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "LEMBAR SUPERVISI GURU", bold: true, size: 28 })], alignment: "center" }),
            new Paragraph({ text: "Nama: {nama}" }),
            new Paragraph({ text: "Mata Pelajaran: {mapel}" }),
            new Paragraph({ text: "Kelas: {kelas}" }),
            new Paragraph({ text: "Tanggal: {tanggal}" }),
            new Paragraph({ text: "Supervisor: {supervisor}" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [tc("No", true), tc("Indikator", true), tc("Skor", true), tc("Catatan", true)] }),
                    new TableRow({ children: [tc("{#indikator}{id}"), tc("{judul}"), tc("{skor}"), tc("{catatan}{/indikator}")] }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Kekuatan: {kekuatan}" }),
            new Paragraph({ text: "Area Perbaikan: {areaPerbaikan}" }),
            new Paragraph({ text: "Rekomendasi: {rekomendasi}" }),
        ],
    }],
});

// 2. Template B
const docB = new Document({
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "INSTRUMEN SUPERVISI GURU", bold: true, size: 28 })], alignment: "center" }),
            new Paragraph({ text: "Nama: {nama}" }),
            new Paragraph({ text: "Mata Pelajaran: {mapel}" }),
            new Paragraph({ text: "Kelas: {kelas}" }),
            new Paragraph({ text: "Tanggal: {tanggal}" }),
            new Paragraph({ text: "Supervisor: {supervisor}" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [tc("No", true), tc("Aspek", true), tc("Skor", true), tc("Catatan", true)] }),
                    new TableRow({ children: [tc("{#aspek}{id}"), tc("{nama_aspek}"), tc("{skor}"), tc("{catatan}{/aspek}")] }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Total Skor: {total}" }),
            new Paragraph({ text: "Predikat: {predikat}" }),
            new Paragraph({ text: "Catatan: {catatanB}" }),
            new Paragraph({ text: "Kesimpulan: {kesimpulanB}" }),
        ],
    }],
});

// 3. Rekap A
const rekapA = new Document({
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "REKAP YAYASAN (TEMPLATE A)", bold: true, size: 28 })], alignment: "center" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [tc("No", true), tc("Nama", true), tc("Mapel", true), tc("Total", true), tc("Persen", true), tc("Predikat", true), tc("Catatan KS", true)] }),
                    new TableRow({ children: [tc("{#guru}{no}"), tc("{nama}"), tc("{mapel}"), tc("{total}"), tc("{persen}%"), tc("{predikat}"), tc("{catatan_ks}{/guru}")] }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Kesimpulan Kepala Sekolah: {kesimpulan_ks}" }),
        ],
    }],
});

// 4. Rekap B
const rekapB = new Document({
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "REKAP YAYASAN (TEMPLATE B)", bold: true, size: 28 })], alignment: "center" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ children: [tc("No", true), tc("Nama", true), tc("Mapel", true), tc("Total", true), tc("Persen", true), tc("Predikat", true), tc("Catatan KS", true)] }),
                    new TableRow({ children: [tc("{#guru}{no}"), tc("{nama}"), tc("{mapel}"), tc("{total}"), tc("{persen}%"), tc("{predikat}"), tc("{catatan_ks}{/guru}")] }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Kesimpulan Kepala Sekolah: {kesimpulan_ks}" }),
        ],
    }],
});

Promise.all([
    Packer.toBuffer(docA).then(b => fs.writeFileSync("public/template_a.docx", b)),
    Packer.toBuffer(docB).then(b => fs.writeFileSync("public/template_b.docx", b)),
    Packer.toBuffer(rekapA).then(b => fs.writeFileSync("public/rekap_a.docx", b)),
    Packer.toBuffer(rekapB).then(b => fs.writeFileSync("public/rekap_b.docx", b)),
]).then(() => console.log("Templates created successfully!"));
