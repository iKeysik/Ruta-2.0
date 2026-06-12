module.exports = {
  apps: [
    {
      name: 'ruta-2',
      script: 'node_modules/.bin/next',
      args: 'start --port 3416 --hostname 127.0.0.1',
      cwd: '/home/keysik/travel-quest',
      env: {
        NODE_ENV: 'production',
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
}
