"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeIdFormat = void 0;
const changeIdFormat = (obj) => {
    obj.id = obj._id;
    delete obj._id;
    return obj;
};
exports.changeIdFormat = changeIdFormat;
//# sourceMappingURL=change-id-format.js.map