// Lists likely user-visible English string literals per source file (heuristic; used for NOTES.md counts).
import ts from 'typescript';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []; });
const out = {};
for (const f of walk('src')) {
  const sf = ts.createSourceFile(f, readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
  const hits = [];
  const visit = (n) => {
    let text = null;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) text = n.text;
    else if (ts.isTemplateExpression(n)) text = n.head.text + n.templateSpans.map((s) => '${}' + s.literal.text).join('');
    if (text !== null) {
      const p = n.parent;
      const skip = ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isLiteralTypeNode(p) || ts.isPropertyAssignment(p) && p.name === n || ts.isElementAccessExpression(p) || ts.isCaseClause(p) || (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(p.operatorToken.kind));
      const t = text.replace(/<[^>]+>/g, ' ').trim();
      if (!skip && /[A-Za-z]{3,}/.test(t) && (/\s/.test(t) || /^[A-Z][a-z]+/.test(t)) && !/^[\w.#:\[\]=-]+$/.test(t) || (!skip && /^[A-Z][a-z]{2,}$/.test(t))) hits.push(sf.getLineAndCharacterOfPosition(n.getStart()).line + 1 + ": " + t.slice(0, 160));
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  if (hits.length) out[f] = hits;
}
if (process.argv[2] === '--json') console.log(JSON.stringify(out, null, 1));
else for (const [f, h] of Object.entries(out).sort((a, b) => b[1].length - a[1].length)) console.log(String(h.length).padStart(4), f);
