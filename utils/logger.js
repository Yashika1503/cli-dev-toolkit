import chalk from "chalk";

export function success(message) {
    console.log(chalk.green(message));
}

export function error(message) {
    console.log(chalk.red(message));
}

export function info(label, value) {
    console.log(`${label.padEnd(14)} ${value}`);
}