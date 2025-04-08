
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedText = urlParams.get('text');
  const pdfUrl = urlParams.get('url');

  // Load PDF document
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;

  // Search for citation context
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    
    if (text.includes(selectedText)) {
      // Extract surrounding context
      const contextStart = Math.max(0, text.indexOf(selectedText) - 100);
      const contextEnd = Math.min(text.length, text.indexOf(selectedText) + selectedText.length + 100);
      const context = text.slice(contextStart, contextEnd);
      
      document.getElementById('contextContent').innerHTML = `
        <p class="context-text">${context}</p>
        <p class="page-number">Page ${i}</p>
      `;
      
      // Render PDF page
      const canvas = document.createElement('canvas');
      document.getElementById('pdfViewer').appendChild(canvas);
      const viewport = page.getViewport({scale: 1.5});
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      });
      break;
    }
  }
});
