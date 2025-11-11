# Packagist Setup Guide

## Step 1: Create Packagist Account

1. Go to https://packagist.org/
2. Click "Sign up" or "Log in"
3. Sign in with your GitHub account (recommended)

## Step 2: Submit Your Package

1. After logging in, click "Submit" in the top menu
2. Enter your repository URL: `https://github.com/martynchuk/yii2-editable-cell`
3. Click "Check" - Packagist will validate your `composer.json`
4. If validation passes, click "Submit"

## Step 3: Enable Auto-Update (Recommended)

After submitting, you'll see your package page. To enable automatic updates:

1. Go to your package page on Packagist
2. Click "Settings" (gear icon)
3. Enable "GitHub Service Hook" or "Update Hook"
4. This will automatically update Packagist when you push new commits/tags

### Manual Update Hook

If you prefer manual updates, you can use the update hook URL:
- Go to: `https://packagist.org/api/update-package?username=YOUR_USERNAME&apiToken=YOUR_TOKEN`
- Or use the webhook URL provided in package settings

## Step 4: Verify Installation

Once your package is published, users can install it:

```bash
composer require martynchuk/yii2-editable-cell
```

## Important Notes

- **Version Tags**: Make sure you have at least one version tag (we created v1.0.0)
- **Stability**: Your `composer.json` has `"minimum-stability": "stable"` which is good
- **Updates**: After enabling auto-update, every push to GitHub will trigger Packagist update
- **New Versions**: Create new tags for new versions: `git tag v1.0.1 && git push --tags`

## Package URL

After submission, your package will be available at:
https://packagist.org/packages/martynchuk/yii2-editable-cell

