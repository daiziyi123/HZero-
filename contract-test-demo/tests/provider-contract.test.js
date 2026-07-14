import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUserById } from '../provider/userProvider.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractPath = path.resolve(__dirname, '../contracts/user.contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

function assertType(value, expectedType, fieldPath) {
  const actualType = Array.isArray(value) ? 'array' : typeof value;

  if (actualType !== expectedType) {
    throw new Error(`${fieldPath} 类型错误：期望 ${expectedType}，实际 ${actualType}`);
  }
}

function assertShape(actual, expectedShape, fieldPath = 'body') {
  for (const [key, expectedValue] of Object.entries(expectedShape)) {
    const currentPath = `${fieldPath}.${key}`;

    if (!(key in actual)) {
      throw new Error(`${currentPath} 缺失`);
    }

    if (typeof expectedValue === 'string') {
      assertType(actual[key], expectedValue, currentPath);
    } else {
      assertShape(actual[key], expectedValue, currentPath);
    }
  }
}

async function runProviderContractTest() {
  const response = await getUserById(1);

  assertShape(response, contract.response.body);

  console.log('契约测试通过：后端返回结构满足前端契约');
}

runProviderContractTest().catch(error => {
  console.error('契约测试失败：');
  console.error(error.message);
  process.exit(1);
});
