## Contributing
First off, thank you for considering contributing to OpenClimbMap!

### 1. Bugs, Feature requests, General questions
[Issues](https://github.com/OpenBeta/ocm/issues) is a good place to start. Do a quick search to see whether your concerns have been discussed.  If not, create a [new issue](https://github.com/OpenBeta/ocm/issues/new).

### 2. Help Improve Documentation, Design and User Experience for the app
Look for issues with [help wanted](https://github.com/OpenBeta/ocm/labels/help%20wanted) label.  If you're still not sure what you can do to help email me @ viet@openbeta.io

## Build Instructions (Prior Javascript/React experience may require)
This section is for those who wish to set up a development environment on your own computer.  If you simply want to see how the app works visit https://openbeta.io/demo

Install [Node.js](https://nodejs.org/) if you haven't done so already

Set `REACT_APP_ENV` environment variable to `prod` in order to connect to our live API server (recommended) or `dev` if you run your own API server on localhost
```
# export REACT_APP_ENV=prod
```

Install dependencies
```
# git clone <your fork repo url>
# cd ocm
# npm install
```

Start the app
```
# npm start
```
See [REACT_APP_README.md](REACT_APP_README.md) for more information about the build tool.
