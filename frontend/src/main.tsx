import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px 20px', textAlign: 'center', color: '#ffffff' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#ef4444' }}>⚠️ Terjadi Kendala Tampilan</h2>
          <p style={{ fontSize: '0.85rem', margin: '10px 0', color: 'var(--text-muted)' }}>
            {this.state.error?.message || 'Gagal memuat komponen.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--gold-gradient)',
              color: '#000',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Reset Penyimpanan & Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
