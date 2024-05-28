#!/bin/bash

# Function to create a file with content
create_file() {
  local file_name="$1"
  local file_path="$2"
  local file_content="$3"

  if [ -f "$file_path/$file_name" ]; then
    echo "File $file_path/$file_name already exists."
  else
    echo "$file_content" > "$file_path/$file_name"
    echo "File $file_path/$file_name created successfully."
  fi
}

# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Please provide a name for the files (e.g., auth)."
  exit 1
fi

# Set the base directory
base_dir="src"

# Create the directory if it doesn't exist
if [ ! -d "$base_dir" ]; then
  mkdir "$base_dir"
fi

# Create the module directory
module_dir="$base_dir/$1"
if [ ! -d "$module_dir" ]; then
  mkdir "$module_dir"
fi

# Create the controller file with basic content
controller_file="$1.controller.ts"
controller_content="import { Request, Response } from 'express';

export const ${1}Controller = {
  index: (req: Request, res: Response) => {
    res.send('Hello from ${1} controller!');
  },
};
"
create_file "$controller_file" "$module_dir" "$controller_content"

# Create the router file with basic content
router_file="$1.router.ts"
router_content="import express from 'express';
import { ${1}Controller } from './${1}.controller';

const router = express.Router();

router.get('/', ${1}Controller.index);

export default router;
"
create_file "$router_file" "$module_dir" "$router_content"

echo "Files created successfully in $module_dir."
