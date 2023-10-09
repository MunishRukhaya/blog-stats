import axios from "axios";
import _ from "lodash";
import express, { Request, Response } from "express";
import { isAxiosError } from "axios";
const app = express();

const router = express.Router();

app.get('/api/blog-stats', async (req: Request, res: Response) => {
    try {
    type blog = {
        id: string;
        image_url: string;
        title: string;
    };

    type GetResponse = {
        blogs : blog[];
    };

    const { data } = await axios.get<GetResponse>(
        'https://intent-kit-16.hasura.app/api/rest/blogs',
        {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
                Accept:'application/json'
            },
        },
    )

    const blogs = data.blogs;
    const size = _.size(blogs);
    const containsPrivacy = _.filter(blogs, blog=> _.includes(blog.title.toLowerCase(), 'privacy'));
    const longestTitle = _.maxBy(blogs, blog=>blog.title.length);
    const noDuplicates = _.uniqBy(blogs, blog=>blog.title);

    res.status(200).send({
        size:size,
        longestTitle:longestTitle,
        privacyWord:containsPrivacy,
        noDuplicates:noDuplicates
    })
}
catch((error:any) => res.status(500).send({error:error});
})

app.get(`/api/blog-search`,async (req, res)=> {
try {
    type blog = {
        id: string;
        image_url: string;
        title: string;
    };

    type GetResponse = {
        blogs : blog[];
    };

    const { data } = await axios.get<GetResponse>(
        'https://intent-kit-16.hasura.app/api/rest/blogs',
        {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
                Accept:'application/json'
            },
        },
    )
    const blogs = data.blogs;
    const query = req.query.query;
    const searchedBlogs = _.filter(blogs, blog=> _.includes(blog.title.toLowerCase(), query));
    res.status(200).send({searchedBlogs});
} 
catch((error:any)=> {
        res.status(500).send({error:error});
}) 
});
app.listen(5000);