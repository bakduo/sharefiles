module.exports = {
  apps : [{
    name   : "sharedlink",
    script : "./dist/bin/run.js",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
