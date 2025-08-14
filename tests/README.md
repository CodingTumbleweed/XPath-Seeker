# XPath-Seeker Test Suite

A comprehensive test suite for the XPath-Seeker Chrome extension using Jest and Chrome Extension testing tools.

## Setup

1. Install dependencies:
```json
{
  "devDependencies": {
    "jest": "^27.4.7",
    "jest-chrome": "^0.7.2",
    "puppeteer": "^13.0.1",
    "sinon": "^12.0.1",
    "jest-environment-jsdom": "^27.4.7"
  }
}
```

2. Configure Jest:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/background.js'
  ]
};
```

## Test Structure

```
tests/
├── setup.js                 # Jest setup and global mocks
├── unit/
│   ├── xpath.test.js       # XPath generation tests
│   └── utils.test.js       # Utility function tests
├── integration/
│   ├── context-menu.test.js # Context menu integration tests
│   └── messaging.test.js    # Message passing tests
└── e2e/
    └── extension.test.js    # End-to-end tests
```

## Test Examples

### 1. XPath Generation Tests
```javascript
// tests/unit/xpath.test.js
describe('XPath Generation', () => {
  let mockElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('generates XPath for simple element', () => {
    const xpath = XPathObj.getXPath(mockElement);
    expect(xpath).toBe('//div[1]');
  });

  test('generates XPath for nested element', () => {
    mockElement.innerHTML = '<span><a href="#">Link</a></span>';
    const link = mockElement.querySelector('a');
    const xpath = XPathObj.getXPath(link);
    expect(xpath).toBe('//div[1]/span[1]/a[1]');
  });

  test('handles elements with id', () => {
    mockElement.id = 'test-id';
    const xpath = XPathObj.getXPath(mockElement);
    expect(xpath).toBe('//*[@id="test-id"]');
  });
});
```

### 2. Context Menu Tests
```javascript
// tests/integration/context-menu.test.js
describe('Context Menu Integration', () => {
  beforeEach(() => {
    chrome.contextMenus.create.mockClear();
    chrome.contextMenus.remove.mockClear();
  });

  test('creates context menu on install', () => {
    chrome.runtime.onInstalled.trigger();
    expect(chrome.contextMenus.create).toHaveBeenCalledWith({
      id: 'xpathmenuitem-1',
      title: 'Get XPath',
      contexts: ['all']
    });
  });

  test('toggles context menu on browser action click', () => {
    chrome.browserAction.onClicked.trigger();
    expect(chrome.contextMenus.remove).toHaveBeenCalled();
    chrome.browserAction.onClicked.trigger();
    expect(chrome.contextMenus.create).toHaveBeenCalled();
  });
});
```

### 3. Message Passing Tests
```javascript
// tests/integration/messaging.test.js
describe('Message Passing', () => {
  test('sends XPath in response to getXPath message', () => {
    const mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    
    // Simulate click
    mockElement.click();
    
    // Simulate message from background script
    chrome.runtime.onMessage.trigger(
      { getXPath: true },
      { tab: { id: 1 } },
      (response) => {
        expect(response).toHaveProperty('xpath');
        expect(response.xpath).toBe('//div[1]');
      }
    );
  });
});
```

### 4. End-to-End Tests
```javascript
// tests/e2e/extension.test.js
describe('Extension E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: [
        '--disable-extensions-except=./path/to/extension',
        '--load-extension=./path/to/extension'
      ]
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('gets XPath from context menu', async () => {
    page = await browser.newPage();
    await page.goto('http://example.com');
    
    // Right click on element
    await page.mouse.click(100, 100, { button: 'right' });
    
    // Click "Get XPath" in context menu
    await page.evaluate(() => {
      document.querySelector('[role="menuitem"]').click();
    });
    
    // Check for XPath in prompt
    const promptText = await page.evaluate(() => window.prompt.args[0][0]);
    expect(promptText).toContain('XPath for selected element');
  });
});
```

## Test Categories

### 1. Unit Tests
- XPath generation logic
- DOM traversal
- String manipulation
- Utility functions

### 2. Integration Tests
- Context menu creation/removal
- Browser action handling
- Message passing between scripts
- Icon state management

### 3. End-to-End Tests
- Complete user workflows
- Cross-page functionality
- Browser interaction
- UI response

## Mock Setup

```javascript
// tests/setup.js
import { chrome } from 'jest-chrome';

global.chrome = chrome;

// Mock chrome.contextMenus
chrome.contextMenus = {
  create: jest.fn(),
  remove: jest.fn(),
  onClicked: {
    addListener: jest.fn(),
    trigger: jest.fn()
  }
};

// Mock chrome.browserAction
chrome.browserAction = {
  setIcon: jest.fn(),
  onClicked: {
    addListener: jest.fn(),
    trigger: jest.fn()
  }
};

// Mock chrome.runtime
chrome.runtime = {
  onInstalled: {
    addListener: jest.fn(),
    trigger: jest.fn()
  },
  onMessage: {
    addListener: jest.fn(),
    trigger: jest.fn()
  }
};
```

## Test Utilities

```javascript
// tests/utils/dom-helper.js
export const createTestDOM = (html) => {
  document.body.innerHTML = html;
  return document.body;
};

export const simulateContextMenu = async (element) => {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    button: 2
  });
  element.dispatchEvent(event);
  await new Promise(resolve => setTimeout(resolve, 0));
};
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/unit/xpath.test.js

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Coverage Goals

- Unit Tests: 95%
- Integration Tests: 85%
- E2E Tests: Key user workflows
- Overall Coverage: 90%

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - uses: actions/upload-artifact@v2
        with:
          name: coverage
          path: coverage/
```