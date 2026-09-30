/* =====================================================
   POLARSYNC SCRIPT
===================================================== */


/* =====================================================
   HOME IMAGE SLIDESHOW
===================================================== */

const stationImages = [

    "./station1.jpg",
    "./station2.jpg",
    "./station3.jpg",
    "./station4.jpg",
    "./station5.jpg",
    "./station6.jpg",
    "./station7.jpg",
    "./station8.jpg",
    "./station9.jpg",
    "./station10.jpg"

];


const stationImage =
    document.getElementById("stationimage");


let currentImage = 0;



/* =====================================================
   PRELOAD IMAGES
===================================================== */

stationImages.forEach(function (src) {

    const image = new Image();

    image.src = src;

});



/* =====================================================
   CHANGE IMAGE
===================================================== */

function changeStationImage() {

    if (!stationImage) {

        console.error(
            "Station slideshow image element not found."
        );

        return;

    }


    stationImage.style.opacity = "0";


    setTimeout(function () {

        stationImage.src =
            stationImages[currentImage];


        stationImage.onload =
            function () {

                stationImage.style.opacity = "1";

            };


        stationImage.onerror =
            function () {

                console.error(
                    "Image not found:",
                    stationImages[currentImage]
                );

                stationImage.style.opacity = "1";

            };

    }, 300);

}



/* =====================================================
   CHANGE EVERY 2 SECONDS
===================================================== */

setInterval(function () {

    currentImage++;

    if (
        currentImage >=
        stationImages.length
    ) {

        currentImage = 0;

    }


    changeStationImage();

}, 2000);



/* =====================================================
   PAGE SYSTEM
===================================================== */

const pageIds = [

    "digital-twin",
    "research-stations",
    "scientific-research",
    "indian-vessels",
    "about-us"

];



function hideAllPages() {

    pageIds.forEach(function (id) {

        const page =
            document.getElementById(id);


        if (page) {

            page.classList.remove(
                "active-page"
            );

        }

    });

}



function showPage(
    pageId,
    childId = null
) {

    hideAllPages();


    const page =
        document.getElementById(pageId);


    if (!page) {

        console.error(
            "Page not found:",
            pageId
        );

        return;

    }


    page.classList.add(
        "active-page"
    );


    setTimeout(function () {


        if (childId) {

            const child =
                document.getElementById(childId);


            if (child) {

                child.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

                return;

            }

        }


        page.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });


    }, 100);

}



/* =====================================================
   MAIN MENU LINKS
===================================================== */

document
    .querySelectorAll(".menu-link")
    .forEach(function (link) {


        link.addEventListener(
            "click",
            function (event) {


                const target =
                    this.getAttribute("href");


                if (!target) {

                    return;

                }



                /* HOME */

                if (
                    target === "#home"
                ) {

                    event.preventDefault();


                    hideAllPages();


                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });


                    return;

                }



                /* OTHER PAGES */

                const pageId =
                    target.substring(1);


                if (
                    pageIds.includes(pageId)
                ) {

                    event.preventDefault();


                    showPage(pageId);

                }


            }
        );

    });



/* =====================================================
   DROPDOWN LINKS
===================================================== */

document
    .querySelectorAll(
        ".dropdown a"
    )
    .forEach(function (link) {


        link.addEventListener(
            "click",
            function (event) {


                const target =
                    this.getAttribute("href");


                if (
                    !target ||
                    target === "#"
                ) {

                    return;

                }



                const element =
                    document.querySelector(
                        target
                    );


                if (!element) {

                    console.error(
                        "Target not found:",
                        target
                    );

                    return;

                }


                event.preventDefault();



                /* HOME SECTIONS */

                if (

                    target === "#latest-news" ||

                    target === "#about-antarctica" ||

                    target === "#keep-in-touch"

                ) {


                    hideAllPages();


                    setTimeout(function () {

                        element.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }, 100);


                    return;

                }



                /* OTHER PAGES */

                const parentPage =
                    element.closest(
                        ".hidden-page"
                    );


                if (parentPage) {


                    showPage(

                        parentPage.id,

                        element.id

                    );


                    return;

                }



                /* NORMAL ELEMENT */

                element.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


            }
        );

    });



/* =====================================================
   NEWS ELEMENTS
===================================================== */

const newsContainer =
    document.getElementById(
        "newscontainer"
    );


const newsUpdated =
    document.getElementById(
        "newsupdated"
    );



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value || "";


    return div.innerHTML;

}



/* =====================================================
   DISPLAY NEWS
===================================================== */

function displayNews(
    articles
) {


    if (!newsContainer) {

        return;

    }


    newsContainer.innerHTML = "";



    if (
        !Array.isArray(articles) ||
        articles.length === 0
    ) {


        newsContainer.innerHTML = `

            <div class="news-loading">

                No latest Antarctic news available.

            </div>

        `;


        return;

    }



    articles
        .slice(0, 6)
        .forEach(function (article) {


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "news-card";



            const image =
                article.urlToImage ||
                "./station5.jpg";



            const title =
                article.title ||
                "Antarctic Research News";



            const description =
                article.description ||
                "Latest Antarctic research update.";



            const date =
                article.publishedAt

                    ? new Date(
                        article.publishedAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )

                    : "";



            const source =
                article.source &&
                article.source.name

                    ? article.source.name

                    : "Antarctic News";



            card.innerHTML = `

                <img
                    class="news-image"
                    src="${escapeHTML(image)}"
                    alt="Antarctic News"
                    onerror="this.src='./station5.jpg'"
                >


                <div class="news-content">


                    <div class="news-date">

                        ${escapeHTML(date)}

                    </div>


                    <div class="news-source">

                        ${escapeHTML(source)}

                    </div>


                    <h3>

                        ${escapeHTML(title)}

                    </h3>


                    <p>

                        ${escapeHTML(description)}

                    </p>


                    <a
                        class="news-link"
                        href="${escapeHTML(
                            article.url || "#"
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        Read Full Research →

                    </a>


                </div>

            `;


            newsContainer.appendChild(
                card
            );


        });

}



/* =====================================================
   LOAD NEWS
===================================================== */

async function loadNews() {


    if (!newsContainer) {

        return;

    }



    try {


        if (newsUpdated) {

            newsUpdated.textContent =
                "Loading latest Antarctic news...";

        }



        const response =
            await fetch(
                "/api/news"
            );



        if (!response.ok) {

            throw new Error(
                "News API request failed"
            );

        }



        const data =
            await response.json();



        displayNews(
            data.articles || []
        );



        if (newsUpdated) {

            newsUpdated.textContent =
                "Latest Antarctic research updates";

        }


    }
    catch (error) {


        console.error(
            "POLARSYNC NEWS ERROR:",
            error
        );



        newsContainer.innerHTML = `

            <div class="news-loading">

                Latest news could not be loaded.

                <br><br>

                Please check your server
                and NEWS_API_KEY.

            </div>

        `;



        if (newsUpdated) {

            newsUpdated.textContent =
                "News service unavailable";

        }


    }

}



loadNews();



/* =====================================================
   REFRESH NEWS EVERY 15 MINUTES
===================================================== */

setInterval(

    loadNews,

    15 * 60 * 1000

);