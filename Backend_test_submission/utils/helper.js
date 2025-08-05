  import { urlDatabase } from "../db/index.js";
  import { v4 as uuidv4 } from 'uuid';


  export function generateShortcode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Helper function to validate URL format
  export function isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  // Helper function to ensure unique shortcode
  export function getUniqueShortcode(customShortcode = null) {
    if (customShortcode) {
      if (urlDatabase.has(customShortcode)) {
        throw new Error('Custom shortcode already exists');
      }
      return customShortcode;
    }
    
    let shortcode;
    do {
      shortcode = generateShortcode();
    } while (urlDatabase.has(shortcode));
    
    return shortcode;
  }