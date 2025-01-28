import os
import shutil

def refactor_ui_directory(base_dir):
    for file in os.listdir(base_dir):
        file_path = os.path.join(base_dir, file)

        # Skip directories
        if os.path.isdir(file_path):
            continue

        # Process only .tsx files
        if file.endswith(".tsx"):
            file_name = os.path.splitext(file)[0]
            new_dir = os.path.join(base_dir, file_name)

            # Create a new directory named after the file
            os.makedirs(new_dir, exist_ok=True)

            # Move the .tsx file into the new directory
            new_file_path = os.path.join(new_dir, "index.tsx")
            shutil.move(file_path, new_file_path)

            print(f"Moved {file_path} to {new_file_path}")

if __name__ == "__main__":
    ui_dir = "./src/components/ui"
    if os.path.exists(ui_dir):
        refactor_ui_directory(ui_dir)
        print("Refactor completed.")
    else:
        print(f"The directory {ui_dir} does not exist.")
