import 'reflect-metadata';
import AppDataSource from '../data-source';
import { ExamCategory } from '../../entities/exam-category.entity';
import { ExamCatalog } from '../../entities/exam-catalog.entity';

const CATEGORIES = [
  'Hemograma',
  'Bioquímica',
  'Hormônios',
  'Urina',
  'Imunologia',
  'Microbiologia',
];

interface ExamSeedData {
  name: string;
  synonyms: string;
  categoryName: string;
  preparationInstructions: string;
  estimatedDuration: number;
  price: number;
}

const EXAMS: ExamSeedData[] = [
  // Hemograma
  {
    name: 'Hemograma Completo',
    synonyms: 'CBC, blood count, contagem sanguínea',
    categoryName: 'Hemograma',
    preparationInstructions: 'Jejum de 4 horas. Evitar atividade física intensa nas 24h anteriores.',
    estimatedDuration: 30,
    price: 35.00,
  },
  {
    name: 'Coagulograma',
    synonyms: 'TP, TTPA, tempo de protrombina, coagulação',
    categoryName: 'Hemograma',
    preparationInstructions: 'Jejum de 4 horas. Informar uso de anticoagulantes.',
    estimatedDuration: 30,
    price: 45.00,
  },
  {
    name: 'Velocidade de Hemossedimentação (VHS)',
    synonyms: 'VHS, ESR, eritrossedimentação',
    categoryName: 'Hemograma',
    preparationInstructions: 'Jejum não obrigatório. Evitar atividade física intensa.',
    estimatedDuration: 20,
    price: 25.00,
  },
  {
    name: 'Reticulócitos',
    synonyms: 'contagem de reticulócitos, reticulocyte count',
    categoryName: 'Hemograma',
    preparationInstructions: 'Jejum de 4 horas.',
    estimatedDuration: 20,
    price: 30.00,
  },

  // Bioquímica
  {
    name: 'Glicemia em Jejum',
    synonyms: 'glicose, glucose, açúcar no sangue, fasting glucose',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum obrigatório de 8 horas. Beber apenas água.',
    estimatedDuration: 20,
    price: 20.00,
  },
  {
    name: 'Hemoglobina Glicada (HbA1c)',
    synonyms: 'HbA1c, A1C, glicohemoglobina',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum não obrigatório.',
    estimatedDuration: 20,
    price: 40.00,
  },
  {
    name: 'Colesterol Total e Frações',
    synonyms: 'colesterol, LDL, HDL, VLDL, triglicerídeos, lipidograma',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum obrigatório de 12 horas. Evitar álcool 72h antes.',
    estimatedDuration: 30,
    price: 55.00,
  },
  {
    name: 'Creatinina',
    synonyms: 'creatinine, função renal',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum de 4 horas. Evitar carne vermelha no dia anterior.',
    estimatedDuration: 20,
    price: 20.00,
  },
  {
    name: 'Ureia',
    synonyms: 'urea, BUN, nitrogênio ureico',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum de 4 horas.',
    estimatedDuration: 20,
    price: 20.00,
  },
  {
    name: 'TGO e TGP (Transaminases)',
    synonyms: 'AST, ALT, TGO, TGP, transaminases, função hepática',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum de 4 horas. Evitar atividade física intensa 24h antes.',
    estimatedDuration: 20,
    price: 35.00,
  },
  {
    name: 'Ácido Úrico',
    synonyms: 'uric acid, gota',
    categoryName: 'Bioquímica',
    preparationInstructions: 'Jejum de 4 horas. Evitar alimentos ricos em purinas.',
    estimatedDuration: 20,
    price: 20.00,
  },

  // Hormônios
  {
    name: 'TSH (Hormônio Estimulante da Tireoide)',
    synonyms: 'TSH, thyroid stimulating hormone, tireoide',
    categoryName: 'Hormônios',
    preparationInstructions: 'Jejum de 4 horas. Coletar preferencialmente pela manhã.',
    estimatedDuration: 20,
    price: 45.00,
  },
  {
    name: 'T4 Livre',
    synonyms: 'T4 livre, free T4, tiroxina livre',
    categoryName: 'Hormônios',
    preparationInstructions: 'Jejum de 4 horas. Informar uso de medicamentos para tireoide.',
    estimatedDuration: 20,
    price: 45.00,
  },
  {
    name: 'Testosterona Total',
    synonyms: 'testosterone, testosterona',
    categoryName: 'Hormônios',
    preparationInstructions: 'Jejum de 4 horas. Coletar entre 7h e 10h da manhã.',
    estimatedDuration: 20,
    price: 50.00,
  },
  {
    name: 'Insulina',
    synonyms: 'insulin, insulina basal',
    categoryName: 'Hormônios',
    preparationInstructions: 'Jejum obrigatório de 8 horas.',
    estimatedDuration: 20,
    price: 50.00,
  },

  // Urina
  {
    name: 'Urina Tipo I (EAS)',
    synonyms: 'EAS, urinálise, urinalysis, urina rotina',
    categoryName: 'Urina',
    preparationInstructions: 'Coletar a primeira urina da manhã (jato médio). Higienizar a região genital antes da coleta.',
    estimatedDuration: 20,
    price: 20.00,
  },
  {
    name: 'Urocultura',
    synonyms: 'urine culture, cultura de urina, infecção urinária',
    categoryName: 'Urina',
    preparationInstructions: 'Coletar a primeira urina da manhã em frasco estéril. Higienizar a região genital antes da coleta.',
    estimatedDuration: 30,
    price: 40.00,
  },
  {
    name: 'Microalbuminúria',
    synonyms: 'microalbuminuria, albumina urinária',
    categoryName: 'Urina',
    preparationInstructions: 'Coletar urina de 24 horas ou amostra isolada conforme orientação médica.',
    estimatedDuration: 20,
    price: 45.00,
  },

  // Imunologia
  {
    name: 'PCR (Proteína C Reativa)',
    synonyms: 'CRP, C-reactive protein, proteína C reativa, inflamação',
    categoryName: 'Imunologia',
    preparationInstructions: 'Jejum de 4 horas.',
    estimatedDuration: 20,
    price: 30.00,
  },
  {
    name: 'FAN (Fator Antinuclear)',
    synonyms: 'ANA, antinuclear antibody, fator antinuclear',
    categoryName: 'Imunologia',
    preparationInstructions: 'Jejum de 4 horas.',
    estimatedDuration: 30,
    price: 60.00,
  },
  {
    name: 'Sorologias para Hepatite B e C',
    synonyms: 'HBsAg, anti-HCV, hepatite, hepatitis',
    categoryName: 'Imunologia',
    preparationInstructions: 'Jejum não obrigatório.',
    estimatedDuration: 30,
    price: 70.00,
  },

  // Microbiologia
  {
    name: 'Hemocultura',
    synonyms: 'blood culture, cultura de sangue, bacteremia',
    categoryName: 'Microbiologia',
    preparationInstructions: 'Coleta realizada pelo profissional de saúde. Informar uso de antibióticos.',
    estimatedDuration: 30,
    price: 80.00,
  },
  {
    name: 'Coprocultura',
    synonyms: 'stool culture, cultura de fezes',
    categoryName: 'Microbiologia',
    preparationInstructions: 'Coletar amostra de fezes em frasco estéril. Evitar uso de laxantes ou enemas.',
    estimatedDuration: 30,
    price: 55.00,
  },
  {
    name: 'Parasitológico de Fezes',
    synonyms: 'EPF, exame parasitológico, fezes, parasitas',
    categoryName: 'Microbiologia',
    preparationInstructions: 'Coletar amostras de fezes em 3 dias alternados. Evitar uso de antiparasitários.',
    estimatedDuration: 20,
    price: 30.00,
  },
];

export async function seedExamCatalog() {
  const shouldDestroyConnection = !AppDataSource.isInitialized;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const categoryRepository = AppDataSource.getRepository(ExamCategory);
  const examCatalogRepository = AppDataSource.getRepository(ExamCatalog);

  // ── Categorias ────────────────────────────────────────────────────────────────
  const categoryMap: Record<string, ExamCategory> = {};

  for (const categoryName of CATEGORIES) {
    let category = await categoryRepository.findOne({ where: { name: categoryName } });

    if (!category) {
      category = categoryRepository.create({ name: categoryName });
      category = await categoryRepository.save(category);
    }

    categoryMap[categoryName] = category;
  }

  console.log(`Categorias de exames: ${Object.keys(categoryMap).length} processadas.`);

  // ── Exames ────────────────────────────────────────────────────────────────────
  let created = 0;
  let skipped = 0;

  for (const examData of EXAMS) {
    const existing = await examCatalogRepository.findOne({ where: { name: examData.name } });

    if (existing) {
      skipped++;
      continue;
    }

    const category = categoryMap[examData.categoryName];

    const exam = examCatalogRepository.create({
      name: examData.name,
      synonyms: examData.synonyms,
      categoryId: category.id,
      preparationInstructions: examData.preparationInstructions,
      estimatedDuration: examData.estimatedDuration,
      price: examData.price,
      isActive: true,
    });

    await examCatalogRepository.save(exam);
    created++;
  }

  console.log('─────────────────────────────────────────────────');
  console.log('Seed do catálogo de exames finalizada com sucesso!');
  console.log(`Exames criados: ${created} | Já existentes (ignorados): ${skipped}`);
  console.log('─────────────────────────────────────────────────');

  if (shouldDestroyConnection && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedExamCatalog().catch(async (error) => {
    console.error('Erro ao executar seed do catálogo de exames:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  });
}
