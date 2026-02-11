
import sys

def check_structure(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    stack = []
    
    pairs = {')': '(', '}': '{', ']': '['}

    for i, line in enumerate(lines):
        line_num = i + 1
        for char in line:
            if char in '({[':
                stack.append((char, line_num))
            elif char in ')}]':
                if not stack:
                    print(f"Error: Unmatched '{char}' at line {line_num}")
                    return
                last_char, last_line = stack.pop()
                if last_char != pairs[char]:
                    print(f"Error: Mismatched '{char}' at line {line_num}. Expected closing for '{last_char}' from line {last_line}")
                    return

    if stack:
        char, line = stack[-1]
        print(f"Error: Unclosed '{char}' from line {line}")
    else:
        print("Structure looks OK")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python check_braces.py <filename>")
    else:
        check_structure(sys.argv[1])
