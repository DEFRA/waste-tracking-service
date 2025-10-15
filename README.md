# Waste Tracking Service Documentation

This repository contains the documentation for the DEFRA Digital Waste Tracking Service.

## Versioned Documentation

The documentation is now versioned using [mike](https://github.com/jimporter/mike) and deployed to GitHub Pages. This allows API consumers to lock their integration to a specific version of the schema.

### How Versioning Works

- **Publish a GitHub Release**: Deploys a snapshot (for example, `v1.0.0`) and points the `latest` alias at it

### Viewing Documentation

- **Latest stable version**: https://defra.github.io/waste-tracking-service/
- **Specific version**: https://defra.github.io/waste-tracking-service/v1.0.0/

Users can switch between versions using the version selector in the documentation header.

### One-time Bootstrap (before enabling the workflow)

Run this once so that the `gh-pages` branch exists with an initial `latest` alias:

```bash
pip install mkdocs-material mike
mike deploy --push --remote origin --branch gh-pages v1.0.0 latest
mike set-default --push --remote origin --branch gh-pages latest
```

Replace `v1.0.0` with the current schema version. After pushing, configure GitHub Pages (below) and then enable the workflow.

### Creating a New Version

To create a new versioned release once the workflow is in place:

1. **Update the OpenAPI spec version** in `docs/apiSpecifications/Receipt API.yml`:
   ```yaml
   info:
     version: "1.1.0"  # Update this
   ```

2. **Commit your changes** and push to `main`

3. **Create a GitHub Release**:
   - Go to https://github.com/DEFRA/waste-tracking-service/releases/new
   - Tag version: `v1.1.0` (must match semver format: `v{major}.{minor}.{patch}`)
   - Release title: `v1.1.0`
   - Description: Describe what changed in this version
   - Click "Publish release"

4. **Deployment happens automatically**:
   - The GitHub Actions workflow pushes the release docs to the `gh-pages` branch
   - The new version will be available at `/v1.1.0/`
   - The "latest" alias will point to this new version

### Local Development

#### Prerequisites

```bash
pip install mkdocs-material mike
```

#### Preview Documentation Locally

```bash
mkdocs serve
```

Open http://127.0.0.1:8000 in your browser.

#### Test Versioned Build Locally

Build a test version:

```bash
mike deploy v1.0.0-test latest
mike serve
```

Open http://127.0.0.1:8000 to see the versioned documentation with version selector.

### GitHub Pages Setup

**First-time setup only** (if not already configured):

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / folder `/` (root)
3. Save changes

The workflow (and `mike deploy --push`) will keep the branch up to date.

### Version Naming Convention

- Use semantic versioning: `v{major}.{minor}.{patch}`
- Examples: `v1.0.0`, `v1.1.0`, `v2.0.0`
- Breaking changes: Increment major version (v1.x.x → v2.0.0)
- New features: Increment minor version (v1.0.x → v1.1.0)
- Bug fixes: Increment patch version (v1.0.0 → v1.0.1)

### Troubleshooting

**Version selector not appearing?**
- Check that `extra.version.provider: mike` is set in `mkdocs.yml`
- Ensure at least one version has been deployed with `mike deploy`

**Deployment failed?**
- Check the Actions tab for the `Deploy Versioned Documentation` workflow logs
- Ensure the `gh-pages` branch exists and the GitHub Pages settings point to it
- Confirm the repository has the `GITHUB_TOKEN` permission to push to `gh-pages`

**Need to delete a version?**

```bash
mike delete --push --remote origin --branch gh-pages v1.0.0
```

## Documentation Structure

- `docs/` - Documentation source files (Markdown)
- `docs/apiSpecifications/` - OpenAPI specifications and Swagger UI
- `mkdocs.yml` - MkDocs configuration
- `.github/workflows/ci.yml` - Deployment workflow

## Contributing

When updating documentation:

1. Make changes in the `docs/` folder
2. Test locally with `mkdocs serve`
3. Commit and push to `main`
4. When ready for release, create a GitHub Release (creates versioned docs)

## Support

For questions about the API or documentation, contact: wasteuserresearch@defra.gov.uk
