
  __       __  __   __          ____
 / /___ __/ /_/ /  / /__  ___ _/ __/_ __ ___  _______ ___ ___
/ __/\ \ / __/ _ \/ / _ \/ _ `/ _/ \ \ // _ \/ __/ -_|_-<(_-<
\__//_\_\\__/_.__/_/\___/\_, /___//_\_\/ .__/_/  \__/___/___/
                        /___/         /_/

						(c) 2025
+======================================================+

		txtblogExpress	V.1.2.0

+======================================================+

	txtblogExpress/ (V.1.2.0)
        ├── public/
        │   ├── index.html          # Main blog page
        │   ├── post.html           # Individual post page
        │   ├── images/             # Directory for post images
        │   ├── css/
        │   │   └── style.css       # Main stylesheet
        │   └── js/
        │       └── main.js         # Main JavaScript file
        ├── posts/
        │   ├── post-1.txt          # Post content in TXT format
        │   ├── post-1.json         # Post metadata
        │   ├── post-2.txt
        │   ├── post-2.json
        │   ├── post-3.txt
        │   └── post-3.json
        ├── server.js               # Express server
        ├── package.json           # Project configuration
        ├── package-lock.json      # Dependency lock file
        ├── README.TXT            # Project documentation
        ├── LICENSE.TXT           # GPL-3.0 license
        └── .gitignore            # Git ignore rules

        Key Features:
        - Node.js + Express backend
        - TXT file based posts with JSON metadata
        - Image support (.jpg and .png)
        - Dark/Light mode toggle
        - Responsive design
        - Pagination (10 posts per page)
        - Post preview for long content (>127 words)



	--> HOW TO USE THIS SOFTWARE:
		1. DOWNLOAD AND ENSURE PROJECT STRUCTURE IS AS SHOWN ABOVE
		2. INSTALL DEPENDENCIES: "npm install"
		3. START THE SERVER: "npm start"
		3a. FOR DEVELOPMENT, ENTER "npm run dev"
			ALLOWING SERVER AUTO-START TO MAKE
			MAKING CHANGES EASY.
		4. ACCESS BY VISITING:
			"HTTP://LOCALHOST:3000"
		5. FOR MORE HELP WITH HOW TO SET UP YOUR ENVIRONMENT TO USE
		 	THIS SOFTWARE, SEE "DEPLOY.TXT" FOR REFERENCE.
		6. FOR HELP FORMATTING YOUR POSTS, USE "FORMATTING.TXT"
			AS A REFERENCE.

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
