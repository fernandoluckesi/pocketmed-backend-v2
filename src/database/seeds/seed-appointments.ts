import 'reflect-metadata';
import AppDataSource from '../data-source';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { Doctor } from '../../entities/doctor.entity';
import { Patient } from '../../entities/patient.entity';
import { Dependent } from '../../entities/dependent.entity';
import { DoctorPermission } from '../../entities/doctor-permission.entity';

const SEED_PREFIX = 'Seed consultas em massa:';
const SCHEDULED_PER_USER = 8;
const COMPLETED_PER_USER = 6;

const scheduledReasons = [
  'Retorno clínico com revisão de sintomas',
  'Consulta de rotina anual',
  'Avaliação preventiva de saúde',
  'Revisão de exames recentes',
  'Acompanhamento de tratamento em andamento',
  'Consulta para ajuste de medicação',
  'Avaliação de pressão e bem-estar geral',
  'Consulta para orientações de hábitos saudáveis',
];

const completedReasons = [
  'Consulta finalizada com orientações gerais',
  'Retorno após tratamento recente',
  'Acompanhamento de quadro estável',
  'Consulta de revisão com resultados satisfatórios',
  'Atendimento concluído com recomendações médicas',
  'Consulta de rotina concluída',
];

const completedFeedbacks = [
  'Paciente evolui bem, sem sinais de gravidade no momento.',
  'Quadro clínico estável, manter acompanhamento regular.',
  'Boa resposta às orientações anteriores e exames dentro do esperado.',
  'Sem intercorrências relevantes durante a avaliação.',
  'Sinais vitais preservados e evolução satisfatória.',
  'Condição geral adequada, com necessidade apenas de seguimento periódico.',
];

const completedInstructions = [
  'Manter hidratação adequada e rotina regular de sono.',
  'Seguir medicação prescrita e retornar em caso de piora.',
  'Reforçadas orientações de alimentação balanceada e atividade física leve.',
  'Agendar retorno em 3 meses para reavaliação.',
  'Levar exames laboratoriais atualizados na próxima consulta.',
  'Observar sintomas e procurar atendimento se houver mudança importante.',
];

type SeedTarget =
  | { kind: 'patient'; id: string; name: string; patientId: string; dependentId: null }
  | { kind: 'dependent'; id: string; name: string; patientId: null; dependentId: string };

function atHour(baseDate: Date, hour: number, minute: number) {
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function ensurePermission(
  permissionRepository: ReturnType<typeof AppDataSource.getRepository<DoctorPermission>>,
  doctorId: string,
  target: SeedTarget,
) {
  const existing = await permissionRepository.findOne({
    where: {
      doctorId,
      patientId: target.patientId,
      dependentId: target.dependentId,
    },
  });

  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      await permissionRepository.save(existing);
    }
    return;
  }

  await permissionRepository.save(
    permissionRepository.create({
      doctorId,
      patientId: target.patientId,
      dependentId: target.dependentId,
      isActive: true,
    }),
  );
}

export async function seedAppointmentsInBulk() {
  const shouldDestroyConnection = !AppDataSource.isInitialized;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const doctorRepository = AppDataSource.getRepository(Doctor);
  const patientRepository = AppDataSource.getRepository(Patient);
  const dependentRepository = AppDataSource.getRepository(Dependent);
  const appointmentRepository = AppDataSource.getRepository(Appointment);
  const permissionRepository = AppDataSource.getRepository(DoctorPermission);

  const [doctor] = await doctorRepository.find({
    order: { createdAt: 'ASC' },
    take: 1,
  });

  if (!doctor) {
    throw new Error('Nenhum médico encontrado para vincular as consultas seed.');
  }

  const [patients, dependents] = await Promise.all([
    patientRepository.find({ order: { createdAt: 'ASC' } }),
    dependentRepository.find({ order: { createdAt: 'ASC' } }),
  ]);

  const targets: SeedTarget[] = [
    ...patients.map((patient) => ({
      kind: 'patient' as const,
      id: patient.id,
      name: patient.name,
      patientId: patient.id,
      dependentId: null,
    })),
    ...dependents.map((dependent) => ({
      kind: 'dependent' as const,
      id: dependent.id,
      name: dependent.name,
      patientId: null,
      dependentId: dependent.id,
    })),
  ];

  if (targets.length === 0) {
    console.log('Nenhum paciente ou dependente encontrado. Nada para semear.');
    return;
  }

  await appointmentRepository
    .createQueryBuilder()
    .delete()
    .from(Appointment)
    .where('reason LIKE :prefix', { prefix: `${SEED_PREFIX}%` })
    .execute();

  let insertedCount = 0;

  for (const target of targets) {
    await ensurePermission(permissionRepository, doctor.id, target);

    const appointments: Appointment[] = [];

    for (let index = 0; index < SCHEDULED_PER_USER; index += 1) {
      const daysAhead = index + 1 + (target.kind === 'dependent' ? 2 : 0);
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);

      appointments.push(
        appointmentRepository.create({
          doctorId: doctor.id,
          patientId: target.patientId,
          dependentId: target.dependentId,
          doctorCrm: doctor.crm,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          reason: `${SEED_PREFIX} ${target.name} • agendada ${index + 1} • ${scheduledReasons[index % scheduledReasons.length]}`,
          dateTime: atHour(date, 8 + (index % 6), index % 2 === 0 ? 0 : 30),
          isCompleted: false,
          status: index % 3 === 0 ? AppointmentStatus.PENDING : AppointmentStatus.APPROVED,
          doctorFeedback: null,
          doctorInstructions: null,
        }),
      );
    }

    for (let index = 0; index < COMPLETED_PER_USER; index += 1) {
      const daysAgo = index + 2 + (target.kind === 'dependent' ? 1 : 0);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      appointments.push(
        appointmentRepository.create({
          doctorId: doctor.id,
          patientId: target.patientId,
          dependentId: target.dependentId,
          doctorCrm: doctor.crm,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          reason: `${SEED_PREFIX} ${target.name} • realizada ${index + 1} • ${completedReasons[index % completedReasons.length]}`,
          dateTime: atHour(date, 9 + (index % 5), index % 2 === 0 ? 15 : 45),
          isCompleted: true,
          status: AppointmentStatus.COMPLETED,
          doctorFeedback: completedFeedbacks[index % completedFeedbacks.length],
          doctorInstructions: completedInstructions[index % completedInstructions.length],
        }),
      );
    }

    await appointmentRepository.save(appointments);
    insertedCount += appointments.length;
  }

  console.log(
    `Seed de consultas concluída. ${insertedCount} consultas inseridas para ${targets.length} usuários.`,
  );

  if (shouldDestroyConnection && AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedAppointmentsInBulk().catch(async (error) => {
    console.error('Erro ao executar seed de consultas:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  });
}
