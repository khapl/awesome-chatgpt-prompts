/**
 * Simple test file for awesome-chatgpt-prompts
 * Tests basic functionality and CSV file structure
 */

const fs = require('fs');
const assert = require('assert');

// Test counter
let testsRun = 0;
let testsPassed = 0;

function test(description, testFn) {
  testsRun++;
  try {
    testFn();
    testsPassed++;
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  Error: ${error.message}`);
  }
}

// Test 1: Check if prompts.csv exists
test('prompts.csv file exists', () => {
  assert(fs.existsSync('./prompts.csv'), 'prompts.csv should exist');
});

// Test 2: Check if prompts.csv is not empty
test('prompts.csv is not empty', () => {
  const content = fs.readFileSync('./prompts.csv', 'utf8');
  assert(content.length > 0, 'prompts.csv should not be empty');
});

// Test 3: Check if prompts.csv has header row
test('prompts.csv has header row', () => {
  const content = fs.readFileSync('./prompts.csv', 'utf8');
  const lines = content.split('\n');
  assert(lines.length > 0, 'prompts.csv should have at least one line');
  assert(lines[0].includes('act') || lines[0].includes('prompt'), 'First line should be a header');
});

// Test 4: Check if README.md exists
test('README.md exists', () => {
  assert(fs.existsSync('./README.md'), 'README.md should exist');
});

// Test 5: Check if script.js exists
test('script.js exists', () => {
  assert(fs.existsSync('./script.js'), 'script.js should exist');
});

// Summary
console.log('\n-------------------');
console.log(`Tests run: ${testsRun}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsRun - testsPassed}`);

if (testsPassed === testsRun) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed');
  process.exit(1);
}
