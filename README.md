# Zilliqa Developer Portal

[![Discord chat](https://img.shields.io/discord/370992535725932544.svg)](https://discord.gg/XMRE9tt)

This repository holds the source files for Zilliqa's developer portal website.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Local Deployment
To build the docker container
```
./build_container.sh
```

To run the container
```
./run_container.sh
```
You can then access the site via
```
http://localhost:8080
```

To stop and remove the container
```
./stop_container.sh
```

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

