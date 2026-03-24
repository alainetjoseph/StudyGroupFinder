import axios from "axios";

axios.defaults.withCredentials = true;

let isRedirecting = false;

/**
 * Setup global interceptors for axios.
 * Handles 401 Unauthorized (Session Expired) and ACCOUNT_BLOCKED.
 */
export const setupInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle cases where error.response is undefined (e.g. network error)
      if (!error.response) {
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const currentPath = window.location.pathname + window.location.search;
      const pathname = window.location.pathname;

      // Prevent multiple redirects for concurrent request failures
      if (isRedirecting) {
        return Promise.reject(error);
      }

      // 1. Handle ACCOUNT_BLOCKED
      if (data && data.error === "ACCOUNT_BLOCKED") {
        if (pathname !== "/blocked") {
          isRedirecting = true;
          window.location.href = "/blocked";
        }
        return Promise.reject(error);
      }

      // 2. Handle 401 Unauthorized (Session Expired)
      if (status === 401) {
        const publicPaths = ["/login", "/signup"];
        if (!publicPaths.includes(pathname)) {
          isRedirecting = true;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};
