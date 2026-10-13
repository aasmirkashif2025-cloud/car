import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Wrench } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Maison Motors Self-Healing Boundary caught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleSelfHeal = () => {
    try {
      // Clear any corrupted local session data and reload fresh
      localStorage.removeItem('maison_admin_auth_v3');
      sessionStorage.clear();
      window.location.hash = '';
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090a] text-[#f4f2ec] flex items-center justify-center p-6 selection:bg-[#c5a880] selection:text-black">
          <div className="max-w-md w-full border border-white/10 bg-[#0e1014] p-8 sm:p-10 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Wrench className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] font-mono block">
                SYSTEM RECOVERY · MAISON MOTORS
              </span>
              <h2 className="font-editorial text-2xl font-bold uppercase tracking-tight text-white">
                RESTORING ATELIER SESSION
              </h2>
              <p className="text-xs text-[#9ea3ae] font-light leading-relaxed">
                A temporary display interruption occurred. The self-healing system is ready to safely restore your session immediately.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d6bc96] text-black font-semibold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RELOAD ATELIER</span>
              </button>

              <button
                onClick={this.handleSelfHeal}
                className="px-6 py-3 border border-white/20 hover:border-white/50 text-white font-medium text-xs tracking-[0.2em] uppercase transition-colors"
              >
                <span>SELF-HEAL & RESET</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
