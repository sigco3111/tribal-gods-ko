// Static extraction of the player-visible English strings of a campaign chapter (used by check-i18n.mjs and to author src/i18n-story.ts).
import ts from 'typescript';
import fs from 'fs';
export function extract(f) {
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
  const out = [];
  const strOf = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) { const a = strOf(n.left), b = strOf(n.right); return a != null && b != null ? a + b : null; }
    if (ts.isTemplateExpression(n)) return n.head.text + n.templateSpans.map((s) => '${}' + s.literal.text).join('');
    return null;
  };
  const visit = (n) => {
    const top = (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n) || (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken)) && !(ts.isBinaryExpression(n.parent) && n.parent.operatorToken.kind === ts.SyntaxKind.PlusToken);
    if (top) {
      const p = n.parent;
      const key = ts.isPropertyAssignment(p) ? p.name.getText() : '';
      const s = strOf(n);
      if (s != null && !ts.isImportDeclaration(p) && !['name', 'desc', 'author'].includes(key) && /[A-Za-z]{3,}/.test(s) && /\s/.test(s)) { out.push(s); return; }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}
if (process.argv[2]) for (const s of extract(process.argv[2])) console.log(s);
