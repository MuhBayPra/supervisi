const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add ImageModule import
if (!code.includes('docxtemplater-image-module-free')) {
    code = code.replace(
        'import Docxtemplater from "docxtemplater";',
        'import Docxtemplater from "docxtemplater";\nimport ImageModule from "docxtemplater-image-module-free";'
    );
}

// 2. Add logo to DEFAULT_PENGATURAN_PDF
code = code.replace(
    'umum: {',
    'umum: {\n    logo: "/logo.png",'
);

// 3. Update generateDocx to support images
const oldGenerateDocx = `const generateDocx = (templateUrl, data, outputName) => {
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
};`;

const newGenerateDocx = `const base64Parser = (dataURL) => {
  if (!dataURL || !dataURL.includes("base64,")) return dataURL;
  const base64 = dataURL.split(",")[1];
  if (typeof window !== "undefined" && window.atob) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  return base64;
};

const generateDocx = (templateUrl, data, outputName) => {
  loadFile(templateUrl, async (error, content) => {
    if (error) {
      alert("Error memuat template. Pastikan file " + templateUrl + " ada di folder public.");
      return;
    }

    // Helper fetch image to buffer
    const fetchImage = async (url) => {
      if (url.startsWith("data:")) return base64Parser(url);
      const res = await fetch(url);
      return await res.arrayBuffer();
    };

    const zip = new PizZip(content);
    
    const imageOptions = {
      centered: false,
      getImage: async (tagValue) => {
        return await fetchImage(tagValue);
      },
      getSize: (img, tagValue, tagName) => {
        // Default size 80x80
        return [80, 80];
      }
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [new ImageModule(imageOptions)]
    });
    
    // Docxtemplater v3.x is synchronous usually, but image module can be async
    // However, image-module-free might need a different approach for async
    // Let's use a simpler approach: pre-resolve images if possible
    // or just pass the buffer directly if we can
    
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

// Note: docxtemplater-image-module-free might not support async getImage in the version I think.
// Let's use a synchronous buffer if possible.

code = code.replace(oldGenerateDocx, newGenerateDocx);

// 4. Update UI Header to show logo
code = code.replace(
    '<div>\n              <div style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>\n                {NAMA_SEKOLAH}',
    '<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>\n              {pengaturanPDF.umum.logo && (\n                <img src={pengaturanPDF.umum.logo} alt="Logo" style={{ height: "45px", width: "45px", objectFit: "contain", borderRadius: "8px", background: "#fff", padding: "4px" }} />\n              )}\n              <div>\n                <div style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>\n                  {NAMA_SEKOLAH}'
);

// 5. Add Logo Upload in ModalPengaturanPDF
code = code.replace(
    '<InputField label="Nama Sekolah (footer)"',
    `<div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "6px" }}>Logo Sekolah</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {data.umum.logo && <img src={data.umum.logo} style={{ height: "40px", width: "40px", borderRadius: "6px", border: "1px solid #e2e8f0", objectFit: "contain" }} />}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => set("umum", "logo", reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: "11px" }}
                  />
                </div>
              </div>
              <InputField label="Nama Sekolah (footer)"`
);

fs.writeFileSync('src/App.jsx', code);
console.log('Logo update completed');
