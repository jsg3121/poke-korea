module.exports = {
  apps: [
    {
      name: 'poke-korea',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      env_production: {
        PORT: 80,
      },
    },
  ],
}
