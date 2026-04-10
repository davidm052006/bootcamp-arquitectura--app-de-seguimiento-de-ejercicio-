import { app } from './app.js';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const server = app.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', message: 'FitWell API v5.0.0 iniciada', port: PORT, timestamp: new Date().toISOString() }));
});

async function shutdown(signal) {
  console.log(JSON.stringify({ level: 'info', message: `${signal} recibida — cerrando...` }));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
