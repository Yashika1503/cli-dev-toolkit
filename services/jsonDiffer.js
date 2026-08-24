import { readFile } from "node:fs/promises";

export default async function diffJsonFiles(file1, file2) {
    let content1;
    let content2;

    try {
        content1 = await readFile(file1, "utf8");
    } catch {
        throw new Error(`File not found: ${file1}`);
    }

    try {
        content2 = await readFile(file2, "utf8");
    } catch {
        throw new Error(`File not found: ${file2}`);
    }

    let json1;
    let json2;

    try {
        json1 = JSON.parse(content1);
    } catch {
        throw new Error(`Invalid JSON in file: ${file1}`);
    }

    try {
        json2 = JSON.parse(content2);
    } catch {
        throw new Error(`Invalid JSON in file: ${file2}`);
    }

    const keys = new Set([
        ...Object.keys(json1),
        ...Object.keys(json2)
    ]);

    let differenceCount = 0;

    console.log(`Comparing ${file1} → ${file2}\n`);

    for (const key of keys) {
        const existsInOld = Object.hasOwn(json1, key);
        const existsInNew = Object.hasOwn(json2, key);

        if (!existsInOld && existsInNew) {
            differenceCount++;
            console.log(`+ ${key}`);
            console.log(`  ${JSON.stringify(json2[key])}`);
        }

        if (existsInOld && !existsInNew) {
            differenceCount++;
            console.log(`- ${key}`);
            console.log(`  ${JSON.stringify(json1[key])}`);
        }

        if (existsInOld && existsInNew) {
            if (json1[key] !== json2[key]) {
                differenceCount++;
                console.log(`~ ${key}`);
                console.log(`  ${JSON.stringify(json1[key])} → ${JSON.stringify(json2[key])}`);
            }
        }
    }

    if (differenceCount === 0) {
        console.log("✓ No differences found");
    } else {
        console.log(`Total differences: ${differenceCount}`);
    }
}