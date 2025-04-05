
  __       __  __   __          ____
 / /___ __/ /_/ /  / /__  ___ _/ __/_ __ ___  _______ ___ ___
/ __/\ \ / __/ _ \/ / _ \/ _ `/ _/ \ \ // _ \/ __/ -_|_-<(_-<
\__//_\_\\__/_.__/_/\___/\_, /___//_\_\/ .__/_/  \__/___/___/
                        /___/         /_/

						(c) 2025
+======================================================+

		txtblogExpress	V.1.2.0

+======================================================+

		project-root/
		├── public/
		│   ├── index.html
		│   ├── css/
		│   │   └── style.css
		│   ├── js/
		│   │   └── main.js
		│   └── posts/ (directory for rendered posts)
		├── posts/ (source post data)
		│   ├── post-1.json
		│   ├── post-1.txt
		│   ├── post-2.json
		│   ├── post-2.txt
		│   └── post-3.json
		│   └── post-3.txt
		├── server.js
		├── package.json
		└── .gitignore



	--> HOW TO USE THIS SOFTWARE:
		1. SET UP PROJECT STRUCTURE AS SHOWN ABOVE
		2. INSTALL DEPENDENCIES: "npm install"
		3. START THE SERVER: "npm start"
		3a. FOR DEVELOPMENT, ENTER "npm run dev"
			ALLOWING AUTO-START TO MAKE
			MAKING CHANGES EASY.
		4. ACCESS BY VISITING:
			"HTTP://LOCALHOST:3000"

	--> INFORMATION:
		THIS PROJECT TAKES CONTENT THAT YOU UPLOAD
		INTO /posts IN THE FORM OF .TXT FILES
		AND CREATES A BLOG POST FROM THEM.
		EACH POST WILL START WITH A PHOTO
		BANNER THAT YOU SPECIFY IN THE TXT. POSTS
		WHICH ARE LONGER THAN 127 WORDS SHOW A
		PREVIEW + LINK TO A PAGE DISPLAYING THE
		FULL POST, WHICH CAN BE USED TO DIRECTLY LINK
		TO SPECIFIC POSTS.
		PAGES OF THE BLOG ARE LIMITED TO 10 POSTS.
		EVERY 10 POSTS, A NEW PAGE IS CREATED.
        THERE IS NOW A TOGGLE SWITCH TO SWAP BETWEEN
        DARK AND LIGHT MODES, WITH PERSISTENCE ONCE
        ONE IS CHOSEN.

	--> CUSTOMIZE:
		THE BLOG CREATED BY THIS PROJECT WAS LEFT
		INTENTIONALLY BASIC. CREATED TO BE SIMPLE +
		USED IMMEDIATELY, EITHER DROPPED INTO YOUR
		EXISTING PROJECT, OR FURTHER CUSTOMIZED IN
        ORDER TO FIT YOUR NEEDS. IF YOU DO NOT PROGRAM,
		IT IS RECOMMENDED THAT YOU USE CURSOR OR ANOTHER
		TEXT EDITOR+ AI MODULE ADD-ON TO
		SIMPLY PROMPT IT TO MAKE FORMATTING CHANGES
		BASED ON YOUR PREFERENCES.


	+= POSSIBLE FEATURES TO-DO LIST: =+

	~ IMAGE DITHERING (ONLY ON LOW POWER VERSION? TEST)
    ~ LOG IN PAGE WITH FORM TOOL THAT COULD BE USED TO CREATE JSON+TXT
        (OR A SIMPLE CLI SCRIPT)
