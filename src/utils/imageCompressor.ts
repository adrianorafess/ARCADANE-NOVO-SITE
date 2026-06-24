/**
 * Utility to compress and resize images client-side before storing them in local storage.
 * Helps prevent QuotaExceededError by keeping base64 images well under 100KB.
 */
export function compressImage(file: File, maxWidth: number = 600, maxHeight: number = 600, quality: number = 0.6, forcePng: boolean = false, skipAggressiveLimit: boolean = false): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result as string;
      const img = new Image();
      
      // Define onload BEFORE assigning src to ensure it fires reliably in all browsers
      img.onload = () => {
        try {
          const attemptCompression = (w: number, h: number, q: number): string => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate maintaining aspect ratio within w and h limits
            if (width > height) {
              if (width > w) {
                height = Math.round((height * w) / width);
                width = w;
              }
            } else {
              if (height > h) {
                width = Math.round((width * h) / height);
                height = h;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return rawBase64;
            }

            // Clear canvas to ensure transparency is preserved
            ctx.clearRect(0, 0, width, height);

            ctx.drawImage(img, 0, 0, width, height);
            
            try {
              const isTransparent = forcePng || (file.type && (file.type.includes('png') || file.type.includes('svg') || file.type.includes('gif') || file.type.includes('webp'))) || (file.name && /\.(png|svg|gif|webp)$/i.test(file.name));
              const format = isTransparent ? 'image/png' : 'image/jpeg';
              return canvas.toDataURL(format, isTransparent ? undefined : q);
            } catch (err) {
              console.warn("toDataURL nested failed, returning raw base64", err);
              return rawBase64;
            }
          };

          let resultBase64 = attemptCompression(maxWidth, maxHeight, quality);
          
          // If the image is still larger than 50KB (approx 68,000 base64 chars), compress more aggressively
          if (!skipAggressiveLimit && resultBase64.length > 68000) {
            console.warn(`Compressed image is still large (${resultBase64.length} chars). Retrying with smaller dimensions.`);
            resultBase64 = attemptCompression(Math.min(maxWidth, 400), Math.min(maxHeight, 400), 0.5);
          }
          
          // If still larger than 50KB, take extreme measures (300x300, 0.4 quality)
          if (!skipAggressiveLimit && resultBase64.length > 68000) {
            console.warn(`Compressed image is STILL large (${resultBase64.length} chars). Applying extreme compression.`);
            resultBase64 = attemptCompression(300, 300, 0.35);
          }

          resolve(resultBase64);
        } catch (err) {
          console.warn("Canvas compression failed, falling back to raw base64:", err);
          resolve(rawBase64);
        }
      };

      img.onerror = (err) => {
        console.warn("Image loading failed in compressor, using raw base64:", err);
        resolve(rawBase64);
      };

      // Now set the src trigger
      img.src = rawBase64;
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
}
