import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Layers, 
  Sparkles, 
  Eye, 
  Compass, 
  Code2, 
  Check, 
  Copy,
  Zap,
  Globe
} from 'lucide-react';

interface PanelData {
  id: string;
  num: string;
  label: string;
  meta: string;
  image: string;
  tagline: string;
  description: string;
  frequency: string;
  coordinates: string;
}

const PANELS: PanelData[] = [
  {
    id: '01',
    num: '01',
    label: 'VECTOR',
    meta: 'AXIS-X',
    image: '/images/image-01.jpg',
    tagline: 'Directional coordinate alignment in deep subspace',
    description: 'Precision trajectory algorithms calculate orbital paths in real-time, eliminating gravitational drift across relativistic velocities.',
    frequency: '1420.4 MHz',
    coordinates: 'RA 19h 50m / Dec +08° 52′'
  },
  {
    id: '02',
    num: '02',
    label: 'PRISM',
    meta: 'SPECTRA',
    image: '/images/image-02.jpg',
    tagline: 'Multispectral diffraction and chromatic separation',
    description: 'High-density photonic splitters resolve continuous wavelength spectra into distinct quantum emission bands.',
    frequency: '589.6 nm',
    coordinates: 'RA 05h 35m / Dec -05° 23′'
  },
  {
    id: '03',
    num: '03',
    label: 'PULSE',
    meta: '120 BPM',
    image: '/images/image-03.jpg',
    tagline: 'Synchronous oscillator telemetry & harmonic rhythm',
    description: 'Isochronous pulse-train synthesizers generate rhythmic electromagnetic pulses tuned for interstellar communication arrays.',
    frequency: '2.00 Hz',
    coordinates: 'RA 18h 36m / Dec +38° 47′'
  },
  {
    id: '04',
    num: '04',
    label: 'NOVA',
    meta: 'IGNITION',
    image: '/images/image-04.jpg',
    tagline: 'Stellar flare ignition & high-energy fusion dynamics',
    description: 'Thermonuclear expansion chamber simulations capture rapid plasma discharge patterns during stellar rebirth.',
    frequency: '4.85 GHz',
    coordinates: 'RA 20h 22m / Dec +40° 11′'
  },
  {
    id: '05',
    num: '05',
    label: 'FLUX',
    meta: 'STREAM',
    image: '/images/image-05.jpg',
    tagline: 'Continuous magnetic flux lines through plasma vacuum',
    description: 'Non-linear vector field dynamics model high-velocity particle streams along planetary magnetospheres.',
    frequency: '18.7 GHz',
    coordinates: 'RA 06h 45m / Dec -16° 42′'
  },
  {
    id: '06',
    num: '06',
    label: 'HALO',
    meta: 'RADIANT',
    image: '/images/image-06.jpg',
    tagline: 'Circumstellar corona diffusion and radiant emission',
    description: 'Diffused atmospheric glow rings refract high-energy stellar wind particles into luminous aurora formations.',
    frequency: '656.3 nm',
    coordinates: 'RA 12h 26m / Dec +31° 13′'
  },
  {
    id: '07',
    num: '07',
    label: 'DRIFT',
    meta: 'ZERO-G',
    image: '/images/image-07.jpg',
    tagline: 'Microgravity inertial glide and momentum transfer',
    description: 'Frictionless spatial positioning enables effortless station keeping with near-zero thruster consumption.',
    frequency: '0.04 mHz',
    coordinates: 'RA 16h 41m / Dec +36° 27′'
  },
  {
    id: '08',
    num: '08',
    label: 'ECHO',
    meta: 'RESONANT',
    image: '/images/image-08.jpg',
    tagline: 'Deep space acoustic reverb and acoustic reflection',
    description: 'Gravitational wave interferometers detect subtle spatial ripples echoing from binary pulsar collapses.',
    frequency: '100 Hz',
    coordinates: 'RA 00h 42m / Dec +41° 16′'
  },
  {
    id: '09',
    num: '09',
    label: 'ZENITH',
    meta: 'APEX',
    image: '/images/image-09.jpg',
    tagline: 'Celestial culmination at maximum angular altitude',
    description: 'Highest vertical transit point relative to the observer horizon, providing optimal atmospheric penetration.',
    frequency: '90.0° Elevation',
    coordinates: 'RA 13h 47m / Dec +49° 18′'
  },
  {
    id: '10',
    num: '10',
    label: 'CORE',
    meta: 'CENTER',
    image: '/images/image-10.jpg',
    tagline: 'Gravitational singularity at the center of the ring',
    description: 'The dense central nucleus around which all system telemetry and orbital planes revolve in perfect equilibrium.',
    frequency: '1.414 Planck',
    coordinates: 'RA 17h 45m / Dec -29° 00′'
  }
];

const SPACING_LEVELS = [0.74, 0.92, 1.08];

export default function App() {
  const [visualsOn, setVisualsOn] = useState<boolean>(true);
  const [zoomOn, setZoomOn] = useState<boolean>(false);
  const [spacingIndex, setSpacingIndex] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeModalPanel, setActiveModalPanel] = useState<PanelData | null>(null);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // 3D Carousel Refs and State
  const stageRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Physics animation variables
  const rotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const draggingRef = useRef<boolean>(false);
  const lastXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const hasMovedSignificantlyRef = useRef<boolean>(false);

  // Parallax angles
  const targetXRef = useRef<number>(10); // biasX
  const targetYRef = useRef<number>(0);
  const currentXRef = useRef<number>(10);
  const currentYRef = useRef<number>(0);

  const reqAnimRef = useRef<number | null>(null);

  // Compute effective radius based on viewport and spacing
  const getBaseRadius = () => {
    if (typeof window === 'undefined') return 360;
    return window.innerWidth <= 720 ? 220 : 360;
  };

  const getEffectiveRadius = () => {
    return getBaseRadius() * SPACING_LEVELS[spacingIndex];
  };

  // Position panels dynamically
  const updatePanelPositions = () => {
    if (!ringRef.current) return;
    const panels = ringRef.current.querySelectorAll<HTMLDivElement>('.panel');
    const r = getEffectiveRadius();
    const count = PANELS.length;

    panels.forEach((panel, i) => {
      const angle = (360 / count) * i;
      const tilt = Math.sin((i / count) * Math.PI * 2) * 8;
      panel.style.setProperty('--ry', `${angle}deg`);
      panel.style.setProperty('--tz', `${r}px`);
      panel.style.setProperty('--rz', `${tilt.toFixed(2)}deg`);
      panel.style.setProperty('--i', `${i}`);
    });
  };

  useEffect(() => {
    updatePanelPositions();
  }, [spacingIndex]);

  useEffect(() => {
    const handleResize = () => {
      updatePanelPositions();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [spacingIndex]);

  // Mousemove for Kinetic Parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rangeY = 28;
    const rangeX = 30;
    const biasX = 10;

    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth) - 0.5;
      const my = (e.clientY / window.innerHeight) - 0.5;
      targetYRef.current = mx * rangeY;
      targetXRef.current = (-my * rangeX) + biasX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animation loop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseDrift = prefersReducedMotion ? 0 : 0.12;
    const friction = 0.94;

    const animate = () => {
      if (!draggingRef.current) {
        rotationRef.current += baseDrift + velocityRef.current;
        velocityRef.current *= friction;
        if (Math.abs(velocityRef.current) < 0.0015) {
          velocityRef.current = 0;
        }
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rotationRef.current.toFixed(3)}deg)`;
      }

      if (!prefersReducedMotion && parallaxRef.current) {
        currentXRef.current += (targetXRef.current - currentXRef.current) * 0.06;
        currentYRef.current += (targetYRef.current - currentYRef.current) * 0.06;
        parallaxRef.current.style.transform = `rotateX(${currentXRef.current.toFixed(2)}deg) rotateY(${currentYRef.current.toFixed(2)}deg)`;
      }

      reqAnimRef.current = requestAnimationFrame(animate);
    };

    reqAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
    };
  }, []);

  // Pointer drag events on stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const MAX_VELOCITY = 7;
    const DRAG_SENS = 0.32;
    const WHEEL_SENS = 0.05;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = e.clientX;
      dragStartTimeRef.current = Date.now();
      hasMovedSignificantlyRef.current = false;
      velocityRef.current = 0;
      stage.classList.add('dragging');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      if (Math.abs(dx) > 3) {
        hasMovedSignificantlyRef.current = true;
      }
      lastXRef.current = e.clientX;
      const step = dx * DRAG_SENS;
      rotationRef.current += step;
      velocityRef.current = clamp(step, -MAX_VELOCITY, MAX_VELOCITY);
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      stage.classList.remove('dragging');
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        velocityRef.current = clamp(velocityRef.current + e.deltaX * WHEEL_SENS, -MAX_VELOCITY, MAX_VELOCITY);
      }
    };

    stage.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    stage.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      stage.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      stage.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Scroll reveal trigger
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      reveals.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    } else {
      reveals.forEach(el => el.classList.add('visible'));
    }
  }, []);

  const handlePanelClick = (panel: PanelData) => {
    if (hasMovedSignificantlyRef.current) return;
    setActiveModalPanel(panel);
  };

  const handleNextModal = () => {
    if (!activeModalPanel) return;
    const currentIndex = PANELS.findIndex(p => p.id === activeModalPanel.id);
    const nextIndex = (currentIndex + 1) % PANELS.length;
    setActiveModalPanel(PANELS[nextIndex]);
  };

  const handlePrevModal = () => {
    if (!activeModalPanel) return;
    const currentIndex = PANELS.findIndex(p => p.id === activeModalPanel.id);
    const prevIndex = (currentIndex - 1 + PANELS.length) % PANELS.length;
    setActiveModalPanel(PANELS[prevIndex]);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(`<div class="stage"><div class="ring" id="ring">...</div></div>`);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white overflow-x-hidden ${visualsOn ? 'visuals-on' : ''}`}>
      {/* Ambient background atmosphere */}
      <div className="aura" />
      <div className="stars" />

      {/* Main Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="flex items-center gap-3">
          <a href="#" className="font-mono-code text-sm font-medium tracking-[3px] text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></span>
            ORBITAL <span className="text-cyan-400 font-semibold">// 297</span>
          </a>
        </div>

        <ul className="hidden md:flex items-center gap-9 list-none">
          <li>
            <a 
              href="#system" 
              className="font-mono-code text-xs tracking-[2px] text-white/50 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all"
            >
              System
            </a>
          </li>
          <li>
            <a 
              href="#capabilities" 
              className="font-mono-code text-xs tracking-[2px] text-white/50 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all"
            >
              Capabilities
            </a>
          </li>
          <li>
            <a 
              href="#launch" 
              className="font-mono-code text-xs tracking-[2px] text-white/50 hover:text-white hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all"
            >
              Launch
            </a>
          </li>
        </ul>

        {/* Action Button & Hamburger for Mobile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLaunchModal(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono-code text-[11px] tracking-wider transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ENTER ORBIT</span>
          </button>

          <button 
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 bg-transparent border-0 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 p-6 transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <a 
          href="#system" 
          onClick={() => setMobileMenuOpen(false)}
          className="font-mono-code text-2xl tracking-[3px] text-white/70 hover:text-cyan-400 transition-colors"
        >
          // 01 SYSTEM
        </a>
        <a 
          href="#capabilities" 
          onClick={() => setMobileMenuOpen(false)}
          className="font-mono-code text-2xl tracking-[3px] text-white/70 hover:text-cyan-400 transition-colors"
        >
          // 02 CAPABILITIES
        </a>
        <a 
          href="#launch" 
          onClick={() => setMobileMenuOpen(false)}
          className="font-mono-code text-2xl tracking-[3px] text-white/70 hover:text-cyan-400 transition-colors"
        >
          // 03 LAUNCH
        </a>
        <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShowLaunchModal(true);
            }}
            className="btn-orbital"
          >
            START BUILDING
          </button>
          <span className="font-mono-code text-xs text-white/40 tracking-widest">
            PRESENTATION SYSTEM 297
          </span>
        </div>
      </div>

      {/* Hero Section with 3D Orbital Carousel */}
      <header className="hero relative z-10 h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* 3D Stage */}
        <div 
          ref={stageRef}
          className="stage absolute inset-0 flex items-center justify-center"
        >
          <div 
            ref={parallaxRef}
            className="parallax"
          >
            {/* The tilting Ring Wrapper */}
            <div 
              className="ring-tilt"
              style={{
                transform: `rotateX(-20deg) scale3d(${zoomOn ? '1.24' : '1'}, ${zoomOn ? '1.24' : '1'}, ${zoomOn ? '1.24' : '1'})`
              }}
            >
              <div 
                ref={ringRef}
                className="ring" 
                id="ring"
              >
                {PANELS.map((panel, idx) => (
                  <div 
                    key={panel.id}
                    className="panel group"
                    onClick={() => handlePanelClick(panel)}
                    title={`Click to inspect ${panel.label}`}
                  >
                    {/* Face 1: Frosted Glass Graphic Text */}
                    <div className="panel-face panel-face--text">
                      <div className="p-num flex items-center justify-between">
                        <span>{panel.num}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"></span>
                      </div>
                      <div>
                        <div className="p-label text-white tracking-wider">{panel.label}</div>
                        <div className="p-meta">{panel.meta}</div>
                      </div>
                    </div>

                    {/* Face 2: Photographic Glass Visual with gradient scrim */}
                    <div className="panel-face panel-face--image">
                      <img 
                        src={panel.image} 
                        alt={panel.label} 
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="panel-scrim" />
                      <div className="panel-cap">
                        <span className="p-num font-mono-code text-cyan-400 text-xs">{panel.num}</span>
                        <span>{panel.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Central Typography Floating in 3D Space */}
            <div className="hero-text pointer-events-none select-none">
              <div className="eyebrow glow-cyan text-cyan-400 font-mono-code tracking-[6px] text-xs sm:text-sm uppercase mb-4">
                PRESENTATION SYSTEM 297
              </div>
              <h1 className="glow-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none">
                ELEVATE YOUR VISION
              </h1>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-white/60 tracking-normal max-w-lg mx-auto leading-relaxed">
                A holographic interface built from light, glass and motion. Everything here orbits a single idea.
              </p>
            </div>
          </div>
        </div>

        {/* HUD Controls in Bottom Right */}
        <div className="hero-controls absolute right-4 sm:right-10 bottom-20 sm:bottom-24 z-20 flex flex-col items-end gap-4 bg-black/30 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Visuals Switch: Frosted glass vs Photography */}
          <div className="ctrl flex items-center gap-3">
            <span className="ctrl-label font-mono-code text-[10px] tracking-wider text-white/50">VISUALS</span>
            <button 
              id="visualsSwitch"
              role="switch" 
              aria-checked={visualsOn}
              aria-label="Toggle image visuals"
              onClick={() => setVisualsOn(!visualsOn)}
              className="switch"
            >
              <span className="knob" />
            </button>
          </div>

          {/* Zoom Switch: 24% larger */}
          <div className="ctrl flex items-center gap-3">
            <span className="ctrl-label font-mono-code text-[10px] tracking-wider text-white/50">ZOOM</span>
            <button 
              id="zoomSwitch"
              role="switch" 
              aria-checked={zoomOn}
              aria-label="Zoom ring 24 percent larger"
              onClick={() => setZoomOn(!zoomOn)}
              className="switch"
            >
              <span className="knob" />
            </button>
          </div>

          {/* Spacing 3-step control */}
          <div className="ctrl flex items-center gap-3">
            <span className="ctrl-label font-mono-code text-[10px] tracking-wider text-white/50">SPACING</span>
            <div className="spacing flex gap-1 p-1 rounded-full bg-white/5 border border-white/10" role="group" aria-label="Ring spacing">
              <button 
                className={`spacing-step ${spacingIndex === 0 ? 'is-active' : ''}`}
                onClick={() => setSpacingIndex(0)}
                aria-label="Tight spacing"
                title="Tight Spacing"
              >
                <i />
              </button>
              <button 
                className={`spacing-step ${spacingIndex === 1 ? 'is-active' : ''}`}
                onClick={() => setSpacingIndex(1)}
                aria-label="Default spacing"
                title="Default Spacing"
              >
                <i />
              </button>
              <button 
                className={`spacing-step ${spacingIndex === 2 ? 'is-active' : ''}`}
                onClick={() => setSpacingIndex(2)}
                aria-label="Wide spacing"
                title="Wide Spacing"
              >
                <i />
              </button>
            </div>
          </div>

          {/* Touch / Drag Gesture Tip */}
          <div className="text-[9px] font-mono-code text-white/30 tracking-widest uppercase pt-1 border-t border-white/10 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>DRAG OR SCROLL TO ROTATE</span>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono-code text-[10px] tracking-[3px] text-white/40 flex flex-col items-center gap-2 pointer-events-none">
          <span>SCROLL</span>
          <div className="scroll-line w-[1px] h-9 bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
      </header>

      {/* Section 1: The System */}
      <section className="section py-28 sm:py-36 px-6 sm:px-12 max-w-6xl mx-auto relative z-10" id="system">
        <div className="section-head reveal mb-16 max-w-2xl">
          <div className="eyebrow font-mono-code text-xs tracking-[5px] text-cyan-400 uppercase mb-3">
            // THE SYSTEM
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            Designed in three dimensions, delivered in one file.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed font-normal">
            ORBITAL is a self-contained presentation surface. No frameworks, no dependencies, no build step. Pure HTML, CSS and JavaScript engineered to feel like a window into deep space.
          </p>
        </div>

        {/* Features / Capabilities Grid */}
        <div className="features grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="capabilities">
          <div className="feature relative p-8 sm:p-10 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md overflow-hidden hover:-translate-y-1.5 hover:bg-white/[0.05] transition-all duration-500 reveal">
            <div className="feature-top-bar absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_18px_#06b6d4]" />
            <div className="f-index font-mono-code text-xs tracking-wider text-violet-400 mb-5">
              01 // DEPTH
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight">
              True 3D space
            </h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              Glass panels are positioned with real CSS transforms and <code className="text-cyan-300 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/40">preserve-3d</code>, orbiting the core in a continuous, GPU-driven loop.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono-code text-white/40">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>GPU Matrix Acceleration</span>
            </div>
          </div>

          <div className="feature relative p-8 sm:p-10 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md overflow-hidden hover:-translate-y-1.5 hover:bg-white/[0.05] transition-all duration-500 reveal">
            <div className="feature-top-bar absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_18px_#06b6d4] [animation-delay:1s]" />
            <div className="f-index font-mono-code text-xs tracking-wider text-violet-400 mb-5">
              02 // RESPONSE
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight">
              Kinetic parallax
            </h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              The entire ring leans toward your cursor, tilting on two axes with an expensive easing curve that makes every motion feel weighted.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono-code text-white/40">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dual-Axis Gyro Easing</span>
            </div>
          </div>

          <div className="feature relative p-8 sm:p-10 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md overflow-hidden hover:-translate-y-1.5 hover:bg-white/[0.05] transition-all duration-500 reveal">
            <div className="feature-top-bar absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_18px_#06b6d4] [animation-delay:2s]" />
            <div className="f-index font-mono-code text-xs tracking-wider text-violet-400 mb-5">
              03 // LIGHT
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight">
              Neon glassmorphism
            </h3>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              Layered backdrop blur, gradient borders and inner glow give each surface the quiet shimmer of frosted holographic glass.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono-code text-white/40">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Translucent Photonic Masking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gallery Quick Strip */}
      <section className="py-16 px-6 sm:px-12 max-w-6xl mx-auto relative z-10 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="font-mono-code text-xs tracking-widest text-cyan-400 mb-1">// ORBITAL ARRAY INDEX</div>
            <h3 className="text-2xl font-bold tracking-tight text-white">Ten Harmonic Modules</h3>
          </div>
          <span className="font-mono-code text-xs text-white/40">
            Click any module below or directly on the 3D ring to open deep telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveModalPanel(p)}
              className="text-left p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-cyan-400/50 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between font-mono-code text-[11px] text-cyan-400 mb-2">
                <span>{p.num}</span>
                <span className="text-white/30 group-hover:text-cyan-300">↗</span>
              </div>
              <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {p.label}
              </div>
              <div className="font-mono-code text-[10px] text-white/40 mt-1">
                {p.meta}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Call to Action (Launch) */}
      <section className="cta text-center py-28 sm:py-40 px-6 relative z-10" id="launch">
        <div className="reveal max-w-2xl mx-auto">
          <div className="font-mono-code text-xs tracking-[4px] text-violet-400 mb-4 uppercase">
            // ORBITAL DEPLOYMENT
          </div>
          <h2 className="glow-violet text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
            Ready to orbit?
          </h2>
          <p className="mt-6 mb-10 text-base sm:text-lg text-white/60 leading-relaxed max-w-md mx-auto">
            Drop ORBITAL into any project and ship a hero that people remember long after they leave.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setShowLaunchModal(true)}
              className="btn-orbital cursor-pointer"
            >
              START BUILDING
            </button>
            <a 
              href="#ring" 
              className="font-mono-code text-xs tracking-widest text-cyan-400 hover:text-white px-6 py-4 rounded-full border border-cyan-400/20 hover:border-cyan-400/60 transition-all flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>EXPLORE RING</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer relative z-10 border-t border-white/10 px-6 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="font-mono-code text-sm tracking-[3px] text-white">
            ORBITAL <span className="text-cyan-400 font-semibold">// 297</span>
          </span>
        </div>
        <div className="credit font-mono-code text-xs tracking-wider text-white/40 flex items-center gap-3">
          <span>3D Orbital Carousel by</span>
          <a 
            href="https://www.tooplate.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 hover:text-cyan-400 transition-colors underline decoration-white/20 underline-offset-4"
          >
            Tooplate
          </a>
        </div>
      </footer>

      {/* Interactive Detail Modal for Panel */}
      {activeModalPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-3xl rounded-2xl bg-[#09090d] border border-white/15 p-6 sm:p-8 shadow-[0_0_80px_rgba(139,92,246,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close & Navigation bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-xs px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-400/40 text-cyan-300">
                  MODULE {activeModalPanel.num}
                </span>
                <span className="font-mono-code text-xs text-white/40">
                  {activeModalPanel.meta}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevModal}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Previous Module"
                  title="Previous Module"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNextModal}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Next Module"
                  title="Next Module"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveModalPanel(null)}
                  className="p-1.5 ml-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Image Preview with Hologram Frame */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] border border-white/10 shadow-inner group">
                <img 
                  src={activeModalPanel.image} 
                  alt={activeModalPanel.label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono-code text-white">
                  <span className="text-cyan-400 font-bold">{activeModalPanel.label}</span>
                  <span className="text-white/50">{activeModalPanel.frequency}</span>
                </div>
              </div>

              {/* Data & Telemetry Details */}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    {activeModalPanel.label}
                  </h3>
                  <p className="text-cyan-300 font-mono-code text-xs mb-4">
                    {activeModalPanel.tagline}
                  </p>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                    {activeModalPanel.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6 font-mono-code text-xs">
                    <div>
                      <div className="text-white/40 text-[10px]">COORDINATES</div>
                      <div className="text-white mt-0.5">{activeModalPanel.coordinates}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-[10px]">HARMONIC SPECTRA</div>
                      <div className="text-cyan-400 mt-0.5">{activeModalPanel.frequency}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-[10px]">ORBITAL PLANE</div>
                      <div className="text-white mt-0.5">Vector Angle {((360 / 10) * parseInt(activeModalPanel.num, 10)).toFixed(0)}°</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-[10px]">STATUS</div>
                      <div className="text-emerald-400 mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        SYNCHRONIZED
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setVisualsOn(!visualsOn);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-mono-code text-xs text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>TOGGLE {visualsOn ? 'TEXT' : 'IMAGE'} MODE</span>
                  </button>
                  <button 
                    onClick={() => setActiveModalPanel(null)}
                    className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono-code text-xs transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launch / Start Building Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xl rounded-2xl bg-[#09090d] border border-cyan-400/30 p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">ORBITAL // SYSTEM LAUNCH</h3>
              </div>
              <button 
                onClick={() => setShowLaunchModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6">
              You can instantly drop the ORBITAL 3D Carousel into any project. The ring runs on pure CSS transforms with zero dependencies, 60fps hardware acceleration, and full touch drag interaction.
            </p>

            <div className="p-4 rounded-xl bg-black border border-white/10 mb-6 font-mono-code text-xs text-white/80 relative">
              <div className="text-white/40 text-[10px] mb-2">// QUICK EMBED</div>
              <pre className="overflow-x-auto text-cyan-300">
{`<!-- Include 3D Ring Stage -->
<div class="stage">
  <div class="parallax">
    <div class="ring-tilt">
      <div class="ring" id="ring">
        <!-- 10 Glassmorphic Panels -->
      </div>
    </div>
  </div>
</div>`}
              </pre>
              <button 
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-[11px]"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={() => {
                  setShowLaunchModal(false);
                  const el = document.getElementById('system');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-mono-code text-xs font-semibold tracking-wider transition-all text-center"
              >
                LEARN SYSTEM ARCHITECTURE
              </button>
              <button 
                onClick={() => setShowLaunchModal(false)}
                className="w-full sm:w-auto py-3 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-mono-code text-xs tracking-wider transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
