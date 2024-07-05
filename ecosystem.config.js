module.exports = {
  apps: [
    {
      name: 'poke-korea',
      script: 'npm',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        PORT: 3000,
      },
    },
  ],
}
