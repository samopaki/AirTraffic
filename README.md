# AirTraffic
 All the airplanes that are flying over current location of user

>Warning: Make sure you're using the latest version of Node.js and NPM

### Quick start

```bash
# clone repo
$ git clone https://github.com/samopaki/AirTraffic.git

# change directory AirTraffic
$ cd AirTraffic

# install the dependencies with npm
$ npm install

# start the server
$ npm run start
```

go to [http://localhost:8080](http://localhost:8080) in your browser.

# Table of Contents

* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
    * [Developing](#developing)

# Getting Started

## Dependencies

What you need to run this app:
* `node` and `npm` (Use [NVM](https://github.com/creationix/nvm))
* Ensure you're running Node (`v4.1.x`+) and NPM (`2.14.x`+)

## Installing

* `fork` this repo
* `clone` your fork
* `npm install` to install all dependencies

## Running the app

After you have installed all dependencies you can now run the app with:
```bash
npm run start
```

**Note:** Please be aware that geolocation requires website to be acceessed over HTTPS

It will start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://localhost:8080`.

## Developing

### Build files

* single run: `npm run build`
* build files and watch: `npm run start`


