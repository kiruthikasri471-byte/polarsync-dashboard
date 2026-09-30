const http = require("http");
const fs = require("fs");
const path = require("path");


const PORT = process.env.PORT || 3000;



/* =====================================================
   LOAD .ENV
===================================================== */

function loadEnv() {

    const envPath =
        path.join(
            __dirname,
            ".env"
        );


    if (!fs.existsSync(envPath)) {

        console.log(
            ".env file not found."
        );

        return;

    }


    const content =
        fs.readFileSync(
            envPath,
            "utf8"
        );


    content
        .split(/\r?\n/)
        .forEach(function (line) {


            line = line.trim();


            if (
                !line ||
                line.startsWith("#")
            ) {

                return;

            }


            const index =
                line.indexOf("=");


            if (index === -1) {

                return;

            }


            const key =
                line
                    .substring(
                        0,
                        index
                    )
                    .trim();


            const value =
                line
                    .substring(
                        index + 1
                    )
                    .trim()
                    .replace(
                        /^["']|["']$/g,
                        ""
                    );


            process.env[key] =
                value;


        });

}


loadEnv();



/* =====================================================
   MIME TYPES
===================================================== */

const mimeTypes = {

    ".html":
        "text/html; charset=utf-8",

    ".css":
        "text/css; charset=utf-8",

    ".js":
        "application/javascript; charset=utf-8",

    ".json":
        "application/json; charset=utf-8",

    ".png":
        "image/png",

    ".jpg":
        "image/jpeg",

    ".jpeg":
        "image/jpeg",

    ".webp":
        "image/webp",

    ".gif":
        "image/gif",

    ".svg":
        "image/svg+xml",

    ".mp4":
        "video/mp4",

    ".webm":
        "video/webm",

    ".ico":
        "image/x-icon"

};



/* =====================================================
   NEWS API
===================================================== */

async function getNews() {


    const apiKey =
        process.env.NEWS_API_KEY;



    if (!apiKey) {


        return {

            status: 500,

            data: {

                message:
                    "NEWS_API_KEY is missing in .env",

                articles: []

            }

        };

    }



    const query =
        encodeURIComponent(
            "Antarctica OR Antarctic research"
        );



    const url =
        "https://newsapi.org/v2/everything" +

        "?q=" + query +

        "&language=en" +

        "&sortBy=publishedAt" +

        "&pageSize=10" +

        "&apiKey=" + apiKey;



    try {


        const response =
            await fetch(url);


        const data =
            await response.json();



        return {

            status:
                response.ok
                    ? 200
                    : response.status,

            data: data

        };


    }
    catch (error) {


        console.error(
            "NEWS API ERROR:",
            error
        );


        return {

            status: 500,

            data: {

                message:
                    "Unable to connect to News API",

                articles: []

            }

        };

    }

}



/* =====================================================
   STATIC FILE SERVER
===================================================== */

function serveFile(
    request,
    response
) {


    let requestPath =
        decodeURIComponent(
            request.url.split("?")[0]
        );



    if (
        requestPath === "/" ||
        requestPath === ""
    ) {

        requestPath =
            "/index.html";

    }



    const filePath =
        path.join(
            __dirname,
            requestPath
        );


    const rootPath =
        path.resolve(
            __dirname
        );


    const resolvedFilePath =
        path.resolve(
            filePath
        );



    /* SECURITY */

    if (
        !resolvedFilePath.startsWith(
            rootPath + path.sep
        ) &&
        resolvedFilePath !== rootPath
    ) {


        response.writeHead(403);

        response.end(
            "Forbidden"
        );

        return;

    }



    fs.stat(
        resolvedFilePath,
        function (
            error,
            stats
        ) {


            if (
                error ||
                !stats.isFile()
            ) {


                response.writeHead(
                    404,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );


                response.end(
                    "File not found: " +
                    requestPath
                );


                return;

            }



            const extension =
                path.extname(
                    resolvedFilePath
                ).toLowerCase();



            const contentType =
                mimeTypes[extension] ||
                "application/octet-stream";



            response.writeHead(

                200,

                {

                    "Content-Type":
                        contentType,

                    "Cache-Control":
                        "no-cache"

                }

            );



            const stream =
                fs.createReadStream(
                    resolvedFilePath
                );


            stream.pipe(
                response
            );


        }
    );

}



/* =====================================================
   SERVER
===================================================== */

const server =
    http.createServer(
        async function (
            request,
            response
        ) {


            console.log(
                request.method,
                request.url
            );



            /* =================================================
               NEWS API
            ================================================= */

            if (
                request.url ===
                "/api/news"
            ) {


                const result =
                    await getNews();



                response.writeHead(

                    result.status,

                    {

                        "Content-Type":
                            "application/json; charset=utf-8",

                        "Access-Control-Allow-Origin":
                            "*"

                    }

                );



                response.end(
                    JSON.stringify(
                        result.data
                    )
                );


                return;

            }



            /* =================================================
               STATIC FILES
            ================================================= */

            serveFile(
                request,
                response
            );


        }
    );



/* =====================================================
   START SERVER
===================================================== */

server.listen(

    PORT,
    
    function () {


        console.log("");

        console.log(
            "================================"
        );

        console.log(
            " POLARSYNC SERVER RUNNING"
        );

        console.log(
            " http://localhost:" + PORT
        );

        console.log(
            "================================"
        );

        console.log("");

    }

);