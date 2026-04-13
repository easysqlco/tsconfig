import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const expectedExports = {
  "./dev": "./dev/tsconfig.json",
  "./react": "./react/tsconfig.json",
  "./react/build": "./react/tsconfig.build.json",
};

function relativePath(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readJsonc(filePath) {
  const source = readFileSync(filePath, "utf8");

  try {
    return vm.runInNewContext(`(${source}\n)`, {}, { filename: filePath });
  } catch (error) {
    fail(`Failed to parse ${relativePath(filePath)}: ${error.message}`);
  }
}

function isPublished(filePath, publishedEntries) {
  const normalizedFilePath = filePath.replace(/^\.\//, "");

  return publishedEntries.some((entry) => {
    const normalizedEntry = entry.replace(/^\.\//, "");

    if (normalizedEntry.endsWith("/")) {
      return normalizedFilePath.startsWith(normalizedEntry);
    }

    return normalizedFilePath === normalizedEntry;
  });
}

function resolveExtends(configPath, extendsRef, packageJson) {
  if (extendsRef.startsWith(".") || extendsRef.startsWith("/")) {
    const resolvedPath = path.resolve(path.dirname(configPath), extendsRef);

    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }

    if (existsSync(`${resolvedPath}.json`)) {
      return `${resolvedPath}.json`;
    }

    fail(
      `Config ${relativePath(configPath)} extends missing local path ${extendsRef}`,
    );
  }

  if (extendsRef === packageJson.name || extendsRef.startsWith(`${packageJson.name}/`)) {
    const exportKey =
      extendsRef === packageJson.name
        ? "."
        : `.${extendsRef.slice(packageJson.name.length)}`;
    const exportTarget = packageJson.exports?.[exportKey];

    if (!exportTarget) {
      fail(
        `Config ${relativePath(configPath)} references missing package export ${extendsRef}`,
      );
    }

    return path.resolve(rootDir, exportTarget);
  }

  return null;
}

function validateConfig(configPath, packageJson) {
  const config = readJsonc(configPath);
  const extendsEntries = Array.isArray(config.extends)
    ? config.extends
    : config.extends
      ? [config.extends]
      : [];

  for (const extendsRef of extendsEntries) {
    const resolvedExtends = resolveExtends(configPath, extendsRef, packageJson);

    if (resolvedExtends && !existsSync(resolvedExtends)) {
      fail(
        `Resolved extends target ${relativePath(resolvedExtends)} does not exist for ${relativePath(configPath)}`,
      );
    }
  }
}

try {
  const packageJsonPath = path.join(rootDir, "package.json");
  const readmePath = path.join(rootDir, "README.md");
  const agentsPath = path.join(rootDir, "AGENTS.md");
  const packageJson = readJson(packageJsonPath);
  const publishedEntries = packageJson.files ?? [];

  if (!existsSync(readmePath)) {
    fail("README.md is required");
  }

  if (!existsSync(agentsPath)) {
    fail("AGENTS.md is required");
  }

  if (packageJson.peerDependencies?.typescript !== ">= 5 < 6") {
    fail('package.json must declare "typescript": ">= 5 < 6" in peerDependencies');
  }

  for (const requiredFile of ["README.md", "LICENSE"]) {
    if (!publishedEntries.includes(requiredFile)) {
      fail(`package.json files must include ${requiredFile}`);
    }
  }

  for (const [exportKey, exportTarget] of Object.entries(expectedExports)) {
    if (packageJson.exports?.[exportKey] !== exportTarget) {
      fail(`package.json export ${exportKey} must point to ${exportTarget}`);
    }
  }

  for (const exportTarget of Object.values(expectedExports)) {
    const absoluteTarget = path.resolve(rootDir, exportTarget);

    if (!existsSync(absoluteTarget)) {
      fail(`Missing exported config ${exportTarget}`);
    }

    if (!isPublished(exportTarget, publishedEntries)) {
      fail(`Exported config ${exportTarget} is not included in package.json files`);
    }

    validateConfig(absoluteTarget, packageJson);
  }

  console.log(
    `Validated ${Object.keys(expectedExports).length} exported configs and package metadata.`,
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
