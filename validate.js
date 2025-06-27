#!/usr/bin/env node

// Simple validation script to test key functionality
console.log("🔍 Validating Vaishnavi Complaints Corner...\n");

const fs = require("fs");
const path = require("path");

// Check if key files exist
const keyFiles = [
  ".env.local",
  "app/page.tsx",
  "hooks/useApi.ts",
  "lib/mongodb.ts",
  "lib/models.ts",
  "app/api/workspaces/route.ts",
  "app/api/notes/route.ts",
  "app/api/pins/route.ts",
  "app/api/upload/route.ts",
  "app/api/test-db/route.ts",
];

let allFilesExist = true;

keyFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check environment variables
if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  if (envContent.includes("MONGODB_URI=")) {
    console.log("✅ MongoDB URI configured");
  } else {
    console.log("❌ MongoDB URI missing in .env.local");
    allFilesExist = false;
  }

  if (envContent.includes("CLOUDINARY_")) {
    console.log("✅ Cloudinary configuration found");
  } else {
    console.log(
      "⚠️  Cloudinary configuration missing (file upload may not work)"
    );
  }
}

// Check package.json dependencies
if (fs.existsSync("package.json")) {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const requiredDeps = ["mongoose", "next", "react", "cloudinary"];

  requiredDeps.forEach((dep) => {
    if (pkg.dependencies[dep]) {
      console.log(`✅ ${dep} dependency`);
    } else {
      console.log(`❌ ${dep} dependency missing`);
      allFilesExist = false;
    }
  });
}

console.log("\n" + "=".repeat(50));

if (allFilesExist) {
  console.log("🎉 All key files and dependencies are present!");
  console.log("\n📋 Next steps:");
  console.log("1. Run: npm run dev");
  console.log("2. Visit: http://localhost:3001");
  console.log("3. Test MongoDB: http://localhost:3001/api/test-db");
  console.log("4. Enter secret code: vaisH@206");
  console.log("5. Try creating workspaces and notebooks!");
} else {
  console.log(
    "❌ Some files or dependencies are missing. Please check the errors above."
  );
}

console.log("\n🔧 For detailed debugging, see DEBUG.md");
