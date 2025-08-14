# XPath Seeker

[![License: MIT](https://img.shields.io/badge/XPath-Seeker-orange.svg)](https://github.com/CodingTumbleweed/XPath-Seeker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Chrome browser extension that helps you find the XPath of any DOM element on a webpage. Perfect for web scraping, test automation, and web development.

## Features

- Right-click context menu integration
- One-click XPath generation
- Copy to clipboard functionality
- Toggle extension on/off
- Visual feedback with icon states
- Works on any webpage
- Minimal permissions required

## Installation

### Developer Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked extension"
4. Browse to the project root folder and select it
5. The XPath Seeker icon will appear in your browser toolbar

### Usage
1. Right-click on any element on a webpage
2. Select "Get XPath" from the context menu
3. The XPath will be displayed in a prompt window
4. Use Ctrl/Cmd + C to copy the XPath
5. Click the extension icon to toggle it on/off

## Project Structure

```
XPath-Seeker/
├── _locales/
│   └── en/
│       └── messages.json    # Localization strings
├── images/
│   ├── icon128.png         # Extension icons
│   ├── icon48.png
│   ├── icon16.png
│   ├── icon48-grey.png     # Disabled state icons
│   └── icon16-grey.png
├── src/
│   ├── background.js       # Background script
│   └── contentScript.js    # Content script for DOM interaction
└── manifest.json           # Extension manifest
```

## Features in Detail

### Background Script (`background.js`)
- Manages context menu integration
- Handles extension icon state
- Processes XPath requests
- Manages clipboard operations

### Content Script (`contentScript.js`)
- Tracks clicked elements
- Generates XPath expressions
- Communicates with background script
- DOM manipulation and monitoring

### Manifest (`manifest.json`)
```json
{
  "name": "XPath Seeker",
  "version": "1.0.0",
  "manifest_version": 2,
  "permissions": [
    "contextMenus",
    "notifications"
  ]
}
```

## Permissions

The extension requires minimal permissions:
- `contextMenus`: For the right-click menu integration
- `notifications`: For user feedback

## Development

### Building
No build process required - the extension runs directly from source.

### Testing
1. Make changes to the source files
2. Reload the extension in Chrome
3. Test functionality on various websites

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Browser Support

- Chrome 6.0.0.0 or later
- Chromium-based browsers (Edge, Opera, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

CodingTumbleweed

## Acknowledgments

- Chrome Extension API Documentation
- XPath specification
- Open-source community