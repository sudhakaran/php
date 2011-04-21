YUI({ filter: 'raw' }).use("anim", function(Y) {
    var node = Y.one('#demo .yui3-bd');
    var anim = new Y.Anim({
        node: node,
        to: {
            scroll: function(node) {
                return [0, node.get('scrollTop') + node.get('offsetHeight')]
            }
        },
        easing: Y.Easing.easeOut
    });

    var onClick = function(e) {
        var y = node.get('offsetHeight');
        if (e.currentTarget.hasClass('yui3-scrollup')) {
            y = 0 - y;
        }

        anim.set('to', { scroll: [0, y + node.get('scrollTop')] });
        anim.run();
    };

    Y.all('#demo .yui3-hd a').on('click', onClick);
});
