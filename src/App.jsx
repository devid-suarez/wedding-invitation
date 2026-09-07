import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin, CalendarClock, Heart, Music, Music2, MessageCircle, Navigation, Plus, Minus, Trash2, Sparkles
} from 'lucide-react';
import dressCodeImg from './assets/dress-code.jpg';
import songAudio from './assets/song.mp3';
import waxSealImg from './assets/sello.png';
import backgroundBeach from './assets/background-beach.jpg';
import weddingVideo from './assets/video.mp4';

// Importación automática de imágenes con Vite para asegurar resolución en dev y build
const menuImageModules = import.meta.glob('./assets/menu/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}', { eager: true, import: 'default' });
const itinerarioImageModules = import.meta.glob('./assets/itinerario/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,svg,SVG}', { eager: true, import: 'default' });

const getMenuImageUrl = (id) => {
    for (const ext of ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'webp', 'WEBP']) {
        const pathKey = `./assets/menu/${id}.${ext}`;
        if (menuImageModules[pathKey]) {
            return menuImageModules[pathKey];
        }
    }
    return `/assets/menu/${id}.png`;
};

const getItinerarioImageUrl = (id) => {
    for (const ext of ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'webp', 'WEBP', 'svg', 'SVG']) {
        const pathKey = `./assets/itinerario/${id}.${ext}`;
        if (itinerarioImageModules[pathKey]) {
            return itinerarioImageModules[pathKey];
        }
    }
    return `/assets/itinerario/${id}.png`;
};

// Iconos de arte de línea gris para el cronograma (fallback)
const LineArtReception = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 15v7" />
        <path d="M12 15l-5-7h10l-5 7z" />
        <path d="M7 8h10" />
        <path d="M19 4l-2 2" />
        <circle cx="19" cy="3" r="1" fill="#888888" />
    </svg>
);

const LineArtWeddingArch = () => (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#888888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 58 V 32 A 18 18 0 0 1 50 32 V 58" strokeWidth="1.5" />
        <path d="M10 58 H 54" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="1.5" fill="#888888" />
        <circle cx="32" cy="14" r="1.5" fill="#888888" />
        <circle cx="44" cy="20" r="1.5" fill="#888888" />
        <circle cx="27" cy="35" r="3" />
        <path d="M27 38 v 12 m-3-7 h 6" />
        <circle cx="37" cy="35" r="3" />
        <path d="M37 38 l -3 12 h 6 z" />
        <path d="M30 42 h 4" strokeWidth="1.5" />
    </svg>
);

const LineArtToast = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 15v7" />
        <path d="M7 3l3 7h4l3-7H7z" />
        <path d="M12 3v4" />
        <path d="M17 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <circle cx="17" cy="9" r="1" fill="#888888" />
    </svg>
);

const LineArtDinner = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15a9 9 0 0 0 18 0H3z" />
        <path d="M12 6v3" />
        <circle cx="12" cy="5" r="1" fill="#888888" />
        <path d="M2 18h20" />
    </svg>
);

const LineArtClosure = () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a7 7 0 0 1-7.54-7.54C12.92 3.04 12.46 3 12 3z" />
        <path d="M19 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
    </svg>
);

// Catálogo base de menús
const MENU_CATALOGUE = [
    {
        id: 1,
        title: "Carne asada",
        menu: "· Carne\n· Sopa\n· Albóndiga"
    },
    {
        id: 2,
        title: "Pollo a la Plancha",
        menu: "· Pechuga de pollo\n· Ensalada de la casa\n· Arroz con ajonjolí"
    },
    {
        id: 3,
        title: "Menú Vegetariano",
        menu: "· Lasagna de vegetales\n· Ensalada césar\n· Crema de zapallo"
    },
    {
        id: 4,
        title: "Salmón Glaseado",
        menu: "· Filete de salmón\n· Vegetales al vapor\n· Puré de papa"
    },
    {
        id: 5,
        title: "Menú Infantil",
        menu: "· Nuggets de pollo\n· Papas a la francesa\n· Jugo natural"
    }
];

// Helper para formatear nombres de asistentes separados por coma
const formatAssistantNames = (rawStr) => {
    if (!rawStr || !rawStr.trim()) return { text: null, list: [] };
    const names = rawStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const capitalized = names.map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase());

    if (capitalized.length === 0) return { text: null, list: [] };
    if (capitalized.length === 1) return { text: capitalized[0], list: capitalized };
    if (capitalized.length === 2) return { text: `${capitalized[0]} y ${capitalized[1]}`, list: capitalized };

    const main = capitalized.slice(0, -1).join(', ');
    const last = capitalized[capitalized.length - 1];
    return { text: `${main} y ${last}`, list: capitalized };
};

const AmbientSparkles = () => (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(16)].map((_, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-[#c5a059]/30 animate-pulse"
                style={{
                    top: `${(i * 7 + 12) % 95}%`,
                    left: `${(i * 13 + 5) % 95}%`,
                    width: `${(i % 3) * 2 + 3}px`,
                    height: `${(i % 3) * 2 + 3}px`,
                    animationDuration: `${(i % 4) + 3}s`,
                    animationDelay: `${(i % 3) * 0.7}s`,
                    boxShadow: '0 0 12px rgba(197, 160, 89, 0.8)'
                }}
            />
        ))}
    </div>
);

const App = () => {
    const [envelopeState, setEnvelopeState] = useState('sealed'); // sealed, unsealing, opening, opened
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [whatsAppNumber, setWhatsAppNumber] = useState('573192146220');
    const [isSiteRoute, setIsSiteRoute] = useState(false);
    const [isMenuRoute, setIsMenuRoute] = useState(false);

    // Estados para la sección de menú y música (/menu)
    const [assistantName, setAssistantName] = useState(null);
    const [totalMenusAllowed, setTotalMenusAllowed] = useState(1);
    const [activeMenus, setActiveMenus] = useState([]);
    const [selectedMenuCounts, setSelectedMenuCounts] = useState({});
    const [songs, setSongs] = useState(['']);
    const [menuErrorMessage, setMenuErrorMessage] = useState('');

    // Estado para datos de documentos para ingreso al hotel
    const [guestsData, setGuestsData] = useState([]);
    const [docErrorMessage, setDocErrorMessage] = useState('');

    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const observerRefs = useRef([]);
    const menuSectionRef = useRef(null);
    const docSectionRef = useRef(null);
    const menuCardsRef = useRef(null);
    const songInputRefs = useRef([]);

    // Detección de ruta /site y /menu vs /
    useEffect(() => {
        const checkRoute = () => {
            const path = window.location.pathname;
            setIsSiteRoute(path.includes('/site') || path.includes('/menu'));
            setIsMenuRoute(path.includes('/menu'));
        };
        checkRoute();
        window.addEventListener('popstate', checkRoute);
        return () => window.removeEventListener('popstate', checkRoute);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const familyParam = params.get('family') || params.get('famili');
        if (familyParam && familyParam.toLowerCase() === 'l') {
            setWhatsAppNumber('573013189286');
        } else {
            setWhatsAppNumber('573192146220');
        }

        // Parámetros assistant o assistants (ej: assistant=janeth,victor o david,lina,michael)
        const astRaw = params.get('assistant') || params.get('assistants') || params.get('asistente') || params.get('asistentes');
        const parsedAst = formatAssistantNames(astRaw);
        setAssistantName(parsedAst.text);

        // Parámetro total de menús seleccionables (default la cantidad de asistentes si existe, sino 1)
        const totParam = params.get('total');
        let validTotal = 1;
        if (totParam) {
            const parsedTot = parseInt(totParam, 10);
            validTotal = isNaN(parsedTot) || parsedTot < 1 ? 1 : parsedTot;
        } else if (parsedAst.list.length > 0) {
            validTotal = parsedAst.list.length;
        }
        setTotalMenusAllowed(validTotal);

        // Inicializar formularios de documentos asociando el nombre pre-llenado si existe
        setGuestsData(Array.from({ length: validTotal }, (_, i) => {
            const givenName = parsedAst.list[i];
            return {
                fullName: givenName || '',
                isFixedName: !!givenName,
                docType: 'CC',
                docNumber: ''
            };
        }));

        // Parámetro menus (ej: menus=1,2,3)
        const menusRaw = params.get('menus') || '1,2,3';
        const menuIds = menusRaw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

        const list = menuIds.map(id => {
            const found = MENU_CATALOGUE.find(m => m.id === id);
            return found || {
                id,
                title: `Menú ${id}`,
                menu: `· Entrada especial\n· Plato fuerte ${id}\n· Postre de la casa`
            };
        });
        setActiveMenus(list.length > 0 ? list : MENU_CATALOGUE.slice(0, 3));
    }, []);

    // Manejo de cambio en los datos de los asistentes
    const handleGuestChange = (index, field, value) => {
        const updated = [...guestsData];
        if (field === 'docNumber') {
            // Teclado numérico estricto: filtro únicamente dígitos
            updated[index][field] = value.replace(/\D/g, '');
        } else {
            updated[index][field] = value;
        }
        setGuestsData(updated);
        setDocErrorMessage('');
    };

    // Lógica para incrementar y decrementar menú
    const handleIncrementMenu = (id) => {
        const currentTotal = Object.values(selectedMenuCounts).reduce((a, b) => a + b, 0);
        const currentCountForId = selectedMenuCounts[id] || 0;

        if (currentTotal < totalMenusAllowed) {
            setSelectedMenuCounts(prev => ({
                ...prev,
                [id]: currentCountForId + 1
            }));
            setMenuErrorMessage('');
        }
    };

    const handleDecrementMenu = (id) => {
        const currentCountForId = selectedMenuCounts[id] || 0;
        if (currentCountForId > 0) {
            setSelectedMenuCounts(prev => ({
                ...prev,
                [id]: currentCountForId - 1
            }));
        }
    };

    // Funciones para el bloque de canciones con auto-focus al dar Enter
    const handleSongChange = (index, value) => {
        const updated = [...songs];
        updated[index] = value.slice(0, 100);
        setSongs(updated);
    };

    const handleAddSongRow = () => {
        if (songs.length < 8) {
            setSongs(prev => [...prev, '']);
            setTimeout(() => {
                const nextIndex = songs.length;
                if (songInputRefs.current[nextIndex]) {
                    songInputRefs.current[nextIndex].focus();
                }
            }, 50);
        }
    };

    const handleRemoveSongRow = (index) => {
        if (songs.length > 1) {
            setSongs(songs.filter((_, i) => i !== index));
        }
    };

    const handleSongKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (songs.length < 8) {
                const updated = [...songs];
                updated.splice(index + 1, 0, '');
                setSongs(updated);
                setTimeout(() => {
                    if (songInputRefs.current[index + 1]) {
                        songInputRefs.current[index + 1].focus();
                    }
                }, 50);
            }
        }
    };

    // Envío de información por WhatsApp con validaciones claras y específicas
    const handleSendPreferences = () => {
        // 1. Validar Documentos de Ingreso
        const completedGuests = guestsData.filter(
            g => g.fullName && g.fullName.trim().length > 0 && g.docNumber && g.docNumber.trim().length > 0
        );
        const missingDocs = totalMenusAllowed - completedGuests.length;

        if (missingDocs > 0) {
            const incompleteGuest = guestsData.find(g => !g.docNumber || g.docNumber.trim().length === 0);
            const missingName = incompleteGuest && incompleteGuest.isFixedName ? incompleteGuest.fullName : null;
            
            setDocErrorMessage(
                missingName
                    ? `⚠️ Hace falta ingresar el número de documento de ${missingName}. Por favor indícanos su cédula.`
                    : `⚠️ Hace falta completar los datos de ${missingDocs} ${missingDocs === 1 ? 'persona' : 'personas'} para el ingreso al hotel.`
            );
            setMenuErrorMessage('');
            if (docSectionRef.current) {
                docSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        setDocErrorMessage('');

        // 2. Validar Selección de Menú
        const totalSelected = Object.values(selectedMenuCounts).reduce((a, b) => a + b, 0);
        const missingMenus = totalMenusAllowed - totalSelected;

        if (missingMenus > 0) {
            setMenuErrorMessage(
                `⚠️ Hace falta seleccionar ${missingMenus} ${missingMenus === 1 ? 'menú' : 'menús'} por elegir. Por favor presiona los botones (+) de tu opción preferida.`
            );
            if (menuCardsRef.current) {
                menuCardsRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        setMenuErrorMessage('');

        // Destino de WhatsApp
        const params = new URLSearchParams(window.location.search);
        const familyParam = params.get('family') || params.get('famili');
        let targetPhone = '573192146220';
        if (familyParam && familyParam.trim().toLowerCase() === 'l') {
            targetPhone = '573013189286';
        }

        let text = assistantName ? `¡Hola Lina y David! Somos ${assistantName}.\n\n` : `¡Hola Lina y David! Confirmo nuestros datos para la boda:\n\n`;

        text += `🪪 *Datos para Ingreso al Hotel Wyndham:*\n`;
        guestsData.forEach((g, idx) => {
            text += `• ${g.fullName.trim()} (${g.docType}: ${g.docNumber.trim()})\n`;
        });

        text += `\n🍽️ *Elección de Menú:*\n`;
        activeMenus.forEach(m => {
            const count = selectedMenuCounts[m.id] || 0;
            if (count > 0) {
                text += `• ${m.title}: ${count} ${count === 1 ? 'opción' : 'opciones'}\n`;
            }
        });

        const validSongs = songs.map(s => s.trim()).filter(s => s.length > 0);
        if (validSongs.length > 0) {
            text += `\n🎵 *Sugerencias de canciones:*\n`;
            validSongs.forEach((song, idx) => {
                text += `${idx + 1}. ${song}\n`;
            });
        }

        const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

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
    }, [envelopeState, isSiteRoute]);

    // IntersectionObserver para reproducción automática del video al alcanzar el 40% de visibilidad (en bucle y mudo)
    useEffect(() => {
        if (!isSiteRoute || !videoRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
                        videoRef.current.play()
                            .catch((err) => console.log("Autoplay video info:", err));
                    } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                        if (videoRef.current && !videoRef.current.paused) {
                            videoRef.current.pause();
                        }
                    }
                });
            },
            { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0] }
        );

        observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, [isSiteRoute, envelopeState]);

    // Efecto para la cuenta regresiva (10 de Octubre a las 3:00 PM = 15:00:00)
    useEffect(() => {
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

        if (audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio bloqueado por el navegador"));
        }

        setEnvelopeState('unsealing');

        setTimeout(() => {
            setEnvelopeState('opening');
        }, 750);

        setTimeout(() => {
            setEnvelopeState('opened');
        }, 4750);
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

            {isSiteRoute && <AmbientSparkles />}

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
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          position: relative;
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 1s ease;
          padding: 0;
        }

        .flap-transition {
          transition: transform 4s cubic-bezier(0.25, 1, 0.5, 1), opacity 3.5s ease-in-out;
        }

        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-subtle-bounce {
          animation: subtle-bounce 3s infinite ease-in-out;
        }

        @keyframes ethereal-float {
          0%, 100% { transform: translateY(0) scale(1); text-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { transform: translateY(-8px) scale(1.02); text-shadow: 0 0 35px rgba(255,255,255,0.4); }
        }
        .animate-ethereal {
          animation: ethereal-float 6s ease-in-out infinite;
        }

        .floral-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M200 0C150 50 100 150 200 200C300 150 250 50 200 0Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M400 200C350 150 250 100 200 200C250 300 350 250 400 200Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M200 400C250 350 300 250 200 200C100 250 150 350 200 400Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3Cpath d='M0 200C50 250 150 300 200 200C150 100 50 150 0 200Z' fill='%23c5a059' fill-opacity='0.03'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }

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

            {/* Botón Flotante de Música con Ecualizador */}
            <button
                onClick={toggleMusic}
                className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-full bg-[#c5a059]/25 backdrop-blur-md border border-[#c5a059]/60 flex items-center gap-2 text-[#c5a059] shadow-lg hover:bg-[#c5a059]/40 transition-all duration-300 ${!isOpened && envelopeState === 'sealed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Reproducir o pausar música"
            >
                {isPlaying ? (
                    <>
                        <Music className="w-5 h-5 animate-pulse text-[#c5a059]" />
                        <span className="flex items-end gap-[2px] h-4">
                            <span className="w-[3px] bg-[#c5a059] animate-[bounce_1s_infinite_100ms] h-full rounded-full"></span>
                            <span className="w-[3px] bg-[#c5a059] animate-[bounce_1s_infinite_300ms] h-3 rounded-full"></span>
                            <span className="w-[3px] bg-[#c5a059] animate-[bounce_1s_infinite_200ms] h-4 rounded-full"></span>
                        </span>
                    </>
                ) : (
                    <Music2 className="w-5 h-5 opacity-60" />
                )}
            </button>

            {/* ================= SOBRE A PANTALLA COMPLETA ================= */}
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
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 wax-seal cursor-pointer transition-all duration-[1000ms] ease-in-out ${envelopeState === 'sealed' ? 'opacity-100 scale-100 hover:scale-110' : 'opacity-0 scale-150 pointer-events-none'}`}
                        aria-label="Abrir invitación"
                    >
                        <img src={waxSealImg} alt="Sello" className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]" />
                    </button>
                </div>
            </div>

            {/* ================= CONTENIDO DE LA INVITACIÓN ================= */}

            {/* SECCIÓN HERO */}
            {isSiteRoute ? (
                /* HERO PERSONALIZADO PARA /site: Imagen de playa horizontal y encabezado en el top 20% sin "desliza para descubrir" */
                <div className="relative h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-black">
                    <div
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out ${isOpening ? 'scale-100' : 'scale-110'}`}
                        style={{
                            backgroundImage: `url(${backgroundBeach})`,
                            backgroundPosition: 'center center',
                            filter: 'brightness(0.75) sepia(0.1)'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-[#fcfbf9] z-0" />

                    {/* Encabezado posicionado en el top 20% de altura */}
                    <div className="relative z-10 w-full h-[20vh] max-h-[170px] flex flex-col items-center justify-center pt-6 md:pt-8 px-4 text-center text-[#fcfbf9]">
                        <div className={`transition-all duration-[1500ms] delay-[1500ms] ${isOpening ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                            <p className="font-sans tracking-[0.35em] text-[10px] md:text-xs font-light uppercase border-b border-[#c5a059]/40 pb-1 px-3 mb-1 text-[#e8d0a9]">
                                Save the Date
                            </p>
                        </div>

                        <div className={`transition-all duration-[2000ms] delay-[1800ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="animate-ethereal">
                                <h1 className="font-script text-6xl md:text-7xl font-normal text-white drop-shadow-2xl leading-tight">
                                    Lina & David
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Parte inferior del Hero limpia sin texto de deslizar */}
                    <div className="relative z-10 pb-8 text-center" />
                </div>
            ) : (
                /* HERO ORIGINAL PARA RUTA / */
                <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
                    <div
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out ${isOpening ? 'scale-100' : 'scale-110'}`}
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
                            backgroundPosition: 'center 30%',
                            filter: 'brightness(0.65) sepia(0.15)'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fcfbf9] z-0"></div>

                    <div className="relative z-10 text-center text-[#fcfbf9] flex flex-col items-center h-full justify-between py-16 md:py-24 w-full px-6">
                        <div className="mt-16 space-y-8 flex flex-col items-center w-full">
                            <div className={`overflow-hidden transition-all duration-[1500ms] delay-[1500ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
                                <p className="font-sans tracking-[0.4em] text-xs md:text-sm font-light uppercase border-b border-[#c5a059]/40 pb-3 px-4">
                                    Save the Date
                                </p>
                            </div>

                            <div className={`transition-all duration-[2000ms] delay-[2000ms] ${isOpening ? 'opacity-100' : 'opacity-0'}`}>
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
            )}

            {/* SECCIÓN DETALLES DE LA BODA */}
            <div className="relative z-10 bg-[#fcfbf9] w-full floral-bg">
                {/* Adorno superior sutil */}
                <div className="w-full flex justify-center py-12 opacity-40">
                    <svg width="200" height="30" viewBox="0 0 200 30" fill="none" stroke="#c5a059" strokeWidth="0.5">
                        <path d="M0,15 Q50,0 100,15 T200,15" />
                        <circle cx="100" cy="15" r="3" fill="#c5a059" />
                    </svg>
                </div>

                <div className="max-w-5xl mx-auto px-4 md:px-6 pb-24 text-center">

                    {/* CUENTA REGRESIVA RECARGADA Y LLAMATIVA */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24 md:mb-32 max-w-4xl mx-auto px-2">
                        <div className="relative bg-gradient-to-b from-[#ffffff] via-[#fdfbf7] to-[#f8f3e9] border-2 border-[#c5a059]/40 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.25)] hover:shadow-[0_25px_60px_-10px_rgba(197,160,89,0.4)] transition-all duration-700 overflow-hidden group">
                            
                            {/* Brillo dorado decorativo */}
                            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />

                            {/* Insignia de encabezado */}
                            <div className="inline-flex items-center justify-center gap-2 bg-[#c5a059]/15 border border-[#c5a059]/40 rounded-full px-5 py-1.5 mb-6 text-[#a88a5e]">
                                <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
                                <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-[#a88a5e]">
                                    ¡FALTA MUY POCO PARA EL GRAN DÍA!
                                </span>
                                <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
                            </div>

                            <h3 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c2c2c] mb-8">
                                Cuenta Regresiva
                            </h3>

                            {/* Bloques de la Cuenta Regresiva */}
                            <div className={isSiteRoute ? "grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-xs sm:max-w-md md:max-w-3xl mx-auto" : "flex justify-center max-w-3xl mx-auto"}>
                                {[
                                    { label: 'Días', value: timeLeft.days },
                                    ...(isSiteRoute ? [
                                        { label: 'Horas', value: timeLeft.hours },
                                        { label: 'Minutos', value: timeLeft.minutes },
                                        { label: 'Segundos', value: timeLeft.seconds }
                                    ] : [])
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative bg-white/90 backdrop-blur-sm border-2 border-[#c5a059]/30 p-2 sm:p-4 aspect-square flex flex-col items-center justify-center shadow-[0_10px_25px_-8px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-3xl hover:border-[#c5a059] transition-all duration-500 hover:scale-105 group/card overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a059]/5 via-transparent to-[#c5a059]/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-none bg-gradient-to-b from-[#d4af37] via-[#c5a059] to-[#8b6f47] bg-clip-text text-transparent drop-shadow-sm group-hover/card:scale-110 transition-transform duration-300">
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                        <span className="font-sans text-[9px] sm:text-[11px] md:text-xs tracking-[0.2em] uppercase text-[#777] mt-1 sm:mt-2 font-medium text-center">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Introducción con Anillos */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-32 flex flex-col items-center">
                        <h2 className="font-script text-5xl md:text-6xl text-[#a88a5e] mb-6">Nuestra Boda</h2>

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

                                    <circle className="ring-left" cx="45" cy="45" r="22" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                                    <circle className="ring-right" cx="75" cy="45" r="22" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                                    <path className="ring-left-over" d="M 60 28.91 A 22 22 0 0 1 60 61.09" fill="none" stroke="url(#gold-grad)" strokeWidth="2.5" />
                                    <path className="sparkle-effect" d="M60 21 L61.5 27.5 L68 29 L61.5 30.5 L60 37 L58.5 30.5 L52 29 L58.5 27.5 Z" fill="#fff" />
                                </svg>
                            </div>
                        </div>

                        <p className="font-serif text-xl md:text-3xl leading-relaxed max-w-2xl mx-auto italic text-[#5a5a5a] font-light">
                            Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que amas los hace inolvidables.
                        </p>
                        <div className="w-24 h-[1px] bg-[#c5a059]/40 mt-12"></div>
                    </div>

                    {/* Tarjeta de Fecha & Horario */}
                    <div className="max-w-xl mx-auto mb-24">
                        <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out flex flex-col items-center">
                            <span className="font-sans text-[#c5a059] tracking-[0.3em] text-xs uppercase mb-6">Cuándo</span>
                            <div className="w-full bg-white p-10 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#f0e6d2]/50 hover:border-[#c5a059]/30 transition-colors duration-500 rounded-2xl flex flex-col justify-center min-h-[280px]">
                                <CalendarClock className="w-10 h-10 mx-auto text-[#c5a059] mb-6" strokeWidth={1} />
                                <p className="font-serif text-3xl md:text-4xl mb-2 text-[#2c2c2c]">Sábado, 10 de Octubre</p>
                                <p className="font-sans text-xs md:text-sm tracking-[0.2em] text-[#a88a5e] mt-2 uppercase font-medium">3:00 PM – 8:00 PM</p>
                                <p className="font-sans text-xs tracking-[0.2em] text-[#888] mt-4 uppercase">Dos mil veintiséis</p>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN UBICACIÓN Y MAPA INTERACTIVO (En /site y /menu, pero sin mapa en /menu) */}
                    {isSiteRoute && (
                        <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-28 max-w-4xl mx-auto">
                            <div className="bg-white border border-[#c5a059]/30 rounded-2xl p-6 md:p-12 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)] text-center relative overflow-hidden">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c5a059]/10 text-[#c5a059] mb-6">
                                    <MapPin className="w-7 h-7 animate-bounce" strokeWidth={1.5} />
                                </div>

                                <span className="font-sans text-[#c5a059] tracking-[0.3em] text-xs uppercase mb-2 block font-medium">Ubicación del Evento</span>
                                <h2 className="font-script text-5xl md:text-6xl text-[#2c2c2c] mb-8">Recepción & Celebración</h2>
                                <p className="font-serif text-2xl md:text-4xl mb-2 text-[#2c2c2c]">Hotel Wyndham Bogotá</p>
                                <p className="font-serif text-2xl md:text-4xl mb-6 text-[#2c2c2c]">Ac. 24 # 51 - 40</p>
                                
                                {/* MAPA EMBEBIDO GOOGLE MAPS (Escondido únicamente en la ruta /menu) */}
                                {!isMenuRoute && (
                                    <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-inner border border-[#e8d0a9] mb-8 group">
                                        <iframe
                                            title="Ubicación de la Boda"
                                            src="https://maps.google.com/maps?q=4.638632,-74.098044&z=16&output=embed"
                                            className="w-full h-full border-0 filter saturate-[0.95]"
                                            loading="lazy"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {/* ÚNICO BOTÓN: ABRIR EN GOOGLE MAPS */}
                                <div className="flex items-center justify-center">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=4.638632,-74.098044"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#a88a5e] text-white px-8 py-4 rounded-full font-sans text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        <span>Abrir en Google Maps</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN CRONOGRAMA DE ITINERARIO (En todas las rutas: /, /site, /menu) */}
                    <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24 max-w-3xl mx-auto px-2 md:px-4">
                        <span className="font-sans text-[#c5a059] tracking-[0.3em] text-xs uppercase mb-3 block">Cronograma</span>
                        <h2 className="font-script text-5xl md:text-6xl text-[#2c2c2c] mb-16">Itinerario del Día</h2>

                        <div className="relative max-w-2xl mx-auto py-2">
                            {/* Eje vertical central sólido */}
                            <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-[#c5a059]/60 -translate-x-1/2" />

                            <div className="space-y-12 md:space-y-16">
                                {[
                                    {
                                        time: '3:00 PM',
                                        title: 'Recepción',
                                        leftType: 'icon',
                                        fallbackIcon: <LineArtReception />,
                                        rightType: 'text'
                                    },
                                    {
                                        time: '3:30 PM',
                                        title: 'Ceremonia de Boda',
                                        leftType: 'text',
                                        rightType: 'icon',
                                        fallbackIcon: <LineArtWeddingArch />
                                    },
                                    {
                                        time: '4:30 PM',
                                        title: 'Brindis & Sesión de Fotos',
                                        leftType: 'icon',
                                        fallbackIcon: <LineArtToast />,
                                        rightType: 'text'
                                    },
                                    {
                                        time: '5:00 PM',
                                        title: 'Cena & Celebración',
                                        leftType: 'text',
                                        rightType: 'icon',
                                        fallbackIcon: <LineArtDinner />
                                    },
                                    {
                                        time: '8:00 PM',
                                        title: 'Cierre de Evento',
                                        leftType: 'icon',
                                        fallbackIcon: <LineArtClosure />,
                                        rightType: 'text'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative flex items-center justify-between w-full min-h-[70px]">

                                        {/* Corazón decorativo en el eje central */}
                                        <div className="absolute left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-[#fcfbf9] border border-[#c5a059] flex items-center justify-center shadow-sm">
                                            <Heart className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]/30" />
                                        </div>

                                        {/* Lado Izquierdo */}
                                        <div className="w-[43%] text-right pr-4 md:pr-8 flex justify-end items-center">
                                            {item.leftType === 'text' ? (
                                                <div>
                                                    <span className="font-serif text-lg md:text-2xl text-[#2c2c2c] font-medium block">
                                                        {item.time} · {item.title}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 md:w-14 md:h-14 aspect-square flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={getItinerarioImageUrl(idx + 1)}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden items-center justify-center w-full h-full">
                                                        {item.fallbackIcon}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lado Derecho */}
                                        <div className="w-[43%] text-left pl-4 md:pl-8 flex justify-start items-center">
                                            {item.rightType === 'text' ? (
                                                <div>
                                                    <span className="font-serif text-lg md:text-2xl text-[#2c2c2c] font-medium block">
                                                        {item.time} · {item.title}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 md:w-14 md:h-14 aspect-square flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={getItinerarioImageUrl(idx + 1)}
                                                        alt={item.title}
                                                        className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden items-center justify-center w-full h-full">
                                                        {item.fallbackIcon}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN DRESS CODE (Ubicada inmediatamente después de Itinerario) */}
                    <div className="relative w-full py-24 my-12 flex items-center justify-center overflow-hidden rounded-3xl shadow-xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                            style={{
                                backgroundImage: `url(${dressCodeImg})`,
                                filter: 'brightness(0.35) sepia(0.15)'
                            }}
                        />
                        <div ref={addToRefs} className="relative z-10 opacity-0 translate-y-16 transition-all duration-1000 ease-out text-center px-6 max-w-4xl mx-auto">
                            <span className="font-sans text-[#e8d0a9] tracking-[0.3em] text-xs uppercase mb-4 block font-medium">Código de Vestimenta</span>
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

                    {/* SECCIÓN ELECCIÓN DE MENÚ, REGISTRO DE DOCUMENTOS Y RECOMENDACIÓN MUSICAL (Solo en /menu) */}
                    {isMenuRoute && (
                        <div ref={(el) => { addToRefs(el); menuSectionRef.current = el; }} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-28 max-w-5xl mx-auto px-4 mt-16">
                            {/* ENCABEZADO PERSONALIZADO PARA EL ASISTENTE */}
                            <div className="text-center mb-12">
                                {assistantName && (
                                    <h2 className="font-script text-5xl md:text-7xl text-[#2c2c2c] mb-3">
                                        {assistantName}
                                    </h2>
                                )}
                                <p className="font-serif text-lg md:text-xl text-[#5a5a5a] max-w-2xl mx-auto leading-relaxed">
                                    ¡Ayúdanos a consentirte! ❤️ Queremos que cada detalle esté a tu gusto.
                                </p>
                            </div>

                            {/* BLOQUE REGISTRO DE DOCUMENTOS PARA INGRESO AL HOTEL */}
                            <div ref={docSectionRef} className="bg-white border border-[#c5a059]/30 rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] max-w-3xl mx-auto mb-16 text-center">
                                <span className="font-sans text-[#c5a059] tracking-[0.25em] text-xs uppercase mb-2 block font-semibold">
                                    Ingreso al Hotel Wyndham
                                </span>
                                <h3 className="font-script text-4xl sm:text-5xl text-[#2c2c2c] mb-4">
                                    Registro de Asistentes
                                </h3>
                                <p className="font-serif italic text-base md:text-lg text-[#5a5a5a] mb-8 leading-relaxed max-w-2xl mx-auto">
                                    Para asegurar tu comodidad y un ingreso ágil al Hotel Wyndham Bogotá, por favor indícanos los datos de identificación de los asistentes ({totalMenusAllowed} {totalMenusAllowed === 1 ? 'persona' : 'personas'}). Recuerda presentar tu documento físico el día de nuestra boda.
                                </p>

                                {/* Mensaje de error para documentos */}
                                {docErrorMessage && (
                                    <div className="mb-8 p-4 bg-amber-100 border-2 border-amber-400 text-amber-950 font-sans text-sm md:text-base font-medium rounded-2xl shadow-md animate-bounce flex items-center justify-center gap-2">
                                        <span>⚠️</span>
                                        <span>{docErrorMessage}</span>
                                    </div>
                                )}

                                <div className="space-y-8 text-left">
                                    {guestsData.map((guest, idx) => (
                                        <div key={idx} className="bg-[#fdfbf7] border border-[#e8d0a9] rounded-2xl p-5 sm:p-6 shadow-sm">
                                            <h4 className="font-serif text-xl font-semibold text-[#2c2c2c] mb-4 flex items-center gap-2 border-b border-[#e8d0a9]/60 pb-2">
                                                <span className="w-6 h-6 rounded-full bg-[#c5a059] text-white text-xs font-sans flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span>
                                                    {guest.fullName && guest.fullName.trim()
                                                        ? `Datos de ${guest.fullName.trim()}`
                                                        : `Datos del Asistente ${idx + 1}`}
                                                </span>
                                            </h4>

                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                                {/* Nombre Completo (únicamente visible si no viene pre-llenado en la URL) */}
                                                {!guest.isFixedName && (
                                                    <div className="sm:col-span-12">
                                                        <label className="block font-sans text-xs tracking-wider uppercase text-[#777] mb-1 font-medium">
                                                            Nombre Completo
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={guest.fullName}
                                                            onChange={(e) => handleGuestChange(idx, 'fullName', e.target.value)}
                                                            placeholder="Ej. María Josefa Pérez"
                                                            className="w-full bg-white border border-[#e8d0a9] rounded-xl px-4 py-2.5 font-sans text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c5a059] transition-colors"
                                                        />
                                                    </div>
                                                )}

                                                {/* Tipo de Documento */}
                                                <div className="sm:col-span-4">
                                                    <label className="block font-sans text-xs tracking-wider uppercase text-[#777] mb-1 font-medium">
                                                        Tipo Documento
                                                    </label>
                                                    <select
                                                        value={guest.docType}
                                                        onChange={(e) => handleGuestChange(idx, 'docType', e.target.value)}
                                                        className="w-full bg-white border border-[#e8d0a9] rounded-xl px-3 py-2.5 font-sans text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c5a059] transition-colors"
                                                    >
                                                        <option value="CC">Cédula (CC)</option>
                                                        <option value="CE">Cédula Extranjería (CE)</option>
                                                        <option value="PA">Pasaporte (PA)</option>
                                                        <option value="TI">Tarjeta Identidad (TI)</option>
                                                    </select>
                                                </div>

                                                {/* Número de Documento (Teclado numérico estricto) */}
                                                <div className="sm:col-span-8">
                                                    <label className="block font-sans text-xs tracking-wider uppercase text-[#777] mb-1 font-medium">
                                                        Número de Documento (Sólo números)
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={guest.docNumber}
                                                        onChange={(e) => handleGuestChange(idx, 'docNumber', e.target.value)}
                                                        placeholder="Ej. 10203040"
                                                        className="w-full bg-white border border-[#e8d0a9] rounded-xl px-4 py-2.5 font-sans text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c5a059] transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECCIÓN ELECCIÓN DE OPCIONES DE MENÚ */}
                            <div ref={menuCardsRef} className="text-center mb-12">
                                <span className="font-sans text-[#c5a059] tracking-[0.25em] text-xs uppercase mb-2 block font-semibold">
                                    Banquete de Bodas
                                </span>
                                <h3 className="font-script text-4xl sm:text-5xl text-[#2c2c2c] mb-3">
                                    Elección de Menú
                                </h3>
                                <p className="font-serif italic text-base md:text-lg text-[#888888]">
                                    Descubre nuestras opciones y elige las {totalMenusAllowed} {totalMenusAllowed === 1 ? 'opción' : 'opciones'} para tu mesa
                                </p>

                                {/* Indicador de cuota de selección */}
                                <div className="mt-4 inline-block bg-[#f7f3eb] border border-[#c5a059]/30 rounded-full px-5 py-1.5 font-sans text-xs text-[#a88a5e] font-semibold">
                                    Seleccionados: {Object.values(selectedMenuCounts).reduce((a, b) => a + b, 0)} / {totalMenusAllowed} {totalMenusAllowed === 1 ? 'menú' : 'menús'}
                                </div>

                                {/* Mensaje de error para menús */}
                                {menuErrorMessage && (
                                    <div className="mt-6 p-4 bg-amber-100 border-2 border-amber-400 text-amber-950 font-sans text-sm md:text-base font-medium rounded-2xl shadow-md animate-bounce inline-flex items-center gap-2">
                                        <span>⚠️</span>
                                        <span>{menuErrorMessage}</span>
                                    </div>
                                )}
                            </div>

                            {/* TARJETAS DE MENÚ */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                                {activeMenus.map((item) => {
                                    const count = selectedMenuCounts[item.id] || 0;
                                    const totalSelected = Object.values(selectedMenuCounts).reduce((a, b) => a + b, 0);

                                    return (
                                        <div
                                            key={item.id}
                                            className={`relative bg-white border p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-between items-center text-center group ${count > 0 ? 'border-[#c5a059] ring-2 ring-[#c5a059]/40' : 'border-[#e8d0a9]/60 hover:border-[#c5a059]/50'}`}
                                        >
                                            {/* Contador badge si fue seleccionado */}
                                            {count > 0 && (
                                                <div className="absolute -top-3 -right-3 bg-[#c5a059] text-white font-sans text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
                                                    x{count}
                                                </div>
                                            )}

                                            {/* 1. TEXTO TÍTULO */}
                                            <h3 className="font-serif text-2xl md:text-3xl text-[#2c2c2c] font-semibold mb-2">
                                                {item.title}
                                            </h3>

                                            {/* 2. IMAGEN PNG SIN FONDO (solo el plato) */}
                                            <div className="w-40 h-40 md:w-48 md:h-48 my-3 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={getMenuImageUrl(item.id)}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23c5a059" stroke-width="1.2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 7v10M7 12h10"/></svg>';
                                                    }}
                                                />
                                            </div>

                                            {/* 3. MENU DETALLADO EN FUENTE MÁS LIVIANA */}
                                            <div className="font-sans text-xs md:text-sm text-[#777777] font-light leading-relaxed whitespace-pre-line my-2 border-t border-[#f0e6d2] pt-3 w-full">
                                                {item.menu}
                                            </div>

                                            {/* CONTROLES BOTONES + Y - */}
                                            <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-[#f0e6d2] w-full">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrementMenu(item.id)}
                                                    disabled={count === 0}
                                                    className="w-9 h-9 rounded-full border border-[#c5a059] flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#c5a059] transition-colors"
                                                    title="Restar menú"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="font-serif text-xl text-[#2c2c2c] font-semibold w-8 text-center">
                                                    {count}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrementMenu(item.id)}
                                                    disabled={totalSelected >= totalMenusAllowed}
                                                    className="w-9 h-9 rounded-full border border-[#c5a059] flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#c5a059] transition-colors"
                                                    title="Sumar menú"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* BLOQUE RECOMENDACIÓN DE MÚSICA */}
                            <div className="bg-white border border-[#c5a059]/30 rounded-3xl p-6 md:p-10 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] max-w-2xl mx-auto text-center">
                                <h3 className="font-script text-4xl md:text-5xl text-[#2c2c2c] mb-3">Recomendación Musical</h3>
                                <p className="font-serif italic text-base md:text-lg text-[#5a5a5a] mb-8 leading-relaxed">
                                    Queremos que la música refleje lo especial que eres para nosotros. Dinos los nombres de las canciones que deseas escuchar
                                </p>

                                <div className="space-y-3 mb-6">
                                    {songs.map((song, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                ref={(el) => (songInputRefs.current[idx] = el)}
                                                value={song}
                                                maxLength={100}
                                                onChange={(e) => handleSongChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleSongKeyDown(e, idx)}
                                                placeholder={`Nombre de canción ${idx + 1}`}
                                                className="flex-1 bg-[#fcfbf9] border border-[#e8d0a9] rounded-xl px-4 py-2.5 font-sans text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c5a059] transition-colors"
                                            />
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSongRow(idx)}
                                                    className="p-2 text-[#888] hover:text-red-500 transition-colors"
                                                    title="Eliminar canción"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {songs.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={handleAddSongRow}
                                        className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider text-[#c5a059] hover:text-[#a88a5e] uppercase font-semibold border border-[#c5a059]/40 hover:border-[#c5a059] px-5 py-2.5 rounded-full transition-all duration-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Agregar otra canción</span>
                                    </button>
                                )}

                                {/* BOTÓN ENVIAR */}
                                <div className="mt-10">
                                    <button
                                        type="button"
                                        onClick={handleSendPreferences}
                                        className="inline-flex items-center justify-center gap-3 bg-[#c5a059] hover:bg-[#a88a5e] text-white px-9 py-4 rounded-full font-sans text-xs md:text-sm tracking-wider uppercase font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>Compartenos tus gustos!</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            {/* SECCIÓN FINAL Y CIERRE */}
            <div className="relative z-10 bg-[#fcfbf9] w-full floral-bg pb-24">
                <div className="max-w-3xl mx-auto px-6 text-center pt-24">

                    {isSiteRoute ? (
                        <div></div>
                        /* REEMPLAZO DE RSVP POR VIDEO FULL-WIDTH AUTOPLAY SIN CONTENEDOR MÓVIL NI BOTONES */
                     /*   <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24 w-full text-center">
                            <div className="bg-white py-10 md:py-14 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border-y border-[#c5a059]/30 w-full rounded-2xl overflow-hidden">
                                <div className="max-w-xl mx-auto px-6 mb-8">
                                    <span className="font-sans text-[#c5a059] tracking-[0.3em] text-xs uppercase mb-2 block font-medium">Nuestros Momentos</span>
                                    <h2 className="font-script text-5xl md:text-6xl text-[#2c2c2c]">Un Vistazo a Nuestra Historia</h2>
                                </div>
                                <div className="w-full relative bg-black overflow-hidden shadow-xl">
                                    <video
                                        ref={videoRef}
                                        src={weddingVideo}
                                        playsInline
                                        loop
                                        muted
                                        autoPlay
                                        className="w-full h-auto max-h-[85vh] object-cover mx-auto block"
                                    />
                                </div>

                                <div className="max-w-xl mx-auto px-6 mt-8">
                                    <p className="font-serif italic text-base text-[#666] font-light">
                                        El amor es el ingrediente principal de cada uno de nuestros días.
                                    </p>
                                </div>
                            </div>
                        </div>*/
                    ) : (
                        /* TARJETA DE CONFIRMACIÓN RSVP ORIGINAL PARA RUTA / */
                        <div ref={addToRefs} className="opacity-0 translate-y-16 transition-all duration-1000 ease-out mb-24">
                            <div className="bg-white p-10 md:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#c5a059]/20 rounded-sm">
                                <Heart className="w-8 h-8 mx-auto text-[#c5a059] mb-6 opacity-80" strokeWidth={1} />
                                <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c] mb-6">Confirmación de Asistencia</h2>
                                <p className="font-sans text-sm md:text-base text-[#5a5a5a] mb-10 leading-relaxed">
                                    Por favor, confirma tu asistencia antes del <br className="hidden md:block" />
                                    <strong className="text-[#a88a5e] font-semibold">15 de Agosto</strong>, indicando el número de personas.
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
                    )}

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