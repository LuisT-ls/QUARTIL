/**
 * Minificador de CSS simples
 * Remove espaços desnecessários, comentários e otimiza o CSS
 */

class CSSMinifier {
  constructor() {
    this.minifiedCSS = '';
  }

  minify(css) {
    if (!css || typeof css !== 'string') {
      return '';
    }

    // Remove comentários /* ... */
    let minified = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove espaços em branco desnecessários
    minified = minified.replace(/\s+/g, ' ');
    
    // Remove espaços antes e depois de caracteres especiais
    minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1');
    
    // Remove espaços no início e fim de linhas
    minified = minified.replace(/^\s+|\s+$/gm, '');
    
    // Remove quebras de linha desnecessárias
    minified = minified.replace(/\n\s*\n/g, '\n');
    
    // Remove espaços antes de { e depois de }
    minified = minified.replace(/\s*{\s*/g, '{');
    minified = minified.replace(/\s*}\s*/g, '}');
    
    // Remove espaços antes de ; e :
    minified = minified.replace(/\s*;\s*/g, ';');
    minified = minified.replace(/\s*:\s*/g, ':');
    
    // Remove espaços antes de , e >
    minified = minified.replace(/\s*,\s*/g, ',');
    minified = minified.replace(/\s*>\s*/g, '>');
    
    // Remove espaços antes de + e ~
    minified = minified.replace(/\s*\+\s*/g, '+');
    minified = minified.replace(/\s*~\s*/g, '~');
    
    // Remove espaços no início e fim
    minified = minified.trim();
    
    return minified;
  }

  async minifyFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const css = await response.text();
      return this.minify(css);
    } catch (error) {
      console.error(`Erro ao minificar ${filePath}:`, error);
      return '';
    }
  }

  async minifyAllCSS() {
    const cssFiles = [
      './assets/css/critical.css',
      './assets/css/bootstrap-custom.css',
      './assets/css/main.css'
    ];

    const minifiedFiles = {};
    
    for (const file of cssFiles) {
      const minified = await this.minifyFile(file);
      if (minified) {
        minifiedFiles[file] = minified;
      }
    }

    return minifiedFiles;
  }

  // Salva CSS minificado em um arquivo
  saveMinifiedCSS(css, filename) {
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}

// Função para minificar CSS em tempo real durante o desenvolvimento
window.minifyCSS = async function() {
  const minifier = new CSSMinifier();
  const minifiedFiles = await minifier.minifyAllCSS();
  
  console.log('CSS minificado:', minifiedFiles);
  
  // Salva arquivos minificados
  for (const [file, css] of Object.entries(minifiedFiles)) {
    const filename = file.replace('.css', '.min.css');
    minifier.saveMinifiedCSS(css, filename);
  }
};

// Exporta para uso em outros módulos
window.CSSMinifier = CSSMinifier;
