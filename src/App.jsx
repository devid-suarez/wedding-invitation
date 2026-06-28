import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CalendarClock, Heart, Music, Music2, MessageCircle } from 'lucide-react';
import dressCodeImg from './assets/dress-code.jpg';
import songAudio from './assets/song.mp3';

const App = () => {
    const [envelopeState, setEnvelopeState] = useState('sealed'); // sealed, unsealing, opening, opened
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [whatsAppNumber, setWhatsAppNumber] = useState('573192146220');
    const audioRef = useRef(null);
    const observerRefs = useRef([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const familyParam = params.get('family') || params.get('famili');
        if (familyParam && familyParam.toLowerCase() === 'l') {
            setWhatsAppNumber('573013189286');
        } else {
            setWhatsAppNumber('573192146220');
        }
    }, []);

    useEffect(() => {
        // Fuentes elegantes de Google Fonts
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@200;300;400&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Observador para animaciones de scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-16');
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        observerRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observerRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [envelopeState]);

    // Efecto para la cuenta regresiva (Formato de fecha ultra-compatible y nueva hora 3:00 PM)
    useEffect(() => {
        // 3:00 PM es 15:00:00
        const targetDate = new Date('October 10, 2026 15:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleOpenEnvelope = () => {
        if (envelopeState !== 'sealed') return;

        // Intentar iniciar la música (A Whole New World)
        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio bloqueado por el navegador"));
        }

        // Paso 1: El sello desaparece
        setEnvelopeState('unsealing');

        // Paso 2: Los triángulos deslizan (Inicia animación suave)
        setTimeout(() => {
            setEnvelopeState('opening');
        }, 1500);

        // Paso 3: Habilitar el scroll después de que termine gran parte de la transición
        setTimeout(() => {
            setEnvelopeState('opened');
        }, 9500);
    };

    const addToRefs = (el) => {
        if (el && !observerRefs.current.includes(el)) {
            observerRefs.current.push(el);
        }
    };

    const isOpening = envelopeState === 'opening' || envelopeState === 'opened';
    const isOpened = envelopeState === 'opened';

    return (
        <div className={`min-h-screen bg-[#fcfbf9] text-[#2c2c2c] ${!isOpened ? 'overflow-hidden h-screen' : 'overflow-auto'}`}>

            {/* ESTILOS PERSONALIZADOS */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        
        .paper-texture {
          background-color: #f7f3eb;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        }

        .wax-seal {
          background: radial-gradient(circle at 35% 35%, #fef8eb, #e6cdab, #c89e66);
          box-shadow: 
            inset 0 0 15px rgba(166, 124, 76, 0.4),
            0 10px 20px rgba(0,0,0,0.15),
            0 2px 5px rgba(0,0,0,0.1);
          border: 1px solid #dcc29a;
        }

        /* ANIMACIÓN DE APERTURA LENTA Y ELEGANTE */
        .flap-transition {
          transition: transform 8s cubic-bezier(0.25, 1, 0.5, 1), opacity 7s ease-in-out;
        }

        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-subtle-bounce {
          animation: subtle-bounce 3s infinite ease-in-out;
        }

        /* Animación etérea constante para los nombres */
        @keyframes ethereal-float {
          0%, 100% { transform: translateY(0) scale(1); text-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { transform: translateY(-8px) scale(1.02); text-shadow: 0 0 35px rgba(255,255,255,0.4); }
        }
        .animate-ethereal {
          animation: ethereal-float 6s ease-in-out infinite;
        }

        /* Fondo decorativo floral para la segunda parte */
        .floral-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 0C150 50 100 150 200 200C300 150 250 50 200 0Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M400 200C350 150 250 100 200 200C250 300 350 250 400 200Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M200 400C250 350 300 250 200 200C100 250 150 350 200 400Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M0 200C50 250 150 300 200 200C150 100 50 150 0 200Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }

        /* ANIMACIONES DE LOS ANILLOS */
        .ring-left, .ring-right {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          opacity: 0;
        }
        .ring-left-over {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          opacity: 0;
        }

        .opacity-100 .ring-left {
          animation: 
            draw-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.3s,
            drop-join-left 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.3s;
        }
        
        .opacity-100 .ring-right {
          animation: 
            draw-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.3s,
            drop-join-right 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.3s;
        }

        .opacity-100 .ring-left-over {
          animation: 
            draw-ring-over 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.3s,
            drop-join-left 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.3s;
        }

        .opacity-100 .sparkle-effect {
          animation: sparkle-flash 2.5s ease-in-out forwards 2.4s;
          opacity: 0;
          transform-origin: 60px 29px; 
        }

        @keyframes draw-ring {
          0% { stroke-dashoffset: 140; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes draw-ring-over {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes drop-join-left {
          0% { transform: translate(-50px, -80px) rotate(-30deg) scale(1.2); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        }
        
        @keyframes drop-join-right {
          0% { transform: translate(50px, -80px) rotate(30deg) scale(1.2); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        }

        @keyframes sparkle-flash {
          0% { opacity: 0; transform: scale(0) rotate(0deg); }
          30% { opacity: 1; transform: scale(1.5) rotate(45deg); filter: drop-shadow(0 0 8px rgba(197, 160, 89, 0.9)); }
          100% { opacity: 0; transform: scale(0) rotate(135deg); }
        }

        /* Rotação contínua como um único objeto */
        .rings-spin-wrapper {
          transform-style: preserve-3d;
          transform-origin: center center;
        }
        
        .opacity-100 .rings-spin-wrapper {
          animation: spin-joined-rings 12s linear infinite;
          animation-delay: 2.8s;
          animation-fill-mode: both;
        }
        
        @keyframes spin-joined-rings {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}} />

            {/* Audio de fondo: song.mp3 */}
            <audio ref={audioRef} loop src={songAudio} />

            {/* Botón Flotante de Música */}
            <button
                onClick={toggleMusic}
                className={`fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full bg-[#c5a059]/20 backdrop-blur-md border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/40 transition-all duration-300 ${!isOpened && envelopeState === 'sealed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-50" />}
            </button>

            {/* ================= SOBRE A PANTALLA COMPLETA ================= */}
            {/* Eliminado el 'hidden' que causaba el salto; ahora solo se vuelve transparente y sin pointer-events */}
            <div className={`fixed inset-0 z-50 w-full h-full pointer-events-none transition-opacity duration-1000 ${isOpened ? 'opacity-0' : 'opacity-100'}`}>
                <div className={`relative w-full h-full overflow-hidden bg-black/10 ${!isOpened ? 'pointer-events-auto' : ''}`}>

                    {/* TRIÁNGULO IZQUIERDO */}
                    <div
                        className={`absolute inset-0 paper-texture flap-transition filter drop-shadow-[5px_0_15px_rgba(0,0,0,0.1)] z-10 ${isOpening ? '-translate-x-full opacity-30' : 'translate-x-0 opacity-100'}`}
                        style={{ clipPath: 'polygon(0 0, 0 100%, 50.5% 50%)' }}
                    />

                    {/* TRIÁNGULO DERECHO */}
                    <div
                        className={`absolute inset-0 paper-texture flap-transition filter drop-shadow-[-5px_0_15px_rgba(0,0,0,0.1)] z-10 ${isOpening ? 'translate-x-full opacity-30' : 'translate-x-0 opacity-100'}`}
                        style={{ clipPath: 'polygon(100% 0, 100% 100%, 49.5% 50%)' }}
                    />

                    {/* TRIÁNGULO INFERIOR */}
                    <div
                        className={`absolute inset-0 paper-texture flap-transition filter drop-shadow-[0_-5px_15px_rgba(0,0,0,0.15)] z-20 flex flex-col items-center justify-end pb-[5vh] md:pb-[7vh] ${isOpening ? 'translate-y-full opacity-30' : 'translate-y-0 opacity-100'}`}
                        style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 49.5%)' }}
                    >
                        <div className={`text-center px-4 w-full max-w-[95%] mx-auto transition-opacity duration-700 ${envelopeState !== 'sealed' ? 'opacity-0' : 'opacity-100'}`}>
                            <p className="font-script text-[1.4rem] md:text-3xl text-[#a88a5e] mb-1 tracking-wide leading-tight">Esta invitación es</p>
                            <p className="font-script text-[1.4rem] md:text-3xl text-[#a88a5e] tracking-wide leading-tight">exclusiva para ti</p>

                            <div className="mt-4 flex justify-center opacity-60">
                                <svg width="60" height="20" viewBox="0 0 60 20" fill="none" stroke="#a88a5e" strokeWidth="0.5">
                                    <path d="M0,10 C15,10 20,0 30,10 C40,20 45,10 60,10" />
                                    <circle cx="30" cy="10" r="1.5" fill="#a88a5e" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* TRIÁNGULO SUPERIOR (Solapa principal) */}
                    <div
                        className={`absolute inset-0 paper-texture flap-transition filter drop-shadow-[0_5px_20px_rgba(0,0,0,0.2)] z-30 ${isOpening ? '-translate-y-full opacity-30' : 'translate-y-0 opacity-100'}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50.5%)', backgroundColor: '#fdfbf7' }}
                    />

                    {/* SELLO DE CERA */}
                    <button
                        onClick={handleOpenEnvelope}
                        disabled={envelopeState !== 'sealed'}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-24 h-24 md:w-32 md:h-32 rounded-full wax-seal flex items-center justify-center cursor-pointer transition-all duration-[1000ms] ease-in-out
              ${envelopeState === 'sealed' ? 'opacity-100 scale-100 hover:scale-105' : 'opacity-0 scale-150 pointer-events-none'}`}
                        aria-label="Abrir invitación"
                    >
                        <span className="font-script text-3xl md:text-5xl text-[#8b6f47] font-medium tracking-widest drop-shadow-sm ml-2 z-10">L&D</span>
                    </button>
                </div>
            </div>

            {/* ================= CONTENIDO DE LA INVITACIÓN ================= */}

            {/* SECCIÓN HERO - FOTO DE FONDO */}
            <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">

                {/* Imagen de fondo - Se escala mientras el sobre se abre, no después */}
                <div
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out ${isOpening ? 'scale-100' : 'scale-110'}`}
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
                        backgroundPosition: 'center 30%',
                        filter: 'brightness(0.65) sepia(0.15)'
                    }}
                />

                {/* Degradados */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fcfbf9] z-0"></div>

                <div className="relative z-10 text-center text-[#fcfbf9] flex flex-col items-center h-full justify-between py-16 md:py-24 w-full px-6">

                    <div className="mt-16 space-y-8 flex flex-col items-center w-full">
                        {/* Tiempos de retraso acortados para que aparezcan fluidamente mientras el sobre se retira */}
                        <div className={`overflow-hidden transition-all duration-[1500ms] delay-[1500ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="font-sans tracking-[0.4em] text-xs md:text-sm font-light uppercase border-b border-[#c5a059]/40 pb-3 px-4">
                                Save the Date
                            </p>
                        </div>

                        <div className={`transition-all duration-[2000ms] delay-[2000ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Animación estética y permanente de los nombres */}
                            <div className="animate-ethereal">
                                <h1 className="font-script text-[5.5rem] md:text-[9rem] font-normal text-white drop-shadow-2xl leading-none px-2 text-center">
                                    Lina & David
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col items-center opacity-80 transition-all duration-[2000ms] delay-[3500ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="font-serif italic text-lg md:text-xl mb-6 tracking-wide font-light">Desliza para descubrir</p>
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#c5a059] to-transparent animate-subtle-bounce"></div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DETALLES DE LA BODA */}
            <div className="relative z-10 bg-[#fcfbf9] w-full floral-bg">
                {/* Adorno superior sutil */}
                <div className="w-full flex justify-center py-12 opacity-40">
                    <svg width="200" height="30" viewBox="0 0 200 30" fill="none" stroke="#c5a059" strokeWidth="0.5">
                        <path d="M0,15 Q50,0 100,15 T200,15" />
                        <circle cx="100" cy="15" r="3" fill="#c5a059" />
                    </svg>
                </div>

                <div className="max-w-5xl mx-auto px-6 pb-24 text-center">

                    {/* CUENTA REGRESIVA */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24 md:mb-32">
                        <h3 className="font-sans text-[#c5a059] tracking-[0.3em] text-sm uppercase mb-10">Faltan</h3>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-3xl mx-auto">
                            {[
                                { label: 'Días', value: timeLeft.days }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white border border-[#c5a059]/20 w-24 h-24 md:w-36 md:h-36 flex flex-col items-center justify-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] rounded-full hover:border-[#c5a059]/50 transition-colors duration-500">
                                    <span className="font-serif text-3xl md:text-6xl text-[#2c2c2c]">{item.value}</span>
                                    <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-[#888] mt-1 md:mt-2">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Introducción con Anillos */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-32 flex flex-col items-center">
                        <h2 className="font-script text-5xl md:text-6xl text-[#a88a5e] mb-6">Nuestra Boda</h2>

                        {/* Anillos Animados (Dibujo, caída suave, entrelazado 3D y rotación continua) */}
                        <div className="relative mb-10 mt-4 flex justify-center w-full" style={{ perspective: '800px' }}>
                            <div className="rings-spin-wrapper">
                                <svg width="140" height="100" viewBox="0 0 120 80" className="overflow-visible">
                                    <defs>
                                        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#e8d0a9" />
                                            <stop offset="50%" stopColor="#c5a059" />
                                            <stop offset="100%" stopColor="#8b6f47" />
                                        </linearGradient>
                                    </defs>

                                    {/* Anillo Izquierdo */}
                                    <circle className="ring-left" cx="45" cy="45" r="22" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                                    {/* Anillo Derecho */}
                                    <circle className="ring-right" cx="75" cy="45" r="22" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                                    {/* Segmento milimétrico que crea la ilusión óptica del entrelazado */}
                                    <path className="ring-left-over" d="M 60 28.91 A 22 22 0 0 1 60 61.09" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />

                                    {/* Brillo Dorado que aparece al unirse */}
                                    <path className="sparkle-effect" d="M60 21 L61.5 27.5 L68 29 L61.5 30.5 L60 37 L58.5 30.5 L52 29 L58.5 27.5 Z" fill="#fff" />
                                </svg>
                            </div>
                        </div>

                        <p className="font-serif text-xl md:text-3xl leading-relaxed max-w-2xl mx-auto italic text-[#5a5a5a] font-light">
                            "Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que amas los hace inolvidables."
                        </p>
                        <div className="w-24 h-[1px] bg-[#c5a059]/40 mt-12"></div>
                    </div>

                    {/* Tarjeta de Información */}
                    <div className="max-w-xl mx-auto mb-24">

                        {/* Cuándo */}
                        <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out flex flex-col items-center">
                            <span className="font-sans text-[#c5a059] tracking-[0.3em] text-xs uppercase mb-6">Cuándo</span>
                            <div className="w-full bg-white p-10 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f0e6d2]/50 hover:border-[#c5a059]/30 transition-colors duration-500 rounded-sm flex flex-col justify-center min-h-[300px]">
                                <CalendarClock className="w-10 h-10 mx-auto text-[#c5a059] mb-8" strokeWidth={1} />
                                <p className="font-serif text-3xl mb-2 text-[#2c2c2c]">Sábado, 10 de Octubre</p>
                                <p className="font-sans text-sm tracking-[0.2em] text-[#888] mt-4 uppercase">Dos mil veintiséis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DRESS CODE (Fondo con Imagen) */}
            <div className="relative w-full py-32 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{
                        backgroundImage: `url(${dressCodeImg})`,
                        filter: 'brightness(0.35) sepia(0.15)'
                    }}
                />
                <div ref={addToRefs} className="relative z-10 opacity-0 translate-y-16 transition-all duration-1000 ease-out text-center px-6 max-w-4xl mx-auto">
                    <span className="font-sans text-[#e8d0a9] tracking-[0.3em] text-xs uppercase mb-4 block">Código de Vestimenta</span>
                    <h2 className="font-script text-6xl md:text-7xl text-white mb-2">Formal</h2>
                    <p className="font-serif italic text-lg md:text-xl text-gray-200 mb-10">Tu presencia es lo más importante para nosotros</p>

                    <div className="flex flex-col md:flex-row gap-12 md:gap-16 justify-center mt-12">
                        <div className="text-center max-w-sm flex flex-col justify-start">
                            <h3 className="font-serif text-2xl text-[#e8d0a9] mb-3 italic">Para Hombres</h3>
                            <p className="font-sans text-sm text-gray-300 leading-relaxed">Puedes optar por trajes en tonos claros u oscuros, para tu comodidad, la corbata es opcional.</p>
                        </div>
                        <div className="hidden md:block w-px h-24 bg-[#c5a059]/40 self-center"></div>
                        <div className="text-center max-w-sm flex flex-col justify-start">
                            <h3 className="font-serif text-2xl text-[#e8d0a9] mb-3 italic">Para Mujeres</h3>
                            <p className="font-sans text-sm text-gray-300 leading-relaxed mb-2">Siéntete libre de elegir entre un vestido elegante o un conjunto de pantalón formal.</p>
                            <p className="font-sans text-xs text-[#e8d0a9]/90 tracking-wide font-light">No uses los siguientes colores: blanco, marfil, crema, champagne</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN RSVP Y CIERRE */}
            <div className="relative z-10 bg-[#fcfbf9] w-full floral-bg pb-24">
                <div className="max-w-3xl mx-auto px-6 text-center pt-24">

                    {/* Tarjeta de Confirmación (RSVP) */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24">
                        <div className="bg-white p-10 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#c5a059]/20 rounded-sm">
                            <Heart className="w-8 h-8 mx-auto text-[#c5a059] mb-6 opacity-80" strokeWidth={1} />
                            <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c] mb-6">Confirmación de Asistencia</h2>
                            <p className="font-sans text-sm md:text-base text-[#5a5a5a] mb-10 leading-relaxed">
                                Por favor, confirma tu asistencia antes del <br className="hidden md:block" />
                                <strong className="text-[#a88a5e] font-semibold">1 de Agosto</strong>, indicando el número de personas.
                            </p>

                            <a
                                href={`https://wa.me/${whatsAppNumber}?text=Hola,%20quiero%20confirmar%20mi%20asistencia%20a%20la%20boda%20de%20Lina%20y%20David.%20Mi%20nombre%20es:%20`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center gap-3 border border-[#c5a059] bg-[#fdfbf7] text-[#a88a5e] px-8 py-4 overflow-hidden transition-all duration-500 hover:text-white mx-auto w-full md:w-auto"
                            >
                                <span className="absolute inset-0 w-full h-full bg-[#c5a059] transform scale-y-0 origin-bottom transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
                                <MessageCircle className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                                <span className="font-sans tracking-[0.1em] text-xs uppercase relative z-10 font-medium">Confirmar por WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Cierre */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out flex flex-col items-center">
                        <div className="w-12 h-12 border border-[#c5a059]/30 rotate-45 mb-10 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#c5a059]/50"></div>
                        </div>
                        <h2 className="font-script text-5xl md:text-7xl text-[#2c2c2c] mb-6">Te esperamos</h2>
                        <p className="font-serif text-xl md:text-2xl italic text-[#5a5a5a] tracking-wide mb-12">
                            Para celebrar el inicio de nuestra historia
                        </p>
                        <p className="font-sans text-xs tracking-[0.2em] text-[#888] uppercase border-t border-[#c5a059]/30 pt-8 mt-4 w-full md:w-2/3 mx-auto">
                            Próximamente compartiremos más detalles sobre nuestro gran día.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default App;