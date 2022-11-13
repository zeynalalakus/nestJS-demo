import { rm } from "fs/promises";
import { doc } from "prettier";
import { join } from "path";

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
})
