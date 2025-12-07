// src/dev/dump-project.ts
import fs from 'node:fs';
import path from 'node:path';
import clipboardy from 'clipboardy';

type Flags = {
  root: string;
  out: string | null;
  clipboard: boolean;
  include: string | null;
  exclude: string;
  exts: string;
};

function parseFlags(): Flags {
  const args = process.argv.slice(2);
  const raw: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        raw[key] = next;
        i++;
      } else {
        raw[key] = true;
      }
    }
  }

  const excludeDefault =
    'node_modules,.git,.next,dist,build,.vite,.idea,.vscode,.cache,.DS_Store,coverage';
  const extsDefault =
    '.ts,.tsx,.js,.jsx,.json,.md,.html,.css,.scss,.yml,.yaml,.toml,.cjs,.mjs';

  const root = path.resolve(process.cwd(), (raw.root as string) ?? '.');
  const out = (raw.out as string) ?? null;
  const clipboard = !!raw.clipboard;
  const include = (raw.include as string) ?? null;
  const exclude = (raw.exclude as string) ?? excludeDefault;
  const exts = (raw.exts as string) ?? extsDefault;

  return { root, out, clipboard, include, exclude, exts };
}

function shouldSkipDir(name: string, excludes: Set<string>) {
  return excludes.has(name);
}

function visibleExt(name: string, allowed: Set<string>) {
  const ext = path.extname(name).toLowerCase();
  return allowed.has(ext);
}

function collectFiles(
  root: string,
  allowedExts: Set<string>,
  excludeDirs: Set<string>,
) {
  const out: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (shouldSkipDir(e.name, excludeDirs)) continue;
        walk(full);
      } else if (e.isFile()) {
        if (visibleExt(e.name, allowedExts)) {
          out.push(full);
        }
      }
    }
  }

  walk(root);
  return out.sort((a, b) => a.localeCompare(b));
}

function filterByPattern(files: string[], root: string, include: string | null) {
  if (!include) return files;

  // `include` se interpreta como regexp sobre la ruta relativa
  const re = new RegExp(include);
  return files.filter((file) => {
    const rel = path
      .relative(root, file)
      .split(path.sep)
      .join('/');

    return re.test(rel);
  });
}

function formatHeader(root: string, filesCount: number) {
  const ts = new Date().toISOString();
  return `// Full project dump — ${ts}
// Root: ${root}
// Files: ${filesCount}

`;
}

function formatFile(root: string, fullPath: string) {
  const rel = path
    .relative(root, fullPath)
    .split(path.sep)
    .join('/');

  const content = fs.readFileSync(fullPath, 'utf8');

  return `// ===== ${rel} =====

${content.trimEnd()}


// ----- end ${rel} -----

`;
}

function makeDump(root: string, files: string[]) {
  let out = formatHeader(root, files.length);
  for (const f of files) {
    out += formatFile(root, f);
  }
  return out;
}

async function main() {
  const flags = parseFlags();

  const allowedExts = new Set(
    flags.exts
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const excludeDirs = new Set(
    flags.exclude
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

  const allFiles = collectFiles(flags.root, allowedExts, excludeDirs);
  const files = filterByPattern(allFiles, flags.root, flags.include);

  const dump = makeDump(flags.root, files);

  if (flags.out) {
    fs.writeFileSync(flags.out, dump, 'utf8');
    process.stdout.write(dump);
  } else if (flags.clipboard) {
    await clipboardy.write(dump);
    console.error('✅ Dump copiado al portapapeles.');
  } else {
    process.stdout.write(dump);
  }
}

main().catch((err) => {
  console.error('dump-project error:', err);
  process.exit(1);
});
