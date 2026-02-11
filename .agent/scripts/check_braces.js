
const fs = require('fs');

function checkStructure(filename) {
    try {
        const content = fs.readFileSync(filename, 'utf-8');
        const lines = content.split('\n');
        const stack = [];
        const pairs = { ')': '(', '}': '{', ']': '[' };
        
        let inString = false;
        let stringChar = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNum = i + 1;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                // Simple string skipping (doesn't handle escaped quotes perfectly but better than nothing)
                if (inString) {
                    if (char === stringChar && line[j-1] !== '\\') {
                        inString = false;
                    }
                    continue;
                }
                
                if (char === '"' || char === "'" || char === '`') {
                    inString = true;
                    stringChar = char;
                    continue;
                }

                if (['(', '{', '['].includes(char)) {
                    stack.push({ char, line: lineNum });
                } else if ([')', '}', ']'].includes(char)) {
                    if (stack.length === 0) {
                        console.log(`Error: Unmatched '${char}' at line ${lineNum}`);
                        return;
                    }
                    const last = stack.pop();
                    if (last.char !== pairs[char]) {
                        console.log(`Error: Mismatched '${char}' at line ${lineNum}. Expected closing for '${last.char}' from line ${last.line}`);
                        return;
                    }
                }
            }
        }

        if (stack.length > 0) {
            const last = stack[stack.length - 1];
            console.log(`Error: Unclosed '${last.char}' from line ${last.line}`);
        } else {
            console.log("Structure looks OK");
        }

    } catch (err) {
        console.error("Error reading file:", err);
    }
}

if (process.argv.length < 3) {
    console.log("Usage: node check_braces.js <filename>");
} else {
    checkStructure(process.argv[2]);
}
