const workerTools = require('../../src/common/utilities/workerTools');
const { QUEUE_META_EXTRACT } = require('../../src/common/constants/redis');

(async function (){
    const worker = workerTools.getWorker( QUEUE_META_EXTRACT );
    await workerTools.sendData( worker, {
        hostname: 'ian.wij.ma',
        pathname: '',
        search: '',
        html: '<html lang="en"><head><meta name="viewport" content="width=device-width"><meta charset="utf-8"><title>Ian Wijma</title><meta name="description" content="My online space"><meta name="next-head-count" content="4"><link rel="preload" href="/_next/static/css/26a20b2c68f3b6417c52.css" as="style"><link rel="stylesheet" href="/_next/static/css/26a20b2c68f3b6417c52.css" data-n-g=""><noscript data-n-css="true"></noscript><link rel="preload" href="/_next/static/chunks/main-7df81f3560aad46109d8.js" as="script"><link rel="preload" href="/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js" as="script"><link rel="preload" href="/_next/static/chunks/framework.4df82c4704a0136f6a4b.js" as="script"><link rel="preload" href="/_next/static/chunks/aa2b9c68.ff5578978733a40a67a3.js" as="script"><link rel="preload" href="/_next/static/chunks/commons.1ef53c9f95d3762ed004.js" as="script"><link rel="preload" href="/_next/static/chunks/pages/_app-f06a6678b1d6ab1351f9.js" as="script"><link rel="preload" href="/_next/static/chunks/a98879f0ead0bf0aa4b1bb171b94fec978471701.8811398a144f15701bab.js" as="script"><link rel="preload" href="/_next/static/chunks/pages/index-60b94d19a2a948450123.js" as="script"><style id="__jsx-3593738319">.a4.jsx-3593738319{margin:0 auto;max-width:950px;}.a4--header.jsx-3593738319{border-bottom:1px dotted lightgray;padding-bottom:10px;margin-bottom:20px;}</style><script data-dapp-detection="">\n' +
            '(function() {\n' +
            '  let alreadyInsertedMetaTag = false\n' +
            '\n' +
            '  function __insertDappDetected() {\n' +
            '    if (!alreadyInsertedMetaTag) {\n' +
            '      const meta = document.createElement(\'meta\')\n' +
            '      meta.name = \'dapp-detected\'\n' +
            '      document.head.appendChild(meta)\n' +
            '      alreadyInsertedMetaTag = true\n' +
            '    }\n' +
            '  }\n' +
            '\n' +
            '  if (window.hasOwnProperty(\'web3\')) {\n' +
            '    // Note a closure can\'t be used for this var because some sites like\n' +
            '    // www.wnyc.org do a second script execution via eval for some reason.\n' +
            '    window.__disableDappDetectionInsertion = true\n' +
            '    // Likely oldWeb3 is undefined and it has a property only because\n' +
            '    // we defined it. Some sites like wnyc.org are evaling all scripts\n' +
            '    // that exist again, so this is protection against multiple calls.\n' +
            '    if (window.web3 === undefined) {\n' +
            '      return\n' +
            '    }\n' +
            '    __insertDappDetected()\n' +
            '  } else {\n' +
            '    var oldWeb3 = window.web3\n' +
            '    Object.defineProperty(window, \'web3\', {\n' +
            '      configurable: true,\n' +
            '      set: function (val) {\n' +
            '        if (!window.__disableDappDetectionInsertion)\n' +
            '          __insertDappDetected()\n' +
            '        oldWeb3 = val\n' +
            '      },\n' +
            '      get: function () {\n' +
            '        if (!window.__disableDappDetectionInsertion)\n' +
            '          __insertDappDetected()\n' +
            '        return oldWeb3\n' +
            '      }\n' +
            '    })\n' +
            '  }\n' +
            '})()</script><style type="text/css" data-styled-jsx=""></style><link as="fetch" rel="prefetch" href="/_next/data/TJC8fPj0_ODRgIqfyu4e2/index.json"><link as="script" rel="prefetch" href="/_next/static/chunks/a98879f0ead0bf0aa4b1bb171b94fec978471701.8811398a144f15701bab.js"><link as="script" rel="prefetch" href="/_next/static/chunks/pages/index-60b94d19a2a948450123.js"></head><body><div id="__next"><div><header class="mb-5 shadow p-5"><h1 class="text-center text-sm-left m-0"><span>Ian<!-- -->\'s <!-- -->papers</span><br class="d-xxl-none d-xl-none d-lg-none d-md-none"><br class="d-xxl-none d-xl-none d-lg-none d-md-none"><small class="a4--header-right float-none float-lg-right"><div><a href="/ianwijma-cover.pdf" target="_blank" class="link-dark">Cover letter</a>&nbsp; | &nbsp;<a href="/ianwijma-resume.pdf" target="_blank" class="link-dark">Resume</a>&nbsp; | &nbsp;<a href="#projects" class="link-dark">Projects</a>&nbsp; | &nbsp;<a href="#blog-posts" class="link-dark">Blog posts</a></div></small></h1></header><div id="hey-you" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Hey you!</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="jsx-3593738319 a4--content"><div><p>Welcome and thanks for visiting my humble place on the internet.</p>\n' +
            '<p>Here you can find my projects, blog and information about me.\n' +
            'In the future I will also host fun projects to try out here.</p>\n' +
            '<p><strong>About me</strong></p>\n' +
            '<p>I\'m Ian Wijma and currently living in Australia, Canberra.\n' +
            'I\'m born on 17th of Juli, 1993 in The Netherlands, Enschede.\n' +
            'I moved to Australia on 14th of August 2019.</p>\n' +
            '<p><strong>Passions</strong></p>\n' +
            '<p><em>Programming</em></p>\n' +
            '<p>This is my hobby and my profession.\n' +
            'In my spare time I love trying out new and exciting new languages like GO, Rust, Deno and C#.\n' +
            'Where at work I mainly use JavaScript with sprinkles of PHP.</p>\n' +
            '<p><em>Craft beer</em></p>\n' +
            '<p>I love trying out new craft beer from local and international brewers.\n' +
            'Any new location has its own brewers with their beers to try out.\n' +
            'I\'m also starting to read into brewing my own beers. So stay tuned about potential blog posts about that.</p>\n' +
            '<p><em>Traveling</em></p>\n' +
            '<p>I love traveling, about 7 years ago, when I was still living in The Netherlands, I always went to France.\n' +
            'But ever since I went to Dublin and Scotland I got the travel fever.\n' +
            'Countries I\'d love to visit are Japan, India, Russia and Canada.\n' +
            'I also want to travel around Europe more, visit friend from Sweden, Denmark and England. </p>\n' +
            '<p><em>Gaming</em></p>\n' +
            '<p>Gaming for me is a way to wind down my head after a busy day of programming.\n' +
            'Where after I feel relaxed and ready to get some good sleep. </p>\n' +
            '<p><em>FOSS</em></p>\n' +
            '<p>Free Open Source Software is great, I always look at project to contribute to.\n' +
            'During a busy work week I don\'t get much time to do so.\n' +
            'But during my holidays I love checking out projects that I can start or help.</p>\n' +
            '</div></div></div><div id="skills" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Skills</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="jsx-3593738319 a4--content"><div><p><strong>Communication</strong></p>\n' +
            '<p>I consider myself to have good communication skills,\n' +
            'and I love meeting new people of different backgrounds.\n' +
            'I have many friends from all over the world as I mentioned before.\n' +
            'Where I love seeing differences between different parts of the world.</p>\n' +
            '<p><strong>Teamwork</strong></p>\n' +
            '<p>Teamwork is very important for me and love practising it.\n' +
            'Teamwork to me is obvious working in a team,\n' +
            'as a group who understands each others standpoint and view.\n' +
            'I also have lots of experience working and interactive with people from different origins,\n' +
            'due to the fact that I have friends all over the worlds which I have met up with. </p>\n' +
            '<p><strong>Project/Product focused</strong></p>\n' +
            '<p>I\'m because of my works very product focused,\n' +
            'and love to know the scope of the whole product so decisions are easy to make.\n' +
            'Were I often know the actual code from the top of my head.</p>\n' +
            '<p><strong>Programming</strong></p>\n' +
            '<p>I consider myself very capable in programming.\n' +
            'I\'m not focused on one language which makes it relatively easy for me to pickup a new language.\n' +
            'I learn myself programming concepts instead the language.</p>\n' +
            '<p>Saying this I find myself skilled in JavaScript because I have been programming with this languages 8 years as a hobby,\n' +
            'and 5 years professionally.\n' +
            'This allows me to know various gotchas, like shrinking an array in JavaScript can be done via setting the <code>array.length = 5;</code></p>\n' +
            '<p><strong>Linux</strong></p>\n' +
            '<p>I love Linux and I have been using it personally for 6 years and professionally for 5 years.\n' +
            'Where since beginning 2019 I personally run fully on Linux, where I migrated my gaming PC to POP!_OS 20.04.\n' +
            'I also have experience running Linux server. Where Debian is my operating system of choice.</p>\n' +
            '<p><strong>Workaholic</strong></p>\n' +
            '<p>Yep, This is not a skill I\'m proud of,\n' +
            'But once I\'m going on a project I\'m excited for I sometimes work long hours.\n' +
            'In my current job I used to make easily 12+ hours days for a week long.</p>\n' +
            '<p>Now I have stopped doing such a long hours due to pay,\n' +
            'I still see myself work for hours on personal projects.</p>\n' +
            '</div></div></div><div id="working-experience" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Working experience</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="jsx-3593738319 a4--content"><div><p><strong>Albert Heijn (Dutch grocery store) 2010-2013</strong></p>\n' +
            '<p>I started off with a proper job at the local grocery store,\n' +
            'where I learned allot about teamwork, communication and being organised.\n' +
            'Where after a few months I mainly worked in the warehouse extracting the truck and organising the warehouse.</p>\n' +
            '<p><strong>StoreKeeper B.V. 2015-today</strong></p>\n' +
            '<p>After my game development application was a flop I started working for StoreKeeper B.V.\n' +
            'Here I learned allot, but mainly that I need to learn at my own pace.\n' +
            'Which school are often slow and won\'t give me a challenge. </p>\n' +
            '<p>Here I learned professional/technical communication in English due to the fact that the CTO is from Poland.\n' +
            'Where we mainly work with JavaScript, PHP and PostGreSQL on an eCommerce product.\n' +
            'I learned here to combine hardware and software because we have our own POS system.\n' +
            'with a connection to several web shops using a backend and backoffice to manage it all.</p>\n' +
            '</div></div></div><div id="education" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Education</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="jsx-3593738319 a4--content"><div><p>Although I went to a school where I learned to work with hardware and later on learned to program.\n' +
            'The periods where too easy and learned mostly from my own projects.</p>\n' +
            '<p><strong>ROC Van Twente (IT support) 2010-2012</strong></p>\n' +
            '<p>IT support was a requirement for me due to my prior education.\n' +
            'Here I mainly learned the basics of ITIL and some basic hardware.</p>\n' +
            '<p>This course was easy for me because I already worked on hardware 4 years prior to this study,\n' +
            'where I was tinkering around with several 2nd hard desktops and a 1u server. </p>\n' +
            '<p><strong>ROC Van Twente (Programming) 2012-2015</strong></p>\n' +
            '<p>After the IT support study I was ready for a challenge,\n' +
            'and was excited to get started with C#.\n' +
            'But after a month the pace was slow for myself due to me also playing around with C# at home.</p>\n' +
            '<p><strong>Saxion University (Game development) 2015</strong></p>\n' +
            '<p>After I was done with my programming education.\n' +
            'I have applied for a game development university where I have programmed my game from scratch as a challenge for myself.\n' +
            'But after getting negative advice because my game from scratch was less complete than other peoples drag and drop games.\n' +
            'I decided to work for a year.\n' +
            'Which turned into my never going back to any university due to the fact I learn way more in the field and personally.</p>\n' +
            '</div></div></div><div id="other" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Other</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="jsx-3593738319 a4--content"><div><p><strong>Manager gaming community 2013-2014</strong></p>\n' +
            '<p>Maybe a silly think to include,\n' +
            'but I used to be a Manager at a gaming community where I mainly took care of conflicts within the community.\n' +
            'But this was on an American server.\n' +
            'Where I learned a lot of English speaking and writing. </p>\n' +
            '<p>I stopped managing after the exams began and required some focus,\n' +
            'and the timezone difference blocked my of resolving conflicts.</p>\n' +
            '</div></div></div><div id="projects" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Projects</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="row"><div class="col-md-6 mb-4"><div class="card"><div class="card-body"><h3 class="card-title">ian.wij.ma</h3><p class="card-text">This very website!</p><a class="btn btn-dark" href="/project/ian-wij-ma">Project</a></div></div></div><div class="col-md-6 mb-4"><div class="card"><div class="card-body"><h3 class="card-title">Stare till they grow!</h3><p class="card-text">A quick Minecraft mod written in Java.</p><a class="btn btn-dark" href="/project/stare-till-they-grow">Project</a></div></div></div></div></div><div id="blog-posts" class="jsx-3593738319 a4 mb-5 shadow p-5"><div class="jsx-3593738319 a4--header"><h2 class="jsx-3593738319 m-0"><strong class="jsx-3593738319">Blog posts</strong><span class="jsx-3593738319 a4--header-right float-right"></span></h2></div><div class="row"><div class="col-md-6 mb-4"><div class="card"><div class="card-body"><h3 class="card-title">Hello World!</h3><p class="card-text">Hello you!</p><a class="btn btn-dark" href="/blog/hello-world">Post</a></div></div></div></div></div></div></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"config":{"firstName":"Ian","lastName":"Wijma"},"intro":"\u003cdiv\u003e\u003cp\u003eWelcome and thanks for visiting my humble place on the internet.\u003c/p\u003e\\n\u003cp\u003eHere you can find my projects, blog and information about me.\\nIn the future I will also host fun projects to try out here.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eAbout me\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI\'m Ian Wijma and currently living in Australia, Canberra.\\nI\'m born on 17th of Juli, 1993 in The Netherlands, Enschede.\\nI moved to Australia on 14th of August 2019.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003ePassions\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003e\u003cem\u003eProgramming\u003c/em\u003e\u003c/p\u003e\\n\u003cp\u003eThis is my hobby and my profession.\\nIn my spare time I love trying out new and exciting new languages like GO, Rust, Deno and C#.\\nWhere at work I mainly use JavaScript with sprinkles of PHP.\u003c/p\u003e\\n\u003cp\u003e\u003cem\u003eCraft beer\u003c/em\u003e\u003c/p\u003e\\n\u003cp\u003eI love trying out new craft beer from local and international brewers.\\nAny new location has its own brewers with their beers to try out.\\nI\'m also starting to read into brewing my own beers. So stay tuned about potential blog posts about that.\u003c/p\u003e\\n\u003cp\u003e\u003cem\u003eTraveling\u003c/em\u003e\u003c/p\u003e\\n\u003cp\u003eI love traveling, about 7 years ago, when I was still living in The Netherlands, I always went to France.\\nBut ever since I went to Dublin and Scotland I got the travel fever.\\nCountries I\'d love to visit are Japan, India, Russia and Canada.\\nI also want to travel around Europe more, visit friend from Sweden, Denmark and England. \u003c/p\u003e\\n\u003cp\u003e\u003cem\u003eGaming\u003c/em\u003e\u003c/p\u003e\\n\u003cp\u003eGaming for me is a way to wind down my head after a busy day of programming.\\nWhere after I feel relaxed and ready to get some good sleep. \u003c/p\u003e\\n\u003cp\u003e\u003cem\u003eFOSS\u003c/em\u003e\u003c/p\u003e\\n\u003cp\u003eFree Open Source Software is great, I always look at project to contribute to.\\nDuring a busy work week I don\'t get much time to do so.\\nBut during my holidays I love checking out projects that I can start or help.\u003c/p\u003e\\n\u003c/div\u003e","skills":"\u003cdiv\u003e\u003cp\u003e\u003cstrong\u003eCommunication\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI consider myself to have good communication skills,\\nand I love meeting new people of different backgrounds.\\nI have many friends from all over the world as I mentioned before.\\nWhere I love seeing differences between different parts of the world.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eTeamwork\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eTeamwork is very important for me and love practising it.\\nTeamwork to me is obvious working in a team,\\nas a group who understands each others standpoint and view.\\nI also have lots of experience working and interactive with people from different origins,\\ndue to the fact that I have friends all over the worlds which I have met up with. \u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eProject/Product focused\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI\'m because of my works very product focused,\\nand love to know the scope of the whole product so decisions are easy to make.\\nWere I often know the actual code from the top of my head.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eProgramming\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI consider myself very capable in programming.\\nI\'m not focused on one language which makes it relatively easy for me to pickup a new language.\\nI learn myself programming concepts instead the language.\u003c/p\u003e\\n\u003cp\u003eSaying this I find myself skilled in JavaScript because I have been programming with this languages 8 years as a hobby,\\nand 5 years professionally.\\nThis allows me to know various gotchas, like shrinking an array in JavaScript can be done via setting the \u003ccode\u003earray.length = 5;\u003c/code\u003e\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eLinux\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI love Linux and I have been using it personally for 6 years and professionally for 5 years.\\nWhere since beginning 2019 I personally run fully on Linux, where I migrated my gaming PC to POP!_OS 20.04.\\nI also have experience running Linux server. Where Debian is my operating system of choice.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eWorkaholic\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eYep, This is not a skill I\'m proud of,\\nBut once I\'m going on a project I\'m excited for I sometimes work long hours.\\nIn my current job I used to make easily 12+ hours days for a week long.\u003c/p\u003e\\n\u003cp\u003eNow I have stopped doing such a long hours due to pay,\\nI still see myself work for hours on personal projects.\u003c/p\u003e\\n\u003c/div\u003e","work":"\u003cdiv\u003e\u003cp\u003e\u003cstrong\u003eAlbert Heijn (Dutch grocery store) 2010-2013\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eI started off with a proper job at the local grocery store,\\nwhere I learned allot about teamwork, communication and being organised.\\nWhere after a few months I mainly worked in the warehouse extracting the truck and organising the warehouse.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eStoreKeeper B.V. 2015-today\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eAfter my game development application was a flop I started working for StoreKeeper B.V.\\nHere I learned allot, but mainly that I need to learn at my own pace.\\nWhich school are often slow and won\'t give me a challenge. \u003c/p\u003e\\n\u003cp\u003eHere I learned professional/technical communication in English due to the fact that the CTO is from Poland.\\nWhere we mainly work with JavaScript, PHP and PostGreSQL on an eCommerce product.\\nI learned here to combine hardware and software because we have our own POS system.\\nwith a connection to several web shops using a backend and backoffice to manage it all.\u003c/p\u003e\\n\u003c/div\u003e","other":"\u003cdiv\u003e\u003cp\u003e\u003cstrong\u003eManager gaming community 2013-2014\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eMaybe a silly think to include,\\nbut I used to be a Manager at a gaming community where I mainly took care of conflicts within the community.\\nBut this was on an American server.\\nWhere I learned a lot of English speaking and writing. \u003c/p\u003e\\n\u003cp\u003eI stopped managing after the exams began and required some focus,\\nand the timezone difference blocked my of resolving conflicts.\u003c/p\u003e\\n\u003c/div\u003e","education":"\u003cdiv\u003e\u003cp\u003eAlthough I went to a school where I learned to work with hardware and later on learned to program.\\nThe periods where too easy and learned mostly from my own projects.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eROC Van Twente (IT support) 2010-2012\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eIT support was a requirement for me due to my prior education.\\nHere I mainly learned the basics of ITIL and some basic hardware.\u003c/p\u003e\\n\u003cp\u003eThis course was easy for me because I already worked on hardware 4 years prior to this study,\\nwhere I was tinkering around with several 2nd hard desktops and a 1u server. \u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eROC Van Twente (Programming) 2012-2015\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eAfter the IT support study I was ready for a challenge,\\nand was excited to get started with C#.\\nBut after a month the pace was slow for myself due to me also playing around with C# at home.\u003c/p\u003e\\n\u003cp\u003e\u003cstrong\u003eSaxion University (Game development) 2015\u003c/strong\u003e\u003c/p\u003e\\n\u003cp\u003eAfter I was done with my programming education.\\nI have applied for a game development university where I have programmed my game from scratch as a challenge for myself.\\nBut after getting negative advice because my game from scratch was less complete than other peoples drag and drop games.\\nI decided to work for a year.\\nWhich turned into my never going back to any university due to the fact I learn way more in the field and personally.\u003c/p\u003e\\n\u003c/div\u003e","projects":[{"title":"ian.wij.ma","summary":"This very website!","url":"https://github.com/ianwijma/ian.wij.ma","slug":"ian-wij-ma","content":"\u003cp\u003eAfter postponing my personal website for many years,\\nI had a long week off with not much to do.\\nThus worked on this very website.\\nOf course I had some base requirements for my site.\u003c/p\u003e\\n\u003ch2\u003eGotta go FAST!\u003c/h2\u003e\\n\u003cp\u003eSites these times have no execute to be slow.\\nThere are many free and easy solutions to make fast websites,\\neven with full eCommerce capabilities!\u003c/p\u003e\\n\u003cp\u003eThe speed accomplished by the React based next.js,\\nwhich is pre-rendering the content and serves it efficiently and quick to the end user.\u003c/p\u003e\\n\u003ch2\u003eMobile first!\u003c/h2\u003e\\n\u003cp\u003eNowadays everyone uses their phones for anything.\\nAnd if you site doesn\'t make it easy for mobile users,\\nyou might as well not have a website.\u003c/p\u003e\\n\u003ch2\u003eMaintainability\u003c/h2\u003e\\n\u003cp\u003eBecause I have lots of hobbies,\\nI don\'t want to spend ALL my time writing a new function for my site.\\nSo I wanted it to be easy to add and update pages and features. \u003c/p\u003e\\n\u003ch2\u003eStack\u003c/h2\u003e\\n\u003cp\u003eAs stated before I used React and Next.JS, which allows me to pre-render the pages.\\nI used markdown for all the content of the site.\\nI host it for free on the reliable hosting of Vercel.\u003c/p\u003e\\n"},{"title":"Stare till they grow!","summary":"A quick Minecraft mod written in Java.","url":"https://github.com/ianwijma/stare-till-they-grow","slug":"stare-till-they-grow","content":"\u003cp\u003eI love Minecraft, the simplicity and mindless playing allows me to relax.\\nBut I wanted to program it, and decided to checkout how easy it is to write a mod for it.\u003c/p\u003e\\n\u003cp\u003eSo I write a super simple mod which thought me about server \u003ccode\u003e\u0026#x3C;-\u003e\u003c/code\u003e client communication.\\nI knew a little Java, so it was a weekend me warming up my Java skills and learning the mod API called Forge.\u003c/p\u003e\\n"}],"blogPosts":[{"title":"Hello World!","summary":"Hello you!","date":"31-08-2020","slug":"hello-world","content":"\u003cp\u003eThis is my first blog post. This contains anything then a hello and welcome to my site!\u003c/p\u003e\\n"}]},"__N_SSG":true},"page":"/","query":{},"buildId":"TJC8fPj0_ODRgIqfyu4e2","runtimeConfig":{},"nextExport":false,"isFallback":false,"gsp":true}</script><script nomodule="" src="/_next/static/chunks/polyfills-4beebf4ac9054f0bf4e6.js"></script><script src="/_next/static/chunks/main-7df81f3560aad46109d8.js" async=""></script><script src="/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js" async=""></script><script src="/_next/static/chunks/framework.4df82c4704a0136f6a4b.js" async=""></script><script src="/_next/static/chunks/aa2b9c68.ff5578978733a40a67a3.js" async=""></script><script src="/_next/static/chunks/commons.1ef53c9f95d3762ed004.js" async=""></script><script src="/_next/static/chunks/pages/_app-f06a6678b1d6ab1351f9.js" async=""></script><script src="/_next/static/chunks/a98879f0ead0bf0aa4b1bb171b94fec978471701.8811398a144f15701bab.js" async=""></script><script src="/_next/static/chunks/pages/index-60b94d19a2a948450123.js" async=""></script><script src="/_next/static/TJC8fPj0_ODRgIqfyu4e2/_buildManifest.js" async=""></script><script src="/_next/static/TJC8fPj0_ODRgIqfyu4e2/_ssgManifest.js" async=""></script></body></html>',
    });
    console.log('Done!');
})()
