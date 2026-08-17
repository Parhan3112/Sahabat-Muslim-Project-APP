import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Moon, Pause, RotateCcw, Sun, Volume2 } from 'lucide-react';
import { apiService } from '../services/api';

export const DzikirTab: React.FC = () => {
  const [category, setCategory] = useState<'pagi' | 'petang' | 'doa-harian'>('pagi');
  const [items, setItems] = useState<any[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Load dzikir list when category changes
  useEffect(() => {
    async function loadDzikir() {
      try {
        setLoading(true);
        const data = await apiService.getDzikirList(category);
        setItems(data);

        // Load saved counts from localStorage
        const savedKey = `sm_dzikir_counts_${category}`;
        const saved = localStorage.getItem(savedKey);
        if (saved) {
          try {
            setCounts(JSON.parse(saved));
          } catch (_e) {
            setCounts({});
          }
        } else {
          setCounts({});
        }
      } catch (err) {
        console.error('Failed to load dzikir list:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDzikir();
  }, [category]);

  const handleIncrementCount = (id: string, targetCount: number) => {
    const current = counts[id] || 0;
    if (current >= targetCount) return;

    const newCounts = { ...counts, [id]: current + 1 };
    setCounts(newCounts);
    localStorage.setItem(`sm_dzikir_counts_${category}`, JSON.stringify(newCounts));
  };

  const handleResetCounts = () => {
    setCounts({});
    localStorage.removeItem(`sm_dzikir_counts_${category}`);
  };

  const toggleAudio = (id: string, audioUrl?: string) => {
    if (audioObj) {
      audioObj.pause();
    }

    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play();
    setPlayingId(id);
    audio.onended = () => setPlayingId(null);
    setAudioObj(audio);
  };

  // Count completed dzikir
  const completedCount = items.filter((item) => (counts[item.id] || 0) >= item.targetCount).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Dzikir & Doa 🤲</h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Amalan Dzikir Pagi Petang (Al-Matsurat) & Doa Harian Sahih
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          padding: '4px',
          backgroundColor: 'var(--bg-input)',
        }}
      >
        <button
          onClick={() => setCategory('pagi')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: category === 'pagi' ? 'var(--primary-emerald)' : 'transparent',
            color: category === 'pagi' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Sun size={14} color={category === 'pagi' ? 'var(--gold-accent)' : 'var(--text-muted)'} />
          Dzikir Pagi
        </button>

        <button
          onClick={() => setCategory('petang')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: category === 'petang' ? 'var(--primary-emerald)' : 'transparent',
            color: category === 'petang' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Moon size={14} color={category === 'petang' ? 'var(--gold-accent)' : 'var(--text-muted)'} />
          Dzikir Petang
        </button>

        <button
          onClick={() => setCategory('doa-harian')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: category === 'doa-harian' ? 'var(--primary-emerald)' : 'transparent',
            color: category === 'doa-harian' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Doa Harian
        </button>
      </div>

      {/* Progress & Reset Header */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, paddingRight: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: 'var(--gold-accent)' }}>Progress Dzikir: {completedCount} / {items.length} Selesai</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--gold-accent)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <button
          onClick={handleResetCounts}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="Reset Hitungan Tasbih"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Dzikir List Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Memuat amalan dzikir...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => {
            const currentCount = counts[item.id] || 0;
            const isCompleted = currentCount >= item.targetCount;

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '18px',
                  border: isCompleted ? '2px solid #22c55e' : '1px solid var(--border-color)',
                  backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.06)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header & Source Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: isCompleted ? '#22c55e' : 'var(--gold-accent)' }}>
                    {item.title}
                  </h3>

                  {item.audioUrl && (
                    <button
                      onClick={() => toggleAudio(item.id, item.audioUrl)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: playingId === item.id ? 'var(--gold-accent)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {playingId === item.id ? <Pause size={18} /> : <Volume2 size={18} />}
                    </button>
                  )}
                </div>

                {/* Arabic Text */}
                <div
                  className="font-arabic"
                  style={{
                    fontSize: '1.4rem',
                    lineHeight: '2.2',
                    textAlign: 'right',
                    marginBottom: '12px',
                    color: 'var(--text-main)',
                  }}
                >
                  {item.textArabic}
                </div>

                {/* Latin Transliteration */}
                <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--gold-accent)', marginBottom: '8px' }}>
                  "{item.textLatin}"
                </div>

                {/* Indonesian Translation */}
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '14px' }}>
                  "{item.translation}"
                </div>

                {/* Benefit Note */}
                {item.benefit && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-input)', padding: '8px 12px', borderRadius: '10px', marginBottom: '14px' }}>
                    💡 <b>Faedah:</b> {item.benefit}
                  </div>
                )}

                {/* Footer Info & Digital Tasbih Counter Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.source}
                  </span>

                  {/* Digital Tasbih Counter Button */}
                  <button
                    onClick={() => handleIncrementCount(item.id, item.targetCount)}
                    disabled={isCompleted}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: isCompleted ? '#22c55e' : 'var(--gold-gradient)',
                      color: isCompleted ? '#ffffff' : '#000000',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: isCompleted ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isCompleted ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Selesai ({item.targetCount}x)</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Tasbih: {currentCount} / {item.targetCount}x</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
