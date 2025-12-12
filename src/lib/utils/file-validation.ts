export const MAX_DIRECT_UPLOAD_MB = 200;

export function validateFileSize(file: File): { valid: boolean; error?: string } {
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > MAX_DIRECT_UPLOAD_MB) {
    return {
      valid: false,
      error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds the maximum allowed size of ${MAX_DIRECT_UPLOAD_MB}MB. Please use an external link instead.`
    };
  }
  
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function isValidExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validDomains = ['mega.nz', 'drive.google.com', 'dropbox.com', 'onedrive.live.com'];
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}
