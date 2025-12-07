import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importFixes = {
  '"@radix-ui/react-slot@1.1.2"': '"@radix-ui/react-slot"',
  '"@radix-ui/react-label@2.1.2"': '"@radix-ui/react-label"',
  '"@radix-ui/react-select@2.1.6"': '"@radix-ui/react-select"',
  '"@radix-ui/react-dialog@1.1.6"': '"@radix-ui/react-dialog"',
  '"@radix-ui/react-alert-dialog@1.1.6"': '"@radix-ui/react-alert-dialog"',
  '"@radix-ui/react-tabs@1.1.3"': '"@radix-ui/react-tabs"',
  '"class-variance-authority@0.7.1"': '"class-variance-authority"',
  '"next-themes@0.4.6"': '"next-themes"',
  '"sonner@2.0.3"': '"sonner"',
  '"lucide-react@0.487.0"': '"lucide-react"',
};

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  for (const [oldImport, newImport] of Object.entries(importFixes)) {
    if (content.includes(oldImport)) {
      content = content.replace(
        new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        newImport
      );
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function fixImportsInDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fixImportsInDirectory(filePath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fixImportsInFile(filePath);
    }
  });
}

console.log("🔧 Fixing imports...");
fixImportsInDirectory(path.join(__dirname, "src"));
console.log("✅ Done!");
