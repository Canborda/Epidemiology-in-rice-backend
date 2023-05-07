class CommonService {
  /**
   * Handles common operations over dtos or types
   */

  advanceDays(startDate: Date | string, days: number): Date {
    if (typeof startDate == 'string') startDate = new Date(startDate);
    return new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

export default new CommonService();
