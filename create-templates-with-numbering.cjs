const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, convertInchesToTwip } = require('docx');

// Pastikan folder public ada
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Helper to make cells with custom width and numbering support
const tc = (text, isHeader = false, widthPercent = null, useNumbering = false, numberingLevel = 0) => {
    const paragraphConfig = {
        children: [new TextRun({ text, bold: isHeader })],
    };
    
    // Jika menggunakan numbering
    if (useNumbering) {
        paragraphConfig.numbering = {
            reference: "template-b-numbering",
            level: numberingLevel
        };
    }
    
    const cellConfig = {
        children: [new Paragraph(paragraphConfig)]
    };
    
    if (widthPercent) {
        cellConfig.width = { size: widthPercent, type: WidthType.PERCENTAGE };
    }
    
    return new TableCell(cellConfig);
};

// Helper untuk membuat cell dengan multiple paragraphs (untuk indikator dengan numbering)
const tcMultiParagraph = (lines, widthPercent = null, startNumber = 1) => {
    const paragraphs = lines.map((line, idx) => {
        return new Paragraph({
            text: line,
            numbering: {
                reference: "template-b-numbering",
                level: 0,
                instance: startNumber + idx - 1
            },
            spacing: {
                before: 0,
                after: 0,
                line: 240, // Single line spacing
            },
            indent: {
                left: convertInchesToTwip(0.25),
                hanging: convertInchesToTwip(0.25)
            }
        });
    });
    
    const cellConfig = {
        children: paragraphs
    };
    
    if (widthPercent) {
        cellConfig.width = { size: widthPercent, type: WidthType.PERCENTAGE };
    }
    
    return new TableCell(cellConfig);
};

// 1. Template A (tidak berubah)
const docA = new Document({
    sections: [{
        children: [
            new Paragraph({ children: [new TextRun({ text: "LEMBAR SUPERVISI GURU", bold: true, size: 28 })], alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "Nama: {nama}" }),
            new Paragraph({ text: "Mata Pelajaran: {mapel}" }),
            new Paragraph({ text: "Kelas: {kelas}" }),
            new Paragraph({ text: "Tanggal: {tanggal}" }),
            new Paragraph({ text: "Supervisor: {supervisor}" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ 
                        tableHeader: true,
                        children: [
                            tc("No", true, 5), 
                            tc("Indikator", true, 50), 
                            tc("Skor", true, 10), 
                            tc("Catatan", true, 35)
                        ] 
                    }),
                    new TableRow({ 
                        children: [
                            tc("{#indikator}{id}", false, 5), 
                            tc("{judul}", false, 50), 
                            tc("{skor}", false, 10), 
                            tc("{catatan}{/indikator}", false, 35)
                        ] 
                    }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Kekuatan: {kekuatan}" }),
            new Paragraph({ text: "Area Perbaikan: {areaPerbaikan}" }),
            new Paragraph({ text: "Rekomendasi: {rekomendasi}" }),
        ],
    }],
});

// 2. Template B - Dengan numbering definition
const docB = new Document({
    numbering: {
        config: [
            {
                reference: "template-b-numbering",
                levels: [
                    {
                        level: 0,
                        format: "decimal",
                        text: "%1.",
                        alignment: AlignmentType.LEFT,
                        style: {
                            paragraph: {
                                indent: { 
                                    left: convertInchesToTwip(0.25), 
                                    hanging: convertInchesToTwip(0.25) 
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    sections: [{
        children: [
            new Paragraph({ 
                children: [new TextRun({ text: "INSTRUMEN SUPERVISI GURU", bold: true, size: 28 })], 
                alignment: AlignmentType.CENTER 
            }),
            new Paragraph({ text: "Nama: {nama}" }),
            new Paragraph({ text: "NUPTK: {nuptk}" }),
            new Paragraph({ text: "Mata Pelajaran: {mapel}" }),
            new Paragraph({ text: "Kelas: {kelas}" }),
            new Paragraph({ text: "Tanggal: {tanggal}" }),
            new Paragraph({ text: "Supervisor: {supervisor}" }),
            new Paragraph(""),
            new Paragraph({ text: "Skala Penilaian: 1 = Kurang  |  2 = Cukup  |  3 = Baik  |  4 = Sangat Baik" }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    // Header
                    new TableRow({ 
                        tableHeader: true,
                        children: [
                            tc("Aspek Supervisi", true, 22), 
                            tc("Indikator yang Diamati", true, 43), 
                            tc("Skor (1-4)", true, 10),
                            tc("Skor Maks", true, 10),
                            tc("Catatan", true, 15)
                        ] 
                    }),
                    // Aspek 1: Perencanaan Pembelajaran (3 indikator)
                    new TableRow({ 
                        children: [
                            tc("{aspek1_nama}", false, 22), 
                            tc("{aspek1_indikator}", false, 43), 
                            tc("{aspek1_skor}", false, 10),
                            tc("{aspek1_maks}", false, 10),
                            tc("{aspek1_catatan}", false, 15)
                        ] 
                    }),
                    // Aspek 2: Pelaksanaan Pembelajaran (3 indikator)
                    new TableRow({ 
                        children: [
                            tc("{aspek2_nama}", false, 22), 
                            tc("{aspek2_indikator}", false, 43), 
                            tc("{aspek2_skor}", false, 10),
                            tc("{aspek2_maks}", false, 10),
                            tc("{aspek2_catatan}", false, 15)
                        ] 
                    }),
                    // Aspek 3: Pengelolaan Kelas (3 indikator)
                    new TableRow({ 
                        children: [
                            tc("{aspek3_nama}", false, 22), 
                            tc("{aspek3_indikator}", false, 43), 
                            tc("{aspek3_skor}", false, 10),
                            tc("{aspek3_maks}", false, 10),
                            tc("{aspek3_catatan}", false, 15)
                        ] 
                    }),
                    // Aspek 4: Penilaian dan Tindak Lanjut (2 indikator)
                    new TableRow({ 
                        children: [
                            tc("{aspek4_nama}", false, 22), 
                            tc("{aspek4_indikator}", false, 43), 
                            tc("{aspek4_skor}", false, 10),
                            tc("{aspek4_maks}", false, 10),
                            tc("{aspek4_catatan}", false, 15)
                        ] 
                    }),
                    // Aspek 5: Sikap dan Profesionalisme (4 indikator)
                    new TableRow({ 
                        children: [
                            tc("{aspek5_nama}", false, 22), 
                            tc("{aspek5_indikator}", false, 43), 
                            tc("{aspek5_skor}", false, 10),
                            tc("{aspek5_maks}", false, 10),
                            tc("{aspek5_catatan}", false, 15)
                        ] 
                    }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Total Skor: {total} / {skor_maks_total}" }),
            new Paragraph({ text: "Persentase: {persen}%" }),
            new Paragraph({ text: "Predikat: {predikat}" }),
            new Paragraph(""),
            new Paragraph({ text: "Kesimpulan:" }),
            new Paragraph({ text: "{kesimpulan_sudahB}" }),
            new Paragraph({ text: "{kesimpulan_perluB}" }),
            new Paragraph(""),
            new Paragraph({ text: "Catatan Umum: {catatanB}" }),
            new Paragraph({ text: "Yang Sudah Baik: {catatan_sudahB}" }),
            new Paragraph({ text: "Yang Perlu Ditingkatkan: {catatan_perluB}" }),
        ],
    }],
});

// 3. Rekap A
const rekapA = new Document({
    sections: [{
        children: [
            new Paragraph({ 
                children: [new TextRun({ text: "REKAP YAYASAN (TEMPLATE A)", bold: true, size: 28 })], 
                alignment: AlignmentType.CENTER 
            }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ 
                        tableHeader: true,
                        children: [
                            tc("No", true, 5), 
                            tc("Nama", true, 20), 
                            tc("Mapel", true, 15), 
                            tc("Total", true, 8), 
                            tc("Persen", true, 8), 
                            tc("Predikat", true, 12), 
                            tc("Catatan KS", true, 32)
                        ] 
                    }),
                    new TableRow({ 
                        children: [
                            tc("{#guru}{no}", false, 5), 
                            tc("{nama}", false, 20), 
                            tc("{mapel}", false, 15), 
                            tc("{total}", false, 8), 
                            tc("{persen}%", false, 8), 
                            tc("{predikat}", false, 12), 
                            tc("{catatan_ks}{/guru}", false, 32)
                        ] 
                    }),
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
            new Paragraph({ 
                children: [new TextRun({ text: "REKAP YAYASAN (TEMPLATE B)", bold: true, size: 28 })], 
                alignment: AlignmentType.CENTER 
            }),
            new Paragraph(""),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({ 
                        tableHeader: true,
                        children: [
                            tc("No", true, 5), 
                            tc("Nama", true, 20), 
                            tc("Mapel", true, 15), 
                            tc("Total", true, 8), 
                            tc("Persen", true, 8), 
                            tc("Predikat", true, 12), 
                            tc("Catatan KS", true, 32)
                        ] 
                    }),
                    new TableRow({ 
                        children: [
                            tc("{#guru}{no}", false, 5), 
                            tc("{nama}", false, 20), 
                            tc("{mapel}", false, 15), 
                            tc("{total}", false, 8), 
                            tc("{persen}%", false, 8), 
                            tc("{predikat}", false, 12), 
                            tc("{catatan_ks}{/guru}", false, 32)
                        ] 
                    }),
                ]
            }),
            new Paragraph(""),
            new Paragraph({ text: "Kesimpulan Kepala Sekolah: {kesimpulan_ks}" }),
        ],
    }],
});

console.log("Generating templates with numbering support...");

Promise.all([
    Packer.toBuffer(docA).then(b => fs.writeFileSync("public/template_a.docx", b)),
    Packer.toBuffer(docB).then(b => fs.writeFileSync("public/template_b.docx", b)),
    Packer.toBuffer(rekapA).then(b => fs.writeFileSync("public/rekap_a.docx", b)),
    Packer.toBuffer(rekapB).then(b => fs.writeFileSync("public/rekap_b.docx", b)),
]).then(() => {
    console.log("✅ Templates created successfully!");
    console.log("\n📝 CATATAN PENTING:");
    console.log("Template B sudah dibuat dengan struktur fix 5 aspek.");
    console.log("Numbering definition sudah ditambahkan ke template.");
    console.log("\nUntuk hasil terbaik, buka template_b.docx di Word dan:");
    console.log("1. Klik di cell {aspek1_indikator}");
    console.log("2. Pilih Home → Numbering (1. 2. 3.)");
    console.log("3. Ulangi untuk aspek2 sampai aspek5");
    console.log("4. Simpan template");
    console.log("\nSetelah itu, semua laporan yang di-generate akan otomatis punya numbering!");
});
