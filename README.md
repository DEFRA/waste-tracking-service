# Waste Tracking Service Documentation

Documentation website for DEFRA's Digital Waste Tracking Service. This repository contains the public-facing technical documentation published at [https://defra.github.io/waste-tracking-service](https://defra.github.io/waste-tracking-service).

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
  - [Available Commands](#available-commands)
  - [Adding Documentation](#adding-documentation)
  - [Working with Bruno Collections](#working-with-bruno-collections)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Additional Resources](#additional-resources)
- [Licence](#licence)

## Overview

This repository hosts the documentation site for DEFRA's Waste Tracking Service, built using MkDocs Material. The documentation includes:

- **API Specifications** - OpenAPI/Swagger documentation for the Receipt of Waste API
- **Authentication Guides** - OAuth and JWT authentication instructions
- **Data Definitions** - Receipt data requirements and field specifications
- **Use Cases** - Process diagrams and workflows for waste receivers
- **Testing Guides** - API testing examples and production approval tests
- **FAQs** - Frequently asked questions and troubleshooting

The documentation is aimed at waste receivers, carriers, software providers, and developers integrating with DEFRA's waste tracking APIs.

## Key Features

- Static documentation site generated with MkDocs Material
- Automated deployment to GitHub Pages
- OpenAPI/Swagger specifications for API endpoints
- Bruno API collections for testing examples
- Light and dark mode support
- Full-text search across documentation
- Mobile-responsive design

## Technology Stack

- **Site Generator**: MkDocs Material
- **Runtime**: Python 3
- **Deployment**: GitHub Pages (via GitHub Actions)
- **API Testing**: Bruno API collections
- **Hosting**: GitHub Pages at `defra.github.io/waste-tracking-service`

## Prerequisites

- Python 3
- pip (Python package manager)

## Getting Started

### 1. Clone the Repository

```bash
cd waste-tracking-service
```

### 2. Install MkDocs Material

```bash
pip install mkdocs-material
```

### 3. Run the Documentation Site Locally

Start the local development server with live reload:

```bash
mkdocs serve
```

The documentation will be available at `http://127.0.0.1:8000`

Any changes you make to the documentation files will automatically reload in your browser.

### 4. Build the Static Site

To generate the static HTML files:

```bash
mkdocs build
```

The built site will be output to the `site/` directory.

## Development

### Available Commands

```bash
# Local Development
mkdocs serve              # Start local server with live reload (http://127.0.0.1:8000)

# Building
mkdocs build              # Build static site to site/ directory

# Deployment
mkdocs gh-deploy          # Deploy to GitHub Pages (automated via CI/CD)
```

### Adding Documentation

1. **Create or edit Markdown files** in the `docs/` directory
2. **Add new pages to navigation** by editing `mkdocs.yml`:
   ```yaml
   nav:
     - README.md
     - your-new-page.md
   ```
3. **Use MkDocs extensions** for enhanced formatting:
   - Admonitions for callouts (`!!! note`, `!!! warning`)
   - Tables with `| Header | Header |`
   - Code blocks with syntax highlighting
4. **Preview changes** with `mkdocs serve` before committing

### Working with Bruno Collections

The `docs/bruno/` directory contains API testing collections that can be imported into [Bruno](https://www.usebruno.com/), an open-source API client. These collections provide example requests for testing the Receipt of Waste API.

## Deployment

### Automated Deployment

Documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch:

1. **GitHub Actions workflow** (`.github/workflows/ci.yml`) triggers on push to `main`
2. **Python 3.x is installed** and MkDocs Material is set up
3. **`mkdocs gh-deploy --force`** builds and deploys to the `gh-pages` branch
4. **GitHub Pages** serves the site at https://defra.github.io/waste-tracking-service

### Manual Deployment

To manually deploy (if needed):

```bash
mkdocs gh-deploy --force
```

This builds the site and pushes it to the `gh-pages` branch.

## Contributing

When contributing to this documentation:

1. **Follow existing formatting** - Review similar pages for style consistency
2. **Use UK English spelling** - Organisation, initialise, authorise, licence, etc.
3. **Keep content high-level** - Focus on clarity and practical guidance
4. **Test locally** - Always preview changes with `mkdocs serve` before committing
5. **Update navigation** - Add new pages to `mkdocs.yml` nav section
6. **Include images thoughtfully** - Store images in `docs/assets/` or alongside related docs

For API specification changes:

- Update OpenAPI YAML files in `docs/apiSpecifications/`
- Ensure specifications follow OpenAPI 3.x standards
- Update Bruno collections if endpoints change

## Additional Resources

- **Published Documentation**: https://defra.github.io/waste-tracking-service
- **MkDocs Documentation**: https://www.mkdocs.org/
- **Material for MkDocs**: https://squidfunk.github.io/mkdocs-material/
- **Bruno API Client**: https://www.usebruno.com/

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to licence the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
