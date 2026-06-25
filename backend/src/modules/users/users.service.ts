import { UsersRepository } from './users.repository.js';
import type { UpdateProfileInput } from './users.schemas.js';

export class UsersService {
  private repo = new UsersRepository();

  async getMyProfile(userId: string) {
    const user = await this.repo.getProfile(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    return this.repo.updateProfile(userId, data);
  }

  async getPublicProfile(username: string) {
    const user = await this.repo.getPublicProfile(username);
    if (!user) throw new Error('User not found');
    return user;
  }

  async requestVerification(userId: string) {
    const user = await this.repo.getProfile(userId);
    if (!user) throw new Error('User not found');
    if (user.verification_status !== 'unverified') {
      throw new Error('Verification already requested or completed');
    }
    return this.repo.requestVerification(userId);
  }
}

export const usersService = new UsersService();
