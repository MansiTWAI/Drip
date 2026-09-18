import app, { initializeServices } from "../backend/server.js";

let initialization;

const ensureServices = () => {
  if (!initialization) {
    initialization = initializeServices().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }

  return initialization;
};

export default async function handler(request, response) {
  try {
    await ensureServices();
    return app(request, response);
  } catch (error) {
    console.error("API initialization failed:", error.message);
    return response.status(503).json({
      success: false,
      message: "Database connection unavailable. Check MongoDB Atlas Network Access.",
    });
  }
}
