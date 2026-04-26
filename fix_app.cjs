const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Perbaiki komentar JSX yang salah (double check)
code = code.replace(/<!-- Warna diatur di Word -->/g, '{/* Warna diatur di Word */}');
code = code.replace(/<!-- Font diatur di Word -->/g, '{/* Font diatur di Word */}');

// 2. Perbaiki fungsi generateDocx agar menangani gambar secara sinkron (lebih aman)
const robustGenerateDocx = `const base64Parser = (dataURL) => {
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

const generateDocx = (templateUrl, data, outputName) => {
  loadFile(templateUrl, async (error, content) => {
    if (error) {
      alert("Error memuat template. Pastikan file " + templateUrl + " ada di folder public.");
      return;
    }

    // Pre-resolve logo if exists
    if (data.logo) {
      try {
        if (data.logo.startsWith("data:")) {
          data.logo = base64Parser(data.logo);
        } else {
          const res = await fetch(data.logo);
          data.logo = await res.arrayBuffer();
        }
      } catch (e) {
        console.error("Gagal memuat logo:", e);
      }
    }

    const zip = new PizZip(content);
    
    const imageOptions = {
      centered: false,
      getImage: (tagValue) => {
        return tagValue; // tagValue sudah berupa buffer karena sudah di-resolve di atas
      },
      getSize: () => [80, 80]
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(imageOptions)]
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
};`;

// Ganti blok generateDocx yang lama
code = code.replace(/const base64Parser = [\s\S]+?saveAs\(out, outputName\);\s+?\}\);\s+?\};/, robustGenerateDocx);

fs.writeFileSync('src/App.jsx', code);
console.log('Fix applied');
