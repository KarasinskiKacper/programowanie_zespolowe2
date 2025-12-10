import { mdToPdf } from "md-to-pdf";
import { glob } from "glob";
import fs from "fs";

async function main() {
  const files = await glob("docs/**/*.md");

  // Sortowanie alfabetyczne, aby PDF miał stabilną kolejność
  files.sort();

  let combined = "";

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    combined += `\n\n# ${file}\n\n` + content + "\n\n";
  }

  const result = await mdToPdf({ content: combined }, {});

  if (result.content) {
    fs.writeFileSync("docs/documentation.pdf", result.content);
    console.log("✔️ Wygenerowano docs/documentation.pdf");
  } else {
    console.error("❌ Błąd generowania PDF");
  }
}

main();
