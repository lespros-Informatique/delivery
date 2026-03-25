/**
 * Logger Utility - Simple Console Logger
 * ===========================================
 * Shared utility for structured logging
 * For production, consider using pino or winston
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()} [${this.context}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, err?: Error | LogContext): void {
    const context = err instanceof Error ? { error: err.message, stack: err.stack } : err;
    console.error(this.formatMessage('error', message, context as LogContext));
  }
}

// Main logger instance
export const logger = new Logger('WoliAPI');

// Create child logger with context
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};
