/**
 * Script untuk setup numbering di Template B
 * Menggunakan pizzip untuk memodifikasi XML Word secara langsung
 */

const fs = require('fs');
const PizZip = require('pizzip');

console.log("🔧 Setting up Template B with hanging indent...\n");

// Baca template yang sudah ada
const templatePath = 'public/template_b.docx';

if (!fs.existsSync(templatePath)) {
    console.error("❌ Error: template_b.docx tidak ditemukan!");
    console.log("Jalankan dulu: node create-templates.cjs");
    process.exit(1);
}

const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);

// Ambil document.xml (isi utama Word)
let docXml = zip.file('word/document.xml').asText();

// Fungsi untuk menambahkan tab stop dan hanging indent ke paragraph
// Tab stop di 0.5 inch (720 twips), hanging indent 0.5 inch
const addHangingIndent = (xml) => {
    // Pattern untuk mencari paragraph yang berisi {aspekX_indikator}
    const pattern = /<w:p>(.*?){aspek[1-5]_indikator}(.*?)<\/w:p>/g;
    
    // Replace dengan paragraph yang punya tab stop dan hanging indent
    const replacement = `<w:p>
        <w:pPr>
            <w:tabs>
                <w:tab w:val="left" w:pos="720"/>
            </w:tabs>
            <w:ind w:left="720" w:hanging="720"/>
            <w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>
        </w:pPr>
        $1{aspek$2_indikator}$3
    </w:p>`.replace(/\n\s+/g, '');
    
    return xml.replace(pattern, replacement);
};

// Terapkan hanging indent
docXml = addHangingIndent(docXml);

// Simpan kembali ke zip
zip.file('word/document.xml', docXml);

// Generate buffer dan simpan
const buf = zip.generate({ 
    type: 'nodebuffer',
    compression: 'DEFLATE'
});

fs.writeFileSync(templatePath, buf);

console.log("✅ Template B berhasil diupdate!");
console.log("\n📋 Yang sudah ditambahkan:");
console.log("   • Tab stop di 0.5 inch");
console.log("   • Hanging indent 0.5 inch");
console.log("   • Line spacing optimal");
console.log("\n🎯 Hasil:");
console.log("   Text yang panjang akan wrap dengan rapi");
console.log("   Baris kedua akan menjorok ke dalam (hanging indent)");
console.log("\n💡 Test sekarang:");
console.log("   1. Refresh aplikasi web");
console.log("   2. Download laporan Template B");
console.log("   3. Buka di Word - lihat hasilnya!");
