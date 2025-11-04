const fs = require("fs");
const path = require("path");

// Read JSON file
const collectionPath = path.join(__dirname, "..", "es-ws-collection.json");
const outputPath = path.join(__dirname, "..", "es-ws-collection.md");
const todoOutputPath = path.join(__dirname, "..", "es-ws-collection-todo.md");

try {
  // Load data
  const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

  // Create full collection markdown
  let markdown = "# EuroSkills & WorldSkills Project Collection\n\n";
  markdown +=
    "| id  | name                  | competition                      | status |\n";
  markdown +=
    "| --- | --------------------- | -------------------------------- | ------ |\n";

  // Add each project as a row (id is a counter starting from 1)
  collection.forEach((project, index) => {
    const id = (index + 1).toString().padStart(3, " ");
    const name = project.name || "";
    const competition = project.competition || "";
    const status = project.status || "";

    markdown += `| ${id} | ${name} | ${competition} | ${status} |\n`;
  });

  // Write the full markdown file
  fs.writeFileSync(outputPath, markdown, "utf8");

  // Create todo-only collection markdown
  const todoCollection = collection.filter(
    (project) => project.status === "todo"
  );

  let todoMarkdown =
    "# EuroSkills & WorldSkills Project Collection - TODO Tasks\n\n";
  todoMarkdown +=
    "| id  | name                  | competition                      | status |\n";
  todoMarkdown +=
    "| --- | --------------------- | -------------------------------- | ------ |\n";

  // Add each todo project as a row (id is a counter starting from 1)
  todoCollection.forEach((project, index) => {
    const id = (index + 1).toString().padStart(3, " ");
    const name = project.name || "";
    const competition = project.competition || "";
    const status = project.status || "";

    todoMarkdown += `| ${id} | ${name} | ${competition} | ${status} |\n`;
  });

  // Write the todo markdown file
  fs.writeFileSync(todoOutputPath, todoMarkdown, "utf8");

  console.log(`✅ Successfully created markdown files!`);
  console.log(`📊 Total entries: ${collection.length}`);
  console.log(`📊 TODO entries: ${todoCollection.length}`);
  console.log(
    `📊 Published entries: ${collection.length - todoCollection.length}`
  );
  console.log(`📄 Full collection: ${outputPath}`);
  console.log(`📄 TODO collection: ${todoOutputPath}`);
} catch (error) {
  console.error("❌ Error processing files:", error.message);
  process.exit(1);
}
