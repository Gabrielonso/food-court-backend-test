import { spawn } from 'child_process';

// Extract service name and arguments
const service = process.argv[2];
const knexArgs = process.argv.slice(3);

// Step 1: Check for `--env=xxx` or `--env xxx`
let env: string | undefined;

// Handle --env=xyz
const inlineEnvIndex = knexArgs.findIndex((arg) => arg.startsWith('--env='));
if (inlineEnvIndex !== -1) {
  env = knexArgs[inlineEnvIndex].split('=')[1];
  knexArgs.splice(inlineEnvIndex, 1);
}

// Handle --env xyz
const splitEnvIndex = knexArgs.findIndex((arg) => arg === '--env');
if (splitEnvIndex !== -1 && knexArgs[splitEnvIndex + 1]) {
  env = knexArgs[splitEnvIndex + 1];
  knexArgs.splice(splitEnvIndex, 2);
}

// Step 2: Fallback to NODE_ENV or 'development'
env = env || process.env.NODE_ENV || 'development';

// Validate service name
if (!service) {
  console.error('❌ Please provide a service name (e.g., orders or riders)');
  process.exit(1);
}

// Map service to its knexfile
const serviceMap: Record<string, string> = {
  orders: './apps/order-management/src/knexfile.ts',
  riders: './apps/rider-management/src/knexfile.ts',
};

const knexfile = serviceMap[service];
if (!knexfile) {
  console.error(
    `❌ Unknown service "${service}". Available: ${Object.keys(serviceMap).join(', ')}`,
  );
  process.exit(1);
}

// Run knex with resolved knexfile and env
const knexProcess = spawn(
  'ts-node',
  [
    '-r',
    'tsconfig-paths/register',
    './node_modules/knex/bin/cli.js',
    ...knexArgs,
    '--knexfile',
    knexfile,
    '--env',
    env,
  ],
  { stdio: 'inherit' },
);

knexProcess.on('close', (code) => process.exit(code ?? 1));
