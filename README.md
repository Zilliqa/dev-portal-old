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

### Local Deployment via Docker container

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

This is done via github actions.

Docusaurus takes its `baseUrl` from the `BASE_URL` environment variable, which is taken from the `BASE_URL` secret for the `github-pages` environment.
You will need to explicitly whitelist `master` in the allowed branches protection rules for `github-pages`, or deployment will fail with `Invalid deployment branch and no branch protection rules set in the environment`.

If you don't specify a secret, we'll build for the root - suitable for a production deploying with a custom URL, but best to explicitly set a root as `/`, just in case.

The staging site is held in a separate repository; push to it with `-f` and deploy to "ordinary" pages.
If you do, we'll use that as the base URL - for the staging repo, set the `BASE_URL` secret to `/<reponame>/`.

You can then issue a PR to the production repo against your staging repo with (hopefully!) the security that it will deploy correctly.


### Utilities

#### Check all links return HTTP status 200

```
cd docs
find */*.md -exec npx markdown-link-check {} \;
```
