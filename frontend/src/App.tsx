import React, { useEffect, useState } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { HomeTab } from './components/HomeTab';
import { QuranTab } from './components/QuranTab';
import { PrayerTab } from './components/PrayerTab';
import { DzikirTab } from './components/DzikirTab';
import { QiblaTab } from './components/QiblaTab';
import { ProfileTab } from './components/ProfileTab';
import { MosqueModal } from './components/MosqueModal';
import { apiService } from './services/api';
import { getSavedLocation, LocationInfo } from './services/locationService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedSurahNum, setSelectedSurahNum] = useState<number | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light' | 'green'>('dark');
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [isMosqueModalOpen, setIsMosqueModalOpen] = useState<boolean>(false);

  // Active Location State (with Safe Initializer)
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    try {
      return getSavedLocation();
    } catch (_e) {
      return { name: 'DKI Jakarta & Sekitarnya', lat: -6.2088, lng: 106.8456 };
    }
  });

  // Auth State (with Safe Initializer)
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sm_token');
    } catch (_e) {
      return null;
    }
  });

  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('sm_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_e) {
      return null;
    }
  });

  // Bookmarks State (with Safe Initializer)
  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('sm_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (_e) {
      return [];
    }
  });

  // Reading Progress State (with Safe Initializer)
  const [readingProgress, setReadingProgress] = useState<any>(() => {
    const defaultProgress = {
      lastSurahNumber: 1,
      lastVerseNumber: 1,
      lastSurahNameLatin: 'Al-Fatihah',
      currentSurahTotalVerses: 7,
      dailyVerseTarget: 30,
      khatamStats: {
        totalQuranVerses: 6236,
        totalQuranSurahs: 114,
        percentageCompleted: 0,
        remainingTotalVerses: 6236,
        remainingVersesInCurrentSurah: 6,
        remainingSurahsToKhatam: 113,
        dailyVerseTarget: 30,
        estimatedDaysToKhatam: 208,
        estimatedMonthsToKhatam: 6.9,
      },
    };

    try {
      const saved = localStorage.getItem('sm_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProgress,
          ...parsed,
          khatamStats: {
            ...defaultProgress.khatamStats,
            ...(parsed?.khatamStats || {}),
          },
        };
      }
    } catch (_e) {
      // ignore
    }
    return defaultProgress;
  });

  // Sync Theme to HTML data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load Bookmarks & Reading Progress from API when token is present
  useEffect(() => {
    if (token) {
      async function loadUserData() {
        try {
          const list = await apiService.getBookmarks(token!);
          setBookmarks(list);
          localStorage.setItem('sm_bookmarks', JSON.stringify(list));

          const progress = await apiService.getReadingProgress(token!);
          setReadingProgress(progress);
          localStorage.setItem('sm_progress', JSON.stringify(progress));
        } catch (_err) {
          // ignore
        }
      }
      loadUserData();
    }
  }, [token]);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sm_token', newToken);
    localStorage.setItem('sm_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setBookmarks([]);
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_bookmarks');
    localStorage.removeItem('sm_progress');
  };

  const handleMarkLastRead = async (
    surahNum: number,
    verseNum: number,
    surahName: string,
    totalSurahVerses: number
  ) => {
    const dailyTarget = readingProgress?.dailyVerseTarget || 30;
    const remainingTotalVerses = Math.max(0, 6236 - (readingProgress?.totalVersesRead || 0));
    const estimatedDaysToKhatam = Math.ceil((remainingTotalVerses || 6236) / dailyTarget);

    const updated = {
      ...readingProgress,
      lastSurahNumber: surahNum,
      lastVerseNumber: verseNum,
      lastSurahNameLatin: surahName,
      currentSurahTotalVerses: totalSurahVerses,
      khatamStats: {
        ...readingProgress?.khatamStats,
        remainingVersesInCurrentSurah: Math.max(0, totalSurahVerses - verseNum),
        remainingSurahsToKhatam: Math.max(0, 114 - surahNum),
        estimatedDaysToKhatam,
        estimatedMonthsToKhatam: Math.round((estimatedDaysToKhatam / 30) * 10) / 10,
      },
    };

    setReadingProgress(updated);
    localStorage.setItem('sm_progress', JSON.stringify(updated));

    if (token) {
      try {
        const apiUpdated = await apiService.updateReadingProgress(token, {
          lastSurahNumber: surahNum,
          lastVerseNumber: verseNum,
          lastSurahNameLatin: surahName,
          currentSurahTotalVerses: totalSurahVerses,
          dailyVerseTarget: dailyTarget,
        });
        setReadingProgress(apiUpdated);
        localStorage.setItem('sm_progress', JSON.stringify(apiUpdated));
      } catch (_err) {
        // ignore
      }
    }
  };

  const handleUpdateDailyTarget = async (dailyTarget: number) => {
    const remainingTotalVerses = Math.max(0, 6236 - (readingProgress?.totalVersesRead || 0));
    const estimatedDaysToKhatam = Math.ceil((remainingTotalVerses || 6236) / dailyTarget);

    const updated = {
      ...readingProgress,
      dailyVerseTarget: dailyTarget,
      khatamStats: {
        ...readingProgress?.khatamStats,
        dailyVerseTarget: dailyTarget,
        estimatedDaysToKhatam,
        estimatedMonthsToKhatam: Math.round((estimatedDaysToKhatam / 30) * 10) / 10,
      },
    };

    setReadingProgress(updated);
    localStorage.setItem('sm_progress', JSON.stringify(updated));

    if (token) {
      try {
        const apiUpdated = await apiService.updateReadingProgress(token, {
          lastSurahNumber: readingProgress?.lastSurahNumber || 1,
          lastVerseNumber: readingProgress?.lastVerseNumber || 1,
          lastSurahNameLatin: readingProgress?.lastSurahNameLatin || 'Al-Fatihah',
          dailyVerseTarget: dailyTarget,
        });
        setReadingProgress(apiUpdated);
        localStorage.setItem('sm_progress', JSON.stringify(apiUpdated));
      } catch (_err) {
        // ignore
      }
    }
  };

  const handleToggleBookmark = async (surahNum: number, verseNum: number, surahName: string) => {
    const existingIndex = bookmarks.findIndex(
      (b) => b.surahNumber === surahNum && b.verseNumber === verseNum
    );

    if (existingIndex !== -1) {
      // Remove
      const itemToDelete = bookmarks[existingIndex];
      const updated = bookmarks.filter((_, idx) => idx !== existingIndex);
      setBookmarks(updated);
      localStorage.setItem('sm_bookmarks', JSON.stringify(updated));

      if (token && itemToDelete.id) {
        try {
          await apiService.deleteBookmark(token, itemToDelete.id);
        } catch (_err) {
          // ignore
        }
      }
    } else {
      // Add
      const newBm = {
        id: `bm-temp-${Date.now()}`,
        surahNumber: surahNum,
        verseNumber: verseNum,
        surahNameLatin: surahName,
        createdAt: new Date().toISOString(),
      };
      const updated = [newBm, ...bookmarks];
      setBookmarks(updated);
      localStorage.setItem('sm_bookmarks', JSON.stringify(updated));

      if (token) {
        try {
          const savedApiBm = await apiService.createBookmark(token, {
            surahNumber: surahNum,
            verseNumber: verseNum,
            surahNameLatin: surahName,
          });
          setBookmarks((prev) => prev.map((b) => (b.id === newBm.id ? savedApiBm : b)));
        } catch (_err) {
          // ignore
        }
      }
    }
  };

  const handleDeleteBookmarkById = async (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('sm_bookmarks', JSON.stringify(updated));

    if (token) {
      try {
        await apiService.deleteBookmark(token, id);
      } catch (_err) {
        // ignore
      }
    }
  };

  const handleOpenSurah = (surahNum: number) => {
    setSelectedSurahNum(surahNum);
    setActiveTab('quran');
  };

  const handleToggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('green');
    else setTheme('dark');
  };

  return (
    <div className="app-wrapper">
      {/* Content Body based on Active Tab */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && (
          <HomeTab
            onNavigate={(tab) => {
              if (tab === 'quran') setSelectedSurahNum(null);
              setActiveTab(tab);
            }}
            onOpenSurah={handleOpenSurah}
            onOpenMosquesModal={() => setIsMosqueModalOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
          />
        )}

        {activeTab === 'quran' && (
          <QuranTab
            token={token}
            selectedSurahNum={selectedSurahNum}
            onSelectSurah={setSelectedSurahNum}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            arabicFontSize={arabicFontSize}
            lastReadProgress={readingProgress}
            onMarkLastRead={handleMarkLastRead}
          />
        )}

        {activeTab === 'prayer' && <PrayerTab currentLocation={currentLocation} />}

        {activeTab === 'dzikir' && <DzikirTab />}

        {activeTab === 'qibla' && <QiblaTab currentLocation={currentLocation} />}

        {activeTab === 'profile' && (
          <ProfileTab
            token={token}
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            bookmarks={bookmarks}
            onDeleteBookmark={handleDeleteBookmarkById}
            onOpenSurah={(num) => handleOpenSurah(num)}
            arabicFontSize={arabicFontSize}
            onFontSizeChange={setArabicFontSize}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            readingProgress={readingProgress}
            onUpdateDailyTarget={handleUpdateDailyTarget}
          />
        )}
      </div>

      {/* Mosque Finder Modal */}
      <MosqueModal
        isOpen={isMosqueModalOpen}
        onClose={() => setIsMosqueModalOpen(false)}
        currentLocation={currentLocation}
      />

      {/* Persistent Bottom Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />
    </div>
  );
};

export default App;
