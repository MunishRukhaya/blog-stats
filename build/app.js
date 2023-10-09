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
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.get('/api/blog-stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
                Accept: 'application/json'
            },
        });
        const blogs = data.blogs;
        const size = lodash_1.default.size(blogs);
        const containsPrivacy = lodash_1.default.filter(blogs, blog => lodash_1.default.includes(blog.title.toLowerCase(), 'privacy'));
        const longestTitle = lodash_1.default.maxBy(blogs, blog => blog.title.length);
        const noDuplicates = lodash_1.default.uniqBy(blogs, blog => blog.title);
        res.status(200).send({
            size: size,
            longestTitle: longestTitle,
            privacyWord: containsPrivacy,
            noDuplicates: noDuplicates
        });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            res.status(500).send({ message: error.message });
        }
        else {
            res.status(500).send({ message: error });
        }
    }
}));
app.get(`/api/blog-search`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
                Accept: 'application/json'
            },
        });
        const blogs = data.blogs;
        const query = req.query.query;
        const searchedBlogs = lodash_1.default.filter(blogs, blog => lodash_1.default.includes(blog.title.toLowerCase(), query));
        res.status(200).send({ searchedBlogs });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            res.status(500).send({ message: error.message });
        }
        else {
            res.status(500).send({ message: error });
        }
    }
}));
app.listen(5000);
