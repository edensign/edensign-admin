/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import axios from "axios";

export const api = axios.create({
  withCredentials: true,
  baseURL: (import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1").replace(/"/g, ""),
  validateStatus: (status) => (status >= 200 && status < 300) || status == 404
});

// defining a custom error handler for all APIs
const errorHandler = (error) => {
  const statusCode = error.response?.status;

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    throw error;
  };

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

//ask for token on every request made from edensign website
api.interceptors.request.use(req => {
  req.headers.Type = "admin";
  return req;
});
