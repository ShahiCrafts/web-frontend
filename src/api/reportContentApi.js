import instance from './api';

const ADMIN_CONTENT_URL = '/admin/content';
const ADMIN_REPORTS_URL = '/admin/reports';

export const listReportsApi = (params = {}) => {
  return instance.get(`${ADMIN_REPORTS_URL}`, { params });
};

export const reviewReportApi = (reportId, reviewData) => {
  return instance.patch(`${ADMIN_REPORTS_URL}/${reportId}/review`, reviewData);
};

export const getContentStatsApi = () => {
  return instance.get(`${ADMIN_CONTENT_URL}/analytics`);
};

export const getAllContentsApi = (params = {}) => {
  return instance.get(`${ADMIN_CONTENT_URL}`, { params });
};