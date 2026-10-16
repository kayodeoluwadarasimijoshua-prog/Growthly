import reviewWidths from "../config/review-image-widths.json" with { type: "json" };
import sharp from "sharp";
import { readFile, stat, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const help = `Usage: npm run prepare:starxco-image -- <local-image> --kind screenshot|homepage-photo --alt "description" --credit "source and permission" (--permission-confirmed | --approval-pending) [--check-only] [--replace]
Requires a genuine, approved wide image. No download, screenshot fabrication or logo recreation occurs.
Check-only validates/optimises in memory without changing the website. Replace is required to overwrite an existing asset.`;
async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(help);
    return;
  }
  const input = args.shift();
  const options = {};
  while (args.length) {
    const key = args.shift();
    if (
      [
        "--permission-confirmed",
        "--approval-pending",
        "--check-only",
        "--replace",
      ].includes(key)
    )
      options[key] = true;
    else if (
      ["--kind", "--alt", "--credit"].includes(key) &&
      args[0] &&
      !args[0].startsWith("--")
    )
      options[key] = args.shift();
    else throw new Error(`Unknown or incomplete option. ${help}`);
  }
  if (
    !input ||
    input.startsWith("--") ||
    !(options["--permission-confirmed"] || options["--approval-pending"])
  )
    throw new Error(
      "Provide a local image and confirm permission first. " + help,
    );
  if (options["--permission-confirmed"] && options["--approval-pending"])
    throw new Error("Choose one permission status, not both.");
  if (!["screenshot", "homepage-photo"].includes(options["--kind"]))
    throw new Error("Specify whether this is a screenshot or homepage-photo.");
  for (const key of ["--alt", "--credit"])
    if (
      typeof options[key] !== "string" ||
      options[key].trim().length < 5 ||
      options[key].trim().length > 300
    )
      throw new Error(
        "Provide a meaningful alt description and source/permission credit (5–300 characters each).",
      );
  const source = path.resolve(input);
  const info = await stat(source);
  if (!info.isFile() || info.size > 25 * 1024 * 1024)
    throw new Error("Input must be a local file no larger than 25 MB.");
  const bytes = await readFile(source);
  const image = sharp(bytes, { limitInputPixels: 20_000_000 });
  const meta = await image.metadata();
  if (
    !["png", "jpeg", "webp", "avif"].includes(meta.format) ||
    (meta.pages ?? 1) !== 1
  )
    throw new Error(
      "Use a still PNG, JPEG, WebP or AVIF image, not an SVG/animation.",
    );
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  if (width < 640 || height < 360 || width / height < 1 || width / height > 3)
    throw new Error(
      "Send a wide homepage first-screen screenshot/photo, at least 640×360. Avoid a tall full-page capture.",
    );
  const pipeline = image.rotate().resize({
    width: 1440,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  });
  let output = await pipeline
    .clone()
    .webp({ quality: 82, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  if (output.data.length > 400_000)
    output = await pipeline
      .clone()
      .webp({ quality: 70, effort: 6 })
      .toBuffer({ resolveWithObject: true });
  if (output.data.length > 400_000)
    throw new Error(
      "Optimised image exceeds 400 KB; choose a tighter first-screen image rather than reducing readability further.",
    );
  const registration = {
    src: options["--approval-pending"]
      ? "/review-media/starxco.webp"
      : "/images/projects/starxco.webp",
    width: output.info.width,
    height: output.info.height,
    alt: options["--alt"].trim(),
    credit: options["--credit"].trim(),
    kind: options["--kind"],
    permissionConfirmed: !options["--approval-pending"],
  };
  if (options["--check-only"]) {
    console.log(
      JSON.stringify({
        checkOnly: true,
        bytes: output.data.length,
        ...registration,
      }),
    );
    return;
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const destination = registration.permissionConfirmed
    ? path.join(root, "public", registration.src.slice(1))
    : path.join(root, "project-assets/starxco.webp");
  const manifestPath = path.join(root, "config/project-images.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest))
    throw new Error(
      "Invalid project-image manifest; review it before importing.",
    );
  let exists = false;
  try {
    await access(destination);
    exists = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if ((exists || manifest.starxco) && !options["--replace"])
    throw new Error(
      "A StarXCO asset already exists. Review it and explicitly use --replace if approved.",
    );
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, output.data);
  if (!registration.permissionConfirmed) {
    for (const width of reviewWidths.filter(
      (width) => width < output.info.width,
    )) {
      const variant = await image
        .clone()
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
      await writeFile(
        path.join(root, `project-assets/starxco-${width}.webp`),
        variant,
      );
    }
  }
  await writeFile(
    manifestPath,
    JSON.stringify({ ...manifest, starxco: registration }, null, 2) + "\n",
  );
  console.log(
    `Imported local WebP: ${output.info.width}×${output.info.height}, ${output.data.length} bytes. EXIF metadata stripped. Rebuild and visually review before release.`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
