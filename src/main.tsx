import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Download,
  Expand,
  FileText,
  Globe2,
  Layers3,
  Leaf,
  Menu,
  Package,
  ShieldCheck,
  TrainFront,
  X,
  Droplets,
} from "lucide-react";
import {
  applications,
  company,
  features,
  materials,
  metrics,
  sourceNote,
  sourceSlides,
  technicalData,
} from "./data";
import type { Lang } from "./data";
import "./styles.css";

type LanguageValue = {
  lang: Lang;
  toggle: () => void;
  t: (zh: string, en: string) => string;
};
const Language = createContext<LanguageValue>({
  lang: "zh",
  toggle: () => {},
  t: (zh) => zh,
});
const Viewer = createContext<(id: number) => void>(() => {});
function useLang() {
  return useContext(Language);
}
function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("acs-language") ||
        localStorage.getItem("fireproof-language")) === "en"
        ? "en"
        : "zh";
    } catch {
      return "zh";
    }
  });
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    try {
      localStorage.setItem("acs-language", lang);
    } catch {
      /* Storage is optional for a local preview. */
    }
  }, [lang]);
  return (
    <Language.Provider
      value={{
        lang,
        toggle: () => setLang((value) => (value === "zh" ? "en" : "zh")),
        t: (zh, en) => (lang === "zh" ? zh : en),
      }}
    >
      {children}
    </Language.Provider>
  );
}
const navigation = [
  ["/", "首页", "Home"],
  ["/products", "产品介绍", "Product"],
  ["/technology", "技术与性能", "Technology"],
  ["/applications", "应用领域", "Applications"],
  ["/about", "关于卓界", "Company"],
];
function handleSectionLink(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const id = event.currentTarget.getAttribute("href")?.slice(1) || "main";
  const target = document.getElementById(id);
  target?.scrollIntoView();
  if (id === "main") target?.focus({ preventScroll: true });
}
function Logo() {
  const { lang, t } = useLang();
  return (
    <Link
      className="brand"
      to="/"
      aria-label={t(
        "卓界科技有限公司首页",
        "Advanced Composites Studio Limited home",
      )}
    >
      <span className="brand-mark" aria-hidden="true">
        A<span />
        <i />
      </span>
      <span className="brand-wordmark">
        <strong>{company.name[lang]}</strong>
        <small>
          {lang === "zh" ? company.englishName : "卓界科技有限公司"}
        </small>
      </span>
    </Link>
  );
}
function Header() {
  const { lang, t, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav
          id="main-navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
          aria-label={t("主导航", "Main navigation")}
        >
          {navigation.map(([path, zh, en]) => (
            <NavLink end={path === "/"} to={path} key={path}>
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
            <Globe2 size={16} />
            <span>{lang === "zh" ? "EN" : "中文"}</span>
          </button>
          <button
            className="menu-toggle icon-button"
            aria-controls="main-navigation"
            aria-expanded={open}
            aria-label={t(
              open ? "关闭导航" : "打开导航",
              open ? "Close menu" : "Open menu",
            )}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  const { lang, t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Logo />
          <p>
            {company.product}
            <span> / </span>
            {company.tagline[lang]}
          </p>
        </div>
        <nav aria-label={t("页脚导航", "Footer navigation")}>
          {navigation.slice(1).map(([path, zh, en]) => (
            <Link to={path} key={path}>
              {t(zh, en)}
              <ArrowUpRight size={13} />
            </Link>
          ))}
          <Link to="/about#contact">
            {t("联系方式", "Contact")}
            <ArrowUpRight size={13} />
          </Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name[lang]}
        </span>
        <a href="#main" onClick={handleSectionLink}>
          {t("返回顶部", "Back to top")} ↑
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
      <i />
      {children}
    </div>
  );
}
function SourceImage({
  id,
  className = "",
  priority = false,
}: {
  id: number;
  className?: string;
  priority?: boolean;
}) {
  const { lang, t } = useLang();
  const open = useContext(Viewer);
  const slide = sourceSlides.find((item) => item.id === id)!;
  return (
    <button
      type="button"
      className={`source-image ${className}`}
      onClick={() => open(id)}
      aria-label={t(
        `查看图片：${slide.title.zh}`,
        `View image: ${slide.title.en}`,
      )}
    >
      <img
        src={slide.image}
        alt={slide.alt[lang]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      <span className="image-expand">
        <Expand size={15} />
        <span>{t("查看图文", "View material")}</span>
      </span>
    </button>
  );
}
function ImageDialog({
  id,
  onClose,
  onChange,
}: {
  id: number;
  onClose: () => void;
  onChange: (id: number) => void;
}) {
  const { lang, t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const slide = sourceSlides.find((item) => item.id === id)!;
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      requestAnimationFrame(() => {
        if (previousFocus?.isConnected)
          previousFocus.focus({ preventScroll: true });
      });
    };
  }, []);
  function cycle(delta: number) {
    onChange(
      ((id - 1 + delta + sourceSlides.length) % sourceSlides.length) + 1,
    );
  }
  return (
    <dialog
      ref={ref}
      className="image-dialog"
      aria-labelledby="image-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          cycle(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          cycle(-1);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-heading">
        <div>
          <span>{String(id).padStart(2, "0")} / 06</span>
          <h2 id="image-dialog-title">{slide.title[lang]}</h2>
        </div>
        <button
          className="icon-button"
          aria-label={t("关闭图片", "Close image")}
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>
      <div className="dialog-image">
        <img src={slide.image} alt={slide.alt[lang]} />
      </div>
      <div className="dialog-toolbar">
        <button
          className="text-button"
          onClick={() => cycle(-1)}
          aria-label={t("上一张图片", "Previous image")}
        >
          <ArrowLeft size={17} />
          {t("上一张", "Previous")}
        </button>
        <a
          href={slide.image}
          download={`Therma-Clear-${id}.webp`}
          className="text-button"
        >
          <Download size={16} />
          {t("保存图片", "Save image")}
        </a>
        <button
          className="text-button"
          onClick={() => cycle(1)}
          aria-label={t("下一张图片", "Next image")}
        >
          {t("下一张", "Next")}
          <ArrowRight size={17} />
        </button>
      </div>
    </dialog>
  );
}
function MetricStrip() {
  const { lang } = useLang();
  return (
    <div className="metrics-grid">
      {metrics.map((metric) => (
        <div className="metric" key={metric.label.en}>
          <strong>{metric.value}</strong>
          <span>{metric.label[lang]}</span>
        </div>
      ))}
    </div>
  );
}
function FeatureCards() {
  const { lang } = useLang();
  const icons = [Layers3, ShieldCheck, Droplets];
  return (
    <div className="feature-grid">
      {features.map((feature, i) => {
        const Icon = icons[i];
        return (
          <article className="feature-card" key={feature.id}>
            <div>
              <span>{feature.number}</span>
              <Icon size={27} strokeWidth={1.3} />
            </div>
            <h3>{feature.title[lang]}</h3>
            <p>{feature.description[lang]}</p>
          </article>
        );
      })}
    </div>
  );
}
function DownloadLink({ compact = false }: { compact?: boolean }) {
  const { lang, t } = useLang();
  return (
    <a
      className={compact ? "text-link" : "button outline"}
      href={`/downloads/Therma-Clear-${lang}.pdf`}
      download
    >
      <FileText size={16} />
      {t("下载产品资料", "Download product summary")}
      <Download size={16} />
    </a>
  );
}
function Gallery({ ids = [1, 2, 3, 4, 5, 6] }: { ids?: number[] }) {
  const { lang } = useLang();
  return (
    <div className="source-gallery">
      {sourceSlides
        .filter((slide) => ids.includes(slide.id))
        .map((slide) => (
          <figure key={slide.id}>
            <SourceImage id={slide.id} />
            <figcaption>
              <span>{String(slide.id).padStart(2, "0")}</span>
              {slide.title[lang]}
              <ArrowUpRight size={15} />
            </figcaption>
          </figure>
        ))}
    </div>
  );
}
function NextSection({
  to,
  title,
  eyebrow,
}: {
  to: string;
  title: string;
  eyebrow: string;
}) {
  const { t } = useLang();
  return (
    <section className="next-section">
      <div className="container">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2>{title}</h2>
        </div>
        <Link
          className="round-link"
          to={to}
          aria-label={t("了解更多", "Explore more")}
        >
          <ArrowUpRight size={27} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
function PageIntro({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <div>
          <h1>{title}</h1>
          <span className="page-number">/{number}</span>
        </div>
        <p>{description}</p>
      </div>
    </section>
  );
}
function Home() {
  const { lang, t } = useLang();
  return (
    <>
      <section className="home-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <Eyebrow>
              THERMA CLEAR /{" "}
              {t("透明防火材料", "TRANSPARENT FIREPROOF MATERIAL")}
            </Eyebrow>
            <h1>
              {t("透明防火，", "Protection,")}
              <br />
              <em>{t("保留材料本色。", "in plain sight.")}</em>
            </h1>
            <p>
              {t(
                "让防火保护，与自然美感共存。\nTherma Clear 以透明涂层，守护材料原有的色彩与纹理。",
                "Fire protection with a transparent finish.\nTherma Clear preserves the original colour and texture of the materials around us.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="button" to="/products">
                {t("探索 Therma Clear", "Explore Therma Clear")}
                <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" to="/technology">
                {t("了解防火机理", "How it works")}
                <ArrowRight size={17} />
              </Link>
            </div>
            <span className="hero-signature">
              ADVANCED COMPOSITES STUDIO LIMITED
            </span>
          </div>
          <div className="hero-visual">
            <SourceImage id={1} className="subject-right" priority />
            <span className="visual-label">
              MATERIAL / COATING / PROTECTION
            </span>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>01 / THERMA CLEAR</span>
          <a href="#features" onClick={handleSectionLink}>
            {t("向下探索", "Discover more")}
            <ArrowDown size={14} />
          </a>
        </div>
      </section>
      <section className="metrics-section">
        <div className="container">
          <MetricStrip />
          <p className="source-note">{sourceNote[lang]}</p>
        </div>
      </section>
      <section className="section" id="features">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("核心特点", "THE ESSENTIALS")}</Eyebrow>
              <h2>
                {t("防护融入表面，", "An invisible layer.")}
                <br />
                {t("美感留在眼前。", "A visible difference.")}
              </h2>
            </div>
            <p>
              {t(
                "无色透明的保护层，\n将材料美感与防火功能结合。",
                "A colourless, transparent layer that brings material aesthetics and fire protection together.",
              )}
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>
      <section className="story-section">
        <div className="container story-grid">
          <SourceImage id={2} className="subject-architecture" />
          <div className="story-copy">
            <Eyebrow dark>
              {t("材料与建筑", "MATERIALS & ARCHITECTURE")}
            </Eyebrow>
            <h2>
              {t("让材料，", "Let materials")}
              <br />
              {t("保有自己的表达。", "keep their character.")}
            </h2>
            <p>
              {t(
                "从历史建筑到现代木结构，Therma Clear 以透明保护保留基材的自然纹理。遇火时，涂层迅速膨胀，形成隔热炭层。",
                "From historical buildings to modern timber structures, Therma Clear preserves natural texture with transparent protection. On exposure to fire, the coating expands rapidly into an insulating char layer.",
              )}
            </p>
            <Link className="text-link light" to="/applications">
              {t("浏览应用领域", "Explore applications")}
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("水性多功能保护", "WATER-BASED PROTECTION")}</Eyebrow>
              <h2>
                {t("从施工，到日常使用。", "From application to everyday use.")}
              </h2>
            </div>
            <Link className="text-link" to="/products">
              {t("了解产品", "Meet the coating")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="water-grid">
            <SourceImage id={6} className="subject-water" />
            <div className="water-copy">
              <span className="small-label">THERMA CLEAR</span>
              <h3>
                {t(
                  "透明外观，水性成膜。",
                  "Transparent finish. Water-based film.",
                )}
              </h3>
              <p>
                {t(
                  "水性体系，可用水稀释，支持喷涂或刷涂，并在常温下成膜。无卤、无毒、环保的配方，将美感、防火与环境保护结合。",
                  "A water-based system that can be diluted with water, applied by spraying or brushing, and cured at room temperature. The halogen-free, non-toxic and eco-friendly formulation brings aesthetics, fire protection and environmental considerations together.",
                )}
              </p>
              <div className="tag-list">
                {[
                  t("无卤", "Halogen-free"),
                  t("无毒", "Non-toxic"),
                  t("常温成膜", "Room-temperature curing"),
                ].map((tag) => (
                  <span key={tag}>
                    <Check size={13} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <NextSection
        to="/technology"
        eyebrow={t("技术与性能", "TECHNOLOGY & PERFORMANCE")}
        title={t("看清透明保护背后的原理。", "Look closer at the protection.")}
      />
    </>
  );
}
function Products() {
  const { lang, t } = useLang();
  return (
    <>
      <PageIntro
        number="01"
        eyebrow="THERMA CLEAR"
        title={t(
          "透明防火，兼顾材料美感。",
          "Fire protection. Original character.",
        )}
        description={company.introduction[lang]}
      />
      <section className="section product-overview">
        <div className="container product-grid">
          <div>
            <Eyebrow>
              {t("透明防火材料", "TRANSPARENT FIREPROOF MATERIAL")}
            </Eyebrow>
            <h2>Therma Clear</h2>
            <p>
              {t(
                "以高透明膨胀型防火体系，在材料表面形成无色保护层。日常保留原有外观，遇火膨胀成炭，形成隔热屏障。",
                "A highly transparent intumescent fire protection system forms a colourless layer on the material. It preserves the everyday appearance and expands into an insulating char barrier when exposed to fire.",
              )}
            </p>
            <div className="material-list">
              {materials.map((material) => (
                <span key={material.en}>{material[lang]}</span>
              ))}
            </div>
            <DownloadLink />
          </div>
          <SourceImage id={1} className="product-cover" />
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("产品特点", "PRODUCT CHARACTERISTICS")}</Eyebrow>
              <h2>
                {t(
                  "透明、防护、便于施工。",
                  "Transparent. Protective. Practical.",
                )}
              </h2>
            </div>
          </div>
          <FeatureCards />
        </div>
      </section>
      <section className="section">
        <div className="container water-grid">
          <SourceImage id={4} className="subject-system" />
          <div className="water-copy">
            <Eyebrow>
              {t("水性多功能体系", "A MULTIFUNCTIONAL WATER-BASED SYSTEM")}
            </Eyebrow>
            <h2>
              {t("一层涂覆，多重保护。", "Multiple functions. One layer.")}
            </h2>
            <p>
              {t(
                "支持现场喷涂或刷涂，可用水稀释；常温下成膜。涂层兼具 6H 表面硬度与大于 1.25 MPa 的附着力。",
                "Supports on-site spraying or brushing, can be diluted with water and forms a film at room temperature. The coating combines 6H surface hardness with adhesion greater than 1.25 MPa.",
              )}
            </p>
            <div className="tag-list">
              {[
                t("水性", "Water-based"),
                t("无卤", "Halogen-free"),
                t("透明", "Transparent"),
              ].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="text-link" to="/technology">
              {t("查看完整技术指标", "View technical figures")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section source-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("产品图文", "PRODUCT MATERIALS")}</Eyebrow>
              <h2>
                {t(
                  "进一步了解 Therma Clear。",
                  "A closer look at Therma Clear.",
                )}
              </h2>
            </div>
            <span className="gallery-hint">
              {t(
                "点击图片查看完整图文",
                "Select an image to view the complete material",
              )}
            </span>
          </div>
          <Gallery />
        </div>
      </section>
      <NextSection
        to="/technology"
        eyebrow={t("技术与性能", "TECHNOLOGY & PERFORMANCE")}
        title={t(
          "让每一项性能，都清晰可见。",
          "Explore the detail behind the coating.",
        )}
      />
    </>
  );
}
function Technology() {
  const { lang, t } = useLang();
  return (
    <>
      <PageIntro
        number="02"
        eyebrow={t("技术与性能", "TECHNOLOGY & PERFORMANCE")}
        title={t(
          "透明屏障背后的防火机理。",
          "The science behind a transparent barrier.",
        )}
        description={t(
          "纳米分散与折射率匹配，将阻燃组分与成炭前驱体整合于水性体系中。遇火后，通过磷氮协同作用迅速膨胀成炭。",
          "Nano-dispersion and refractive index matching integrate flame retardants and char-forming precursors into a water-based system. On fire exposure, phosphorus–nitrogen synergy enables rapid expansion and char formation.",
        )}
      />
      <section className="section technology-intro">
        <div className="container">
          <MetricStrip />
          <div className="mechanism-steps">
            {[
              [
                "01",
                t("透明涂层", "Transparent coating"),
                t(
                  "分子或纳米尺度的分散，保留材料外观。",
                  "Molecular or nanoscale dispersion preserves the material’s appearance.",
                ),
              ],
              [
                "02",
                t("遇火膨胀", "Intumescence"),
                t(
                  "磷氮协同作用，促进快速膨胀与成炭。",
                  "Phosphorus–nitrogen synergy promotes rapid expansion and char formation.",
                ),
              ],
              [
                "03",
                t("隔热屏障", "Insulating barrier"),
                t(
                  "形成发泡炭层，隔离热量与氧气。",
                  "A foamed char layer separates the substrate from heat and oxygen.",
                ),
              ],
            ].map(([n, title, description]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>
                {t(
                  "产品资料中的技术指标",
                  "FIGURES FROM THE PRODUCT MATERIALS",
                )}
              </Eyebrow>
              <h2>{t("关键性能一览", "The key figures.")}</h2>
            </div>
            <DownloadLink />
          </div>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label={t(
              "技术性能表，可左右滑动",
              "Technical data table, scroll horizontally",
            )}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">{t("性能指标", "Property")}</th>
                  <th scope="col">{t("资料数值", "Reported value")}</th>
                  <th scope="col">
                    {t("对应材料或说明", "Material or context")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {technicalData.map((row) => (
                  <tr key={row.label.en}>
                    <th scope="row">{row.label[lang]}</th>
                    <td>{row.value}</td>
                    <td>{row.condition[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="source-note">{sourceNote[lang]}</p>
        </div>
      </section>
      <section className="section" id="demonstration">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>
                {t("图像中的防火演示", "FIRE DEMONSTRATION IMAGES")}
              </Eyebrow>
              <h2>
                {t(
                  "从透明涂层，到膨胀炭层。",
                  "From transparent film to insulating char.",
                )}
              </h2>
            </div>
            <p>
              {t(
                "图中记录了热成像与火焰演示过程，\n展示涂层受热后的成炭变化。",
                "Thermal images and flame demonstrations illustrate char formation as the coating is exposed to heat.",
              )}
            </p>
          </div>
          <SourceImage id={3} className="technical-plate" />
          <div className="demonstration-labels">
            <span>
              {t("画面温度标注", "Temperature labels")}
              <strong>20.7°C / 86.7°C / 153°C</strong>
            </span>
            <span>
              {t("演示时间标注", "Time labels")}
              <strong>0 s / 40 s / 10 min</strong>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
function Applications() {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState(0);
  const active = applications[selected];
  const icons = [Building2, Package, TrainFront];
  return (
    <>
      <PageIntro
        number="03"
        eyebrow={t("应用领域", "APPLICATIONS")}
        title={t(
          "保留本色，延伸材料的可能。",
          "Original character. Broader possibilities.",
        )}
        description={t(
          "从建筑与包装，到轨道交通内饰，透明保护让材料原有的纹理与色彩继续呈现。",
          "From architecture and packaging to rail transit interiors, transparent protection allows the original texture and colour of materials to remain visible.",
        )}
      />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("适用基材", "SUBSTRATES")}</Eyebrow>
              <h2>
                {t(
                  "多种基材，同样透明。",
                  "Different substrates. The same clarity.",
                )}
              </h2>
            </div>
            <div className="material-list">
              {materials.map((material) => (
                <span key={material.en}>{material[lang]}</span>
              ))}
            </div>
          </div>
          <SourceImage id={5} className="materials-plate" />
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div
            className="application-tabs"
            role="tablist"
            aria-label={t("选择应用领域", "Select an application")}
          >
            {applications.map((item, index) => {
              const Icon = icons[index];
              return (
                <button
                  key={item.id}
                  id={`application-${item.id}`}
                  role="tab"
                  aria-selected={selected === index}
                  aria-controls="application-panel"
                  tabIndex={selected === index ? 0 : -1}
                  className={selected === index ? "active" : ""}
                  onClick={() => setSelected(index)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? 2
                            : (selected +
                                (event.key === "ArrowRight" ? 1 : 2)) %
                              3;
                      setSelected(next);
                      document
                        .getElementById(`application-${applications[next].id}`)
                        ?.focus();
                    }
                  }}
                >
                  <Icon size={21} strokeWidth={1.4} />
                  <span>{item.title[lang]}</span>
                  <ArrowUpRight size={16} />
                </button>
              );
            })}
          </div>
          <div
            className="application-panel"
            id="application-panel"
            role="tabpanel"
            aria-labelledby={`application-${active.id}`}
          >
            <div className="application-copy">
              <span className="small-label">
                {active.number} / THERMA CLEAR
              </span>
              <h2>{active.title[lang]}</h2>
              <p>{active.description[lang]}</p>
              <span className="application-caption">{active.label[lang]}</span>
              <Link className="text-link" to="/technology">
                {t("了解技术性能", "Explore the performance")}
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <SourceImage
              id={active.image}
              className={
                active.image === 2
                  ? "subject-architecture"
                  : active.image === 4
                    ? "subject-system"
                    : "application-materials"
              }
            />
          </div>
        </div>
      </section>
      <NextSection
        to="/products"
        eyebrow="THERMA CLEAR"
        title={t(
          "以透明保护，延续材料之美。",
          "Keep the beauty. Add the protection.",
        )}
      />
    </>
  );
}
function About() {
  const { lang, t } = useLang();
  return (
    <>
      <PageIntro
        number="04"
        eyebrow={t("关于卓界", "THE COMPANY")}
        title={company.name[lang]}
        description={lang === "zh" ? company.englishName : company.name.zh}
      />
      <section className="section">
        <div className="container about-grid">
          <div className="about-copy">
            <Eyebrow>THERMA CLEAR</Eyebrow>
            <h2>
              {t("将防火安全，", "Bringing fire protection")}
              <br />
              {t("融入材料美感。", "and aesthetics together.")}
            </h2>
            <p>
              {t(
                "Therma Clear 的设计源于建筑、包装与轨道交通领域对美感和防火保护的共同需求。透明保护层保留材料原有的外观，遇火后膨胀成炭，兼顾视觉表达与防护功能。",
                "Therma Clear was designed around the shared need for aesthetics and fire protection in architecture, packaging and rail transit. A transparent layer preserves the original appearance and expands into char on fire exposure, bringing visual expression and protection together.",
              )}
            </p>
            <Link to="/products" className="button">
              {t("了解 Therma Clear", "Discover Therma Clear")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <SourceImage id={2} className="subject-architecture" />
        </div>
      </section>
      <section className="section soft-section">
        <div className="container sustainability-grid">
          <div>
            <Eyebrow>
              {t(
                "水性材料与可持续发展",
                "WATER-BASED MATERIALS & SUSTAINABILITY",
              )}
            </Eyebrow>
            <h2>
              {t("保护材料，", "Protect the material.")}
              <br />
              {t("也珍惜资源。", "Respect the resource.")}
            </h2>
          </div>
          <div>
            <Leaf size={30} strokeWidth={1.3} />
            <p>
              {t(
                "水性、无卤、无毒的透明涂层，可在常温下成膜。通过保护基材、减少材料更换与浪费，支持绿色建筑、可持续物流与低碳生产。",
                "A water-based, halogen-free, non-toxic transparent coating that forms a film at room temperature. Protecting substrates and reducing material replacement and waste supports green building, sustainable logistics and low-carbon production.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>{t("联系方式", "CONTACT")}</Eyebrow>
              <h2>{t("联系我们", "Contact us")}</h2>
            </div>
          </div>
          <dl className="contact-fields">
            {[t("电话", "Phone"), t("邮箱", "Email"), t("地址", "Address")].map(
              (label) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd title={t("尚未填写", "Not provided")} />
                </div>
              ),
            )}
          </dl>
        </div>
      </section>
      <section className="company-nameplate">
        <div className="container">
          <span className="small-label">
            ADVANCED COMPOSITES STUDIO LIMITED
          </span>
          <strong>{company.name.zh}</strong>
          <span>Therma Clear · {company.tagline[lang]}</span>
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
      <h1>{t("没有找到这个页面。", "This page could not be found.")}</h1>
      <Link className="button" to="/">
        {t("返回首页", "Return home")}
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
function App() {
  const { lang, t } = useLang();
  const location = useLocation();
  const [image, setImage] = useState<number | null>(null);
  useEffect(() => {
    setImage(null);
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" }),
      );
    } else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const page = navigation.find(([path]) => path === location.pathname);
    document.title = `${page ? t(page[1], page[2]) : "404"} · ${company.name[lang]}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          "卓界科技有限公司 Therma Clear 透明防火材料，介绍透明膨胀型防火体系、水性施工、技术性能与应用领域。",
          "Advanced Composites Studio Limited presents Therma Clear: transparent intumescent fire protection, water-based application, technical performance and application areas.",
        ),
      );
  }, [lang, location.pathname, t]);
  return (
    <Viewer.Provider value={setImage}>
      <a href="#main" onClick={handleSectionLink} className="skip-link">
        {t("跳转到主要内容", "Skip to content")}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/contact"
            element={<Navigate to="/about#contact" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {image !== null && (
        <ImageDialog
          id={image}
          onClose={() => setImage(null)}
          onChange={setImage}
        />
      )}
    </Viewer.Provider>
  );
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>,
);
