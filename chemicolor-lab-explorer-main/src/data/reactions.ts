import { Reaction } from '../context/SimulationContext';

export const reactions: Reaction[] = [
  // Acid-Base Reactions
  {
    id: 'acid-base-1',
    name: 'تعادل حمض وقاعدة – Acid-Base Neutralization',
    nameAr: 'تعادل حمض وقاعدة – Acid-Base Neutralization',
    description: "This reaction produces sodium chloride (table salt) and water. It's a classic neutralization reaction.",
    descriptionAr: "يُنتج هذا التفاعل كلوريد الصوديوم (ملح الطعام) والماء. إنه تفاعل تعادل كلاسيكي.",
    reactants: ['hcl', 'naoh'],
    products: ['nacl', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F5F5F5',
      bubbles: false,
      precipitate: true,
      temperature: 'increase'
    }
  },
  
  // Metal-Acid Reactions
  {
    id: 'metal-acid-1',
    name: 'تفاعل الزنك مع الحمض – Zinc-Acid Reaction',
    nameAr: 'تفاعل الزنك مع الحمض – Zinc-Acid Reaction',
    description: 'Zinc metal reacts with hydrochloric acid to produce zinc chloride and hydrogen gas. The bubbles you see are hydrogen gas being released.',
    descriptionAr: 'يتفاعل معدن الزنك مع حمض الهيدروكلوريك لإنتاج كلوريد الزنك وغاز الهيدروجين. الفقاعات التي تراها هي غاز الهيدروجين المنبعث.',
    reactants: ['zn', 'hcl'],
    products: ['zncl2', 'h2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#E6E6E6',
      bubbles: true,
      temperature: 'increase'
    }
  },
  
  // Precipitation Reactions
  {
    id: 'precipitation-1',
    name: 'تفاعل كبريتات النحاس مع هيدروكسيد الصوديوم – Copper Sulfate and Sodium Hydroxide Reaction',
    nameAr: 'تفاعل كبريتات النحاس مع هيدروكسيد الصوديوم – Copper Sulfate and Sodium Hydroxide Reaction',
    description: 'This reaction forms a blue precipitate of copper(II) hydroxide.',
    descriptionAr: 'يشكل هذا التفاعل راسبًا أزرقًا من هيدروكسيد النحاس(II).',
    reactants: ['cuso4', 'naoh'],
    products: ['cu', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#007FFF',
      precipitate: true
    }
  },
  
  // Redox Reactions
  {
    id: 'redox-1',
    name: 'تفاعل النحاس مع الحمض – Copper-Acid Reaction',
    nameAr: 'تفاعل النحاس مع الحمض – Copper-Acid Reaction',
    description: 'Copper metal reacts with nitric acid to produce copper nitrate, water, and nitrogen dioxide gas (reddish-brown).',
    descriptionAr: 'يتفاعل معدن النحاس مع حمض النيتريك لإنتاج نترات النحاس والماء وغاز ثاني أكسيد النيتروجين (بني محمر).',
    reactants: ['cu', 'hno3'],
    products: ['nano3', 'no2', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#64AAD0',
      smoke: true,
      bubbles: true,
      temperature: 'increase'
    }
  },
  
  // Catalytic Reactions
  {
    id: 'catalytic-1',
    name: 'تحلل فوق أكسيد الهيدروجين – Hydrogen Peroxide Decomposition',
    nameAr: 'تحلل فوق أكسيد الهيدروجين – Hydrogen Peroxide Decomposition',
    description: 'Hydrogen peroxide decomposes into water and oxygen gas when catalyzed. The rapid production of oxygen creates bubbles and foam.',
    descriptionAr: 'يتحلل بيروكسيد الهيدروجين إلى ماء وغاز الأكسجين عند وجود محفز. الإنتاج السريع للأكسجين يخلق فقاعات ورغوة.',
    reactants: ['h2o2', 'fe'],
    products: ['h2o', 'o2'],
    conditions: {
      temperature: 25,
      pressure: 1,
      catalyst: 'fe'
    },
    effects: {
      color: '#FFFFFF',
      bubbles: true,
      temperature: 'increase'
    }
  },
  
  // New Reactions from the user's request
  {
    id: 'combustion-1',
    name: 'تكوين الماء – Water Formation',
    nameAr: 'تكوين الماء – Water Formation',
    description: '2H₂ + O₂ → 2H₂O - This is a highly exothermic reaction that produces water.',
    descriptionAr: '2H₂ + O₂ → 2H₂O - هذا تفاعل شديد الحرارة ينتج الماء.',
    reactants: ['h2', 'o2'],
    products: ['h2o'],
    conditions: {
      temperature: 400,
      pressure: 1
    },
    effects: {
      color: '#D4F1F9',
      bubbles: false,
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'metal-nonmetal-1',
    name: 'تكوين ملح الطعام – Salt Formation',
    nameAr: 'تكوين ملح الطعام – Salt Formation',
    description: '2Na + Cl₂ → 2NaCl - Sodium metal reacts vigorously with chlorine gas to form sodium chloride (table salt).',
    descriptionAr: '2Na + Cl₂ → 2NaCl - يتفاعل معدن الصوديوم بقوة مع غاز الكلور لتكوين كلوريد الصوديوم (ملح الطعام).',
    reactants: ['na', 'cl2'],
    products: ['nacl'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'metal-nonmetal-2',
    name: 'احتراق المغنيسيوم – Magnesium Combustion',
    nameAr: 'احتراق المغنيسيوم – Magnesium Combustion',
    description: '2Mg + O₂ → 2MgO - Magnesium burns brightly in oxygen to form magnesium oxide.',
    descriptionAr: '2Mg + O₂ → 2MgO - يحترق المغنيسيوم بشكل ساطع في الأكسجين لتكوين أكسيد المغنيسيوم.',
    reactants: ['mg', 'o2'],
    products: ['mgo'],
    conditions: {
      temperature: 400,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'metal-water-1',
    name: 'تفاعل الكالسيوم مع الماء – Calcium-Water Reaction',
    nameAr: 'تفاعل الكالسيوم مع الماء – Calcium-Water Reaction',
    description: 'Ca + 2H₂O → Ca(OH)₂ + H₂ - Calcium reacts with water to produce calcium hydroxide and hydrogen gas.',
    descriptionAr: 'Ca + 2H₂O → Ca(OH)₂ + H₂ - يتفاعل الكالسيوم مع الماء لإنتاج هيدروكسيد الكالسيوم وغاز الهيدروجين.',
    reactants: ['ca', 'h2o'],
    products: ['caoh2', 'h2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F8F8F8',
      bubbles: true,
      temperature: 'increase'
    }
  },
  {
    id: 'combustion-2',
    name: 'احتراق الكبريت – Sulfur Combustion',
    nameAr: 'احتراق الكبريت – Sulfur Combustion',
    description: 'S + O₂ → SO₂ - Sulfur burns in oxygen to form sulfur dioxide, a toxic gas with a pungent odor.',
    descriptionAr: 'S + O₂ → SO₂ - يحترق الكبريت في الأكسجين لتكوين ثاني أكسيد الكبريت، وهو غاز سام ذو رائحة نفاذة.',
    reactants: ['s', 'o2'],
    products: ['so2'],
    conditions: {
      temperature: 300,
      pressure: 1
    },
    effects: {
      color: '#FFFF00',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'redox-2',
    name: 'تكوين صدأ الحديد – Iron Rust Formation',
    nameAr: 'تكوين صدأ الحديد – Iron Rust Formation',
    description: '4Fe + 3O₂ → 2Fe₂O₃ - Iron oxidizes (rusts) in the presence of oxygen to form iron(III) oxide.',
    descriptionAr: '4Fe + 3O₂ → 2Fe₂O₃ - يتأكسد الحديد (يصدأ) في وجود الأكسجين لتكوين أكسيد الحديد(III).',
    reactants: ['fe', 'o2'],
    products: ['fe2o3'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#A52A2A',
      temperature: 'increase'
    }
  },
  {
    id: 'combustion-3',
    name: 'احتراق الكربون – Carbon Combustion',
    nameAr: 'احتراق الكربون – Carbon Combustion',
    description: 'C + O₂ → CO₂ - Carbon burns in oxygen to produce carbon dioxide.',
    descriptionAr: 'C + O₂ → CO₂ - يحترق الكربون في الأكسجين لإنتاج ثاني أكسيد الكربون.',
    reactants: ['c', 'o2'],
    products: ['co2'],
    conditions: {
      temperature: 500,
      pressure: 1
    },
    effects: {
      color: '#000000',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'acid-base-2',
    name: 'تكوين كلوريد الأمونيوم – Ammonium Chloride Formation',
    nameAr: 'تكوين كلوريد الأمونيوم – Ammonium Chloride Formation',
    description: 'NH₃ + HCl → NH₄Cl - Ammonia gas reacts with hydrochloric acid to form ammonium chloride salt.',
    descriptionAr: 'NH₃ + HCl → NH₄Cl - يتفاعل غاز الأمونيا مع حمض الهيدروكلوريك لتكوين ملح كلوريد الأمونيوم.',
    reactants: ['nh3', 'hcl'],
    products: ['nh4cl'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'redox-3',
    name: 'تفاعل الإزاحة بين النحاس والزنك – Copper-Zinc Displacement Reaction',
    nameAr: 'تفاعل الإزاحة بين النحاس والزنك – Copper-Zinc Displacement Reaction',
    description: 'CuSO₄ + Zn → ZnSO₄ + Cu - A single displacement reaction where zinc displaces copper from copper sulfate solution.',
    descriptionAr: 'CuSO₄ + Zn → ZnSO₄ + Cu - تفاعل إزاحة أحادي حيث يحل الزنك محل النحاس من محلول كبريتات النحاس.',
    reactants: ['cuso4', 'zn'],
    products: ['znso4', 'cu'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#1E90FF',
      precipitate: true
    }
  },
  {
    id: 'gas-formation-1',
    name: 'تفاعل الخل مع بيكربونات الصوديوم – Vinegar and Baking Soda Reaction',
    nameAr: 'تفاعل الخل مع بيكربونات الصوديوم – Vinegar and Baking Soda Reaction',
    description: 'CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O - This reaction produces bubbles of carbon dioxide gas.',
    descriptionAr: 'CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O - ينتج هذا التفاعل فقاعات من غاز ثاني أكسيد الكربون.',
    reactants: ['c2h4o2', 'nahco3'],
    products: ['ch3coona', 'co2', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFF8E1',
      bubbles: true
    }
  },
  {
    id: 'metal-acid-2',
    name: 'تفاعل المغنيسيوم مع الحمض – Magnesium-Acid Reaction',
    nameAr: 'تفاعل المغنيسيوم مع الحمض – Magnesium-Acid Reaction',
    description: 'Mg + 2HCl → MgCl₂ + H₂ - Magnesium reacts with hydrochloric acid to produce magnesium chloride and hydrogen gas.',
    descriptionAr: 'Mg + 2HCl → MgCl₂ + H₂ - يتفاعل المغنيسيوم مع حمض الهيدروكلوريك لإنتاج كلوريد المغنيسيوم وغاز الهيدروجين.',
    reactants: ['mg', 'hcl'],
    products: ['mgcl2', 'h2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      bubbles: true,
      temperature: 'increase'
    }
  },
  {
    id: 'acid-base-3',
    name: 'تعادل حمض وقاعدة – Acid-Base Neutralization',
    nameAr: 'تعادل حمض وقاعدة – Acid-Base Neutralization',
    description: 'NaOH + HCl → NaCl + H₂O - A classic acid-base neutralization reaction that produces salt and water.',
    descriptionAr: 'NaOH + HCl → NaCl + H₂O - تفاعل تعادل حمض-قاعدة كلاسيكي ينتج الملح والماء.',
    reactants: ['naoh', 'hcl'],
    products: ['nacl', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F5F5F5',
      temperature: 'increase'
    }
  },
  {
    id: 'catalytic-2',
    name: 'تكوين الأمونيا – Ammonia Formation',
    nameAr: 'تكوين الأمونيا – Ammonia Formation',
    description: 'N₂ + 3H₂ → 2NH₃ - The Haber process for ammonia production, which requires high pressure, temperature, and an iron catalyst.',
    descriptionAr: 'N₂ + 3H₂ → 2NH₃ - عملية هابر لإنتاج الأمونيا، والتي تتطلب ضغطًا عاليًا ودرجة حرارة عالية ومحفزًا من الحديد.',
    reactants: ['n2', 'h2'],
    products: ['nh3'],
    conditions: {
      temperature: 450,
      pressure: 200,
      catalyst: 'fe'
    },
    effects: {
      color: '#F5F5F5',
      temperature: 'decrease'
    }
  },
  {
    id: 'decomposition-1',
    name: 'تحلل كربونات الكالسيوم – Calcium Carbonate Decomposition',
    nameAr: 'تحلل كربونات الكالسيوم – Calcium Carbonate Decomposition',
    description: 'CaCO₃ → CaO + CO₂ - When heated, calcium carbonate decomposes to form calcium oxide and carbon dioxide.',
    descriptionAr: 'CaCO₃ → CaO + CO₂ - عند التسخين، تتحلل كربونات الكالسيوم لتكوين أكسيد الكالسيوم وثاني أكسيد الكربون.',
    reactants: ['caco3'],
    products: ['cao', 'co2'],
    conditions: {
      temperature: 900,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      bubbles: true
    }
  },
  {
    id: 'metal-water-2',
    name: 'تفاعل الصوديوم مع الماء – Sodium-Water Reaction',
    nameAr: 'تفاعل الصوديوم مع الماء – Sodium-Water Reaction',
    description: '2Na + 2H₂O → 2NaOH + H₂ - Sodium reacts vigorously with water to produce sodium hydroxide and hydrogen gas.',
    descriptionAr: '2Na + 2H₂O → 2NaOH + H₂ - يتفاعل الصوديوم بقوة مع الماء لإنتاج هيدروكسيد الصوديوم وغاز الهيدروجين.',
    reactants: ['na', 'h2o'],
    products: ['naoh', 'h2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F5F5F5',
      bubbles: true,
      temperature: 'increase'
    }
  },
  {
    id: 'acid-oxide-1',
    name: 'تفاعل حمض الكبريتيك مع أكسيد النحاس – Sulfuric Acid and Copper Oxide Reaction',
    nameAr: 'تفاعل حمض الكبريتيك مع أكسيد النحاس – Sulfuric Acid and Copper Oxide Reaction',
    description: 'CuO + H₂SO₄ → CuSO₄ + H₂O - Copper(II) oxide reacts with sulfuric acid to form copper(II) sulfate and water.',
    descriptionAr: 'CuO + H₂SO₄ → CuSO₄ + H₂O - يتفاعل أكسيد النحاس(II) مع حمض الكبريتيك لتكوين كبريتات النحاس(II) والماء.',
    reactants: ['cuo', 'h2so4'],
    products: ['cuso4', 'h2o'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#1E90FF',
      temperature: 'increase'
    }
  },
  {
    id: 'redox-4',
    name: 'استخلاص الحديد من أكسيده – Iron Extraction from Oxide',
    nameAr: 'استخلاص الحديد من أكسيده – Iron Extraction from Oxide',
    description: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂ - This is the basis of iron smelting in blast furnaces.',
    descriptionAr: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂ - هذا هو أساس صهر الحديد في الأفران العالية.',
    reactants: ['fe2o3', 'co'],
    products: ['fe', 'co2'],
    conditions: {
      temperature: 800,
      pressure: 1
    },
    effects: {
      color: '#708090',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'double-displacement-1',
    name: 'تفاعل نترات الفضة مع كلوريد الصوديوم – Silver Nitrate and Sodium Chloride Reaction',
    nameAr: 'تفاعل نترات الفضة مع كلوريد الصوديوم – Silver Nitrate and Sodium Chloride Reaction',
    description: 'AgNO₃ + NaCl → AgCl + NaNO₃ - A double displacement reaction that forms silver chloride precipitate.',
    descriptionAr: 'AgNO₃ + NaCl → AgCl + NaNO₃ - تفاعل إزاحة مزدوج يشكل راسب كلوريد الفضة.',
    reactants: ['agno3', 'nacl'],
    products: ['agcl', 'nano3'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F5F5F5',
      precipitate: true
    }
  },
  {
    id: 'precipitation-2',
    name: 'تفاعل هيدروكسيد الباريوم مع كبريتات الأمونيوم – Barium Hydroxide and Ammonium Sulfate Reaction',
    nameAr: 'تفاعل هيدروكسيد الباريوم مع كبريتات الأمونيوم – Barium Hydroxide and Ammonium Sulfate Reaction',
    description: 'Ba(OH)₂ + (NH₄)₂SO₄ → BaSO₄ + 2NH₄OH - This reaction forms a white precipitate of barium sulfate.',
    descriptionAr: 'Ba(OH)₂ + (NH₄)₂SO₄ → BaSO₄ + 2NH₄OH - يشكل هذا التفاعل راسبًا أبيض من كبريتات الباريوم.',
    reactants: ['baoh2', 'h2so4'],
    products: ['baso4', 'nh4oh'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      precipitate: true
    }
  },
  {
    id: 'double-displacement-2',
    name: 'تفاعل يوديد البوتاسيوم مع نترات الرصاص – Reaction of Potassium Iodide with Lead Nitrate',
    nameAr: 'تفاعل يوديد البوتاسيوم مع نترات الرصاص – Reaction of Potassium Iodide with Lead Nitrate',
    description: 'Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃ - This reaction forms a bright yellow precipitate of lead(II) iodide.',
    descriptionAr: 'Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃ - يشكل هذا التفاعل راسبًا أصفر ساطع من يوديد الرصاص(II).',
    reactants: ['pbno32', 'ki'],
    products: ['pbi2', 'kno3'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFF00',
      precipitate: true
    }
  },
  {
    id: 'acid-base-4',
    name: 'تفاعل الأمونيا مع الماء – Reaction of Ammonia with Water',
    nameAr: 'تفاعل الأمونيا مع الماء – Reaction of Ammonia with Water',
    description: 'NH₃ + H₂O → NH₄OH - Ammonia dissolves in water to form a basic solution of ammonium hydroxide.',
    descriptionAr: 'NH₃ + H₂O → NH₄OH - تذوب الأمونيا في الماء لتكوين محلول قاعدي من هيدروكسيد الأمونيوم.',
    reactants: ['nh3', 'h2o'],
    products: ['nh4oh'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#F5F5F5'
    }
  },
  {
    id: 'decomposition-2',
    name: 'تحلل بيروكسيد الهيدروجين – Decomposition of Hydrogen Peroxide',
    nameAr: 'تحلل بيروكسيد الهيدروجين – Decomposition of Hydrogen Peroxide',
    description: '2H₂O₂ → 2H₂O + O₂ - Hydrogen peroxide decomposes to form water and oxygen gas.',
    descriptionAr: '2H₂O₂ → 2H₂O + O₂ - يتحلل بيروكسيد الهيدروجين لتكوين الماء وغاز الأكسجين.',
    reactants: ['h2o2'],
    products: ['h2o', 'o2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#E6F7FF',
      bubbles: true
    }
  },
  {
    id: 'metal-nonmetal-3',
    name: 'تفاعل الصوديوم مع البروم – Reaction of Sodium with Bromine',
    nameAr: 'تفاعل الصوديوم مع البروم – Reaction of Sodium with Bromine',
    description: '2Na + Br₂ → 2NaBr - Sodium reacts with bromine to form sodium bromide.',
    descriptionAr: '2Na + Br₂ → 2NaBr - يتفاعل الصوديوم مع البروم لتكوين بروميد الصوديوم.',
    reactants: ['na', 'br2'],
    products: ['nabr'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#A52A2A',
      smoke: true,
      temperature: 'increase'
    }
  },
  {
    id: 'precipitation-3',
    name: 'تفاعل كلوريد الحديد(III) مع هيدروكسيد الصوديوم – Reaction of Iron(III) Chloride with Sodium Hydroxide',
    nameAr: 'تفاعل كلوريد الحديد(III) مع هيدروكسيد الصوديوم – Reaction of Iron(III) Chloride with Sodium Hydroxide',
    description: 'FeCl₃ + 3NaOH → Fe(OH)₃ + 3NaCl - This reaction forms a brown precipitate of iron(III) hydroxide.',
    descriptionAr: 'FeCl₃ + 3NaOH → Fe(OH)₃ + 3NaCl - يشكل هذا التفاعل راسبًا بنيًا من هيدروكسيد الحديد(III).',
    reactants: ['fecl3', 'naoh'],
    products: ['feoh3', 'nacl'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#A52A2A',
      precipitate: true
    }
  },
  {
    id: 'combustion-4',
    name: 'احتراق أول أكسيد الكربون – Combustion of Carbon Monoxide',
    nameAr: 'احتراق أول أكسيد الكربون – Combustion of Carbon Monoxide',
    description: '2CO + O₂ → 2CO₂ - Carbon monoxide burns in oxygen to form carbon dioxide.',
    descriptionAr: '2CO + O₂ → 2CO₂ - يحترق أول أكسيد الكربون في الأكسجين لتكوين ثاني أكسيد الكربون.',
    reactants: ['co', 'o2'],
    products: ['co2'],
    conditions: {
      temperature: 400,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      temperature: 'increase'
    }
  },
  {
    id: 'metal-nonmetal-4',
    name: 'تكوين كبريتيد النحاس – Formation of Copper Sulfide',
    nameAr: 'تكوين كبريتيد النحاس – Formation of Copper Sulfide',
    description: 'Cu + S → CuS - When heated, copper reacts with sulfur to form copper(II) sulfide.',
    descriptionAr: 'Cu + S → CuS - عند التسخين، يتفاعل النحاس مع الكبريت لتكوين كبريتيد النحاس(II).',
    reactants: ['cu', 's'],
    products: ['cus'],
    conditions: {
      temperature: 500,
      pressure: 1
    },
    effects: {
      color: '#000000',
      temperature: 'increase'
    }
  },
  {
    id: 'precipitation-4',
    name: 'تفاعل هيدروكسيد الصوديوم مع كبريتات الزنك – Reaction of Sodium Hydroxide with Zinc Sulfate',
    nameAr: 'تفاعل هيدروكسيد الصوديوم مع كبريتات الزنك – Reaction of Sodium Hydroxide with Zinc Sulfate',
    description: '2NaOH + ZnSO₄ → Na₂SO₄ + Zn(OH)₂ - This reaction forms a white precipitate of zinc hydroxide.',
    descriptionAr: '2NaOH + ZnSO₄ → Na₂SO₄ + Zn(OH)₂ - يشكل هذا التفاعل راسبًا أبيض من هيدروكسيد الزنك.',
    reactants: ['naoh', 'znso4'],
    products: ['na2so4', 'znoh2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      precipitate: true
    }
  },
  {
    id: 'metal-acid-3',
    name: 'تفاعل المغنيسيوم مع حمض النيتريك – Reaction of Magnesium with Nitric Acid',
    nameAr: 'تفاعل المغنيسيوم مع حمض النيتريك – Reaction of Magnesium with Nitric Acid',
    description: 'Mg + 2HNO₃ → Mg(NO₃)₂ + H₂ - Magnesium reacts with nitric acid to produce magnesium nitrate and hydrogen gas.',
    descriptionAr: 'Mg + 2HNO₃ → Mg(NO₃)₂ + H₂ - يتفاعل المغنيسيوم مع حمض النيتريك لإنتاج نترات المغنيسيوم وغاز الهيدروجين.',
    reactants: ['mg', 'hno3'],
    products: ['mgno32', 'h2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      bubbles: true,
      temperature: 'increase'
    }
  },
  {
    id: 'displacement-1',
    name: 'تفاعل البروم مع يوديد البوتاسيوم – Reaction of Bromine with Potassium Iodide',
    nameAr: 'تفاعل البروم مع يوديد البوتاسيوم – Reaction of Bromine with Potassium Iodide',
    description: 'Br₂ + 2KI → 2KBr + I₂ - Bromine displaces iodine from potassium iodide solution.',
    descriptionAr: 'Br₂ + 2KI → 2KBr + I₂ - يزيح البروم اليود من محلول يوديد البوتاسيوم.',
    reactants: ['br2', 'ki'],
    products: ['kbr', 'i2'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#4B0082',
      temperature: 'increase'
    }
  },
  {
    id: 'decomposition-3',
    name: 'تحلل كلورات البوتاسيوم – Decomposition of Potassium Chlorate',
    nameAr: 'تحلل كلورات البوتاسيوم – Decomposition of Potassium Chlorate',
    description: '2KClO₃ → 2KCl + 3O₂ - When heated, potassium chlorate decomposes to form potassium chloride and oxygen gas.',
    descriptionAr: '2KClO₃ → 2KCl + 3O₂ - عند التسخين، تتحلل كلورات البوتاسيوم لتكوين كلوريد البوتاسيوم وغاز الأكسجين.',
    reactants: ['kclo3'],
    products: ['kcl', 'o2'],
    conditions: {
      temperature: 400,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      bubbles: true,
      temperature: 'decrease'
    }
  },
  {
    id: 'double-displacement-3',
    name: 'تفاعل كبريتات الكالسيوم مع كربونات الصوديوم – Reaction of Calcium Sulfate with Sodium Carbonate',
    nameAr: 'تفاعل كبريتات الكالسيوم مع كربونات الصوديوم – Reaction of Calcium Sulfate with Sodium Carbonate',
    description: 'CaSO₄ + Na₂CO₃ → CaCO₃ + Na₂SO₄ - A double displacement reaction that forms calcium carbonate precipitate.',
    descriptionAr: 'CaSO₄ + Na₂CO₃ → CaCO₃ + Na₂SO₄ - تفاعل إزاحة مزدوج يشكل راسب كربونات الكالسيوم.',
    reactants: ['caso4', 'na2co3'],
    products: ['caco3', 'na2so4'],
    conditions: {
      temperature: 25,
      pressure: 1
    },
    effects: {
      color: '#FFFFFF',
      precipitate: true
    }
  }
];
