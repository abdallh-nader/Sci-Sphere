import { Chemical } from '../context/SimulationContext';

export const chemicals: Chemical[] = [
  // Acids
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    nameAr: 'حمض الهيدروكلوريك',
    color: '#DCFFDD',
    density: 1.49,
    state: 'liquid',
    formula: 'HCl'
  },
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    nameAr: 'حمض الكبريتيك',
    color: '#F5F6CE',
    density: 1.84,
    state: 'liquid',
    formula: 'H₂SO₄'
  },
  {
    id: 'hno3',
    name: 'Nitric Acid',
    nameAr: 'حمض النيتريك',
    color: '#FCEAEA',
    density: 1.51,
    state: 'liquid',
    formula: 'HNO₃'
  },
  {
    id: 'c2h4o2',
    name: 'Acetic Acid (Vinegar)',
    nameAr: 'حمض الخليك (الخل)',
    color: '#FFF8E1',
    density: 1.05,
    state: 'liquid',
    formula: 'CH₃COOH'
  },
  
  // Bases
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    nameAr: 'هيدروكسيد الصوديوم',
    color: '#F5F5F5',
    density: 2.13,
    state: 'solid',
    formula: 'NaOH'
  },
  {
    id: 'koh',
    name: 'Potassium Hydroxide',
    nameAr: 'هيدروكسيد البوتاسيوم',
    color: '#F2F2F2',
    density: 2.04,
    state: 'solid',
    formula: 'KOH'
  },
  {
    id: 'mgoh2',
    name: 'Magnesium Hydroxide',
    nameAr: 'هيدروكسيد المغنيسيوم',
    color: '#FFFFFF',
    density: 2.36,
    state: 'solid',
    formula: 'Mg(OH)₂'
  },
  {
    id: 'caoh2',
    name: 'Calcium Hydroxide',
    nameAr: 'هيدروكسيد الكالسيوم',
    color: '#F8F8F8',
    density: 2.21,
    state: 'solid',
    formula: 'Ca(OH)₂'
  },
  {
    id: 'baoh2',
    name: 'Barium Hydroxide',
    nameAr: 'هيدروكسيد الباريوم',
    color: '#FFFFFF',
    density: 3.74,
    state: 'solid',
    formula: 'Ba(OH)₂'
  },
  {
    id: 'nh4oh',
    name: 'Ammonium Hydroxide',
    nameAr: 'هيدروكسيد الأمونيوم',
    color: '#F5F5F5',
    density: 0.91,
    state: 'liquid',
    formula: 'NH₄OH'
  },
  
  // Salts
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    nameAr: 'كلوريد الصوديوم',
    color: '#FFFFFF',
    density: 2.16,
    state: 'solid',
    formula: 'NaCl'
  },
  {
    id: 'cuso4',
    name: 'Copper Sulfate',
    nameAr: 'كبريتات النحاس',
    color: '#1E90FF',
    density: 3.6,
    state: 'solid',
    formula: 'CuSO₄'
  },
  {
    id: 'agno3',
    name: 'Silver Nitrate',
    nameAr: 'نترات الفضة',
    color: '#E8E8E8',
    density: 4.35,
    state: 'solid',
    formula: 'AgNO₃'
  },
  {
    id: 'nahco3',
    name: 'Sodium Bicarbonate',
    nameAr: 'بيكربونات الصوديوم',
    color: '#FFFFFF',
    density: 2.20,
    state: 'solid',
    formula: 'NaHCO₃'
  },
  {
    id: 'na2co3',
    name: 'Sodium Carbonate',
    nameAr: 'كربونات الصوديوم',
    color: '#FFFFFF',
    density: 2.54,
    state: 'solid',
    formula: 'Na₂CO₃'
  },
  {
    id: 'mgcl2',
    name: 'Magnesium Chloride',
    nameAr: 'كلوريد المغنيسيوم',
    color: '#FFFFFF',
    density: 2.32,
    state: 'solid',
    formula: 'MgCl₂'
  },
  {
    id: 'mgso4',
    name: 'Magnesium Sulfate',
    nameAr: 'كبريتات المغنيسيوم',
    color: '#FFFFFF',
    density: 2.66,
    state: 'solid',
    formula: 'MgSO₄'
  },
  {
    id: 'znso4',
    name: 'Zinc Sulfate',
    nameAr: 'كبريتات الزنك',
    color: '#FFFFFF',
    density: 3.54,
    state: 'solid',
    formula: 'ZnSO₄'
  },
  {
    id: 'zncl2',
    name: 'Zinc Chloride',
    nameAr: 'كلوريد الزنك',
    color: '#FFFFFF',
    density: 2.91,
    state: 'solid',
    formula: 'ZnCl₂'
  },
  {
    id: 'na2so4',
    name: 'Sodium Sulfate',
    nameAr: 'كبريتات الصوديوم',
    color: '#FFFFFF',
    density: 2.68,
    state: 'solid',
    formula: 'Na₂SO₄'
  },
  {
    id: 'caso4',
    name: 'Calcium Sulfate',
    nameAr: 'كبريتات الكالسيوم',
    color: '#FFFFFF',
    density: 2.96,
    state: 'solid',
    formula: 'CaSO₄'
  },
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    nameAr: 'كربونات الكالسيوم',
    color: '#FFFFFF',
    density: 2.71,
    state: 'solid',
    formula: 'CaCO₃'
  },
  {
    id: 'feso4',
    name: 'Iron(II) Sulfate',
    nameAr: 'كبريتات الحديد(II)',
    color: '#CCFFCC',
    density: 3.10,
    state: 'solid',
    formula: 'FeSO₄'
  },
  {
    id: 'agcl',
    name: 'Silver Chloride',
    nameAr: 'كلوريد الفضة',
    color: '#F5F5F5',
    density: 5.56,
    state: 'solid',
    formula: 'AgCl'
  },
  {
    id: 'baso4',
    name: 'Barium Sulfate',
    nameAr: 'كبريتات الباريوم',
    color: '#FFFFFF',
    density: 4.49,
    state: 'solid',
    formula: 'BaSO₄'
  },
  {
    id: 'nh4cl',
    name: 'Ammonium Chloride',
    nameAr: 'كلوريد الأمونيوم',
    color: '#FFFFFF',
    density: 1.53,
    state: 'solid',
    formula: 'NH₄Cl'
  },
  {
    id: 'nano3',
    name: 'Sodium Nitrate',
    nameAr: 'نترات الصوديوم',
    color: '#FFFFFF',
    density: 2.26,
    state: 'solid',
    formula: 'NaNO₃'
  },
  {
    id: 'kno3',
    name: 'Potassium Nitrate',
    nameAr: 'نترات البوتاسيوم',
    color: '#FFFFFF',
    density: 2.11,
    state: 'solid',
    formula: 'KNO₃'
  },
  {
    id: 'mgno32',
    name: 'Magnesium Nitrate',
    nameAr: 'نترات المغنيسيوم',
    color: '#FFFFFF',
    density: 2.3,
    state: 'solid',
    formula: 'Mg(NO₃)₂'
  },
  {
    id: 'kbr',
    name: 'Potassium Bromide',
    nameAr: 'بروميد البوتاسيوم',
    color: '#FFFFFF',
    density: 2.75,
    state: 'solid',
    formula: 'KBr'
  },
  {
    id: 'nabr',
    name: 'Sodium Bromide',
    nameAr: 'بروميد الصوديوم',
    color: '#FFFFFF',
    density: 3.21,
    state: 'solid',
    formula: 'NaBr'
  },
  {
    id: 'ch3coona',
    name: 'Sodium Acetate',
    nameAr: 'أسيتات الصوديوم',
    color: '#FFFFFF',
    density: 1.53,
    state: 'solid',
    formula: 'CH₃COONa'
  },
  {
    id: 'pbi2',
    name: 'Lead(II) Iodide',
    nameAr: 'يوديد الرصاص(II)',
    color: '#FFFF00',
    density: 6.16,
    state: 'solid',
    formula: 'PbI₂'
  },
  
  // Metals
  {
    id: 'fe',
    name: 'Iron',
    nameAr: 'حديد',
    color: '#708090',
    density: 7.87,
    state: 'solid',
    formula: 'Fe'
  },
  {
    id: 'zn',
    name: 'Zinc',
    nameAr: 'زنك',
    color: '#D3D3D3',
    density: 7.14,
    state: 'solid',
    formula: 'Zn'
  },
  {
    id: 'cu',
    name: 'Copper',
    nameAr: 'نحاس',
    color: '#B87333',
    density: 8.96,
    state: 'solid',
    formula: 'Cu'
  },
  {
    id: 'na',
    name: 'Sodium',
    nameAr: 'صوديوم',
    color: '#C0C0C0',
    density: 0.97,
    state: 'solid',
    formula: 'Na'
  },
  {
    id: 'mg',
    name: 'Magnesium',
    nameAr: 'مغنيسيوم',
    color: '#C0C0C0',
    density: 1.74,
    state: 'solid',
    formula: 'Mg'
  },
  {
    id: 'ca',
    name: 'Calcium',
    nameAr: 'كالسيوم',
    color: '#C0C0C0',
    density: 1.55,
    state: 'solid',
    formula: 'Ca'
  },
  {
    id: 'al',
    name: 'Aluminum',
    nameAr: ' aluminum',
    color: '#D3D3D3',
    density: 2.70,
    state: 'solid',
    formula: 'Al'
  },
  {
    id: 'k',
    name: 'Potassium',
    nameAr: 'بوتاسيوم',
    color: '#C0C0C0',
    density: 0.89,
    state: 'solid',
    formula: 'K'
  },
  {
    id: 'ag',
    name: 'Silver',
    nameAr: 'فضة',
    color: '#C0C0C0',
    density: 10.49,
    state: 'solid',
    formula: 'Ag'
  },
  {
    id: 'pb',
    name: 'Lead',
    nameAr: 'رصاص',
    color: '#778899',
    density: 11.29,
    state: 'solid',
    formula: 'Pb'
  },
  
  // Indicators
  {
    id: 'phenol',
    name: 'Phenolphthalein',
    nameAr: 'فينولفثالين',
    color: '#FFFFFF',
    density: 1.277,
    state: 'liquid',
    formula: 'C₆H₄(OH)₂'
  },
  {
    id: 'methyl',
    name: 'Methyl Orange',
    nameAr: 'برتقالي الميثيل',
    color: '#FF5733',
    density: 1.28,
    state: 'liquid',
    formula: 'C₆H₅O'
  },
  
  // Other common chemicals
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide',
    nameAr: 'بيروكسيد الهيدروجين',
    color: '#E6F7FF',
    density: 1.45,
    state: 'liquid',
    formula: 'H₂O₂'
  },
  {
    id: 'h2o',
    name: 'Water',
    nameAr: 'ماء',
    color: '#D4F1F9',
    density: 1.0,
    state: 'liquid',
    formula: 'H₂O'
  },
  {
    id: 'c2h5oh',
    name: 'Ethanol',
    nameAr: 'إيثانول',
    color: '#F5F5F5',
    density: 0.789,
    state: 'liquid',
    formula: 'C₂H₅OH'
  },
  {
    id: 'ch4',
    name: 'Methane',
    nameAr: 'ميثان',
    color: '#FAFAFA',
    density: 0.657,
    state: 'gas',
    formula: 'CH₄'
  },
  {
    id: 'o2',
    name: 'Oxygen',
    nameAr: 'أكسجين',
    color: '#E3F2FD',
    density: 1.429,
    state: 'gas',
    formula: 'O₂'
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    nameAr: 'ثاني أكسيد الكربون',
    color: '#FFFFFF',
    density: 1.977,
    state: 'gas',
    formula: 'CO₂'
  },
  {
    id: 'h2',
    name: 'Hydrogen',
    nameAr: 'هيدروجين',
    color: '#F5F5F5',
    density: 0.0899,
    state: 'gas',
    formula: 'H₂'
  },
  {
    id: 'no2',
    name: 'Nitrogen Dioxide',
    nameAr: 'ثاني أكسيد النيتروجين',
    color: '#BF360C',
    density: 1.88,
    state: 'gas',
    formula: 'NO₂'
  },
  {
    id: 'cl2',
    name: 'Chlorine',
    nameAr: 'كلور',
    color: '#AAFF00',
    density: 3.214,
    state: 'gas',
    formula: 'Cl₂'
  },
  {
    id: 'br2',
    name: 'Bromine',
    nameAr: 'بروم',
    color: '#A52A2A',
    density: 3.1028,
    state: 'liquid',
    formula: 'Br₂'
  },
  {
    id: 'i2',
    name: 'Iodine',
    nameAr: 'يود',
    color: '#4B0082',
    density: 4.933,
    state: 'solid',
    formula: 'I₂'
  },
  {
    id: 's',
    name: 'Sulfur',
    nameAr: 'كبريت',
    color: '#FFFF00',
    density: 2.07,
    state: 'solid',
    formula: 'S'
  },
  {
    id: 'c',
    name: 'Carbon',
    nameAr: 'كربون',
    color: '#000000',
    density: 2.267,
    state: 'solid',
    formula: 'C'
  },
  {
    id: 'n2',
    name: 'Nitrogen',
    nameAr: 'نيتروجين',
    color: '#E6F7FF',
    density: 1.251,
    state: 'gas',
    formula: 'N₂'
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    nameAr: 'أمونيا',
    color: '#F5F5F5',
    density: 0.769,
    state: 'gas',
    formula: 'NH₃'
  },
  {
    id: 'so2',
    name: 'Sulfur Dioxide',
    nameAr: 'ثاني أكسيد الكبريت',
    color: '#FFFFFF',
    density: 2.6288,
    state: 'gas',
    formula: 'SO₂'
  },
  {
    id: 'co',
    name: 'Carbon Monoxide',
    nameAr: 'أول أكسيد الكربون',
    color: '#FFFFFF',
    density: 1.145,
    state: 'gas',
    formula: 'CO'
  },
  {
    id: 'cuo',
    name: 'Copper(II) Oxide',
    nameAr: 'أكسيد النحاس(II)',
    color: '#000000',
    density: 6.315,
    state: 'solid',
    formula: 'CuO'
  },
  {
    id: 'cao',
    name: 'Calcium Oxide',
    nameAr: 'أكسيد الكالسيوم',
    color: '#FFFFFF',
    density: 3.34,
    state: 'solid',
    formula: 'CaO'
  },
  {
    id: 'fe2o3',
    name: 'Iron(III) Oxide',
    nameAr: 'أكسيد الحديد(III)',
    color: '#A52A2A',
    density: 5.242,
    state: 'solid',
    formula: 'Fe₂O₃'
  },
  {
    id: 'mgo',
    name: 'Magnesium Oxide',
    nameAr: 'أكسيد المغنيسيوم',
    color: '#FFFFFF',
    density: 3.58,
    state: 'solid',
    formula: 'MgO'
  },
  {
    id: 'al2o3',
    name: 'Aluminum Oxide',
    nameAr: 'أكسيد الألومنيوم',
    color: '#FFFFFF',
    density: 3.95,
    state: 'solid',
    formula: 'Al₂O₃'
  },
  {
    id: 'cus',
    name: 'Copper(II) Sulfide',
    nameAr: 'كبريتيد النحاس(II)',
    color: '#000000',
    density: 5.6,
    state: 'solid',
    formula: 'CuS'
  },
  {
    id: 'kclo3',
    name: 'Potassium Chlorate',
    nameAr: 'كلورات البوتاسيوم',
    color: '#FFFFFF',
    density: 2.32,
    state: 'solid',
    formula: 'KClO₃'
  },
  {
    id: 'kcl',
    name: 'Potassium Chloride',
    nameAr: 'كلوريد البوتاسيوم',
    color: '#FFFFFF',
    density: 1.98,
    state: 'solid',
    formula: 'KCl'
  },
  {
    id: 'ki',
    name: 'Potassium Iodide',
    nameAr: 'يوديد البوتاسيوم',
    color: '#FFFFFF',
    density: 3.13,
    state: 'solid',
    formula: 'KI'
  },
  {
    id: 'fecl3',
    name: 'Iron(III) Chloride',
    nameAr: 'كلوريد الحديد(III)',
    color: '#964B00',
    density: 2.9,
    state: 'solid',
    formula: 'FeCl₃'
  },
  {
    id: 'feoh3',
    name: 'Iron(III) Hydroxide',
    nameAr: 'هيدروكسيد الحديد(III)',
    color: '#A52A2A',
    density: 3.4,
    state: 'solid',
    formula: 'Fe(OH)₃'
  },
  {
    id: 'znoh2',
    name: 'Zinc Hydroxide',
    nameAr: 'هيدروكسيد الزنك',
    color: '#FFFFFF',
    density: 3.053,
    state: 'solid',
    formula: 'Zn(OH)₂'
  }
];
