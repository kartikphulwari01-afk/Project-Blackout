'use client';

import { useState, useEffect } from 'react';
import { Shield, Check, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BlackoutWidget({ enabled }: { enabled: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;
    
    // Prevent showing on admin pages or if already run this session
    if (pathname.startsWith('/admin')) return;
    if (sessionStorage.getItem('blackout_simulation_run') === 'true') return;

    // Wait 3-4 seconds before showing overlay
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Prevent body scrolling when overlay is active
      document.body.style.overflow = 'hidden';
    }, 3500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [enabled, pathname]);

  const handleVerify = async () => {
    if (isChecked || isVerifying || isVerified) return;
    
    setIsChecked(true);
    setIsVerifying(true);
    setError('');

    // Simulate verification delay (800-1500ms)
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsVerifying(false);
    setIsVerified(true);
    
    // Mark as run for this session
    sessionStorage.setItem('blackout_simulation_run', 'true');

    try {
      // Log the event
      const logRes = await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SIMULATED_SECURITY_VERIFICATION_DOWNLOAD',
          severity: 'HIGH',
          source: pathname,
          metadata: {
            simulation: 'PROJECT_BLACKOUT',
            artifact: 'MOSAIC_Product_Catalog_2026.pdf',
            status: 'SIMULATED',
            mimeType: 'application/pdf'
          }
        })
      });

      if (!logRes.ok) {
        throw new Error('Failed to log event');
      }

      // Hide widget after a short delay with a fade-out state
      setTimeout(() => {
        setIsClosing(true);
        // Trigger download
        const link = document.createElement('a');
        link.href = '/api/security/simulation/download';
        link.download = 'MOSAIC_Product_Catalog_2026.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Remove from DOM after fade out completes
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = 'unset';
        }, 500);
      }, 300);

    } catch (err) {
      console.error(err);
      setError('Simulation artifact unavailable. Please try again.');
      setIsVerified(false);
      setIsChecked(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'animate-in fade-in opacity-100'}`}>
      {/* Invisible trap to catch clicks and prevent interaction with the background */}
      <div className="absolute inset-0" aria-hidden="true" onClick={(e) => e.stopPropagation()}></div>
      
      <div className={`relative w-[calc(100%-32px)] sm:w-[400px] bg-card border border-border shadow-2xl rounded-2xl p-8 overflow-hidden transition-transform duration-500 ${isClosing ? 'scale-95' : 'animate-in zoom-in-95 slide-in-from-bottom-4'}`}>
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/50 to-primary"></div>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">MOSAIC Security Check</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verify you&apos;re human</h2>
            <p className="text-sm text-muted-foreground">Please complete this security verification to continue.</p>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <button 
              onClick={handleVerify}
              disabled={isVerifying || isVerified}
              className={`w-7 h-7 shrink-0 rounded-md border-2 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${isChecked ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-background hover:border-primary/50 cursor-pointer shadow-sm'}
              `}
              aria-label="Verify you&apos;re human checkbox"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              ) : isVerified ? (
                <Check className="w-4 h-4 text-primary-foreground" />
              ) : null}
            </button>
            
            <span className={`text-base font-medium select-none ${isVerified ? 'text-primary' : 'text-foreground'}`}>
              {isVerifying ? 'Verifying...' : isVerified ? 'Verification complete' : "Verify you&apos;re human"}
            </span>
          </div>

          <div className="text-xs text-muted-foreground pt-4 border-t border-border/50 flex justify-between items-center font-medium">
            <span>MOSAIC Security Verification</span>
            <span className="opacity-60">v1.0</span>
          </div>

          {error && (
            <div className="text-sm text-destructive mt-2 bg-destructive/10 p-3 rounded-lg border border-destructive/20 font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
