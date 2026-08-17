import React, { useState } from 'react';
import { Bookmark, LogIn, LogOut, Moon, Settings, Sun, Trash2, UserPlus } from 'lucide-react';
import { apiService } from '../services/api';

interface ProfileTabProps {
  token: string | null;
  user: any;
  onLoginSuccess: (token: string, user: any) => void;
  onLogout: () => void;
  bookmarks: any[];
  onDeleteBookmark: (id: string) => void;
  onOpenSurah: (surahNum: number) => void;
  arabicFontSize: number;
  onFontSizeChange: (size: number) => void;
  theme: string;
  onToggleTheme: () => void;
  readingProgress: any;
  onUpdateDailyTarget: (dailyTarget: number) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  token,
  user,
  onLoginSuccess,
  onLogout,
  bookmarks,
  onDeleteBookmark,
  onOpenSurah,
  arabicFontSize,
  onFontSizeChange,
  theme,
  onToggleTheme,
  readingProgress,
  onUpdateDailyTarget,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const stats = readingProgress?.khatamStats || {
    totalQuranVerses: 6236,
    totalQuranSurahs: 114,
    percentageCompleted: 0,
    remainingTotalVerses: 6236,
    remainingVersesInCurrentSurah: 6,
    remainingSurahsToKhatam: 113,
    dailyVerseTarget: 30,
    estimatedDaysToKhatam: 208,
    estimatedMonthsToKhatam: 6.9,
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoadingAuth(true);

    try {
      if (authMode === 'register') {
        const res = await apiService.register({ email, password, name });
        onLoginSuccess(res.token, res.user);
      } else {
        const res = await apiService.login({ email, password });
        onLoginSuccess(res.token, res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses autentikasi');
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Profil & Target Khatam 👤</h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Atur target harian, posisi membaca, dan preferensi akun
        </div>
      </div>

      {/* User Login/Register Card */}
      {!token ? (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: authMode === 'login' ? 'var(--primary-emerald)' : 'var(--bg-input)',
                color: authMode === 'login' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <LogIn size={16} /> Masuk
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: authMode === 'register' ? 'var(--primary-emerald)' : 'var(--bg-input)',
                color: authMode === 'register' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <UserPlus size={16} /> Daftar
            </button>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '14px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {authMode === 'register' && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-card"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-card"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              style={{
                marginTop: '8px',
                padding: '12px',
                border: 'none',
                borderRadius: '12px',
                background: 'var(--gold-gradient)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              }}
            >
              {loadingAuth ? 'Memproses...' : authMode === 'register' ? 'Daftar Sekarang' : 'Masuk ke Akun'}
            </button>
          </form>
        </div>
      ) : (
        /* Logged In User Card */
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: 'var(--primary-emerald)', color: 'var(--gold-accent)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, border: '2px solid var(--gold-accent)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{user?.name || 'Sahabat Muslim'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              <div className="gold-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                Akun Terautentikasi JWT
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '8px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      )}

      {/* Target Khatam & Detailed Stats Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--gold-accent)' }}>
          📊 Target Membaca & Estimasi Khatam
        </h3>

        {/* Daily Target Selector Presets */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Pilih Target Kemampuan Membaca Anda (Ayat Per Hari):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[10, 30, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => onUpdateDailyTarget(preset)}
                style={{
                  padding: '8px',
                  borderRadius: '12px',
                  border: stats.dailyVerseTarget === preset ? '1px solid var(--gold-accent)' : '1px solid var(--border-color)',
                  backgroundColor: stats.dailyVerseTarget === preset ? 'rgba(212, 175, 55, 0.2)' : 'var(--bg-input)',
                  color: stats.dailyVerseTarget === preset ? 'var(--gold-accent)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {preset} Ayat
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Duration Banner */}
        <div
          style={{
            backgroundColor: 'rgba(15, 81, 50, 0.3)',
            border: '1px dashed var(--gold-accent)',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Estimasi Waktu Sampai Khatam:
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>
            ~{stats.estimatedDaysToKhatam} Hari <span style={{ fontSize: '0.9rem', color: 'var(--gold-accent)' }}>({stats.estimatedMonthsToKhatam} Bulan)</span>
          </div>
        </div>

        {/* Detailed 4-Grid Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📌 Posisi Terakhir</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px', color: 'var(--gold-accent)' }}>
              {readingProgress?.lastSurahNameLatin || 'Al-Fatihah'}: {readingProgress?.lastVerseNumber || 1}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📖 Sisa Ayat Surah Ini</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)' }}>
              {stats.remainingVersesInCurrentSurah} Ayat lagi
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📚 Sisa Surah ke Khatam</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)' }}>
              {stats.remainingSurahsToKhatam} Surah lagi
            </div>
          </div>

          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🔢 Sisa Total Ayat</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-main)' }}>
              {stats.remainingTotalVerses?.toLocaleString('id-ID')} Ayat
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks Section */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Bookmark size={18} color="var(--gold-accent)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Bookmark Saya ({bookmarks.length})
          </h3>
        </div>

        {bookmarks.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
            Belum ada ayat yang ditandai. Tekan ikon bookmark saat membaca Al-Qur'an!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookmarks.map((bm) => (
              <div key={bm.id} className="glass-card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => onOpenSurah(bm.surahNumber)} style={{ cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {bm.surahNameLatin} : Ayat {bm.verseNumber}
                  </div>
                  {bm.note && <div style={{ fontSize: '0.72rem', color: 'var(--gold-accent)', marginTop: '2px' }}>"{bm.note}"</div>}
                </div>

                <button
                  onClick={() => onDeleteBookmark(bm.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                  title="Hapus Bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Appearance Settings */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Settings size={18} color="var(--gold-accent)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Pengaturan Tampilan</h3>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ukuran Font Teks Arab</span>
            <span style={{ fontWeight: 700, color: 'var(--gold-accent)' }}>{arabicFontSize}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="44"
            value={arabicFontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--gold-accent)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tema Tampilan</span>
          <button
            onClick={onToggleTheme}
            className="glass-card"
            style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
          </button>
        </div>
      </div>
    </div>
  );
};
