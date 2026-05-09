import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from '../entities/device-token.entity';
import { Notification } from '../entities/notification.entity';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';

// expo-server-sdk is ESM-only — use dynamic import to avoid ERR_REQUIRE_ESM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _expoModule: any = null;
async function getExpoModule() {
  if (!_expoModule) {
    _expoModule = await import('expo-server-sdk');
  }
  return _expoModule;
}

export interface PushPayload {
  type: string;
  relatedEntityId?: string;
  [key: string]: unknown;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  // Lazy-initialized Expo client
  private _expoClient: any = null;

  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  private async getExpoClient() {
    if (!this._expoClient) {
      const mod = await getExpoModule();
      const ExpoClass = mod.default ?? mod.Expo ?? mod;
      this._expoClient = new ExpoClass();
    }
    return this._expoClient;
  }

  private async isExpoPushToken(token: string): Promise<boolean> {
    const mod = await getExpoModule();
    const ExpoClass = mod.default ?? mod.Expo ?? mod;
    return ExpoClass.isExpoPushToken(token);
  }

  async registerToken(
    userId: string,
    userType: string,
    dto: RegisterDeviceTokenDto,
  ): Promise<void> {
    const existing = await this.deviceTokenRepository.findOne({
      where: { userId, expoPushToken: dto.expoPushToken },
    });

    if (existing) {
      existing.isActive = true;
      existing.platform = dto.platform ?? existing.platform;
      await this.deviceTokenRepository.save(existing);
      return;
    }

    const token = this.deviceTokenRepository.create({
      userId,
      userType,
      expoPushToken: dto.expoPushToken,
      platform: dto.platform ?? 'unknown',
      isActive: true,
    });

    await this.deviceTokenRepository.save(token);
  }

  async unregisterToken(userId: string, expoPushToken: string): Promise<void> {
    await this.deviceTokenRepository.update({ userId, expoPushToken }, { isActive: false });
  }

  async sendPushToUser(
    userId: string,
    title: string,
    body: string,
    data: PushPayload,
  ): Promise<void> {
    const tokens = await this.deviceTokenRepository.find({
      where: { userId, isActive: true },
    });

    if (!tokens.length) return;

    const expo = await this.getExpoClient();

    const validTokens: string[] = [];
    for (const t of tokens) {
      if (await this.isExpoPushToken(t.expoPushToken)) {
        validTokens.push(t.expoPushToken);
      }
    }

    if (!validTokens.length) return;

    const messages = validTokens.map((to) => ({
      to,
      sound: 'default' as const,
      title,
      body,
      data,
    }));

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);

        for (const ticket of tickets) {
          if (ticket.status === 'error') {
            this.logger.warn(`Push error: ${ticket.message}`);

            if (
              ticket.details?.error === 'DeviceNotRegistered' ||
              ticket.details?.error === 'InvalidCredentials'
            ) {
              const tokenStr = (ticket as any).to as string | undefined;
              if (tokenStr) {
                await this.deviceTokenRepository.update(
                  { expoPushToken: tokenStr },
                  { isActive: false },
                );
              }
            }
          }
        }
      } catch (err) {
        this.logger.error(`Failed to send push chunk: ${(err as Error).message}`);
      }
    }
  }

  // ─── Persistent in-app notifications ────────────────────────────────────────

  async createNotification(
    userId: string,
    userType: string,
    title: string,
    body: string,
    type: string,
    data?: Record<string, unknown>,
    relatedEntityId?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      userType,
      title,
      body,
      type,
      data: data ?? null,
      relatedEntityId: relatedEntityId ?? null,
      isRead: false,
    });
    const saved = await this.notificationRepository.save(notification);

    // Fire push (best-effort)
    this.sendPushToUser(userId, title, body, { type, relatedEntityId, ...data }).catch((err) =>
      this.logger.error(`Push failed: ${err.message}`),
    );

    return saved;
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCountForUser(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException();
    notification.isRead = true;
    await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
  }
}
