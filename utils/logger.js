export const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp}: ${message}`);
    if (data) console.log('   Data:', data);
  },
  
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp}: ${message}`);
    if (error) console.error('   Error:', error);
  },
  
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp}: ${message}`);
    if (data) console.warn('   Data:', data);
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG] ${timestamp}: ${message}`);
      if (data) console.log('   Data:', data);
    }
  }
};