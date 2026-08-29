import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constant';

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export async function downloadImage(id, photo) {
  try {
    const filename = `gencanvas-${id || Date.now()}.png`;

    if (photo && photo.startsWith('data:')) {
      // Base64 Data URL -> Blob conversion for reliable cross-browser download
      const parts = photo.split(';base64,');
      const contentType = parts[0].split(':')[1] || 'image/png';
      const raw = atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      FileSaver.saveAs(blob, filename);
    } else if (photo) {
      // Fetch as blob for external image URLs to avoid CORS download issues
      const res = await fetch(photo);
      const blob = await res.blob();
      FileSaver.saveAs(blob, filename);
    }
  } catch (error) {
    console.warn('FileSaver error, trying direct link download fallback:', error);
    const link = document.createElement('a');
    link.href = photo;
    link.download = `gencanvas-${id || Date.now()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export * from './storage';
export * from './api';

