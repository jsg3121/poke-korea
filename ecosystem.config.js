module.exports = {
  apps: [
    {
      name: 'poke-korea',
      cwd: './',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      env_production: {
        PORT: 80,
      },
    },
    {
      name: 'poke-korea-blog',
      cwd: './changelog',
      script: 'npx',
      args: 'docusaurus serve --port 3001 --no-open',
      instances: 1,
      exec_mode: 'fork',
    },
  ],
}
