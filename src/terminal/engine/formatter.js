/**
 * Terminal Markdown to Cyberpunk HTML Formatter
 */

export function renderMarkdownToHTML(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  let html = markdown;

  // 1. Preserve and render code blocks with pre/code
  const codeBlocks = [];
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(`<pre class="term-code-block"><code>${escaped.trim()}</code></pre>`);
    return placeholder;
  });

  // 2. Parse Markdown Tables
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return match;

    const parseRow = (rowStr) => {
      return rowStr.split('|').slice(1, -1).map(c => c.trim());
    };

    const headerCells = parseRow(lines[0]);
    // Check if line 1 is separator (:---)
    let startIndex = 1;
    if (lines.length > 1 && lines[1].includes('---')) {
      startIndex = 2;
    }

    let tableHtml = '<table class="term-table"><thead><tr>';
    headerCells.forEach(cell => {
      tableHtml += `<th>${cell}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = startIndex; i < lines.length; i++) {
      const rowCells = parseRow(lines[i]);
      tableHtml += '<tr>';
      rowCells.forEach(cell => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    return tableHtml;
  });

  // 3. Headings
  html = html.replace(/^### (.*$)/gim, '<div class="term-heading-3">$1</div>');
  html = html.replace(/^#### (.*$)/gim, '<div class="term-heading-4">$1</div>');

  // 4. Horizontal Rules
  html = html.replace(/^---$/gim, '<div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 0.5rem 0;"></div>');

  // 5. Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 2px solid #38bdf8; padding-left: 0.75rem; color: #94a3b8; margin: 0.4rem 0;">$1</blockquote>');

  // 6. Bold and Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #f1f5f9;">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em style="color: #cbd5e1;">$1</em>');

  // 7. Inline Code
  html = html.replace(/`([^`]+)`/g, '<code class="term-inline-code">$1</code>');

  // 8. Markdown Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline;">$1</a>');

  // 9. Details / Summary Accordion
  html = html.replace(/<details>/gi, '<details class="term-details">');

  // 10. List Items (* or -)
  html = html.replace(/^[\*\-] (.*$)/gim, '<div style="margin-left: 0.5rem; margin-bottom: 0.2rem;"><span style="color: #38bdf8; margin-right: 0.4rem;">▹</span>$1</div>');

  // 11. Restore Code Blocks
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, block);
  });

  // 12. Convert newlines to breaks when not inside HTML elements
  html = html.replace(/\n\n/g, '<div style="height: 0.35rem;"></div>');

  return html;
}
