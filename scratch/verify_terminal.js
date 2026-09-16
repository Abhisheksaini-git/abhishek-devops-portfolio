// Automated Test Suite for DevOps Terminal Simulator
import { DevOpsTerminal } from '../src/terminal/devopsTerminal.js';

// Minimal mock DOM environment for headless Node.js testing
class MockElement {
  constructor(tag = 'div', id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = '';
    this.innerHTML = '';
    this.value = '';
    this.style = {};
    this.children = [];
    this.eventListeners = {};
    this.dataset = {};
    this.scrollTop = 0;
    this.scrollHeight = 100;
  }

  addEventListener(event, callback) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(callback);
  }

  dispatchEvent(eventObj) {
    const listeners = this.eventListeners[eventObj.type] || [];
    for (const listener of listeners) {
      listener(eventObj);
    }
  }

  appendChild(child) {
    this.children.push(child);
  }

  querySelector(selector) {
    if (selector.startsWith('#')) {
      const targetId = selector.substring(1);
      return this.findChildById(targetId);
    }
    return null;
  }

  findChildById(targetId) {
    if (this.id === targetId) return this;
    for (const child of this.children) {
      if (child.id === targetId) return child;
      const found = child.findChildById ? child.findChildById(targetId) : null;
      if (found) return found;
    }
    return null;
  }

  closest(tagOrClass) {
    if (tagOrClass.toLowerCase() === this.tagName.toLowerCase()) return this;
    if (tagOrClass.startsWith('.') && this.className.includes(tagOrClass.substring(1))) return this;
    return null;
  }

  focus() {
    this.isFocused = true;
  }

  setSelectionRange(start, end) {
    this.selectionStart = start;
    this.selectionEnd = end;
  }
}

// Set up global browser mocks
global.document = {
  getElementById: (id) => mockRegistry[id] || null,
  createElement: (tag) => new MockElement(tag)
};

global.window = {};

const mockRegistry = {};

function setupDOM() {
  const container = new MockElement('div', 'devops-interactive-terminal');
  const outputBody = new MockElement('div', 'terminal-stream-content');
  const inputField = new MockElement('input', 'terminal-cli-input');
  const runBtn = new MockElement('button', 'terminal-cli-run-btn');
  const clearBtn = new MockElement('button', 'terminal-clear-btn');
  const suggestionsContainer = new MockElement('div', 'terminal-suggestions');

  container.appendChild(outputBody);
  container.appendChild(inputField);
  container.appendChild(runBtn);
  container.appendChild(clearBtn);

  mockRegistry['devops-interactive-terminal'] = container;
  mockRegistry['terminal-stream-content'] = outputBody;
  mockRegistry['terminal-cli-input'] = inputField;
  mockRegistry['terminal-cli-run-btn'] = runBtn;
  mockRegistry['terminal-clear-btn'] = clearBtn;
  mockRegistry['terminal-suggestions'] = suggestionsContainer;

  return { container, outputBody, inputField, runBtn, clearBtn, suggestionsContainer };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('Starting Interactive DevOps Terminal Test Suite');
  console.log('====================================================\n');

  const { container, outputBody, inputField, runBtn, clearBtn, suggestionsContainer } = setupDOM();
  const terminal = new DevOpsTerminal('devops-interactive-terminal');

  // TEST 1: Initial banner
  console.log('TEST 1: Initial terminal banner');
  assert(outputBody.innerHTML.includes('DevOps Intelligence Engine ONLINE'), 'Initial banner loaded');

  // TEST 2: Type "hii" and click Execute
  console.log('\nTEST 2: Type "hii" and click Execute button');
  inputField.value = 'hii';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Hello! 👋')), 'Greeting response rendered for "hii"');
  assert(inputField.value === '', 'Input cleared after Execute');
  assert(inputField.isFocused === true, 'Input received focus');

  // TEST 3: Press Enter with "what is kubernetes"
  console.log('\nTEST 3: Press Enter with "what is kubernetes"');
  inputField.value = 'what is kubernetes';
  inputField.dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('container orchestration platform')), 'Kubernetes explanation returned');

  // TEST 4: "docker ps" command explanation & simulation
  console.log('\nTEST 4: "docker ps" command');
  inputField.value = 'docker ps';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('running Docker containers')), 'Docker ps explanation returned');

  // TEST 5: "kubectl get pods" simulated pod output
  console.log('\nTEST 5: "kubectl get pods" command');
  inputField.value = 'kubectl get pods';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('portfolio-api')), 'Kubernetes pod simulation output returned');

  // TEST 6: "skills" portfolio command
  console.log('\nTEST 6: "skills" portfolio command');
  inputField.value = 'skills';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('AWS:') && c.innerHTML.includes('Kubernetes:')), 'Abhishek skills returned');

  // TEST 7: "projects" portfolio command
  console.log('\nTEST 7: "projects" portfolio command');
  inputField.value = 'projects';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Enterprise End-to-End CI/CD Pipeline')), 'Abhishek projects returned');

  // TEST 8: "status" command
  console.log('\nTEST 8: "status" command');
  inputField.value = 'status';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('SYSTEM STATUS') && c.innerHTML.includes('Nodes: 3')), 'Cluster status simulation returned');

  // TEST 9: "docker vs kubernetes" comparison
  console.log('\nTEST 9: "docker vs kubernetes" comparison');
  inputField.value = 'docker vs kubernetes';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Docker builds and runs the containers; Kubernetes orchestrates')), 'Comparison returned');

  // TEST 10: Hinglish queries "kubernetes kya hai"
  console.log('\nTEST 10: Hinglish query "kubernetes kya hai"');
  inputField.value = 'kubernetes kya hai';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Kubernetes (K8s):')), 'Hinglish kubernetes query matched');

  // TEST 11: Hinglish queries "docker kya hai"
  console.log('\nTEST 11: Hinglish query "docker kya hai"');
  inputField.value = 'docker kya hai';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Docker:')), 'Hinglish docker query matched');

  // TEST 12: Unrelated query fallback (e.g. "what is cricket?")
  console.log('\nTEST 12: Unrelated query "what is cricket?"');
  inputField.value = 'what is cricket?';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('[DEVOPS TERMINAL]')), 'Unrelated fallback returned');

  // TEST 13: Empty input handling
  console.log('\nTEST 13: Empty input handling');
  inputField.value = '   ';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.children.some(c => c.innerHTML && c.innerHTML.includes('Type a command or question')), 'Empty prompt reminder shown');

  // TEST 14: History Arrow Up / Down
  console.log('\nTEST 14: History Arrow Up / Down navigation');
  inputField.dispatchEvent({ type: 'keydown', key: 'ArrowUp', preventDefault: () => {} });
  assert(inputField.value !== '', `ArrowUp retrieved previous command: "${inputField.value}"`);
  inputField.dispatchEvent({ type: 'keydown', key: 'ArrowDown', preventDefault: () => {} });
  assert(inputField.value === '', 'ArrowDown returned to blank input');

  // TEST 15: "clear" command
  console.log('\nTEST 15: "clear" command');
  inputField.value = 'clear';
  runBtn.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  assert(outputBody.innerHTML.includes('abhishek@cloud-orchestrator:~$'), 'Clear reset output to clean prompt');

  console.log('\n====================================================');
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
