import fs from 'fs/promises';
import path from 'path';

const walk = async (dir, fileList = []) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = await walk(path.join(dir, file), fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
};

const processFiles = async () => {
  const files = await walk('src');

  for (const file of files) {
    let content = await fs.readFile(file, 'utf8');
    let changed = false;

    // 1. Convert react-router-dom imports to next/navigation and next/link
    if (content.includes('react-router-dom')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
        const importList = imports.split(',').map(i => i.trim());
        const nextNav = [];
        const nextLink = [];

        importList.forEach(imp => {
          if (imp === 'Link') nextLink.push('Link');
          else if (imp === 'useNavigate') nextNav.push('useRouter as useNavigate');
          else nextNav.push(imp);
        });

        let newImports = '';
        if (nextNav.length > 0) newImports += `import { ${nextNav.join(', ')} } from 'next/navigation';\n`;
        if (nextLink.length > 0) newImports += `import Link from 'next/link';\n`;
        return newImports;
      });
      changed = true;
    }

    // 2. Fix useForm import (from react-hook-form -> no change, but requires use client)
    // 3. Prepend "use client" if it has client-side hooks or event handlers
    const needsUseClient = /useState|useEffect|useRouter|useNavigate|useSearchParams|useLocation|useForm|useQuery|useMutation|toast|onClick|onChange|onSubmit/.test(content);
    if (needsUseClient && !content.startsWith('"use client";') && !content.startsWith("'use client';")) {
      content = `"use client";\n` + content;
      changed = true;
    }

    // 4. Replace relative imports with aliases
    if (content.match(/from\s+['"]\.\.\//) || content.match(/from\s+['"]\.\.\/\.\.\//)) {
      content = content.replace(/from\s+['"](\.\.\/)+([^'"]+)['"]/g, "from '@/$2'");
      changed = true;
    }

    // 5. Remove react-helmet-async (for client side, they shouldn't use Helmet, but we'll just strip it to prevent errors for now)
    if (content.includes('react-helmet-async')) {
      content = content.replace(/import\s+\{\s*Helmet\s*(?:,\s*HelmetProvider)?\s*\}\s+from\s+['"]react-helmet-async['"];?/g, '');
      content = content.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, '');
      content = content.replace(/<HelmetProvider>([\s\S]*?)<\/HelmetProvider>/g, '$1');
      changed = true;
    }

    // 6. Replace import.meta.env with process.env.NEXT_PUBLIC_
    if (content.includes('import.meta.env.VITE_')) {
      content = content.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');
      changed = true;
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
};

processFiles().catch(console.error);
