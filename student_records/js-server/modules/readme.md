# How to use .js file modules

## How to create

In the module file:

1. create or use a class
2. export the class with the __last__ line:

```javascript

module.exports = MyClass;
```

For __express__, we use the router() class

### Example

[admin module](./admin.js)

## How to import in Express.js

1. Import the module file using a syntax like this one in __server.js__:

```javascript

const _myModuleVar_ = require('path_to_js_file');

```

2. Assign a route to the module (like '_/admin_')

3. Before the "/" route handled by the server,  use this command:

app.use(_route_, _myModuleVar_);

### example 

Line 25 of [server](../server.js)

## tricks

With __express__, we can trigger functions anytime we access the module. To do so, in the module we have to write a something like this:

``````javascript

var router = express.Router();

router.use('/:id', function (req, res, next) {
    // some code
    next();
}, function (req, res, next) {
    // some more code
    next();
    // ... you can add here how many functions you want
});

```
