import { sync as execa } from "execa";
import { resolve } from "path";
import { readFile } from "fs-extra";

const METAFILE_LOCATION = resolve(__dirname, "../meta.jsonl");

function sys_output(command, ...cmdArgs) {
  const commandResults = execa(command, cmdArgs);
  if (commandResults.exitCode > 0) {
    return commandResults.stderr;
  }
  return commandResults.stdout;
}

async function checkLastChangedFiles() {
  let _isMetaStaged: boolean;

  function isMetaStaged() {
    if (_isMetaStaged !== undefined) {
      return _isMetaStaged;
    }
    const filesStdout = sys_output(
      "git",
      "diff-tree",
      "--no-commit-id",
      "--name-only",
      "-r",
      "-n",
      "1",
      "HEAD",
      "--",
      METAFILE_LOCATION
    );
    const files = filesStdout
      .split("\n")
      .map((x) => {
        const [, filename] = x.split("\t");
        if (!filename) {
          return "";
        }
        return filename.trim();
      })
      .filter((x) => {
        return x.endsWith("meta.jsonl");
      });
    return (_isMetaStaged = files.length > 0);
  }

  function getChangedFiles() {
    const filesStdout = sys_output(
      "git",
      "diff-tree",
      "--no-commit-id",
      "--name-only",
      "-r",
      "-n",
      "1",
      "HEAD"
    );
    const files = filesStdout
      .split("\n")
      .map((x) => {
        return x.trim();
      })
      .filter((x) => x.endsWith(".jsonl"))
      .filter((x) => x.startsWith("src/"));
    return files;
  }

  const missingFiles = await getMissingFiles(getChangedFiles());

  if (isMetaStaged()) {
    process.stdout.write(
      "You've added the following files but they're missing from meta.jsonl:\n\n"
    );
    missingFiles.forEach((x) => process.stdout.write(` - ${x}\n`));
    process.stdout.write("\n\n");
    process.stdout.write("Please, update meta.jsonl and try again\n");
    process.exit(2);
  }
  process.stdout.write(
    "You've added the following files but you haven't commited meta.jsonl\n\n"
  );
  missingFiles.forEach((x) => process.stdout.write(` - ${x}\n`));
  process.stdout.write("\n");
  process.stdout.write("Please, commit meta.jsonl and try again\n");
  process.stdout.write(
    "You can check the meta.jsonl file to see how to add the src files\n"
  );
  process.exit(2);
}

async function checkStagedFiles() {
  let _isMetaStaged: boolean;

  function isMetaStaged() {
    if (_isMetaStaged !== undefined) {
      return _isMetaStaged;
    }
    const filesStdout = sys_output(
      "git",
      "diff",
      "--cached",
      "--name-status",
      METAFILE_LOCATION
    );
    const files = filesStdout
      .split("\n")
      .map((x) => {
        const [, filename] = x.split("\t");
        if (!filename) {
          return "";
        }
        return filename.trim();
      })
      .filter((x) => {
        return x.endsWith("meta.jsonl");
      });
    return (_isMetaStaged = files.length > 0);
  }

  function getNewSrcFiles() {
    const filesStdout = sys_output(
      "git",
      "diff",
      "--cached",
      "--name-status",
      "--diff-filter=A"
    );
    const files = filesStdout
      .split("\n")
      .map((x) => {
        const [, filename] = x.split("\t");
        if (!filename) {
          return "";
        }
        return filename.trim();
      })
      .filter((x) => x.endsWith(".jsonl"))
      .filter((x) => x.startsWith("src/"));
    return files;
  }

  const missingFiles = await getMissingFiles(getNewSrcFiles());

  if (isMetaStaged()) {
    process.stdout.write(
      "You've added the following files but they're missing from meta.jsonl:\n\n"
    );
    missingFiles.forEach((x) => process.stdout.write(` - ${x}\n`));
    process.stdout.write("\n\n");
    process.stdout.write("Please, update meta.jsonl and try again\n");
    process.exit(2);
  }
  process.stdout.write(
    "You've added the following files but you haven't staged meta.jsonl\n\n"
  );
  missingFiles.forEach((x) => process.stdout.write(` - ${x}\n`));
  process.stdout.write("\n");
  process.stdout.write(
    "Please, add meta.jsonl to git stage (git add meta.jsonl) and try again\n"
  );
  process.stdout.write(
    "You can check the meta.jsonl file to see how to add the src files\n"
  );
  process.exit(2);
}

async function getMissingFiles(addedFiles) {
  if (!addedFiles || addedFiles.length < 1) {
    process.stdout.write("No files added to src/.\n");
    process.exit(0);
  }

  process.stdout.write(`Reading meta.jsonl from ${METAFILE_LOCATION}\n`);

  const metadata = await readFile(METAFILE_LOCATION, "utf8");
  const metaFiles = metadata
    .split("\n")
    .filter((x) => x)
    .map<{ source: string }>((x) => JSON.parse(x))
    .map((x) => x.source);

  const missingFiles = addedFiles.filter((x) => !metaFiles.includes(x));
  return missingFiles;
}

(async () => {
  if (process.env.CI === "true") {
    await checkLastChangedFiles();
    return;
  }
  await checkStagedFiles();
})();
