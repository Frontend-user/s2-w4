"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.tokensCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.MONGO_URL;
if (!url) {
    throw new Error('! Url doesn\'t found');
}
console.log('url', url);
exports.client = new mongodb_1.MongoClient(url);
exports.blogsCollection = exports.client.db('db').collection('blogs');
exports.postsCollection = exports.client.db('db').collection('posts');
exports.usersCollection = exports.client.db('db').collection('users');
exports.commentsCollection = exports.client.db('db').collection('comments');
exports.tokensCollection = exports.client.db('db').collection('tokens');
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield exports.client.db('blogs').command({ ping: 1 });
        console.log('Connect successfully to mongo server');
    }
    catch (e) {
        console.log('DONT connect successfully to mongo server');
        yield exports.client.close();
    }
});
exports.runDb = runDb;
//# sourceMappingURL=db.js.map