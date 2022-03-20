module.exports = {
  apps : [{
    name   : "sharedlink",
    script : "./dist/bin/run.js",
    watch: true,
    instance_var: 'APP_ID',
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
