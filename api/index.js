import app, { initializeServices } from "../backend/server.js";

let initialization;

export default async function handler(request, response) {
  initialization ||= initializeServices();

  try {
    await initialization;
    return app(request, response);
  } catch (error) {
    console.error("API initialization failed:", error.message);
    return response.status(503).json({
      success: false,
      message: "The Drip API is temporarily unavailable.",
    });
  }
}
