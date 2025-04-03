<code>
  __       __  __   __          ____                         
 / /___ __/ /_/ /  / /__  ___ _/ __/_ __ ___  _______ ___ ___
/ __/\ \ / __/ _ \/ / _ \/ _ `/ _/ \ \ // _ \/ __/ -_|_-<(_-<
\__//_\_\\__/_.__/_/\___/\_, /___//_\_\/ .__/_/  \__/___/___/
                        /___/         /_/                    
	</code>					2025
+======================================================+
			
		txtblogExpress	V.0.1

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
		(W/ CORRESPONDING JSON*, WILL AUTOMATE
		NEXT UPDATE!) AND CREATES A BLOG POST FROM 
		IT. EACH POST WILL START WITH A PHOTO
		BANNER (500x100 px) STARTING V.0.2! POSTS
		WHICH ARE LONGER THAN 127 WORDS SHOW A
		PREVIEW + LINK TO A PAGE DISPLAYING THE
		FULL POST, WHICH CAN BE DIRECTLY LINKED TO.
		PAGES OF THE BLOG ARE LIMITED TO 10 POSTS. 
		V.0.2 WILL ALSO INCLUDE A TOGGLE SWITCH TO 
		SWAP BETWEEN DARK / LIGHT MODE (DARK DEFAULT)

	--> CUSTOMIZE:
		THE BLOG CREATED BY THIS PROJECT WAS LEFT 
		INTENTIONALLY SIMPLE. CREATED TO BE SIMPLE +
		USED IMMEDIATELY, DROPPED INTO YOUR
		EXISTING PROJECT, OR FURTHER CUSTOMIZED AFTER
		INSTALLATION. IF YOU DO NOT PROGRAM,
		IT IS RECOMMENDED THAT YOU USE VSCODE OR ANOTHER
		TEXT EDITOR+ AI MODULE ADD-ON TO
		PROMPT THE AI THIS PROJECT FOLDER,     
		THEN SIMPLY ASK IT TO MAKE FORMATTING CHANGES 
		BASED ON YOUR PREFERENCES.


	+= POSSIBLE FEATURES TO-DO LIST: =+

	~ DARK MODE TOGGLE SWITCH
	~ BASIC SCRIPT OR OPTIONS MENU TO SIMPLIFY CUSTOMIZATION
	~ IMAGE DITHERING (ONLY ON LOW POWER VERSION? TEST)
	~ LOG IN PAGE WITH FORM TOOL THAT COULD BE USED TO CREATE JSON+TXT
		(OR A SIMPLE CLI SCRIPT)
	~
