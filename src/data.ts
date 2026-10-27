export type Lang = "zh" | "en";
export type Localized = { zh: string; en: string };
export interface Product {
  id: string;
  name: Localized;
  category: "steel" | "concrete" | "wood";
  tag: Localized;
  description: Localized;
  duration: number;
  thickness: string;
  density: string;
  consumption: string;
  color: Localized;
  features: Localized[];
}
export const brand = { zh: "防火材料", en: "FIREPROOF MATERIALS" };
export const categories: Record<string, Localized> = {
  all: { zh: "全部产品", en: "All products" },
  steel: { zh: "钢结构防护", en: "Steel protection" },
  concrete: { zh: "混凝土防护", en: "Concrete protection" },
  wood: { zh: "木结构防护", en: "Timber protection" },
};
export const products: Product[] = [
  {
    id: "SF-120",
    name: { zh: "水性膨胀型防火涂料", en: "Water-based intumescent coating" },
    category: "steel",
    tag: { zh: "轻薄涂层 · 强效防护", en: "Thin film. Reliable protection." },
    description: {
      zh: "为室内钢结构设计的水性膨胀型涂层。受热后形成隔热炭层，兼顾建筑美观与结构防护需求。",
      en: "A water-based intumescent concept for interior steelwork. Designed to form an insulating char layer when exposed to heat, with a clean architectural finish.",
    },
    duration: 120,
    thickness: "1.5–3.0",
    density: "1.35 ± 0.10",
    consumption: "2.0–4.0",
    color: { zh: "哑光白 / 可定制", en: "Matt white / Custom" },
    features: [
      { zh: "水性配方", en: "Water-based" },
      { zh: "轻薄美观", en: "Thin profile" },
      { zh: "室内钢结构", en: "Interior steel" },
    ],
  },
  {
    id: "SF-180",
    name: { zh: "厚型钢结构防火涂料", en: "High-build steel fire coating" },
    category: "steel",
    tag: { zh: "厚实屏障 · 持久守护", en: "A stronger thermal barrier." },
    description: {
      zh: "适用于工业钢结构的厚型防火涂层示例方案，以矿物隔热体系延缓热量传递，满足大型结构的防护需求。",
      en: "A high-build mineral coating concept for industrial steelwork, designed to slow heat transfer in large structural elements.",
    },
    duration: 180,
    thickness: "15–25",
    density: "0.65 ± 0.10",
    consumption: "10.0–17.0",
    color: { zh: "自然灰", en: "Natural grey" },
    features: [
      { zh: "矿物体系", en: "Mineral system" },
      { zh: "高厚度防护", en: "High-build" },
      { zh: "工业建筑", en: "Industrial use" },
    ],
  },
  {
    id: "CF-90",
    name: { zh: "混凝土结构防火涂料", en: "Concrete fire protection coating" },
    category: "concrete",
    tag: { zh: "稳固基底 · 从容应对", en: "Protection from the foundation." },
    description: {
      zh: "面向隧道及混凝土结构的防火涂层示例。通过连续隔热层保护结构基材，适配复杂建筑空间。",
      en: "A protective coating concept for tunnels and concrete structures. A continuous thermal layer is designed to protect the substrate in demanding spaces.",
    },
    duration: 90,
    thickness: "8–15",
    density: "0.80 ± 0.10",
    consumption: "6.0–12.0",
    color: { zh: "浅灰色", en: "Light grey" },
    features: [
      { zh: "混凝土基材", en: "Concrete substrate" },
      { zh: "连续隔热", en: "Thermal barrier" },
      { zh: "隧道空间", en: "Tunnel spaces" },
    ],
  },
  {
    id: "WF-60",
    name: { zh: "木结构透明防火涂料", en: "Clear timber fire coating" },
    category: "wood",
    tag: {
      zh: "保留质感 · 增添安心",
      en: "Natural texture. Added protection.",
    },
    description: {
      zh: "为室内木结构与装饰构件设计的透明防火涂层示例，在保留木材自然纹理的同时增添防护层。",
      en: "A clear fire coating concept for interior timber and decorative elements, designed to preserve natural wood grain with an added protective layer.",
    },
    duration: 60,
    thickness: "0.5–1.0",
    density: "1.10 ± 0.10",
    consumption: "0.6–1.2",
    color: { zh: "透明 / 半哑光", en: "Clear / Satin" },
    features: [
      { zh: "自然木纹", en: "Natural grain" },
      { zh: "透明涂层", en: "Clear finish" },
      { zh: "室内装饰", en: "Interior finish" },
    ],
  },
];
export const scenes = [
  {
    id: "commercial",
    n: "01",
    title: { zh: "商业与公共建筑", en: "Commercial & public spaces" },
    subtitle: {
      zh: "让每一处公共空间，多一份安心。",
      en: "Confidence in every shared space.",
    },
    description: {
      zh: "适用于办公楼、商业综合体、展览馆等建筑的室内钢结构。兼顾涂层外观与建筑空间的设计表达。",
      en: "For interior steelwork in offices, mixed-use buildings and exhibition halls. Balance a clean coating finish with architectural expression.",
    },
    product: "SF-120",
    tags: {
      zh: "商业综合体 / 办公建筑 / 展览空间",
      en: "Mixed-use / Offices / Exhibitions",
    },
  },
  {
    id: "industrial",
    n: "02",
    title: { zh: "工业厂房与仓储", en: "Industrial & logistics" },
    subtitle: {
      zh: "为大跨度结构，构筑可靠防线。",
      en: "A considered barrier for larger structures.",
    },
    description: {
      zh: "为厂房、物流仓储等大跨度钢结构提供防护方案思路。结合构件尺寸、使用环境与施工条件选择适配涂层。",
      en: "Explore coating concepts for large-span steelwork in factories and logistics spaces. Selection depends on section size, environment and site conditions.",
    },
    product: "SF-180",
    tags: {
      zh: "工业厂房 / 物流仓储 / 设备空间",
      en: "Factories / Warehouses / Plant rooms",
    },
  },
  {
    id: "transport",
    n: "03",
    title: { zh: "交通与基础设施", en: "Transport & infrastructure" },
    subtitle: {
      zh: "守护连接城市的每一段旅程。",
      en: "Considered protection for connected cities.",
    },
    description: {
      zh: "探索隧道、交通枢纽与地下空间的混凝土结构防护。实际方案需根据项目火灾工况、基材和施工要求设计。",
      en: "Explore concrete protection for tunnels, transport hubs and underground spaces. Actual systems require project-specific fire exposure and substrate design.",
    },
    product: "CF-90",
    tags: {
      zh: "交通枢纽 / 隧道工程 / 地下空间",
      en: "Transport hubs / Tunnels / Underground",
    },
  },
  {
    id: "timber",
    n: "04",
    title: { zh: "木构建筑与室内", en: "Timber & interior spaces" },
    subtitle: {
      zh: "让自然的温度，与安全相伴。",
      en: "Make room for natural warmth.",
    },
    description: {
      zh: "面向室内木构、酒店及文化空间的装饰防护思路。透明表面处理保留木纹，具体防护要求需以真实检测结果为准。",
      en: "A finish concept for interior timber, hospitality and cultural spaces. A clear finish preserves the grain; actual protection requires verified test evidence.",
    },
    product: "WF-60",
    tags: {
      zh: "木构建筑 / 酒店空间 / 文化场馆",
      en: "Timber / Hospitality / Cultural spaces",
    },
  },
];

// THERMA CLEAR layout content. Product facts remain unconfirmed until the source
// presentations and videos are available. Add verified benefits and local files here.
export const coating = {
  name: "THERMA CLEAR",
  summary: {
    zh: "从产品特点到实际演示，以更直观的方式认识 THERMA CLEAR 涂层。具体产品介绍将在资料确认后补充。",
    en: "Get to know THERMA CLEAR through a concise product introduction and demonstration. Product details will be added once the source materials are confirmed.",
  },
  features: [
    {
      id: "01",
      title: { zh: "涂层特点", en: "Coating features" },
      description: {
        zh: "用简洁图文介绍产品的核心特点。",
        en: "A clear, visual introduction to the key product features.",
      },
    },
    {
      id: "02",
      title: { zh: "演示与表现", en: "See it in action" },
      description: {
        zh: "通过产品视频，直观了解涂层表现。",
        en: "A product film to help explain the coating in context.",
      },
    },
    {
      id: "03",
      title: { zh: "应用方向", en: "Application ideas" },
      description: {
        zh: "展示适用场景与基本选型方向。",
        en: "An overview of potential applications and selection considerations.",
      },
    },
  ],
  video: {
    src: "", // Add an authorised local MP4 path, e.g. /media/therma-clear.mp4.
    poster: "/images/coating-system.svg",
  },
};
// File names come from the user's email screenshot. No SharePoint links or private
// school-account information are embedded in the public website or offline preview.
export const referenceMaterials = [
  {
    id: "product-ppt",
    type: "PPTX",
    filename: "Product PPT for Meeting with Nu-Rock v2 2.pptx",
    title: { zh: "产品介绍", en: "Product presentation" },
    description: {
      zh: "产品定位与特点概览",
      en: "Product context and key features",
    },
    href: "",
  },
  {
    id: "therma-ppt",
    type: "PPTX",
    filename: "THERMA CLEAR 1.pptx",
    title: { zh: "THERMA CLEAR 介绍", en: "THERMA CLEAR overview" },
    description: {
      zh: "涂层介绍与应用思路",
      en: "Coating overview and application ideas",
    },
    href: "",
  },
  {
    id: "video-2",
    type: "MP4",
    filename: "THERMA CLEAR V4 2.mp4",
    title: { zh: "产品演示视频 01", en: "Product demonstration 01" },
    description: {
      zh: "预留产品视频展示位置",
      en: "Reserved for a product demonstration",
    },
    href: "",
  },
  {
    id: "video-1",
    type: "MP4",
    filename: "THERMA CLEAR V4 1.mp4",
    title: { zh: "产品演示视频 02", en: "Product demonstration 02" },
    description: {
      zh: "预留补充演示视频位置",
      en: "Reserved for an additional demonstration",
    },
    href: "",
  },
];
