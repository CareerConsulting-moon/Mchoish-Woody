export type PortfolioCategory = "interior" | "architecture" | "traditional";

export type PortfolioItem = {
  id: number;
  title: string;
  location: string;
  year: number;
  category: PortfolioCategory;
  imageUrl: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  icon: "Building2" | "Warehouse" | "Landmark";
};

export type ProcessStep = {
  id: number;
  step: string;
  title: string;
  description: string;
  icon: "MessageSquare" | "PenTool" | "TreePine" | "Hammer" | "ShieldCheck";
};

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string;
};

export const heroImages = {
  hero: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=2000&q=80",
  about:
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "서교동 카페 인테리어",
    location: "서울 마포구",
    year: 2024,
    category: "interior",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "한남동 레스토랑 리모델링",
    location: "서울 용산구",
    year: 2024,
    category: "interior",
    imageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "판교 주택 거실 목재 인테리어",
    location: "성남시",
    year: 2023,
    category: "interior",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "양평 목조주택 신축",
    location: "경기 양평군",
    year: 2024,
    category: "architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    title: "가평 글램핑 목조 파빌리온",
    location: "경기 가평군",
    year: 2023,
    category: "architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    title: "제주 펜션 목조 증축",
    location: "제주시",
    year: 2023,
    category: "architecture",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    title: "해인사 요사채 보수공사",
    location: "합천군",
    year: 2024,
    category: "traditional",
    imageUrl:
      "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    title: "서울 OO성당 제대 및 강대상 제작",
    location: "서울",
    year: 2023,
    category: "traditional",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 9,
    title: "전통 한옥 대들보 복원",
    location: "전주시",
    year: 2022,
    category: "traditional",
    imageUrl:
      "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?auto=format&fit=crop&w=1200&q=80",
  },
];

export const services: ServiceItem[] = [
  {
    id: 1,
    icon: "Building2",
    title: "상업 · 주거 공간 인테리어",
    description:
      "카페, 레스토랑, 사무실부터 주거 공간까지. 목재의 온기로 공간의 가치를 높입니다.",
    tags: ["#카페인테리어", "#사무실인테리어", "#주거공간", "#리모델링"],
  },
  {
    id: 2,
    icon: "Warehouse",
    title: "중소형 목조 건축",
    description:
      "목조주택, 글램핑 시설, 파빌리온 등 중소형 목조 건축물을 설계부터 시공까지 원스톱으로.",
    tags: ["#목조주택", "#글램핑", "#파빌리온", "#구조물"],
  },
  {
    id: 3,
    icon: "Landmark",
    title: "전통 건축 · 종교 목공",
    description:
      "사찰, 교회, 한옥의 전통 목조 기법을 이어갑니다. 문화재 보수부터 종교 가구 제작까지.",
    tags: ["#사찰", "#교회목공", "#한옥", "#문화재보수"],
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    step: "Step 01",
    title: "상담 및 현장 방문",
    description:
      "고객의 요구사항을 경청하고, 현장을 직접 방문하여 공간의 가능성을 파악합니다.",
    icon: "MessageSquare",
  },
  {
    id: 2,
    step: "Step 02",
    title: "설계 및 디자인",
    description:
      "3D 모델링과 상세 도면으로 완성될 공간을 미리 확인하실 수 있습니다.",
    icon: "PenTool",
  },
  {
    id: 3,
    step: "Step 03",
    title: "목재 선별 및 가공",
    description:
      "수종과 용도에 맞는 최적의 목재를 선별하고, 정밀하게 가공합니다.",
    icon: "TreePine",
  },
  {
    id: 4,
    step: "Step 04",
    title: "시공",
    description:
      "숙련된 장인들이 전통 기법과 현대 공법을 결합하여 정밀 시공합니다.",
    icon: "Hammer",
  },
  {
    id: 5,
    step: "Step 05",
    title: "완공 및 사후 관리",
    description:
      "완공 후에도 정기적인 점검과 유지보수로 오래도록 함께합니다.",
    icon: "ShieldCheck",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "양평에 꿈꾸던 목조주택을 짓게 되었습니다. 섬세한 손길이 느껴지는 마감에 매번 감동합니다.",
    author: "김OO",
    role: "양평 목조주택 건축주",
  },
  {
    id: 2,
    quote:
      "카페 오픈 후 '인테리어가 예쁘다'는 말을 가장 많이 듣습니다. 나무 향이 손님들에게도 좋은 인상을 줍니다.",
    author: "이OO",
    role: "서교동 카페 대표",
  },
  {
    id: 3,
    quote:
      "요사채 보수공사를 맡겼는데, 전통 기법에 대한 이해도가 남다르셨습니다. 신뢰할 수 있는 분입니다.",
    author: "법OO 스님",
    role: "해인사",
  },
  {
    id: 4,
    quote:
      "성당 제대를 새로 의뢰했는데, 기대 이상의 결과물이었습니다. 정성이 담긴 작업이라 교우들 모두 만족합니다.",
    author: "박OO",
    role: "OO성당 주임신부",
  },
];
