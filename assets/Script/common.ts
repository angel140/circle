export function getRandom(min, max) {
    return min + Math.round(cc.rand() % (max - min));
}
export function clone(obj) {
    var self = this;
    var o: any = {};
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(self.clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = self.clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}