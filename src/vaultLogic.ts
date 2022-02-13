import { readFileSync } from "fs";
import { Config } from "./types";
import path from "path";

export function isValidId(id: string): boolean {
    const config: Config = JSON.parse(readFileSync("config.json").toString());
    return config.accounts.includes(id);
}
