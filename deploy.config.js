module.exports = {
  apps: [
    {
      name: 'JCWDSBY-0112-01', // Format JCWD-{batchcode}-{groupnumber}
      script: './apps/api/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 1121,
      },
      time: true,
      watch: true,
      ignore_watch: ['node_modules'],
    },
  ],
};
