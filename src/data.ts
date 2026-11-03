export type Lang = "zh" | "en";
export type Localized = { zh: string; en: string };
export const company = {
  name: { zh: "卓界科技有限公司", en: "Advanced Composites Studio Limited" },
  englishName: "Advanced Composites Studio Limited",
  product: "Therma Clear",
  tagline: { zh: "透明防火材料", en: "Transparent Fireproof Material" },
  businessTagline: {
    zh: "涂层产品与工程咨询",
    en: "Coating Products & Engineering Consultancy",
  },
  overview: {
    zh: "卓界科技有限公司开展两项业务：Therma Clear 透明防火涂层产品销售，以及材料工程、结构工程和防火工程咨询服务。",
    en: "Advanced Composites Studio Limited has two business areas: the sale of Therma Clear transparent fire protection coatings, and consultancy in materials engineering, structural engineering and fire engineering.",
  },
  introduction: {
    zh: "Therma Clear 将透明外观与防火保护相结合，形成保留基材色彩与纹理的保护层。遇火后，涂层迅速膨胀并形成隔热炭层。",
    en: "Therma Clear brings a transparent finish and fire protection together, preserving the colour and texture of the substrate. On exposure to fire, the coating rapidly expands to form an insulating char layer.",
  },
};
export const businessAreas = [
  {
    id: "coatings",
    number: "01",
    title: { zh: "涂层产品销售", en: "Coating Products" },
    subtitle: {
      zh: "Therma Clear 透明防火涂层",
      en: "Therma Clear transparent fire protection",
    },
    description: {
      zh: "销售 Therma Clear 透明防火涂层，在保留基材色彩与纹理的同时提供防火保护。",
      en: "Therma Clear transparent fire protection coatings preserve the colour and texture of the substrate while providing fire protection.",
    },
    to: "/products",
    linkLabel: { zh: "了解涂层产品", en: "Explore the coating" },
  },
  {
    id: "consulting",
    number: "02",
    title: { zh: "工程咨询服务", en: "Engineering Consultancy" },
    subtitle: {
      zh: "材料工程 · 结构工程 · 防火工程",
      en: "Materials · Structures · Fire engineering",
    },
    description: {
      zh: "围绕材料、结构与防火领域的工程技术问题，提供咨询服务与技术支持。",
      en: "Consultancy and technical support for engineering questions relating to materials, structures and fire protection.",
    },
    to: "/consulting",
    linkLabel: { zh: "了解工程咨询", en: "Explore our consultancy" },
  },
];
export const consultingServices = [
  {
    id: "materials",
    title: { zh: "材料工程咨询", en: "Materials Engineering" },
    description: {
      zh: "提供材料选用、性能与应用方面的工程技术咨询。",
      en: "Technical consultancy on material selection, performance and application.",
    },
  },
  {
    id: "structures",
    title: { zh: "结构工程咨询", en: "Structural Engineering" },
    description: {
      zh: "围绕结构方案与相关工程技术问题，提供咨询支持。",
      en: "Consultancy on structural approaches and related engineering questions.",
    },
  },
  {
    id: "fire",
    title: { zh: "防火工程咨询", en: "Fire Engineering" },
    description: {
      zh: "提供防火方案与材料防火应用方面的工程技术咨询。",
      en: "Technical consultancy on fire protection approaches and the application of fire protection materials.",
    },
  },
];
// Contact details supplied directly by the user; the building name is retained
// from the business registration certificate rather than guessing a translation.
export const contact = {
  email: "info@acs-x.com",
  phone: "",
  address: {
    zh: "香港九龙新蒲岗大有街2–4号 Wong King Industrial Building 10楼E15室",
    en: "Flat E15, 10/F, Wong King Industrial Building, 2–4 Tai Yau Street, San Po Kong, Kowloon, Hong Kong",
  },
};
export const features = [
  {
    id: "transparency",
    number: "01",
    title: { zh: "透明，保留本色", en: "Transparent by design" },
    description: {
      zh: "无色透明的保护层，保留材料原有色彩与自然纹理。",
      en: "A colourless, transparent protective layer that preserves the material’s original colour and natural texture.",
    },
    source: [1, 2, 5],
  },
  {
    id: "protection",
    number: "02",
    title: { zh: "遇火膨胀，形成屏障", en: "Protection through expansion" },
    description: {
      zh: "通过膨胀成炭形成隔热层，阻隔热量与氧气。",
      en: "An intumescent system that forms an insulating char layer to separate the substrate from heat and oxygen.",
    },
    source: [2, 3, 6],
  },
  {
    id: "application",
    number: "03",
    title: { zh: "水性体系，便于施工", en: "Water-based application" },
    description: {
      zh: "支持喷涂或刷涂，可用水稀释，并在常温下成膜。",
      en: "Suitable for spraying or brushing, dilutable with water and able to form a film at room temperature.",
    },
    source: [4, 6],
  },
];
export const metrics = [
  {
    value: ">80%",
    label: { zh: "透光率", en: "Light transmittance" },
    source: 3,
  },
  {
    value: "120×",
    label: { zh: "最大膨胀倍率", en: "Maximum expansion ratio" },
    source: 3,
  },
  { value: "6H", label: { zh: "表面硬度", en: "Surface hardness" }, source: 4 },
  { value: ">1.25 MPa", label: { zh: "附着力", en: "Adhesion" }, source: 4 },
];
export const technicalData = [
  {
    label: { zh: "透光率", en: "Light transmittance" },
    value: ">80%",
    condition: { zh: "透明涂层", en: "Transparent coating" },
    source: 3,
  },
  {
    label: { zh: "最大膨胀倍率", en: "Maximum expansion ratio" },
    value: "120×",
    condition: {
      zh: "遇火膨胀成炭",
      en: "Expansion and char formation on fire exposure",
    },
    source: 3,
  },
  {
    label: { zh: "表面硬度", en: "Surface hardness" },
    value: "6H",
    condition: { zh: "涂层表面", en: "Coating surface" },
    source: 4,
  },
  {
    label: { zh: "附着力", en: "Adhesion" },
    value: ">1.25 MPa",
    condition: {
      zh: "资料所述涂层附着力",
      en: "Adhesion stated in the product material",
    },
    source: 4,
  },
  {
    label: {
      zh: "木材防火与隔热保护",
      en: "Fire and thermal protection for wood",
    },
    value: ">2 h",
    condition: { zh: "5mm 木材", en: "5 mm wood" },
    source: 3,
  },
  {
    label: {
      zh: "纸板防火与隔热保护",
      en: "Fire and thermal protection for cardboard",
    },
    value: ">1 h",
    condition: { zh: "1mm 纸板", en: "1 mm cardboard" },
    source: 3,
  },
];
export const materials: Localized[] = [
  { zh: "木材", en: "Wood" },
  { zh: "玻璃", en: "Glass" },
  { zh: "纸板", en: "Cardboard" },
  { zh: "FRP 复合材料", en: "FRP composites" },
];
export const applications = [
  {
    id: "architecture",
    number: "01",
    title: { zh: "建筑与历史保护", en: "Architecture & heritage" },
    description: {
      zh: "面向历史建筑与现代木结构，在防火保护的同时保留材料原有的纹理与外观。",
      en: "For historical buildings and modern timber structures, combining fire protection with the original texture and appearance of the material.",
    },
    image: 2,
    label: {
      zh: "保留自然纹理与建筑美感",
      en: "Preserve texture and architectural character",
    },
  },
  {
    id: "packaging",
    number: "02",
    title: { zh: "包装与物流", en: "Packaging & logistics" },
    description: {
      zh: "面向纸板等包装基材，形成不改变原有色彩的透明保护层。",
      en: "A transparent protective layer for cardboard and other packaging substrates, retaining the original colour of the material.",
    },
    image: 5,
    label: {
      zh: "透明保护，延续材料本色",
      en: "Transparent protection, original appearance",
    },
  },
  {
    id: "rail",
    number: "03",
    title: { zh: "轨道交通内饰", en: "Rail transit interiors" },
    description: {
      zh: "用于轨道交通内饰的材料表面，将透明外观、防火保护与耐用性相结合。",
      en: "For material surfaces in rail transit interiors, bringing a transparent appearance, fire protection and durability together.",
    },
    image: 4,
    label: {
      zh: "兼顾外观、防护与耐用性",
      en: "Appearance, protection and durability",
    },
  },
];
export const sourceSlides = [
  {
    id: 1,
    image: "/images/therma-clear-1.webp",
    title: {
      zh: "Therma Clear · 透明防火材料",
      en: "Therma Clear · Transparent Fireproof Material",
    },
    alt: {
      zh: "Therma Clear 透明防火材料主视觉，展示木板与透明蜂窝状保护层",
      en: "Therma Clear product visual showing a timber board and a transparent honeycomb protective layer",
    },
  },
  {
    id: 2,
    image: "/images/therma-clear-2.webp",
    title: { zh: "防火安全与材料美感", en: "Safety and aesthetics" },
    alt: {
      zh: "产品设计理念与传统木构建筑图片",
      en: "Product design introduction alongside a traditional timber building",
    },
  },
  {
    id: 3,
    image: "/images/therma-clear-3.webp",
    title: {
      zh: "透明屏障与防火机理",
      en: "The transparent fire protection barrier",
    },
    alt: {
      zh: "防火机理资料，含 20.7、86.7、153 摄氏度热成像及 0 秒、40 秒、10 分钟火焰演示画面",
      en: "Fire protection material with thermal images labelled 20.7, 86.7 and 153 degrees Celsius and flame demonstrations at 0 seconds, 40 seconds and 10 minutes",
    },
  },
  {
    id: 4,
    image: "/images/therma-clear-4.webp",
    title: {
      zh: "水性多功能保护体系",
      en: "Water-based multifunctional protection",
    },
    alt: {
      zh: "水性涂层资料，标注超过 2 小时防火保护、6H 硬度及大于 1.25 MPa 附着力",
      en: "Water-based coating material describing over 2 hours of fire protection, 6H hardness and adhesion above 1.25 MPa",
    },
  },
  {
    id: 5,
    image: "/images/therma-clear-5.webp",
    title: {
      zh: "多基材与透明外观",
      en: "Multiple substrates, transparent appearance",
    },
    alt: {
      zh: "木材、纸板与玻璃等材料的透明保护示意",
      en: "Transparent protection illustrated on wood, cardboard and glass",
    },
  },
  {
    id: 6,
    image: "/images/therma-clear-6.webp",
    title: {
      zh: "可持续的水性材料",
      en: "A water-based approach to sustainability",
    },
    alt: {
      zh: "木材表面的透明涂层，图中标注无毒、无卤、环保、常温成膜与防火特性",
      en: "Transparent coating on timber, labelled non-toxic, halogen-free, eco-friendly, room-temperature curing and fireproof",
    },
  },
];
export const sourceNote = {
  zh: "数据整理自所提供的产品图文资料；保护时间对应资料中标明的基材与厚度。",
  en: "Figures are taken from the supplied product materials. Protection times refer to the substrates and thicknesses stated in those materials.",
};

// Supplementary observation supplied by the user on 2026-11-03.
// The measurement location and test conditions were not specified; do not infer them.
export const fireExposureResult = {
  label: {
    zh: "受火 2 小时后温度",
    en: "Temperature after 2 hours of fire exposure",
  },
  value: { zh: "约 150°C", en: "Approx. 150°C" },
  source: "User-supplied supplementary information, 2026-11-03",
};
