module.exports = {
  apps: [
    {
      name: 'poke-korea',
      script: 'npm',
      args: 'start --port 80',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        PORT: 80,
      },
    },
  ],
}
