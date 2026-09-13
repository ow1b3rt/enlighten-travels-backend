import fs from "fs/promises";
import path from "path";
import { StatusCodes } from "http-status-codes";

const LAYOUTS_DIR = path.join(process.cwd(), "frontlayouts");

export async function saveLayoutController(req, res) {
  const { name } = req.params;
  const data = req.body;

  await fs.mkdir(LAYOUTS_DIR, { recursive: true });
  const filePath = path.join(LAYOUTS_DIR, `${name}.json`);

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Layout '${name}' saved`,
  });
}

export async function getLayoutController(req, res) {
  const { name } = req.params;
  const filePath = path.join(LAYOUTS_DIR, `${name}.json`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    res.status(StatusCodes.OK).json({
      success: true,
      layout: JSON.parse(content),
    });
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: `Layout '${name}' not found`,
    });
  }
}
