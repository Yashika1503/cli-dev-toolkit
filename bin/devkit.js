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
    .option("-m, --method <method>", "HTTP method", "GET")
    .option("-t, --timeout <ms>", "Request timeout in milliseconds", "5000")
    .action(checkApi);

program.parse();