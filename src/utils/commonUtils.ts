export async function logMessage<T>(type: string, message: string, item?: T): Promise<void> {
    try {
        // Ensure debug mode is active or in development environment
        if (process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development') {
            // Choose the appropriate console method based on the type
            switch (type.toLowerCase()) {
                case 'error':
                    console.error(`❌ ${message}`, item);
                    break;
                case 'warn':
                    console.warn(`⚠️ ${message}`, item);
                    break;
                case 'info':
                    console.info(`ℹ️ ${message}`, item);
                    break;
                case 'debug':
                    console.debug(`🔍 ${message}`, item);
                    break;
                case 'log':
                    console.log(`${message}`, item);
                    break;
                case 'trace':
                    console.trace(`🔍 ${message}`, item);
                    break;
                case 'table':
                    console.table(item);
                    break;
                case 'group':
                    console.group(`${message}`);
                    break;
                case 'groupend':
                    console.groupEnd();
                    break;
                default:
                    console.log(`Default log for unknown type: ${message}`, item);
                    break;
            }
        }
    } catch (error) {
        // Log any errors that occur in the try block
        console.error('❌ Error in consoleLog:', error);
    }
}
