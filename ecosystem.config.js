module.exports = {
  apps: [
    {
      name: 'poke-korea',
      cwd: './',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        PORT: 80,
      },
    },
  ],
}
