export async function logMessage<T>(type: string, message: string, item?: T): Promise<void> {
    try {
        const isDev = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
        if (!isDev) return;

        const logWithMessage = (logFn: (...args: unknown[]) => void, prefix = '') => {
            if (item !== undefined) {
                logFn(`${prefix}${message}`, item);
            } else {
                logFn(`${prefix}${message}`);
            }
        };

        switch (type.toLowerCase()) {
            case 'error':
                logWithMessage(console.error, '❌ ');
                break;
            case 'warn':
                logWithMessage(console.warn, '⚠️ ');
                break;
            case 'info':
                logWithMessage(console.info, 'ℹ️ ');
                break;
            case 'debug':
                logWithMessage(console.debug, '🔍 ');
                break;
            case 'log':
                logWithMessage(console.log);
                break;
            case 'trace':
                logWithMessage(console.trace, '🔍 ');
                break;
            case 'table':
                if (item !== undefined) console.table(item);
                break;
            case 'group':
                console.group(message);
                break;
            case 'groupend':
                console.groupEnd();
                break;
            default:
                logWithMessage(console.log, '📌 ');
                break;
        }
    } catch (error) {
        console.error('❌ Error in logMessage:', error);
    }
}
