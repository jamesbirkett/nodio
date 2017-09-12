Nodio
======

A node.js client for accessing the Podio API using the App authentication flow (https://developers.podio.com/authentication/app_auth).

Usage
-----

``` js

// Your podio app and client credentials (obtained in the app's dev section and in https://developers.podio.com/api-key, respectively)
var credentials = {
    app_id: 'YOUR_APP_ID',
    app_token: 'YOUR_APP_TOKEN',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_TOKEN'
};

var Nodio = require('nodio');
var nodio = new Nodio(credentials);

// The item you want to push to Podio (fields defined in the respective app)
var item = {
    arbitrary_field_name: 'some text',
    magic_number: 142857,
    something_else: 'I love Celeste'
};

nodio.items.create(item, function(err, item_info){
    if(err){
        // Error
        console.log(err);
    }
    else{
        // Item added successfully, here's the item's relevant information
        var item_id = item_info.item_id;
        var title = item_info.title;

        console.log(item_id+" - "+title);
    }
});

// Podio item id, obtained from an app item's dev section
var item_id = APP_ITEM_ID;

nodio.items.get(item_id, function (err, item_info) {
    if(err){
        // Error
        console.log(err);
    }
    else{
        // Item retrieved successfully
        var item_id = item_info.item_id;
        var title = item_info.title;

        console.log(item_id+" - "+title);
    }
});
```

*n.b. the old methods will still work in this version, but will throw a warning and will be deprecated next version:*

```
nodio.addNewItem(item, function(err, item_info) {});
nodio.getItem(item_id, function (err, item_info) {});
```


```

Install
-----

```
npm install nodio
```

Methods
-------

###### Add New Item
``` js
nodio.addNewItem(credentials, item, callback);
```
Callback receives two arguments: `(err, item_info)`. [Podio Docs](https://developers.podio.com/doc/items/add-new-item-22362).

###### Get Item
```js
nodio.getItem (item_id, callback);
```
Callback receives two arguments: `(err, item)`. [Podio Docs](https://developers.podio.com/doc/items/get-item-22360).

###### Filter Items
```js
nodio.filterItems (filters, callback);
```
Callback receives two arguments: `(err, results)`, `results` is an object with a property "items", which is an array of the matching items. [Podio Docs](https://developers.podio.com/doc/items/filter-items-4496747).

###### Get Comments On Item
```js
nodio.getCommentsOnItem (item_id, callback);
```
Callback receives two arguments: `(err, comments)`, `comments` is an array of comment objects. [Podio Docs](https://developers.podio.com/doc/comments/get-comments-on-object-22371).


###### Add Comment To Item
```js
nodio.addCommentToItem (item_id, comment_text, callback);
```
Callback receives two arguments: `(err, comment_info)`, `comment_info` includes comment ID. [Podio Docs](https://developers.podio.com/doc/comments/add-comment-to-object-22340).


To do
-----

Lots of stuff, this is only one API operation, please help me! Fork me!

Credits
-------

Written by Andrés Gottlieb (agottlieb@gmail.com).

Copyright
---------

(c) 2012 Andrés Gottlieb. Licensed under the MIT license.