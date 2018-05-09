/// <reference path="Events.js" />

(function (lib) {

    var Collection = (function () {

        function Collection() {

            var _self = this;
            var _items = [];
            var _events = new lib.Extra.Events(this);


            function insert(index, item) {
                if (index < 0)
                    index = 0;
                if (index >= _items.length)
                    index = _items.length;
                if (index === _items.length) {
                    _items.push(item);
                }
                else {
                    _items.splice(index, 0, [item]);
                }
                index = _items.length - 1;
                _events.raise("onItemsAdded", { index: index, items: [item] });
                return index;
            }

            function insertRange(index, items) {
                var i;
                if (index < 0)
                    index = 0;
                if (index >= _items.length)
                    index = _items.length;
                if (index === _items.length) {
                    for (i = 0; i < items.length; i++) {
                        _items.push(items[i]);
                    }
                }
                else {
                    _items.splice(index, 0, [items]);
                }
                if (_items.length > index) {
                    _events.raise("onItemsAdded", { index: index, items: items });
                }
                return index;
            }


            Object.defineProperty(this, "length", {
                get: function () { return _items.length; }
            });


            Object.defineProperty(this, "forEach", {
                value: function (callback) {
                    for (var i = 0; i < _items.length; i++) {
                        callback(_items[i], i, _self);
                    }
                }
            });

            Object.defineProperty(this, "add", {
                value: function (item) {
                    return insert(_items.length, item);
                }
            });

            Object.defineProperty(this, "addRange", {
                value: function (items) {
                    return insertRange(_items.length, items);
                }
            });

            Object.defineProperty(this, "at", {
                value: function (index) {
                    return _items[index];
                }
            });

            Object.defineProperty(this, "clear", {
                value: function () {
                    _items = [];
                    _events.raise("onCollectionCleared", {});
                }
            });

            Object.defineProperty(this, "contains", {
                value: function (item, selector) {
                    if (typeof selector === "function") {
                        for (var i = 0; i < _items.length; i++) {
                            if (selector(_items[i]) === item) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return _items.indexOf(item) >= 0;
                    }
                }
            });

            Object.defineProperty(this, "indexOf", {
                value: function (item, selector) {
                    if (typeof selector === "function") {
                        var result = -1;
                        for (var i = 0; i < _items.length; i++) {
                            if (selector(_items[i]) === item) {
                                result = i;
                                break;
                            }
                        }
                        return result;
                    }
                    else {
                        return _items.indexOf(item);
                    }
                }
            });

            Object.defineProperty(this, "insert", {
                value: insert
            });

            Object.defineProperty(this, "insertRange", {
                value: insertRange
            });

            Object.defineProperty(this, "remove", {
                value: function (item, selector) {
                    var itemIndex = _self.indexOf(item, selector);
                    if (itemIndex === -1)
                        return false;
                    _items.splice(itemIndex, 1);
                    _events.raise("onItemsRemoved", { index: itemIndex, items: [item] });
                    return true;
                }
            });

            Object.defineProperty(this, "removeAt", {
                value: function (index) {
                    if (index < 0 || index >= _items.length)
                        return null;
                    var item = _items[index];
                    _items.splice(index, 1);
                    _events.raise("onItemsRemoved", { index: index, items: [item] });
                    return item;
                }
            });

            Object.defineProperty(this, "removeItems", {
                value: function (items) {
                    var itemIndex = -1;
                    var removedItems = [];
                    for (var i = 0; i < items.length; i++) {
                        itemIndex = _self.indexOf(items[i]);
                        if (itemIndex === -1)
                            continue;
                        var removed = _items.splice(itemIndex, 1);
                        removedItems.push(removed);
                    }
                    _events.raise("onItemsRemoved", { index: itemIndex, items: removedItems });
                    return removedItems;
                }
            });

            Object.defineProperty(this, "removeRange", {
                value: function (index, length) {
                    if (typeof index !== "number" || index < 0)
                        index = 0;
                    if (!length) {
                        length = _items.length - index;
                    }
                    var removedItems = _items.splice(index, length);
                    _events.raise("onItemsRemoved", { index: index, items: removedItems });
                    return removedItems;
                }
            });

            Object.defineProperty(this, "removeAll", {
                value: function () {
                    var removedItems = _items.splice(0, _items.length);
                    _events.raise("onCollectionCleared", {});
                    return removedItems;
                }
            });

            Object.defineProperty(this, "toArray", {
                value: function () {
                    return _items.slice(0);
                }
            });

            Object.defineProperty(this, "onItemsAdded", {
                value: new lib.Extra.EventGroup(_events, "onItemsAdded")
            });

            Object.defineProperty(this, "onItemsRemoved", {
                value: new lib.Extra.EventGroup(_events, "onItemsRemoved")
            });

            Object.defineProperty(this, "onCollectionCleared", {
                value: new lib.Extra.EventGroup(_events, "onCollectionCleared")
            });
        }

        return Collection;
    })();
    lib.Extra.Collection = Collection;

})(library);
