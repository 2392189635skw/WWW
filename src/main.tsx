import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Film,
  Flame,
  Globe2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Plus,
  ShieldCheck,
  X,
  Clock3,
  Building2,
  Factory,
  TrainFront,
  TreePine,
} from "lucide-react";
import {
  brand,
  categories,
  products,
  scenes,
  coating,
  referenceMaterials,
} from "./data";
import type { Lang, Product } from "./data";
import "./styles.css";

const Language = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (zh: string, en: string) => string;
}>({ lang: "zh", toggle: () => {}, t: (zh) => zh });
function useLang() {
  return useContext(Language);
}
function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("fireproof-language") === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem("fireproof-language", lang);
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [lang]);
  return (
    <Language.Provider
      value={{
        lang,
        toggle: () => setLang((v) => (v === "zh" ? "en" : "zh")),
        t: (zh, en) => (lang === "zh" ? zh : en),
      }}
    >
      {children}
    </Language.Provider>
  );
}
const nav = [
  ["/", "首页", "Home"],
  ["/products", "产品展示", "Products"],
  ["/technology", "演示与资料", "Resources"],
  ["/applications", "应用场景", "Applications"],
  ["/contact", "联系我们", "Contact"],
];
function Logo({ footer = false }: { footer?: boolean }) {
  const { t } = useLang();
  return (
    <Link
      to="/"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label={t("防火材料首页", "Fireproof Materials home")}
    >
      <span className="brand-symbol">
        <Flame size={29} strokeWidth={1.7} />
      </span>
      <span>
        <strong>{t(brand.zh, brand.en)}</strong>
        <small>{t("FIREPROOF MATERIALS", "PASSIVE FIRE PROTECTION")}</small>
      </span>
    </Link>
  );
}
function handleSectionLink(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const id = event.currentTarget.getAttribute("href")?.slice(1) || "main";
  const target = document.getElementById(id);
  target?.scrollIntoView();
  if (id === "main") target?.focus({ preventScroll: true });
}
function Header() {
  const { t, toggle, lang } = useLang();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname, loc.search]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav
          className={`main-nav ${open ? "is-open" : ""}`}
          id="main-navigation"
          aria-label={t("主导航", "Main navigation")}
        >
          {nav.map(([path, zh, en]) => (
            <NavLink key={path} to={path} end={path === "/"}>
              {t(zh, en)}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            onClick={toggle}
            aria-label={t("Switch to English", "切换到中文")}
          >
            <Globe2 size={15} />
            <span>{lang === "zh" ? "EN" : "中文"}</span>
          </button>
          <Link className="button small header-cta" to="/contact">
            {t("获取解决方案", "Let’s talk")}
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle icon-button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={t(
              open ? "关闭导航" : "打开导航",
              open ? "Close menu" : "Open menu",
            )}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo footer />
          <p>
            {t(
              "让防护融入建筑，让安全经得起时间。",
              "Protection, built in. Confidence, built to last.",
            )}
          </p>
          <span className="footer-status">
            <i />
            {t("专注被动防火保护", "Focused on passive fire protection")}
          </span>
        </div>
        <div className="footer-links">
          <span className="overline">{t("探索更多", "EXPLORE")}</span>
          {nav.slice(1).map(([p, zh, en]) => (
            <Link to={p} key={p}>
              {t(zh, en)}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
        <div className="footer-contact">
          <span className="overline">{t("保持联系", "GET IN TOUCH")}</span>
          <p>hello@fireproof.example</p>
          <span>
            {t("示例邮箱 · 尚未开通", "Example address · Not connected")}
          </span>
          <Link to="/contact" className="text-link light">
            {t("聊聊你的项目", "Tell us about your project")}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {t("防火材料", "FIREPROOF MATERIALS")}
        </span>
        <span>
          {t(
            "演示网站 · 产品、参数及场景均为示例，不构成认证或工程承诺。",
            "Demo website · Products, data and scenes are illustrative, not certified claims.",
          )}
        </span>
        <a
          href="#main"
          onClick={handleSectionLink}
          aria-label={t("返回顶部", "Back to top")}
        >
          {t("回到顶部", "Back to top")} ↑
        </a>
      </div>
    </footer>
  );
}
function Eyebrow({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={`eyebrow ${dark ? "on-dark" : ""}`}>
      <span />
      {children}
    </div>
  );
}
function Notice({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`demo-notice ${compact ? "compact" : ""}`}>
      <ShieldCheck size={17} />
      <span>
        {t(
          "以下产品与性能参数均为演示数据。实际选型须以有效检测报告、适用标准及项目设计为准。",
          "Products and performance figures are illustrative. Actual selection requires valid test reports, applicable standards and project-specific design.",
        )}
      </span>
    </div>
  );
}
function CTA() {
  const { t } = useLang();
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="overline">
            {t("从一层涂料，到一份安心", "START WITH THE RIGHT PROTECTION")}
          </span>
          <h2>
            {t("你的下一个项目，", "Your next project.")}
            <br />
            {t("值得更周全的防护。", "Consider every layer.")}
          </h2>
        </div>
        <Link to="/contact" className="button black">
          {t("与我们聊聊", "Let’s discuss your project")}
          <ArrowUpRight size={19} />
        </Link>
        <Flame className="cta-watermark" aria-hidden="true" />
      </div>
    </section>
  );
}
function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useLang();
  return (
    <Link className="product-card" to={`/products?product=${product.id}`}>
      <div className="product-visual">
        <span className="product-category">
          {categories[product.category][lang]}
        </span>
        <img
          src={`/images/${product.id.toLowerCase()}.svg`}
          alt={t(
            `${product.id} 防火涂料示例包装`,
            `${product.id} concept coating packaging`,
          )}
          loading="lazy"
        />
        <span className="product-open">
          <Plus size={20} />
        </span>
      </div>
      <div className="product-info">
        <div className="product-model">
          {product.id}
          <span>{t("示例产品", "CONCEPT")}</span>
        </div>
        <h3>{product.name[lang]}</h3>
        <p>{product.tag[lang]}</p>
        <div className="product-card-bottom">
          <span>
            {t("耐火时间示例", "Illustrative fire resistance")}
            <strong>
              {product.duration}
              <small> min</small>
            </strong>
          </span>
          <ArrowUpRight size={21} />
        </div>
      </div>
    </Link>
  );
}
function CoatingFeatures() {
  const { t, lang } = useLang();
  const icons = [Layers3, Film, Building2];
  return (
    <div className="coating-features">
      {coating.features.map((feature, index) => {
        const Icon = icons[index];
        return (
          <article className="coating-feature" key={feature.id}>
            <div className="coating-feature-top">
              <span>{feature.id}</span>
              <Icon size={25} strokeWidth={1.3} />
            </div>
            <h3>{feature.title[lang]}</h3>
            <p>{feature.description[lang]}</p>
            <span className="content-pending">
              {t("具体内容待补充", "Details to follow")}
            </span>
          </article>
        );
      })}
    </div>
  );
}
function FeaturedCoating() {
  const { t, lang } = useLang();
  return (
    <section className="section featured-coating" id="therma-clear">
      <div className="container flagship-grid">
        <div className="flagship-image">
          <img
            src="/images/coating-system.svg"
            alt={t(
              "涂层与基材层次的概念插画，非真实产品结构图",
              "Concept illustration of coating and substrate layers, not an actual product cross-section",
            )}
          />
          <span>{t("涂层概念示意", "COATING CONCEPT")}</span>
        </div>
        <div className="flagship-copy">
          <Eyebrow>{t("重点产品", "PRODUCT SPOTLIGHT")}</Eyebrow>
          <h2>{coating.name}</h2>
          <p>{coating.summary[lang]}</p>
          <div className="flagship-points">
            {coating.features.map((feature) => (
              <span key={feature.id}>
                <Check size={14} />
                {feature.title[lang]}
              </span>
            ))}
          </div>
          <div className="flagship-actions">
            <Link to="/technology#demonstration" className="button">
              {t("查看演示与资料", "Film & resources")}
              <ArrowUpRight size={17} />
            </Link>
            <Link to="/contact?product=THERMA-CLEAR" className="text-link">
              {t("咨询此产品", "Product enquiry")}
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="subtle-note">
            {t(
              "当前展示为布局示意，具体特点与性能将在资料确认后更新。",
              "Layout preview. Specific features and performance will be added after the source materials are confirmed.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
function VideoPanel({ dark = false }: { dark?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`coating-video ${dark ? "video-on-dark" : ""}`}>
      {coating.video.src ? (
        <video
          controls
          preload="metadata"
          playsInline
          src={coating.video.src}
          poster={coating.video.poster}
          aria-label={t(
            "THERMA CLEAR 产品演示视频",
            "THERMA CLEAR product demonstration video",
          )}
        >
          {t(
            "浏览器不支持视频播放。",
            "Your browser does not support video playback.",
          )}
        </video>
      ) : (
        <div className="video-placeholder">
          <img
            src={coating.video.poster}
            alt={t(
              "产品演示区占位插画",
              "Concept illustration for the product film area",
            )}
            loading="lazy"
          />
          <span className="video-stamp">
            THERMA CLEAR <span>/ PRODUCT FILM</span>
          </span>
          <div className="video-placeholder-caption">
            <span className="video-placeholder-icon">
              <Film size={28} strokeWidth={1.2} />
            </span>
            <strong>{t("产品演示视频", "The product, in motion.")}</strong>
            <p>{t("视频资料待补充", "Video to be added")}</p>
          </div>
          <span className="video-runtime">
            {t(
              "演示位置预留 · 暂无可播放视频",
              "RESERVED FILM AREA · NO VIDEO ADDED YET",
            )}
          </span>
        </div>
      )}
    </div>
  );
}
function ReferenceLibrary() {
  const { t, lang } = useLang();
  return (
    <section className="section reference-library" id="reference-materials">
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>{t("产品资料", "PRODUCT RESOURCES")}</Eyebrow>
            <h2>
              {t(
                "需要的资料，在这里找到。",
                "A little more detail, in one place.",
              )}
            </h2>
          </div>
          <p className="reference-intro">
            {t(
              "预留产品演示与介绍资料的位置，后续补充正式文件。",
              "A space for product presentations and films. Source files will be added here.",
            )}
          </p>
        </div>
        <div className="reference-grid">
          {referenceMaterials.map((material) => (
            <article className="reference-card" key={material.id}>
              <div className="reference-card-top">
                {material.type === "MP4" ? (
                  <Film size={25} strokeWidth={1.3} />
                ) : (
                  <FileText size={25} strokeWidth={1.3} />
                )}
                <span>{material.type}</span>
              </div>
              <h3>{material.title[lang]}</h3>
              <p>{material.description[lang]}</p>
              {material.href ? (
                <a href={material.href} download className="text-link">
                  {t("下载资料", "Download resource")}
                  <Download size={15} />
                </a>
              ) : (
                <span className="reference-status">
                  <Clock3 size={13} />
                  {t("资料待补充", "Resource to be added")}
                </span>
              )}
            </article>
          ))}
        </div>
        <p className="subtle-note">
          {t(
            "产品介绍与演示内容以最终确认资料为准。此处暂不提供未经确认的性能或认证信息。",
            "Product information and demonstrations will follow the confirmed source materials. No unverified performance or certification claims are provided here.",
          )}
        </p>
      </div>
    </section>
  );
}
function Home() {
  const { t } = useLang();
  return (
    <>
      <section className="home-hero coating-home">
        <div className="container hero-inner">
          <div className="hero-copy">
            <Eyebrow>{t("涂层产品 · 简明介绍", "COATING IN FOCUS")}</Eyebrow>
            <div className="hero-product-name">{coating.name}</div>
            <h1>
              {t("涂层的价值，", "A closer look.")}
              <br />
              <em>{t("一目了然。", "A clearer picture.")}</em>
            </h1>
            <p>
              {t(
                "聚焦产品特点、演示视频与应用方向。\n以更直观的方式，了解 THERMA CLEAR 涂层。",
                "Meet THERMA CLEAR through its key features, product demonstrations and application ideas. A simpler way to get to know the coating.",
              )}
            </p>
            <div className="hero-buttons">
              <Link to="/products#therma-clear" className="button">
                {t("了解产品", "Meet the coating")}
                <ArrowUpRight size={19} />
              </Link>
              <Link to="/technology#demonstration" className="hero-secondary">
                <Film size={17} />
                {t("演示与资料", "Film & resources")}
              </Link>
            </div>
            <div className="hero-caption">
              <span className="tiny-line" />
              {t("让产品成为主角。", "THE COATING TAKES CENTRE STAGE.")}
            </div>
          </div>
          <div className="hero-art coating-hero-art">
            <img
              src="/images/coating-system.svg"
              alt={t(
                "涂层与材料叠层概念插画，非真实测试画面",
                "Concept illustration of a coating and material layers, not a test image",
              )}
              fetchPriority="high"
            />
            <div className="hero-art-top">
              <span className="live-dot" />
              {t("材料 · 涂层 · 更多可能", "MATERIAL. COATING. POSSIBILITIES.")}
              <span>01 /</span>
            </div>
            <div className="hero-data-card coating-name-card">
              <span className="mini-icon">
                <Layers3 size={23} />
              </span>
              <div>
                <span>{t("认识我们的涂层", "MEET THE COATING")}</span>
                <strong>
                  THERMA
                  <br />
                  CLEAR
                </strong>
                <p>
                  {t(
                    "从特点开始，向应用延伸。",
                    "From features to possibilities.",
                  )}
                </p>
              </div>
              <ArrowUpRight size={22} />
            </div>
            <span className="hero-data-footnote">
              {t(
                "涂层概念示意 · 非实测画面",
                "CONCEPT ILLUSTRATION · NOT A TEST IMAGE",
              )}
            </span>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>01 /</span>
          <p>THERMA CLEAR / {t("产品介绍", "PRODUCT OVERVIEW")}</p>
          <a href="#protection" onClick={handleSectionLink}>
            {t("向下探索", "SCROLL TO EXPLORE")}
            <ArrowDown size={15} />
          </a>
        </div>
      </section>
      <section className="section coating-highlights" id="protection">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("核心看点", "THE ESSENTIALS")}</Eyebrow>
              <h2>
                {t("少一点繁杂，", "Keep it simple.")}
                <br />
                {t("多一点直观。", "Make it visual.")}
              </h2>
            </div>
            <div className="section-heading-aside">
              <p>
                {t(
                  "从特点、演示与应用三个角度，\n快速了解产品。",
                  "An introduction through three lenses: the coating, the demonstration and the application.",
                )}
              </p>
              <Link to="/products" className="text-link">
                {t("产品介绍", "Explore the product")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <CoatingFeatures />
        </div>
      </section>
      <section className="application-feature film-feature">
        <div className="container application-feature-inner">
          <div className="feature-copy">
            <Eyebrow dark>{t("产品演示", "SEE THE COATING")}</Eyebrow>
            <h2>
              {t("让演示，", "Let the film")}
              <br />
              {t("说明更多。", "tell the story.")}
            </h2>
            <p>
              {t(
                "用视频与图文呈现涂层的特点和表现，让产品介绍更清晰，也更容易理解。",
                "Bring the coating introduction to life with a concise film and supporting visuals.",
              )}
            </p>
            <span className="film-status">
              <span />
              {t("视频资料待补充", "Video to be added")}
            </span>
            <Link to="/technology#demonstration" className="button white">
              {t("前往演示与资料", "Explore film & resources")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <VideoPanel dark />
        </div>
      </section>
      <section className="section home-applications">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("应用方向", "PLACES & POSSIBILITIES")}</Eyebrow>
              <h2>{t("从材料，到空间。", "From material to space.")}</h2>
            </div>
            <Link className="text-link" to="/applications">
              {t("浏览应用场景", "Explore application ideas")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="application-preview-grid">
            {scenes.slice(0, 3).map((scene) => (
              <Link
                to={`/applications?scene=${scene.id}`}
                className="application-preview"
                key={scene.id}
              >
                <img
                  src={`/images/${scene.id}.svg`}
                  alt={t(
                    `${scene.title.zh}概念插画`,
                    `${scene.title.en} concept illustration`,
                  )}
                  loading="lazy"
                />
                <span>
                  <strong>{t(scene.title.zh, scene.title.en)}</strong>
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>
          <p className="subtle-note">
            {t(
              "场景为布局示例，具体适用范围待产品资料确认。",
              "Illustrative spaces only. Actual product suitability is to be confirmed.",
            )}
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
  number,
}: {
  eyebrow: string;
  title: string;
  description: string;
  number: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="page-intro-row">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <span className="page-number">/{number}</span>
        </div>
      </div>
    </section>
  );
}
function ProductDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState("overview");
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = original;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="product-dialog"
      onCancel={onClose}
      aria-labelledby="product-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close icon-button"
        onClick={onClose}
        aria-label={t("关闭产品详情", "Close product details")}
      >
        <X />
      </button>
      <div className="dialog-layout">
        <div className="dialog-image">
          <img
            src={`/images/${product.id.toLowerCase()}.svg`}
            alt={t(
              `${product.id} 产品概念包装`,
              `${product.id} concept packaging`,
            )}
          />
          <span>{t("示例产品 · 概念包装", "CONCEPT PRODUCT & PACKAGING")}</span>
        </div>
        <div className="dialog-content">
          <Eyebrow>{categories[product.category][lang]}</Eyebrow>
          <div className="dialog-model">{product.id}</div>
          <h2 id="product-dialog-title">{product.name[lang]}</h2>
          <div
            className="tabs"
            role="tablist"
            aria-label={t("产品详情内容", "Product detail sections")}
          >
            {[
              ["overview", "产品概览", "Overview"],
              ["data", "性能参数", "Performance"],
              ["downloads", "资料下载", "Downloads"],
            ].map(([id, zh, en]) => (
              <button
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls="product-tab-panel"
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? "active" : ""}
                key={id}
                onClick={() => setTab(id)}
                onKeyDown={(e) => {
                  const tabs = ["overview", "data", "downloads"];
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      tabs[
                        (tabs.indexOf(id) + (e.key === "ArrowRight" ? 1 : 2)) %
                          3
                      ];
                    setTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
              >
                {t(zh, en)}
              </button>
            ))}
          </div>
          <div
            id="product-tab-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="dialog-panel"
          >
            {tab === "overview" ? (
              <>
                <p>{product.description[lang]}</p>
                <div className="product-features">
                  {product.features.map((f) => (
                    <span key={f.en}>
                      <Check size={14} />
                      {f[lang]}
                    </span>
                  ))}
                </div>
                <div className="overview-stat">
                  <span>
                    {t("耐火时间示例", "Illustrative fire resistance")}
                  </span>
                  <strong>
                    {product.duration}
                    <small> min</small>
                  </strong>
                </div>
              </>
            ) : tab === "data" ? (
              <dl className="spec-list">
                {[
                  [
                    t("耐火时间（示例）", "Fire resistance (illustrative)"),
                    `${product.duration} min`,
                  ],
                  [
                    t("干膜厚度（示例）", "Dry film thickness (illustrative)"),
                    `${product.thickness} mm`,
                  ],
                  [
                    t("密度（示例）", "Density (illustrative)"),
                    `${product.density} g/cm³`,
                  ],
                  [
                    t("用量（示例）", "Consumption (illustrative)"),
                    `${product.consumption} kg/m²`,
                  ],
                  [t("颜色", "Finish"), product.color[lang]],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <>
                <p>
                  {t(
                    "下载示例技术资料，了解产品信息和选型注意事项。资料不用于实际工程设计。",
                    "Download the concept technical sheet for product information and selection notes. Not for actual engineering design.",
                  )}
                </p>
                <a
                  className="download-row"
                  href={`/downloads/${product.id}-${lang}.pdf`}
                  download
                >
                  <FileText size={24} />
                  <span>
                    {t("示例技术资料", "Concept technical sheet")}
                    <small>
                      {product.id} · PDF · {lang === "zh" ? "中文" : "English"}
                    </small>
                  </span>
                  <Download size={20} />
                </a>
              </>
            )}
          </div>
          <Notice compact />
          <Link to={`/contact?product=${product.id}`} className="button full">
            {t("咨询此产品", "Discuss this coating")}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </dialog>
  );
}
function Products() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const filter = params.get("category") || "all";
  const selected = products.find((p) => p.id === params.get("product"));
  const visible = products.filter(
    (p) => filter === "all" || p.category === filter,
  );
  const [catalogOpen, setCatalogOpen] = useState(
    filter !== "all" || Boolean(selected),
  );
  useEffect(() => {
    if (selected || filter !== "all") setCatalogOpen(true);
  }, [filter, selected]);
  return (
    <>
      <PageIntro
        eyebrow={t("产品展示 / PRODUCTS", "OUR COATING SYSTEMS")}
        title={t("THERMA CLEAR 产品介绍", "Meet THERMA CLEAR.")}
        description={t(
          "先了解核心特点，再通过演示与资料认识产品。详细介绍后续补充。",
          "Start with a concise introduction, then explore the demonstrations and resources. More details will follow.",
        )}
        number="01"
      />
      <FeaturedCoating />
      <section className="section catalog-section secondary-section">
        <div className="container">
          <details
            className="example-disclosure"
            open={catalogOpen}
            onToggle={(event) => setCatalogOpen(event.currentTarget.open)}
          >
            <summary>
              <span>
                <Layers3 size={18} />
                {t("其他产品布局示例", "Example product layouts")}
              </span>
              <span className="disclosure-note">
                {t("非 THERMA CLEAR 产品资料", "NOT THERMA CLEAR PRODUCT DATA")}
                <ChevronDown size={16} />
              </span>
            </summary>
            <div className="container">
              <div className="filter-bar">
                <div
                  className="filter-list"
                  aria-label={t(
                    "按基材筛选产品",
                    "Filter products by substrate",
                  )}
                >
                  {Object.entries(categories).map(([id, name]) => (
                    <button
                      className={filter === id ? "active" : ""}
                      key={id}
                      aria-pressed={filter === id}
                      onClick={() =>
                        setParams(id === "all" ? {} : { category: id })
                      }
                    >
                      {name[lang]}
                      {filter === id && (
                        <span>
                          {id === "all"
                            ? products.length
                            : products.filter((p) => p.category === id).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <span className="result-count" aria-live="polite">
                  {t(
                    `共 ${visible.length} 款产品`,
                    `${visible.length} coatings`,
                  )}
                </span>
              </div>
              <div className="product-grid catalog-grid">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible.length === 0 && (
                <p>
                  {t(
                    "没有匹配的产品，请选择其他分类。",
                    "No matching products. Please select another category.",
                  )}
                </p>
              )}
              <Notice />
            </div>
          </details>
        </div>
      </section>
      <section className="container help-banner">
        <div>
          <FileText size={28} />
          <div>
            <h3>{t("直观了解，轻松交流。", "A clearer conversation.")}</h3>
            <p>
              {t(
                "查看产品演示与介绍资料，再聊聊你的应用需求。",
                "Explore the product films and resources, then tell us what you have in mind.",
              )}
            </p>
          </div>
        </div>
        <Link to="/technology" className="text-link">
          {t("查看演示与资料", "Explore resources")}
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <CTA />
      {selected && (
        <ProductDialog
          key={selected.id}
          product={selected}
          onClose={() => {
            const next = new URLSearchParams(params);
            next.delete("product");
            setParams(next, { replace: true });
          }}
        />
      )}
    </>
  );
}
function Technology() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState(products[0].id);
  const product = products.find((p) => p.id === selected)!;
  const rows = [
    {
      label: t("适用基材", "Substrate"),
      values: products.map((p) => categories[p.category][lang]),
    },
    {
      label: t("耐火时间示例", "Illustrative fire resistance"),
      values: products.map((p) => `${p.duration} min`),
    },
    {
      label: t("干膜厚度示例", "Illustrative dry film thickness"),
      values: products.map((p) => `${p.thickness} mm`),
    },
    {
      label: t("密度示例", "Illustrative density"),
      values: products.map((p) => `${p.density} g/cm³`),
    },
    {
      label: t("理论用量示例", "Illustrative consumption"),
      values: products.map((p) => `${p.consumption} kg/m²`),
    },
    {
      label: t("表面颜色", "Finish"),
      values: products.map((p) => p.color[lang]),
    },
    {
      label: t("使用环境", "Environment"),
      values: products.map(() => t("室内（示例）", "Interior (concept)")),
    },
  ];
  return (
    <>
      <PageIntro
        eyebrow={t("演示与资料 / RESOURCES", "FILM & PRODUCT RESOURCES")}
        title={t("认识涂层，从这里开始。", "Get to know the coating.")}
        description={t(
          "产品视频与介绍资料集中呈现，让重点更清晰。",
          "A dedicated space for product demonstrations and presentations. The essentials, together.",
        )}
        number="02"
      />
      <section className="section demonstration-section" id="demonstration">
        <div className="container demonstration-grid">
          <div>
            <Eyebrow>{t("产品视频", "PRODUCT FILM")}</Eyebrow>
            <h2>THERMA CLEAR</h2>
            <p>
              {t(
                "通过视频，了解产品的特点与演示过程。",
                "Explore the coating and its demonstration through a product film.",
              )}
            </p>
            <span className="content-pending">
              {t("视频待添加", "VIDEO TO FOLLOW")}
            </span>
          </div>
          <VideoPanel />
        </div>
      </section>
      <ReferenceLibrary />
      <section className="container secondary-technical">
        <details className="example-disclosure">
          <summary>
            <span>
              <FileText size={18} />
              {t("示例技术参数与下载", "Example technical data & downloads")}
            </span>
            <span className="disclosure-note">
              {t("非 THERMA CLEAR 产品资料", "NOT THERMA CLEAR PRODUCT DATA")}
              <ChevronDown size={16} />
            </span>
          </summary>
          <section className="section technical-section">
            <div className="container">
              <div className="table-heading">
                <div>
                  <span className="overline">
                    {t("产品性能对比", "COATING COMPARISON")}
                  </span>
                  <h2>{t("一览关键参数", "The key figures, together.")}</h2>
                </div>
                <a
                  href={`/downloads/product-comparison-${lang}.csv`}
                  download
                  className="button outline"
                >
                  <Download size={16} />
                  {t("下载参数表 CSV", "Download table · CSV")}
                </a>
              </div>
              <Notice />
              <div
                className="table-scroll"
                tabIndex={0}
                role="region"
                aria-label={t(
                  "产品参数对比表，可横向滚动",
                  "Product comparison table, scroll horizontally",
                )}
              >
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th scope="col">{t("技术指标", "Technical property")}</th>
                      {products.map((p) => (
                        <th scope="col" key={p.id}>
                          <span>{p.id}</span>
                          <small>{p.name[lang]}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        {row.values.map((v, i) => (
                          <td key={i}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="subtle-note">
                {t(
                  "手机端可左右滑动查看完整参数。耐火时间与涂层厚度并非一一对应，实际系统须经项目专项验证。",
                  "Swipe horizontally on smaller screens. Fire resistance and coating thickness are not directly interchangeable; actual systems need project-specific validation.",
                )}
              </p>
            </div>
          </section>
          <section className="resources-section section">
            <div className="container resources-grid">
              <div>
                <Eyebrow>{t("资料中心", "RESOURCE LIBRARY")}</Eyebrow>
                <h2>
                  {t("把专业资料，", "The detail you need.")}
                  <br />
                  {t("带到你的项目中。", "Ready to take away.")}
                </h2>
                <p>
                  {t(
                    "选择产品，下载相应语言的示例技术资料。正式资料、检测报告及安全数据表需在取得真实文件后补充。",
                    "Choose a coating and download its concept technical sheet in your current language. Verified technical reports and safety data sheets will be added when available.",
                  )}
                </p>
                <label className="field-label" htmlFor="resource-product">
                  {t("选择产品", "Choose a coating")}
                </label>
                <div className="select-wrap">
                  <select
                    id="resource-product"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.name[lang]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="resources-card">
                <span className="resource-code">
                  {product.id}
                  <FileText size={44} strokeWidth={1} />
                </span>
                <h3>{t("示例产品技术资料", "Concept technical data sheet")}</h3>
                <p>{product.name[lang]}</p>
                <div className="resource-meta">
                  <span>PDF</span>
                  <span>{lang === "zh" ? "中文" : "ENGLISH"}</span>
                  <span>{t("演示版本 1.0", "CONCEPT VERSION 1.0")}</span>
                </div>
                <a
                  href={`/downloads/${product.id}-${lang}.pdf`}
                  download
                  className="button full"
                >
                  {t("下载技术资料", "Download technical sheet")}
                  <Download size={18} />
                </a>
                <p className="subtle-note">
                  {t(
                    "仅供网站演示，不可用于工程设计或合规证明。",
                    "For website demonstration, not engineering design or compliance.",
                  )}
                </p>
              </div>
            </div>
          </section>
        </details>
      </section>
      <CTA />
    </>
  );
}
function Applications() {
  const { t, lang } = useLang();
  const [params, setParams] = useSearchParams();
  const active = scenes.find((s) => s.id === params.get("scene")) || scenes[0];
  const icons = [Building2, Factory, TrainFront, TreePine];
  const Icon = icons[scenes.indexOf(active)];
  return (
    <>
      <PageIntro
        eyebrow={t("应用场景 / APPLICATIONS", "PROTECTION IN CONTEXT")}
        title={t("走进建筑，理解每一种守护。", "Protection, in its element.")}
        description={t(
          "理解空间，才能理解防护。为不同类型建筑探索适配的涂层体系。",
          "Understand the space to understand the protection. Explore coating concepts for a range of architectural environments.",
        )}
        number="03"
      />
      <section className="section applications-section">
        <div className="container">
          <div
            className="scene-nav"
            role="tablist"
            aria-label={t("选择应用场景", "Choose an application")}
          >
            {scenes.map((s, i) => {
              const I = icons[i];
              return (
                <button
                  role="tab"
                  id={`scene-${s.id}`}
                  aria-controls="scene-panel"
                  aria-selected={active.id === s.id}
                  tabIndex={active.id === s.id ? 0 : -1}
                  className={active.id === s.id ? "active" : ""}
                  key={s.id}
                  onClick={() => setParams({ scene: s.id })}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault();
                      const next =
                        scenes[(i + (e.key === "ArrowRight" ? 1 : 3)) % 4];
                      setParams({ scene: next.id });
                      document.getElementById(`scene-${next.id}`)?.focus();
                    }
                  }}
                >
                  <I size={21} strokeWidth={1.4} />
                  <span>{s.title[lang]}</span>
                  <ArrowUpRight size={16} />
                </button>
              );
            })}
          </div>
          <div
            className="scene-detail"
            role="tabpanel"
            id="scene-panel"
            aria-labelledby={`scene-${active.id}`}
          >
            <div className="scene-image">
              <img
                key={active.id}
                src={`/images/${active.id}.svg`}
                alt={t(
                  `${active.title.zh}概念插画`,
                  `${active.title.en} concept illustration`,
                )}
              />
              <span>
                {t(
                  "应用概念示意 · 非真实项目案例",
                  "CONCEPT ILLUSTRATION · NOT A COMPLETED PROJECT",
                )}
              </span>
            </div>
            <div className="scene-copy">
              <span className="scene-index">
                {active.n}
                <Icon size={33} strokeWidth={1} />
              </span>
              <h2>{active.subtitle[lang]}</h2>
              <p>{active.description[lang]}</p>
              <div className="scene-tags">{active.tags[lang]}</div>
              <div className="recommended">
                <span>{t("相关示例产品", "RELATED CONCEPT COATING")}</span>
                <Link to={`/products?product=${active.product}`}>
                  <strong>{active.product}</strong>
                  <ArrowUpRight size={22} />
                </Link>
              </div>
              <Link
                className="text-link"
                to={`/contact?product=${active.product}`}
              >
                {t("咨询此场景方案", "Discuss this application")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <Notice />
        </div>
      </section>
      <section className="section applications-notes">
        <div className="container">
          <Eyebrow>
            {t("每一栋建筑，都是独立课题", "EVERY BUILDING HAS ITS OWN BRIEF")}
          </Eyebrow>
          <h2>
            {t(
              "从使用场景出发，回到工程本身。",
              "Start with the space. Design for the structure.",
            )}
          </h2>
          <p>
            {t(
              "防火涂层的实际选型，取决于结构形式、耐火要求、构件截面、环境条件和当地标准。此处场景仅帮助理解产品方向，不能替代专业消防设计。",
              "Actual coating selection depends on structural design, required fire resistance, section factors, exposure conditions and local standards. These scenarios explain coating concepts and do not replace professional fire engineering design.",
            )}
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Contact() {
  const { t, lang } = useLang();
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [chosen, setChosen] = useState(
    params.get("product") === "THERMA-CLEAR" ||
      products.some((p) => p.id === params.get("product"))
      ? params.get("product")!
      : "",
  );
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setDraft(
      Object.fromEntries(
        [...data.entries()].map(([key, value]) => [key, String(value)]),
      ),
    );
    const text = `${t("防火材料 · 项目咨询单（演示，尚未发送）", "FIREPROOF MATERIALS · PROJECT BRIEF (DEMO, NOT SENT)")}\n\n${t("姓名", "Name")}: ${data.get("name")}\n${t("公司", "Company")}: ${data.get("company") || "—"}\n${t("邮箱", "Email")}: ${data.get("email")}\n${t("电话", "Phone")}: ${data.get("phone") || "—"}\n${t("产品", "Product")}: ${data.get("product") || t("需要选型建议", "Selection advice needed")}\n\n${t("项目需求", "Project requirements")}:\n${data.get("message")}`;
    setSummary(text);
    setSubmitted(true);
  };
  return (
    <>
      <PageIntro
        eyebrow={t("联系我们 / CONTACT", "LET’S START A CONVERSATION")}
        title={t(
          "从一次交流，开始更好的防护。",
          "A conversation is a good first layer.",
        )}
        description={t(
          "告诉我们你的项目需求，一起探索更合适的涂层方案。",
          "Tell us about your project and explore a more considered coating approach.",
        )}
        number="04"
      />
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-aside">
            <Eyebrow>{t("保持联系", "GET IN TOUCH")}</Eyebrow>
            <h2>
              {t("好的方案，", "Good solutions")}
              <br />
              {t("始于充分了解。", "start with understanding.")}
            </h2>
            <p>
              {t(
                "无论是产品选型、技术资料还是项目应用，都可以从这里开始。",
                "Coating selection, technical resources or project applications — start your conversation here.",
              )}
            </p>
            <div className="contact-details">
              <div>
                <Mail size={21} />
                <div>
                  <span>{t("电子邮箱", "EMAIL")}</span>
                  <strong>hello@fireproof.example</strong>
                  <small>
                    {t("示例邮箱，尚未开通", "Example email, not connected")}
                  </small>
                </div>
              </div>
              <div>
                <MapPin size={21} />
                <div>
                  <span>{t("办公地点", "LOCATION")}</span>
                  <strong>
                    {t("中国 · 上海（示例）", "Shanghai, China (example)")}
                  </strong>
                  <small>
                    {t(
                      "待补充真实办公地址",
                      "Actual office address to be added",
                    )}
                  </small>
                </div>
              </div>
              <div>
                <Clock3 size={21} />
                <div>
                  <span>{t("服务时间", "OFFICE HOURS")}</span>
                  <strong>
                    {t("周一至周五 09:00–18:00", "Mon–Fri, 09:00–18:00")}
                  </strong>
                  <small>
                    {t(
                      "中国标准时间 · 示例安排",
                      "China Standard Time · Illustrative hours",
                    )}
                  </small>
                </div>
              </div>
            </div>
            <div className="contact-aside-note">
              <ShieldCheck size={21} />
              <p>
                {t(
                  "演示模式：信息仅在当前浏览器内生成咨询单，不会发送或存入服务器。",
                  "Demo mode: the brief is generated in this browser only. No information is sent or stored on a server.",
                )}
              </p>
            </div>
          </div>
          <div className="contact-form-card">
            {submitted ? (
              <div className="form-success" role="status">
                <CheckCircle2 size={52} strokeWidth={1.3} />
                <span className="overline">
                  {t("咨询单已生成", "YOUR BRIEF IS READY")}
                </span>
                <h2>
                  {t("需求已整理，", "Your project,")}
                  <br />
                  {t("下一步更清晰。", "a little clearer.")}
                </h2>
                <p>
                  {t(
                    "这是演示网站，信息尚未发送。你可以下载咨询单保存，待配置真实联系方式后再提交。",
                    "This is a demo website. Your information has not been sent. Download the brief for your records and share it once real contact details are configured.",
                  )}
                </p>
                <button
                  className="button full"
                  onClick={() =>
                    downloadText(summary, `project-brief-${lang}.txt`)
                  }
                >
                  {t("下载我的咨询单", "Download my project brief")}
                  <Download size={18} />
                </button>
                <button
                  className="text-link"
                  onClick={() => setSubmitted(false)}
                >
                  {t("返回修改", "Edit my brief")}
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="form-heading">
                  <h3>{t("聊聊你的项目", "Tell us about your project")}</h3>
                  <span>{t("* 为必填项", "* Required fields")}</span>
                </div>
                <div className="form-row">
                  <label>
                    {t("你的姓名", "Your name")} <span>*</span>
                    <input
                      defaultValue={draft.name}
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={80}
                      placeholder={t("请输入姓名", "Full name")}
                    />
                  </label>
                  <label>
                    {t("公司名称", "Company")}
                    <input
                      defaultValue={draft.company}
                      name="company"
                      autoComplete="organization"
                      maxLength={120}
                      placeholder={t(
                        "请输入公司名称（选填）",
                        "Company name (optional)",
                      )}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    {t("电子邮箱", "Email address")} <span>*</span>
                    <input
                      defaultValue={draft.email}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={160}
                      placeholder="name@company.com"
                    />
                  </label>
                  <label>
                    {t("联系电话", "Phone number")}
                    <input
                      defaultValue={draft.phone}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={40}
                      placeholder={t(
                        "请输入电话（选填）",
                        "Phone number (optional)",
                      )}
                    />
                  </label>
                </div>
                <label>
                  {t("感兴趣的产品", "Coating of interest")}
                  <div className="select-wrap">
                    <select
                      name="product"
                      value={chosen}
                      onChange={(e) => setChosen(e.target.value)}
                    >
                      <option value="">
                        {t(
                          "尚未确定，需要选型建议",
                          "Not sure — I need selection advice",
                        )}
                      </option>
                      <option value="THERMA-CLEAR">THERMA CLEAR</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.id} — {p.name[lang]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </label>
                <label>
                  {t("项目需求", "Project requirements")} <span>*</span>
                  <textarea
                    defaultValue={draft.message}
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={3000}
                    placeholder={t(
                      "请简单介绍项目类型、基材、防护需求或其他问题（至少 10 个字）…",
                      "Tell us about the building, substrate, protection requirements or questions (at least 10 characters)…",
                    )}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    defaultChecked={draft.consent === "on"}
                    type="checkbox"
                    name="consent"
                    required
                  />
                  <span>
                    {t(
                      "我了解此为演示表单，所填信息仅用于在本地生成咨询单，不会发送。",
                      "I understand this demo form generates a local brief only and does not send my information.",
                    )}{" "}
                    *
                  </span>
                </label>
                <button className="button full" type="submit">
                  {t("生成项目咨询单", "Create my project brief")}
                  <ArrowUpRight size={18} />
                </button>
                <p className="form-bottom-note">
                  {t(
                    "正式上线前需配置真实联系方式和表单接收服务。",
                    "Real contact details and a form delivery service are required before launch.",
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function NotFound() {
  const { t } = useLang();
  return (
    <section className="container not-found">
      <Eyebrow>404</Eyebrow>
      <h1>{t("这个页面暂时不在这里。", "This page is not here.")}</h1>
      <p>
        {t(
          "可以返回首页继续探索产品与防护方案。",
          "Return home to explore our coating concepts.",
        )}
      </p>
      <Link className="button" to="/">
        {t("返回首页", "Back to home")}
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
function App() {
  const { t, lang } = useLang();
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const sectionId = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() =>
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "instant" }),
      );
    } else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const page = nav.find(([path]) => path === location.pathname);
    document.title = `${page ? t(page[1], page[2]) : "404"} · ${t(brand.zh, brand.en)}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          "防火材料 · THERMA CLEAR 涂层产品介绍、演示与资料、应用方向。布局演示，产品内容待确认。",
          "Meet THERMA CLEAR: coating introduction, product film, resources and application ideas. Layout preview; product facts to be confirmed.",
        ),
      );
  }, [location.pathname, lang, t]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector("dialog[open]"))
        document
          .querySelector<HTMLButtonElement>(
            '.menu-toggle[aria-expanded="true"]',
          )
          ?.click();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main" onClick={handleSectionLink}>
        {t("跳转到主要内容", "Skip to content")}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>,
);
