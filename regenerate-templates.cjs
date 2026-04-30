const fs = require('fs');
const { execSync } = require('child_process');

// Hapus file lama jika ada
const files = [
    'public/template_a.docx',
    'public/template_b.docx', 
    'public/rekap_a.docx',
    'public/rekap_b.docx'
];

console.log('Menghapus file template lama...');
files.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`✓ Dihapus: ${file}`);
        }
    } catch (err) {
        console.log(`✗ Gagal hapus ${file}: ${err.message}`);
    }
});

console.log('\nMembuat template baru...');
try {
    execSync('node create-templates.cjs', { stdio: 'inherit' });
    console.log('\n✅ Template berhasil dibuat!');
} catch (err) {
    console.log('\n❌ Gagal membuat template:', err.message);
}
