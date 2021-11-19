const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const Instagram = require("instagram-web-api");
const axios = require("axios");

require("dotenv").config();

const client = new Instagram({username, password})

const instagramLoginFunction = () => {
    const client = new Instagram({
        username: process.env.INSTAGRAM_USERNAME,
        password: process.env.INSTAGRAM_PASSWORD
    });

    const instagramPostPicturesFunction = async () => {
        await client
            .getPhotosByUsername({username: process.env.INSTAGRAM_USERNAME})
            .then((res) => res.user.edge_owner_to_timeline_media.edges.map((edge) => edge.node.edge_media_to_caption.edges[0].node.text[0]).then(mostRecent) => Number(mostRecent.split(" - "))[0])).then(latestNumber) => {
                const latestNumber =
            })

            const vidPost = `
            query {
                vidPostCollection(where: {number:${updatedNumber}}) {
                    items {
                        number
                        generation
                        name
                        parents
                        image {
                            url
                        }
                    }
                }
            }
            `;
            axios ({
                url: `http://graphql.contentful.com/content/v1/space/${process.env.CONTENTFUL_SPACE_ID}`,
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
                },
                data: {
                    query: vidPost
                }
            }).then((res) => res.data)
                .then(({data,errors}) => {
                    if (errors) {
                        console.log(errors);
                    }

                    const updateVidPost = data.inkyDoodleCollection.items[0];

                    if (updateInkyDoodle) {
                        const updatedCaption =
                    }
                })
    }



    instagramPostPicturesFunction();
}

instagramLoginFunction();

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

