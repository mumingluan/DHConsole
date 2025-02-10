# Stop execution on errors
$ErrorActionPreference = "Stop"

Write-Output "Stashing local changes..."
git stash push -m "Temporary stash before deployment"

Write-Output "Building the project..."
npm run build

# Ensure the build directory exists
if (-Not (Test-Path -Path "./dist" -PathType Container)) {
    Write-Error "Build failed. Exiting..."
    git stash pop
    exit 1
}

Write-Output "Deploying to GitHub Pages..."

# Store the current branch name
$CurrentBranch = git branch --show-current

# Switch to gh-pages branch, or create it if it doesn't exist
if (-Not (git show-ref --verify --quiet refs/heads/gh-pages)) {
    git checkout --orphan gh-pages
} else {
    git checkout gh-pages
    git reset --hard origin/gh-pages
}

# Preserve project files (node_modules, package.json, config files)
Write-Output "Preserving project files..."
Get-ChildItem -Path . -Exclude "dist", ".git", ".github", "node_modules", "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json" | Remove-Item -Recurse -Force

# Move the dist contents to root
Move-Item -Path "dist/*" -Destination "." -Force

# Commit and push changes
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Switch back to the original branch
git checkout $CurrentBranch

Write-Output "Restoring local changes..."
git stash pop

Write-Output "Deployment complete!"
