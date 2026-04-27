import { useState, useEffect } from "react";

// ============================================================
//  FILE: login.jsx
//  DESKRIPSI: Halaman Login Sistem Supervisi Guru
//
//  CARA UBAH PASSWORD & USERNAME:
//  Cari bagian [KONFIGURASI AKUN] di bawah ini
// ============================================================


// ============================================================
//  [KONFIGURASI AKUN]
//  Ubah username dan password di sini sesuai kebutuhan
// ============================================================
const AKUN_LOGIN = [
  {
    username: "admin",
    password: "supervisi2025",
    nama: "Administrator",
    role: "admin",        // admin = akses penuh
  },
  {
    username: "kepsek",
    password: "bhakti2025",
    nama: "Kepala Sekolah",
    role: "kepsek",       // kepsek = hanya lihat & rekap
  },
  {
    username: "waka",
    password: "kurikulum2025",
    nama: "Waka Kurikulum",
    role: "waka",         // waka = input & lihat
  },
];

// Durasi sesi login (dalam menit) — setelah waktu ini otomatis logout
const DURASI_SESI_MENIT = 480; // 8 jam

// Nama aplikasi & sekolah (tampil di halaman login)
const NAMA_SEKOLAH = "SMKS Bhakti Insani Bogor";
const NAMA_APLIKASI = "Supervisi Guru";
const TAHUN = "2025/2026";


// ============================================================
//  FUNGSI HELPER SESSION
// ============================================================

// Simpan sesi ke sessionStorage (hilang saat tab ditutup)
function simpanSesi(user) {
  const sesi = {
    username: user.username,
    nama: user.nama,
    role: user.role,
    loginAt: Date.now(),
    expiredAt: Date.now() + DURASI_SESI_MENIT * 60 * 1000,
  };
  sessionStorage.setItem("sesi_supervisi", JSON.stringify(sesi));
}

// Baca sesi dari sessionStorage
function bacaSesi() {
  try {
    const raw = sessionStorage.getItem("sesi_supervisi");
    if (!raw) return null;
    const sesi = JSON.parse(raw);
    // Cek apakah sesi masih valid (belum expired)
    if (Date.now() > sesi.expiredAt) {
      sessionStorage.removeItem("sesi_supervisi");
      return null;
    }
    return sesi;
  } catch {
    return null;
  }
}

// Hapus sesi (logout)
function hapusSesi() {
  sessionStorage.removeItem("sesi_supervisi");
}

// Format sisa waktu sesi
function formatSisaWaktu(expiredAt) {
  const selisih = expiredAt - Date.now();
  if (selisih <= 0) return "Habis";
  const menit = Math.floor(selisih / 60000);
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  return jam > 0 ? `${jam}j ${sisa}m` : `${menit}m`;
}


// ============================================================
//  KOMPONEN: Halaman Login
// ============================================================
function HalamanLogin({ onLoginBerhasil }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPass, setLihatPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [percobaan, setPercobaan] = useState(0); // hitung percobaan gagal
  const [terkunci, setTerkunci] = useState(false);
  const [sisaKunci, setSisaKunci] = useState(0);

  // Hitung mundur saat akun terkunci (3 percobaan = kunci 30 detik)
  useEffect(() => {
    if (!terkunci) return;
    const interval = setInterval(() => {
      setSisaKunci(prev => {
        if (prev <= 1) {
          setTerkunci(false);
          setPercobaan(0);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [terkunci]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (terkunci) return;
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulasi delay (supaya tidak terlalu instan)
    await new Promise(r => setTimeout(r, 600));

    // Cek kredensial
    const user = AKUN_LOGIN.find(
      a => a.username === username.trim() && a.password === password
    );

    if (user) {
      simpanSesi(user);
      onLoginBerhasil(user);
    } else {
      const percobaBaru = percobaan + 1;
      setPercobaan(percobaBaru);
      if (percobaBaru >= 3) {
        setTerkunci(true);
        setSisaKunci(30);
        setError("Terlalu banyak percobaan gagal. Tunggu 30 detik.");
      } else {
        setError(`Username atau password salah. (${percobaBaru}/3 percobaan)`);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2447 0%, #1e3a5f 50%, #1e40af 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Dekorasi lingkaran belakang */}
      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

      {/* Card Login */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}>

        {/* Header card */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
          padding: "32px 28px",
          textAlign: "center",
        }}>
          {/* Ikon */}
          <div style={{
            width: "64px", height: "64px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 16px",
          }}>
            📋
          </div>
          <div style={{ color: "#bfdbfe", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
            {NAMA_SEKOLAH}
          </div>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 800, marginBottom: "4px" }}>
            {NAMA_APLIKASI}
          </div>
          <div style={{ color: "#93c5fd", fontSize: "12px" }}>
            Tahun Pelajaran {TAHUN}
          </div>
        </div>

        {/* Form login */}
        <form onSubmit={handleLogin} style={{ padding: "28px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "20px" }}>
            Masuk ke Sistem
          </div>

          {/* Pesan error */}
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              borderRadius: "9px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "12.5px",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Pesan terkunci dengan countdown */}
          {terkunci && (
            <div style={{
              background: "#fff7ed",
              border: "1.5px solid #fed7aa",
              borderRadius: "9px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "12.5px",
              color: "#c2410c",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "16px" }}>🔒</span>
              <span>Akun dikunci. Coba lagi dalam <strong>{sisaKunci} detik</strong>.</span>
            </div>
          )}

          {/* Input Username */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "6px" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>
                👤
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                disabled={terkunci || loading}
                autoComplete="username"
                style={{
                  width: "100%",
                  padding: "11px 12px 11px 40px",
                  borderRadius: "9px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  background: terkunci ? "#f8fafc" : "#fff",
                  color: "#1e293b",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#cbd5e1"}
              />
            </div>
          </div>

          {/* Input Password */}
          <div style={{ marginBottom: "22px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>
                🔑
              </span>
              <input
                type={lihatPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                disabled={terkunci || loading}
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "11px 44px 11px 40px",
                  borderRadius: "9px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  background: terkunci ? "#f8fafc" : "#fff",
                  color: "#1e293b",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#cbd5e1"}
              />
              {/* Toggle lihat password */}
              <button
                type="button"
                onClick={() => setLihatPass(v => !v)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: "16px",
                  color: "#64748b", padding: 0,
                }}
                tabIndex={-1}
              >
                {lihatPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={terkunci || loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: terkunci
                ? "#94a3b8"
                : loading
                  ? "#3b82f6"
                  : "linear-gradient(135deg, #1e3a5f, #2563eb)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: terkunci || loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Memverifikasi...
              </>
            ) : terkunci ? (
              <>🔒 Akun Dikunci ({sisaKunci}s)</>
            ) : (
              <>🔐 Masuk</>
            )}
          </button>
        </form>

        {/* Footer card */}
        <div style={{
          padding: "14px 28px 20px",
          borderTop: "1px solid #f1f5f9",
          textAlign: "center",
          fontSize: "11px",
          color: "#94a3b8",
        }}>
          Sistem ini hanya untuk pengguna yang berwenang.<br />
          Hubungi administrator jika lupa password.
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


// ============================================================
//  KOMPONEN: Info Pengguna (muncul di sudut kanan atas saat login)
// ============================================================
function InfoPengguna({ sesi, onLogout }) {
  const [buka, setBuka] = useState(false);
  const [sisaWaktu, setSisaWaktu] = useState(formatSisaWaktu(sesi.expiredAt));

  // Update sisa waktu setiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      const sisa = formatSisaWaktu(sesi.expiredAt);
      setSisaWaktu(sisa);
      // Auto logout jika sesi habis
      if (Date.now() > sesi.expiredAt) {
        hapusSesi();
        onLogout();
      }
    }, 30000); // cek tiap 30 detik
    return () => clearInterval(interval);
  }, [sesi, onLogout]);

  const badgeRole = {
    admin: { label: "Admin", bg: "#dbeafe", text: "#1e3a8a" },
    kepsek: { label: "Kepala Sekolah", bg: "#d1fae5", text: "#065f46" },
    waka: { label: "Waka Kurikulum", bg: "#fef3c7", text: "#78350f" },
  }[sesi.role] || { label: sesi.role, bg: "#f1f5f9", text: "#475569" };

  return (
    <div style={{ position: "relative" }}>
      {/* Tombol trigger */}
      <button
        onClick={() => setBuka(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "9px",
          padding: "7px 12px",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: "18px" }}>👤</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, lineHeight: 1.2 }}>{sesi.nama}</div>
          <div style={{ fontSize: "10px", color: "#bfdbfe", lineHeight: 1.2 }}>{badgeRole.label}</div>
        </div>
        <span style={{ fontSize: "10px", color: "#bfdbfe", marginLeft: "2px" }}>{buka ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {buka && (
        <>
          {/* Overlay transparan untuk close saat klik luar */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 98 }}
            onClick={() => setBuka(false)}
          />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            minWidth: "220px",
            zIndex: 99,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}>
            {/* Info akun */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>
                {sesi.nama}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
                @{sesi.username}
              </div>
              <span style={{ background: badgeRole.bg, color: badgeRole.text, fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>
                {badgeRole.label}
              </span>
            </div>

            {/* Info sesi */}
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "3px" }}>Waktu sesi tersisa</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a5f" }}>⏱ {sisaWaktu}</div>
              <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
                Login: {new Date(sesi.loginAt).toLocaleTimeString("id-ID")}
              </div>
            </div>

            {/* Tombol Logout */}
            <button
              onClick={() => { hapusSesi(); onLogout(); }}
              style={{
                width: "100%", padding: "12px 16px",
                background: "#fff", border: "none",
                textAlign: "left", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, color: "#dc2626",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              🚪 Keluar dari Sistem
            </button>
          </div>
        </>
      )}
    </div>
  );
}


// ============================================================
//  KOMPONEN UTAMA: App dengan Login Guard
//  Cara pakai: import AppDenganLogin dari file ini,
//              lalu render <AppDenganLogin AppUtama={AppKomponen} />
// ============================================================
export default function AppDenganLogin({ AppUtama }) {
  const [sesi, setSesi] = useState(null);
  const [dicek, setDicek] = useState(false); // mencegah flicker saat load

  // Cek sesi saat pertama kali load
  useEffect(() => {
    const sesiAda = bacaSesi();
    if (sesiAda) setSesi(sesiAda);
    setDicek(true);
  }, []);

  const handleLoginBerhasil = (user) => {
    const sesiData = bacaSesi();
    setSesi(sesiData || {
      username: user.username,
      nama: user.nama,
      role: user.role,
      loginAt: Date.now(),
      expiredAt: Date.now() + DURASI_SESI_MENIT * 60 * 1000,
    });
  };

  const handleLogout = () => {
    setSesi(null);
  };

  // Jangan render apapun sebelum sesi dicek (mencegah flicker)
  if (!dicek) return null;

  // Belum login → tampilkan halaman login
  if (!sesi) {
    return <HalamanLogin onLoginBerhasil={handleLoginBerhasil} />;
  }

  // Sudah login → tampilkan app utama + info pengguna di sudut
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Info pengguna di kanan atas, menumpuk di atas header app */}
      <div style={{
        position: "fixed",
        top: "10px",
        right: "14px",
        zIndex: 100,
      }}>
        <InfoPengguna sesi={sesi} onLogout={handleLogout} />
      </div>

      {/* App utama */}
      <AppUtama sesi={sesi} />
    </div>
  );
}


// ============================================================
//  EKSPOR TAMBAHAN (jika perlu dipakai di file lain)
// ============================================================
export { bacaSesi, hapusSesi, simpanSesi, AKUN_LOGIN };
