import { SavedSearchesRepository } from './saved-searches.repository.js';

export class SavedSearchesService {
  private repo = new SavedSearchesRepository();

  async saveSearch(userId: string, query: string, filters: any) {
    return this.repo.saveSearch(userId, query, filters);
  }

  async deleteSearch(searchId: string, userId: string) {
    const deleted = await this.repo.deleteSearch(searchId, userId);
    if (!deleted) throw new Error('Saved search not found or unauthorized');
    return deleted;
  }

  async getSavedSearches(userId: string) {
    return this.repo.getSavedSearches(userId);
  }

  async toggleAlert(searchId: string, userId: string, enabled: boolean) {
    const updated = await this.repo.toggleAlert(searchId, userId, enabled);
    if (!updated) throw new Error('Saved search not found or unauthorized');
    return updated;
  }
}

export const savedSearchesService = new SavedSearchesService();
