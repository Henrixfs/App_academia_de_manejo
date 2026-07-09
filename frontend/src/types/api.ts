// API response types can be added here if needed
export interface ApiResponse<T> {
  data: T;
  message?: string;
}