import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, CheckCircle2, Pause, Search, Volume2 } from 'lucide-react';
import { apiService } from '../services/api';

interface QuranTabProps {
  token: string | null;
  selectedSurahNum: number | null;
  onSelectSurah: (num: number | null) => void;
  bookmarks: any[];
  onToggleBookmark: (surahNum: number, verseNum: number, surahName: string) => void;
  arabicFontSize: number;
  lastReadProgress: any;
  onMarkLastRead: (surahNum: number, verseNum: number, surahName: string, totalSurahVerses: number) => void;
}

export const QuranTab: React.FC<QuranTabProps> = ({
  token,
  selectedSurahNum,
  onSelectSurah,
  bookmarks,
  onToggleBookmark,
  arabicFontSize,
  lastReadProgress,
  onMarkLastRead,
}) => {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSurahDetail, setCurrentSurahDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Fetch list of surahs
  useEffect(() => {
    async function loadSurahs() {
      try {
        setLoading(true);
        const data = await apiService.getAllSurahs();
        setSurahs(data);
      } catch (err) {
        console.error('Failed to load surahs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  // Fetch selected surah detail when selectedSurahNum changes
  useEffect(() => {
    if (!selectedSurahNum) {
      setCurrentSurahDetail(null);
      return;
    }

    async function loadDetail() {
      try {
        setLoadingDetail(true);
        const data = await apiService.getSurahDetail(selectedSurahNum!);
        setCurrentSurahDetail(data);
      } catch (err) {
        console.error('Failed to load surah detail:', err);
      } finally {
        setLoadingDetail(false);
      }
    }
    loadDetail();
  }, [selectedSurahNum]);

  // Audio player for verses
  const playVerseAudio = (verseNum: number, audioUrl?: string) => {
    if (audioObj) {
      audioObj.pause();
    }

    if (playingVerse === verseNum) {
      setPlayingVerse(null);
      return;
    }

    if (!audioUrl) return;

    const newAudio = new Audio(audioUrl);
    newAudio.play();
    setPlayingVerse(verseNum);
    newAudio.onended = () => setPlayingVerse(null);
    setAudioObj(newAudio);
  };

  const filteredSurahs = surahs.filter(
    (s) =>
      s.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString().includes(searchQuery) ||
      s.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if verse is bookmarked
  const isBookmarked = (surahNum: number, verseNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNum && b.verseNumber === verseNum);
  };

  // Check if verse is the current last read
  const isLastReadVerse = (surahNum: number, verseNum: number) => {
    return lastReadProgress?.lastSurahNumber === surahNum && lastReadProgress?.lastVerseNumber === verseNum;
  };

  // Reader View Mode
  if (selectedSurahNum && currentSurahDetail) {
    return (
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Sticky Reader Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'var(--bg-app)',
            padding: '8px 0',
          }}
        >
          <button
            onClick={() => onSelectSurah(null)}
            className="glass-card"
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kembali</span>
          </button>

          <div style={{ flex: 1, textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentSurahDetail.nameLatin}</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-accent)' }}>
              {currentSurahDetail.nameArabic} • {currentSurahDetail.numberOfVerses} Ayat
            </div>
          </div>
        </div>

        {/* Bismillah Banner */}
        {selectedSurahNum !== 9 && selectedSurahNum !== 1 && (
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <div className="font-arabic" style={{ fontSize: '1.8rem', color: 'var(--gold-accent)' }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>
        )}

        {/* Verses List */}
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Memuat ayat-ayat Al-Qur'an...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentSurahDetail.verses?.map((verse: any) => {
              const bookmarked = isBookmarked(selectedSurahNum, verse.verseNumber);
              const isLastRead = isLastReadVerse(selectedSurahNum, verse.verseNumber);

              return (
                <div
                  key={verse.verseNumber}
                  className="glass-panel"
                  style={{
                    padding: '18px',
                    border: isLastRead ? '2px solid var(--gold-accent)' : '1px solid var(--border-color)',
                    backgroundColor: isLastRead ? 'rgba(212, 175, 55, 0.08)' : 'var(--bg-card)',
                  }}
                >
                  {/* Verse Header Info & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          color: 'var(--gold-accent)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        {verse.verseNumber}
                      </div>

                      {isLastRead && (
                        <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
                          📌 Posisi Terakhir Dibaca
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* Mark Last Read Button */}
                      <button
                        onClick={() =>
                          onMarkLastRead(
                            selectedSurahNum,
                            verse.verseNumber,
                            currentSurahDetail.nameLatin,
                            currentSurahDetail.numberOfVerses
                          )
                        }
                        style={{
                          background: isLastRead ? 'rgba(212, 175, 55, 0.25)' : 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          color: isLastRead ? 'var(--gold-accent)' : 'var(--text-muted)',
                          padding: '5px 10px',
                          borderRadius: '14px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                        }}
                        title="Tandai sebagai ayat terakhir dibaca"
                      >
                        <CheckCircle2 size={14} color={isLastRead ? 'var(--gold-accent)' : 'var(--text-muted)'} />
                        <span>{isLastRead ? 'Terakhir Dibaca' : 'Tandai Terakhir'}</span>
                      </button>

                      {/* Play Audio Button */}
                      <button
                        onClick={() => playVerseAudio(verse.verseNumber, verse.audioUrl)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: playingVerse === verse.verseNumber ? 'var(--gold-accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                        title="Putar Murottal"
                      >
                        {playingVerse === verse.verseNumber ? <Pause size={18} /> : <Volume2 size={18} />}
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => onToggleBookmark(selectedSurahNum, verse.verseNumber, currentSurahDetail.nameLatin)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: bookmarked ? 'var(--gold-accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                        title="Tandai Bookmark"
                      >
                        <Bookmark size={18} fill={bookmarked ? 'var(--gold-accent)' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div
                    className="font-arabic"
                    style={{
                      fontSize: `${arabicFontSize}px`,
                      marginBottom: '14px',
                      color: 'var(--text-main)',
                    }}
                  >
                    {verse.textArabic}
                  </div>

                  {/* Latin Transliteration */}
                  <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--gold-accent)', marginBottom: '8px' }}>
                    {verse.textLatin}
                  </div>

                  {/* Indonesian Translation */}
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                    {verse.translation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Surah List View Mode
  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Al-Qur'an Al-Karim 📖</h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Daftar 114 Surah Utsmani Kemenag RI
        </div>
      </div>

      {/* Search Input */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          backgroundColor: 'var(--bg-input)',
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Cari nama surah atau nomor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            width: '100%',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {/* Surah List Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Memuat daftar Surah...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="glass-card"
              onClick={() => onSelectSurah(surah.number)}
              style={{
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    color: 'var(--gold-accent)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {surah.number}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{surah.nameLatin}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {surah.translation} • {surah.numberOfVerses} Ayat
                  </div>
                </div>
              </div>

              <div className="font-arabic" style={{ fontSize: '1.3rem', color: 'var(--gold-accent)' }}>
                {surah.nameArabic}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
