const fs = require("fs");
const path = require("path");

// Read JSON files
const collectionPath = path.join(__dirname, "..", "collection.json");
const competitionsPath = path.join(__dirname, "..", "competitions.json");
const outputPath = path.join(__dirname, "..", "es-ws-collection.json");

try {
  // Load data
  const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
  const competitions = JSON.parse(fs.readFileSync(competitionsPath, "utf8"));

  // Create a map of competition names to their order (index)
  const competitionOrder = new Map();
  competitions.forEach((comp, index) => {
    competitionOrder.set(comp.name, index);
  });

  // Filter collection to only include projects with matching competitions
  const filteredCollection = collection.filter((project) => {
    return competitionOrder.has(project.competition);
  });

  // Sort the filtered collection
  const sortedCollection = filteredCollection.sort((a, b) => {
    // Primary sort: by competition order
    const orderA = competitionOrder.get(a.competition);
    const orderB = competitionOrder.get(b.competition);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort: alphabetically by name
    return a.name.localeCompare(b.name);
  });

  // Write the sorted collection to output file
  fs.writeFileSync(
    outputPath,
    JSON.stringify(sortedCollection, null, 2),
    "utf8"
  );

  console.log(`✅ Successfully sorted and filtered collection!`);
  console.log(`📊 Original entries: ${collection.length}`);
  console.log(`📊 Filtered entries: ${filteredCollection.length}`);
  console.log(
    `📊 Skipped entries: ${collection.length - filteredCollection.length}`
  );
  console.log(`📄 Output file: ${outputPath}`);
} catch (error) {
  console.error("❌ Error processing files:", error.message);
  process.exit(1);
}
