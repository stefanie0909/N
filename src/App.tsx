import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { Globe, Menu, X, ChevronDown, ArrowRight, Zap, Target, Leaf, Activity, Server, Cpu, Cloud, MapPin, Mail, Building2, Sparkles, Send, ChevronRight, Pause, Play } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { GoogleGenAI } from '@google/genai';

// --- Types & Translations ---
type Lang = 'zh' | 'en' | 'de' | 'vi' | 'th';

const translations = {
  zh: {
    nav: { home: '首页', products: '产品中心', cases: '案例中心', about: '关于我们', contact: '联系我们' },
    hero: { title: 'AI+能源驱动的', subtitle: '“零碳新质生产力”运营商', btn1: '探索解决方案', btn2: '了解我们' },
    stats: { gw: '累计运营可再生能源资产', kwh: '累计节约电能', co2: '累计减少碳排放', desc: '我们不仅提供能源解决方案，更构建可持续发展的底层能源能力。' },
    products: { title: '价值创造', filterAll: '全部', filterSmart: '智能设备', filterSoft: '软件系统', filterSol: '解决方案', matrix: '1+5 多维产品矩阵', sixDim: '六维建设体系', brands: '三大品牌服务' },
    cases: { title: '案例中心', all: '全部案例', factory: '零碳工厂', park: '零碳园区' },
    about: { title: '关于我们', vision: '核心愿景', positioning: '核心定位', focus: '聚焦领域', value: '客户价值', mapTitle: '全球化布局' },
    contact: { title: '联系我们', aiTitle: 'Aethravolt智能助手', aiPlaceholder: '描述您遇到的能源痛点（如：电费高、谐波多）...', aiBtn: '获取建议', hq: '全球总部', email: '联系邮箱' }
  },
  en: {
    nav: { home: 'Home', products: 'Products', cases: 'Cases', about: 'About', contact: 'Contact' },
    hero: { title: 'AI-Driven', subtitle: '"Zero-Carbon New Productive Forces" Operator', btn1: 'Explore Solutions', btn2: 'Discover Us' },
    stats: { gw: 'Renewable Energy Assets', kwh: 'Energy Saved', co2: 'Carbon Reduced', desc: 'We provide energy solutions and build sustainable underlying energy capabilities.' },
    products: { title: 'Value Creation', filterAll: 'All', filterSmart: 'Smart Devices', filterSoft: 'Software', filterSol: 'Solutions', matrix: '1+5 Product Matrix', sixDim: '6-Dimension System', brands: 'Three Brand Services' },
    cases: { title: 'Cases Center', all: 'All Cases', factory: 'Zero-Carbon Factory', park: 'Zero-Carbon Park' },
    about: { title: 'About Us', vision: 'Core Vision', positioning: 'Core Positioning', focus: 'Focus Areas', value: 'Customer Value', mapTitle: 'Global Layout' },
    contact: { title: 'Contact Us', aiTitle: 'Aethravolt Smart Assistant', aiPlaceholder: 'Describe your energy pain points (e.g., high bills, harmonics)...', aiBtn: 'Get Advice', hq: 'Global HQ', email: 'Email' }
  },
  de: { nav: { home: 'Startseite', products: 'Produkte', cases: 'Fälle', about: 'Über uns', contact: 'Kontakt' }, hero: { title: 'KI-gesteuerter', subtitle: '"Zero-Carbon New Productive Forces" Betreiber', btn1: 'Lösungen erkunden', btn2: 'Über uns' }, stats: { gw: 'Erneuerbare Energien', kwh: 'Energie gespart', co2: 'CO2 reduziert', desc: 'Wir bieten Energielösungen und bauen nachhaltige Energiefähigkeiten auf.' }, products: { title: 'Wertschöpfung', filterAll: 'Alle', filterSmart: 'Smart Devices', filterSoft: 'Software', filterSol: 'Lösungen', matrix: '1+5 Produktmatrix', sixDim: '6-Dimensionen-System', brands: 'Drei Markendienste' }, cases: { title: 'Fallzentrum', all: 'Alle Fälle', factory: 'Null-Kohlenstoff-Fabrik', park: 'Null-Kohlenstoff-Park' }, about: { title: 'Über uns', vision: 'Kernvision', positioning: 'Kernpositionierung', focus: 'Fokusbereiche', value: 'Kundenwert', mapTitle: 'Globales Layout' }, contact: { title: 'Kontakt', aiTitle: 'Aethravolt Smart Assistant', aiPlaceholder: 'Beschreiben Sie Ihre Energieprobleme...', aiBtn: 'Beratung erhalten', hq: 'Globales HQ', email: 'E-Mail' } },
  vi: { nav: { home: 'Trang chủ', products: 'Sản phẩm', cases: 'Dự án', about: 'Về chúng tôi', contact: 'Liên hệ' }, hero: { title: 'Điều khiển bằng AI', subtitle: 'Nhà điều hành "Lực lượng sản xuất mới không carbon"', btn1: 'Khám phá giải pháp', btn2: 'Khám phá chúng tôi' }, stats: { gw: 'Tài sản năng lượng tái tạo', kwh: 'Năng lượng tiết kiệm', co2: 'Carbon giảm', desc: 'Chúng tôi cung cấp giải pháp năng lượng và xây dựng khả năng năng lượng bền vững.' }, products: { title: 'Tạo giá trị', filterAll: 'Tất cả', filterSmart: 'Thiết bị thông minh', filterSoft: 'Phần mềm', filterSol: 'Giải pháp', matrix: 'Ma trận sản phẩm 1+5', sixDim: 'Hệ thống 6 chiều', brands: 'Ba dịch vụ thương hiệu' }, cases: { title: 'Trung tâm dự án', all: 'Tất cả dự án', factory: 'Nhà máy không carbon', park: 'Khu công nghiệp không carbon' }, about: { title: 'Về chúng tôi', vision: 'Tầm nhìn cốt lõi', positioning: 'Định vị cốt lõi', focus: 'Lĩnh vực trọng tâm', value: 'Giá trị khách hàng', mapTitle: 'Bố cục toàn cầu' }, contact: { title: 'Liên hệ', aiTitle: 'Trợ lý thông minh Aethravolt', aiPlaceholder: 'Mô tả các vấn đề năng lượng của bạn...', aiBtn: 'Nhận lời khuyên', hq: 'Trụ sở toàn cầu', email: 'Email' } },
  th: { nav: { home: 'หน้าแรก', products: 'ผลิตภัณฑ์', cases: 'กรณีศึกษา', about: 'เกี่ยวกับเรา', contact: 'ติดต่อเรา' }, hero: { title: 'ขับเคลื่อนด้วย AI', subtitle: 'ผู้ดำเนินการ "พลังการผลิตใหม่ไร้คาร์บอน"', btn1: 'สำรวจโซลูชัน', btn2: 'ค้นพบเรา' }, stats: { gw: 'สินทรัพย์พลังงานหมุนเวียน', kwh: 'ประหยัดพลังงาน', co2: 'ลดคาร์บอน', desc: 'เราจัดหาโซลูชันพลังงานและสร้างความสามารถด้านพลังงานที่ยั่งยืน' }, products: { title: 'การสร้างมูลค่า', filterAll: 'ทั้งหมด', filterSmart: 'อุปกรณ์อัจฉริยะ', filterSoft: 'ซอฟต์แวร์', filterSol: 'โซลูชัน', matrix: 'เมทริกซ์ผลิตภัณฑ์ 1+5', sixDim: 'ระบบ 6 มิติ', brands: 'สามบริการแบรนด์' }, cases: { title: 'ศูนย์กรณีศึกษา', all: 'กรณีศึกษาทั้งหมด', factory: 'โรงงานไร้คาร์บอน', park: 'สวนอุตสาหกรรมไร้คาร์บอน' }, about: { title: 'เกี่ยวกับเรา', vision: 'วิสัยทัศน์หลัก', positioning: 'ตำแหน่งหลัก', focus: 'พื้นที่โฟกัส', value: 'คุณค่าของลูกค้า', mapTitle: 'เค้าโครงระดับโลก' }, contact: { title: 'ติดต่อเรา', aiTitle: 'ผู้ช่วยอัจฉริยะ Aethravolt', aiPlaceholder: 'อธิบายปัญหาพลังงานของคุณ...', aiBtn: 'รับคำแนะนำ', hq: 'สำนักงานใหญ่ระดับโลก', email: 'อีเมล' } }
};

// --- Components ---

const AnimatedCounter = ({ value, suffix = '', duration = 2.5 }: { value: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutExpo * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref} className="font-mono tracking-tighter">{count}{suffix}</span>;
};

const MapChart = ({ lang }: { lang: Lang }) => {
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  
  const markerNames = {
    zh: {
      "Shenzhen": "深圳",
      "California": "加州",
      "Thailand": "泰国",
      "Germany": "德国",
      "Vietnam": "越南",
      "Australia": "澳大利亚"
    },
    en: {
      "Shenzhen": "Shenzhen",
      "California": "California",
      "Thailand": "Thailand",
      "Germany": "Germany",
      "Vietnam": "Vietnam",
      "Australia": "Australia"
    },
    de: {
      "Shenzhen": "Shenzhen",
      "California": "Kalifornien",
      "Thailand": "Thailand",
      "Germany": "Deutschland",
      "Vietnam": "Vietnam",
      "Australia": "Australien"
    },
    vi: {
      "Shenzhen": "Thâm Quyến",
      "California": "California",
      "Thailand": "Thái Lan",
      "Germany": "Đức",
      "Vietnam": "Việt Nam",
      "Australia": "Úc"
    },
    th: {
      "Shenzhen": "เซินเจิ้น",
      "California": "แคลิฟอร์เนีย",
      "Thailand": "ประเทศไทย",
      "Germany": "เยอรมนี",
      "Vietnam": "เวียดนาม",
      "Australia": "ออสเตรเลีย"
    }
  };

  const markers = [
    { name: "Shenzhen", coordinates: [114.0579, 22.5431] },
    { name: "California", coordinates: [-119.4179, 36.7783] },
    { name: "Thailand", coordinates: [100.9925, 15.8700] },
    { name: "Germany", coordinates: [10.4515, 51.1657] },
    { name: "Vietnam", coordinates: [108.2772, 14.0583] },
    { name: "Australia", coordinates: [133.7751, -25.2744] }
  ];

  return (
    <div className="w-full h-[400px] md:h-[600px] relative">
      <ComposableMap projectionConfig={{ scale: 140 }} className="w-full h-full opacity-60">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1A1A1A"
                stroke="#333333"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#2A2A2A", outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={6} fill="#00E5FF" className="animate-ping absolute" opacity={0.6} />
            <circle r={3} fill="#0066FF" />
            <text
              textAnchor="middle"
              y={name === "Vietnam" ? 15 : -12}
              x={name === "Vietnam" ? 10 : name === "Thailand" ? -15 : 0}
              style={{ fontFamily: "system-ui", fill: "#A0AEC0", fontSize: "12px", fontWeight: 500 }}
            >
              {markerNames[lang][name as keyof typeof markerNames['zh']]}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Lang>('zh');
  const [isBgPlaying, setIsBgPlaying] = useState(true);
  const t = translations[lang];
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // AI Diagnosis State
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiDiagnosis = async () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: `You are an AI energy consultant for AethraVolt (合擎源动), an AI-driven zero-carbon new productive forces operator.
        The user has the following energy pain points: "${aiInput}".
        Provide a concise, professional, and highly targeted solution using AethraVolt's 1+5 product matrix (AethraEdge, AethraPilot, AethraGrid, AethraCore) and 3 brand services (Aethra·臻电, Aethra·驭能, Aethra·绿擎).
        Keep the response under 150 words and format it nicely using Markdown. Respond in ${lang === 'zh' ? 'Chinese' : 'English'}.`,
      });
      setAiResponse(response.text || '分析完成，建议您联系我们的专家获取详细方案。');
    } catch (error) {
      console.error(error);
      setAiResponse('抱歉，AI 诊断暂时不可用，请直接联系我们的专家。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00E5FF] selection:text-black">
      
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center h-10 overflow-hidden relative w-64 cursor-pointer" onClick={() => scrollTo('home')}>
            <div className="text-2xl font-bold tracking-tighter text-white z-10 bg-[#0A0A0A]/20 backdrop-blur-sm pr-2 h-full flex items-center">AE</div>
            <AnimatePresence>
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-10 flex items-center h-full whitespace-nowrap"
                >
                  <motion.div
                    animate={{ x: [0, -120] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear", repeatType: "loop" }}
                    className="flex items-baseline space-x-2"
                  >
                    <span className="text-lg font-semibold text-white">Aethra<span className="text-[#00E5FF]">V</span>olt</span>
                    <span className="text-xs text-gray-400">合擎源动</span>
                    <span className="text-lg font-semibold text-white ml-8">Aethra<span className="text-[#00E5FF]">V</span>olt</span>
                    <span className="text-xs text-gray-400">合擎源动</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'products', 'cases', 'about', 'contact'].map((item) => (
              <button key={item} onClick={() => scrollTo(item)} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t.nav[item as keyof typeof t.nav]}
              </button>
            ))}
            
            {/* Lang Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white">
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 mt-2 w-32 glass-panel rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                {(['zh', 'en', 'de', 'vi', 'th'] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${lang === l ? 'text-[#00E5FF]' : 'text-gray-300'}`}>
                    {l === 'zh' ? '中文' : l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : l === 'vi' ? 'Tiếng Việt' : 'ไทย'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full glass-nav border-t border-white/5 py-4 px-6 flex flex-col space-y-4 md:hidden"
            >
              {['home', 'products', 'cases', 'about', 'contact'].map((item) => (
                <button key={item} onClick={() => scrollTo(item)} className="text-left text-lg font-medium text-gray-300 hover:text-white">
                  {t.nav[item as keyof typeof t.nav]}
                </button>
              ))}
              <div className="flex space-x-4 pt-4 border-t border-white/10">
                {(['zh', 'en', 'de', 'vi', 'th'] as Lang[]).map((l) => (
                  <button key={l} onClick={() => { setLang(l); setIsMobileMenuOpen(false); }} className={`uppercase text-sm font-medium ${lang === l ? 'text-[#00E5FF]' : 'text-gray-500'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop" 
            alt="Energy Storage Sunset" 
            className={`w-full h-full object-cover animate-kenburns ${isBgPlaying ? '' : '[animation-play-state:paused]'}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tight leading-tight mb-4 text-white"
          >
            {t.hero.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl font-light text-white mb-10"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-10 py-3 font-medium text-white bg-[#3E6AE1] hover:bg-[#3457B2] rounded-md transition-colors duration-300">
              {t.hero.btn1}
            </button>
            <button className="w-full sm:w-auto px-10 py-3 font-medium text-[#171A20] bg-white hover:bg-gray-200 rounded-md transition-colors duration-300">
              {t.hero.btn2}
            </button>
          </motion.div>
        </div>

        {/* Play/Pause Button */}
        <button 
          onClick={() => setIsBgPlaying(!isBgPlaying)}
          className="absolute bottom-8 left-8 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-sm transition-colors"
          aria-label={isBgPlaying ? "Pause background" : "Play background"}
        >
          {isBgPlaying ? <Pause className="w-5 h-5 text-white" fill="currentColor" /> : <Play className="w-5 h-5 text-white" fill="currentColor" />}
        </button>
      </section>

      {/* --- Products Center --- */}
      <section id="products" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-widest mb-16 text-center">{t.products.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="text-6xl md:text-8xl font-thin text-white group-hover:text-[#00E5FF] transition-colors duration-500">
                  <AnimatedCounter value={1} suffix="GW+" />
                </div>
                <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest">{t.stats.gw}</p>
              </div>
              <div className="group">
                <div className="text-6xl md:text-8xl font-thin text-white group-hover:text-[#00E5FF] transition-colors duration-500">
                  <AnimatedCounter value={5} suffix="亿度" />
                </div>
                <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest">{t.stats.kwh}</p>
              </div>
              <div className="group">
                <div className="text-6xl md:text-8xl font-thin text-white group-hover:text-[#00E5FF] transition-colors duration-500">
                  <AnimatedCounter value={30} suffix="万吨" />
                </div>
                <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest">{t.stats.co2}</p>
              </div>
            </div>
            <p className="text-center mt-16 text-xl text-gray-400 font-light">{t.stats.desc}</p>
          </motion.div>

          {/* 1+5 Matrix & 6-Dimension */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
            <ExpandableCard title={t.products.matrix} desc={t.products.matrix} icon={<Cpu className="w-8 h-8 text-[#00E5FF]" />}>
              <div className="space-y-4 mt-6">
                <div className="p-4 glass-panel rounded-xl border-l-2 border-[#00E5FF]">
                  <h4 className="font-medium text-white">AethraCore AI 模型</h4>
                  <p className="text-sm text-gray-400 mt-1">能源中枢Agent，全域智能调度核心</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['AethraEdge 边缘控制', 'AethraPilot 智能控制', 'AethraGrid 能源云', '擎碳 管理平台', '擎维 运维平台'].map((item, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg text-sm text-gray-300">{item}</div>
                  ))}
                </div>
              </div>
            </ExpandableCard>

            <ExpandableCard title={t.products.sixDim} desc={t.products.sixDim} icon={<Target className="w-8 h-8 text-[#0066FF]" />}>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {['科学算碳', '源头减碳', '过程脱碳', '智能控碳', '协同降碳', '抵消披露'].map((item, i) => (
                  <div key={i} className="p-4 glass-panel rounded-xl flex items-center gap-3 group hover:bg-white/10 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#00E5FF] group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          </div>

          {/* Product Filter & List */}
          <div className="mb-32">
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {['all', 'smart', 'soft', 'sol'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-white text-black' : 'glass-panel text-gray-400 hover:text-white'}`}
                >
                  {filter === 'all' ? t.products.filterAll : filter === 'smart' ? t.products.filterSmart : filter === 'soft' ? t.products.filterSoft : t.products.filterSol}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductCard title="AethraEdge" desc="边缘能量控制器" category="smart" activeFilter={activeFilter} />
              <ProductCard title="AethraGrid" desc="能源管理云平台" category="soft" activeFilter={activeFilter} />
              <ProductCard title="零碳工厂整体解决方案" desc="端-边-云 架构落地" category="sol" activeFilter={activeFilter} />
            </div>
          </div>

          {/* 3 Brand Services */}
          <div>
            <h3 className="text-2xl font-light tracking-widest mb-12 text-center">{t.products.brands}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BrandCard 
                title="Aethra·臻电™" 
                desc="主动式电能治理" 
                features={['三相不平衡治理', '谐波抑制', '无功补偿', 'AI主动防御']}
                color="from-blue-500/20 to-cyan-500/20"
              />
              <BrandCard 
                title="Aethra·驭能™" 
                desc="AI驱动的能源自动驾驶" 
                features={['AI削峰填谷', '智能水蓄冷', 'VPP收益', '绿电最大化']}
                color="from-purple-500/20 to-blue-500/20"
              />
              <BrandCard 
                title="Aethra·绿擎™" 
                desc="碳管理与ESG合规" 
                features={['AethraGrid平台', 'EMS+MES联动', '碳足迹追踪', 'ESG合规服务']}
                color="from-emerald-500/20 to-cyan-500/20"
              />
            </div>
          </div>

        </div>
      </section>

      {/* --- Cases Center --- */}
      <section id="cases" className="py-32 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-widest mb-16 text-center">{t.cases.title}</h2>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {['all', 'factory', 'park'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-white text-black' : 'glass-panel text-gray-400 hover:text-white'}`}
              >
                {t.cases[filter as keyof typeof t.cases]}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {[
                { id: 'case1', title: "光储一体化项目", category: t.cases.factory, img: "https://picsum.photos/seed/solar1/800/600", filterCategory: "factory" },
                { id: 'case2', title: "绿电+水蓄冷项目", category: t.cases.factory, img: "https://picsum.photos/seed/factory2/800/600", filterCategory: "factory" },
                { id: 'case3', title: "光伏+污水处理项目", category: t.cases.park, img: "https://picsum.photos/seed/water3/800/600", filterCategory: "park" },
                { id: 'case4', title: "德国光储充一体化项目", category: t.cases.park, img: "https://picsum.photos/seed/germany4/800/600", filterCategory: "park" }
              ].filter(c => activeFilter === 'all' || activeFilter === c.filterCategory).map(c => (
                <CaseCard key={c.id} title={c.title} category={c.category} img={c.img} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* --- About Us --- */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0066FF]/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-widest mb-16 text-center">{t.about.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            <AboutCard title={t.about.vision} desc="以优质负荷为核心，以AI为引擎，成为全球领先的零碳新质生产力运营商" icon={<Globe />} />
            <AboutCard title={t.about.positioning} desc="AI+数据驱动的“零碳新质生产力”能源运营商" icon={<Target />} />
            <AboutCard title={t.about.focus} desc="低碳绿色能源、能源精益运营、ESG价值创造" icon={<Leaf />} />
            <AboutCard title={t.about.value} desc="省成本、创收益、高效率、ESG标杆" icon={<Activity />} />
          </div>

          <div className="glass-panel rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h3 className="text-2xl font-light tracking-widest mb-4">{t.about.mapTitle}</h3>
                <p className="text-gray-400 max-w-md">成立于2017年加州，2025年设立深圳总部。业务遍及中国、美国、德国、越南、泰国、澳大利亚。</p>
              </div>
            </div>
            <MapChart lang={lang} />
          </div>
        </div>
      </section>

      {/* --- Contact & Footer --- */}
      <section id="contact" className="pt-32 pb-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* AI Diagnosis */}
          <div className="mb-32 max-w-3xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-[#0066FF]" />
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-[#00E5FF]" />
                <h3 className="text-xl font-medium">{t.contact.aiTitle}</h3>
              </div>
              <div className="flex flex-col gap-4">
                <textarea 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={t.contact.aiPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF] transition-colors resize-none h-32"
                />
                <button 
                  onClick={handleAiDiagnosis}
                  disabled={isAnalyzing || !aiInput.trim()}
                  className="self-end flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  {t.contact.aiBtn}
                </button>
              </div>
              
              <AnimatePresence>
                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-6 bg-[#0066FF]/10 rounded-xl border border-[#0066FF]/30 text-sm text-gray-300 leading-relaxed"
                  >
                    <div className="prose prose-invert max-w-none">
                      {aiResponse.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold tracking-tighter text-white mb-6">Aethra<span className="text-[#00E5FF]">V</span>olt</div>
              <p className="text-gray-400 text-sm max-w-sm mb-8">
                AI+能源驱动的“零碳新质生产力”运营商。重塑能源世界，重新定义能源资产的运营方式。
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-6">{t.contact.hq}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>深圳南山区清华信息港科研楼</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>San Diego, California, USA</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-6">{t.contact.email}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href="mailto:info@aethravolt.com" className="hover:text-[#00E5FF] transition-colors">info@aethravolt.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 AethraVolt. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// --- Helper Components ---

const ExpandableCard = ({ title, desc, icon, children }: { title: string, desc: string, icon: React.ReactNode, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-3xl p-8 cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">{icon}</div>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProductCard = ({ title, desc, category, activeFilter }: { title: string, desc: string, category: string, activeFilter: string }) => {
  if (activeFilter !== 'all' && activeFilter !== category) return null;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-panel p-6 rounded-2xl group hover:border-[#00E5FF]/50 transition-colors"
    >
      <div className="w-12 h-12 bg-white/5 rounded-xl mb-6 flex items-center justify-center group-hover:bg-[#00E5FF]/10 transition-colors">
        <Server className="w-6 h-6 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
      </div>
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
};

const BrandCard = ({ title, desc, features, color }: { title: string, desc: string, features: string[], color: string }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="relative p-[1px] rounded-3xl overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative h-full bg-[#0A0A0A] rounded-[23px] p-8 flex flex-col">
        <h4 className="text-2xl font-light mb-2">{title}</h4>
        <p className="text-sm text-gray-400 mb-8">{desc}</p>
        <ul className="space-y-3 mt-auto">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const CaseCard = React.forwardRef<HTMLDivElement, { title: string, category: string, img: string }>(({ title, category, img }, ref) => {
  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500"
    >
      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-0 opacity-100 md:translate-y-8 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <span className="px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium rounded-full backdrop-blur-md mb-4 inline-block">{category}</span>
        <h3 className="text-2xl font-medium text-white flex items-center justify-between">
          {title}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out delay-100">
            <ChevronRight className="w-5 h-5" />
          </div>
        </h3>
      </div>
    </motion.div>
  );
});

const AboutCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition-colors"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-[#00E5FF]">
        {icon}
      </div>
      <h4 className="text-lg font-medium mb-3">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
};
