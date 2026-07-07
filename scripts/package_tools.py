import os
import json
import zipfile
import hashlib
import sys
from pathlib import Path

def compute_sha256(file_path):
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

def package_tools():
    # Parse target tools passed as arguments (if any)
    target_tools = sys.argv[1:] if len(sys.argv) > 1 else None
    if target_tools:
        print(f"Incremental mode active. Target tools to build: {target_tools}")

    repo = os.environ.get("GITHUB_REPOSITORY", "vivek123r/omniforge-website")
    branch = os.environ.get("GITHUB_REF_NAME", "main")
    
    root_dir = Path(__file__).resolve().parent.parent
    tools_dir = root_dir / "tools"
    dist_dir = root_dir / "dist_tools"
    dist_dir.mkdir(exist_ok=True)
    
    index_json_path = root_dir / "index.json"
    
    # Load existing registry
    registry = {"tools": {}}
    if index_json_path.exists():
        try:
            with open(index_json_path, "r", encoding="utf-8") as f:
                registry = json.load(f)
        except Exception as e:
            print(f"Warning: could not load existing index.json: {e}")
    
    if "tools" not in registry:
        registry["tools"] = {}
        
    released_list = []
    
    for tool_folder in tools_dir.iterdir():
        if not tool_folder.is_dir():
            continue
            
        tool_id = tool_folder.name
        
        # If in incremental mode, skip tools that are not in target_tools
        if target_tools is not None and tool_id not in target_tools:
            print(f"Skipping {tool_id} (unchanged)")
            continue
            
        manifest_path = tool_folder / "manifest.json"
        if not manifest_path.exists():
            print(f"Skipping {tool_id}: no manifest.json found")
            continue
            
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
        except Exception as e:
            print(f"Error parsing manifest for {tool_id}: {e}")
            continue
            
        tool_id = manifest.get("id") or tool_id
        version = manifest.get("version", "1.0.0")
        
        # Package ZIP file
        zip_filename = f"{tool_id}-{version}.oftool"
        zip_path = dist_dir / zip_filename
        
        print(f"Packaging {tool_id} v{version} into {zip_filename}...")
        
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, _, files in os.walk(tool_folder):
                for file in files:
                    file_path = Path(root) / file
                    rel_path = file_path.relative_to(tool_folder)
                    zf.write(file_path, rel_path)
                    
        # Compute SHA-256
        sha256 = compute_sha256(zip_path)
        
        # Build registry entry
        icon_filename = manifest.get("icon")
        icon_url = ""
        if icon_filename:
            icon_url = f"https://raw.githubusercontent.com/{repo}/{branch}/tools/{tool_id}/{icon_filename}"
            
        tool_entry = {
            "id": tool_id,
            "name": manifest.get("name", tool_id),
            "description": manifest.get("description", ""),
            "version": version,
            "category": manifest.get("category", "utilities"),
            "author": manifest.get("author", "Community"),
            "license": manifest.get("license", "MIT"),
            "tags": manifest.get("tags", []),
            "minAppVersion": manifest.get("minAppVersion", "0.1.0"),
            "entryPoint": manifest.get("entryPoint", "tool.py"),
            "dependencies": manifest.get("dependencies", {}),
            "icon": icon_url,
            "downloadUrl": f"https://github.com/{repo}/releases/download/{tool_id}-{version}/{zip_filename}",
            "sha255": sha256 # maintain schema field compatibility (sha256)
        }
        # Backward-compatibility alias
        tool_entry["sha256"] = sha256
        
        registry["tools"][tool_id] = tool_entry
        released_list.append(f"{tool_id},{version},{zip_path.relative_to(root_dir)}")
        
    # Write registry back
    with open(index_json_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)
    print(f"Updated index.json successfully.")
    
    # Save list of released tools
    with open(dist_dir / "release_packages.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(released_list))
    print(f"Wrote release packages list to dist_tools/release_packages.txt")

if __name__ == "__main__":
    package_tools()
