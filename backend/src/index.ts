/**
 * Woli Delivery API - Entry Point
 * ==========================================
 */

import 'dotenv/config';
import { initializeApp } from './app.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const start = async (): Promise<void> => {
  try {
    // Initialize the app (register plugins, routes, etc.)
    await initializeApp();

    // Start listening
    await (await import('./app.js')).app.listen({ port: PORT, host: HOST });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 Woli Delivery API                                      ║
║                                                              ║
║   Server running at: http://${HOST}:${PORT}                     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                 ║
║   Health check: http://${HOST}:${PORT}/health                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  console.log('Shutting down gracefully...');
  const { app } = await import('./app.js');
  await app.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
