#!/usr/bin/env node

import { Command } from "commander";
import checkApi from "../commands/checkApi.js";

const program = new Command();

program
    .name("devkit")
    .description("CLI Developer Toolkit")
    .version("1.0.0");

program
    .command("check-api <url>")
    .description("Check an API endpoint")
    .action(checkApi);

program.parse();