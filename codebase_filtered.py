import os
import sys

def generate_tree(root_dir, output_file, prefix="", is_last=True):
    """Generate a tree-like string representation, skipping dot files, specific directories, and output file."""
    tree = []
    root_name = os.path.basename(root_dir)
    tree.append(f"{prefix}{'└── ' if is_last else '├── '}{root_name}")
    
    prefix += "    " if is_last else "│   "
    skip_dirs = {'.git', 'node_modules', 'venv', '__pycache__', '.venv', 'dist', 'build', '.idea', 'target'}
    
    try:
        output_abs_path = os.path.abspath(output_file)
        items = sorted(os.listdir(root_dir))
        for i, item in enumerate(items):
            item_path = os.path.join(root_dir, item)
            is_last_item = i == len(items) - 1
            if os.path.abspath(item_path) == output_abs_path:
                continue
            if os.path.isdir(item_path):
                if item in skip_dirs:
                    continue
                tree.extend(generate_tree(item_path, output_file, prefix, is_last_item))
            elif not item.startswith('.'):
                tree.append(f"{prefix}{'└── ' if is_last_item else '├── '}{item}")
    except PermissionError:
        tree.append(f"{prefix}{'└── ' if is_last_item else '├── '}[Permission denied]")
    
    return tree

def collect_codebase_filtered(root_dir, output_file):
    skip_dirs = {'.git', 'node_modules', 'venv', '__pycache__', '.venv', 'dist', 'build', '.idea', 'target'}
    output_abs_path = os.path.abspath(output_file)
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Write directory tree
        outfile.write("=== Directory Structure ===\n")
        tree = generate_tree(root_dir, output_file)
        outfile.write("\n".join(tree))
        outfile.write("\n\n=== File Contents ===\n\n")
        
        # Collect file contents
        for dirpath, dirnames, filenames in os.walk(root_dir, topdown=True):
            dirnames[:] = [d for d in dirnames if d not in skip_dirs]
            
            for filename in filenames:
                if filename.startswith('.'):
                    continue
                file_path = os.path.join(dirpath, filename)
                if os.path.abspath(file_path) == output_abs_path:
                    continue
                relative_path = os.path.relpath(file_path, root_dir)
                
                outfile.write(f"--- File: {relative_path} ---\n\n")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                        outfile.write(content)
                        outfile.write("\n\n")
                except UnicodeDecodeError:
                    outfile.write("[[Binary file or encoding error - content skipped]]\n\n")
                except Exception as e:
                    outfile.write(f"[[Error reading file: {e}]]\n\n")

    print(f"Codebase collected into {output_file}")

if __name__ == "__main__":
    root_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    output_file = sys.argv[2] if len(sys.argv) > 2 else "codebase_filtered.txt"
    collect_codebase_filtered(root_dir, output_file)