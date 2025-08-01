import {
  listReportsApi,
  reviewReportApi,
  getContentStatsApi,
  getAllContentsApi
} from "../api/reportContentApi";

export const listReportsService = async (params = {}) => {
  try {
    const response = await listReportsApi(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch reports" };
  }
};

export const reviewReportService = async (reportId, reviewData) => {
  try {
    const response = await reviewReportApi(reportId, reviewData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to review report" };
  }
};

export const getContentStatsService = async () => {
  try {
    const response = await getContentStatsApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch content stats" };
  }
};


export const getAllContentsService = async (params = {}) => {
  try {
    const response = await getAllContentsApi(params);
    console.log(response.data);
    return response.data.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch content." };
  }
};