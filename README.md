# Frontend-starter-light
Starting pack for project (static templates) with default  nodejs/bower packages and gulp tasks.

### Version
1.0.0

### Installation notes
'Frontend-starter-light' requires [node, npm](https://nodejs.org/), [bower](http://bower.io/) and [git](https://git-scm.com/) (follow links to read installation guides).

To start project install all npm and bower dependencies run in command line:

```
npm install
```
```
bower install
```

Run gulp starting task (to move less libs in dev folder):
```
gulp start-project
```

**And after that you are ready to work!**

You project structure will be:
```
|-- project
|   |-- .git
|   |-- bower_components // all bower components will be placed into this directory
|   |-- build // build directory
|   |-- dev_root // working directory
|   `-- node_modules // all node modules will be placed into this directory
|-- .bowerrc
|-- .gitignore
|-- bower.json
|-- gulpfile.js
|-- package.json
`-- README.md
```
(You can change project structure as you like, but in this case you should update gulpfile.js and all gulp tasks for new folder structure.)