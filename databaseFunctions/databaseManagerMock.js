// encoder/decoder: http://meyerweb.com/eric/tools/dencoder/

function checkLogin(user) {
    if(user.username == "jacobBaird" && user.password == "bairdPass123"){
    	return { status: true , value: {name: "jacobBaird", id: "baird123"}};
    }
    if(user.username == "jacobMelosi" && user.password == "melosiPass123"){
    	return { status: true , value: {name: "jacobMelosi", id: "melosi123"}};
    }
    if(user.username == "tivonMissi" && user.password == "missiPass123"){
    	return { status: true , value: {name: "tivonMissi", id: "missi123"}};
    }
    if(user.username == "enzoGalbo" && user.password == "galboPass123"){
    	return { status: true , value: {name: "enzoGalbo", id: "galbo123"}};
    }
    return {status: false, msg: "invalid username or password." };
}

function createUser(user){
	return {status: true};
}

function getUsers() {
    var d = new Date("2015-03-25");
    //var c = new Date("2014-02-26");
	var val = [
		{
			id: "userID1",
            username: "username1",
            email: "email%40hotmail.com",
            lastLogin: d,
            profilePic: type.string(),
            facebookId: "555sadstuff",
            watchedProjectIds: [
            	"sad21",
				"lost22"
			],
            yourProjectIds: [
                "abelincoln13",
                "44sailors"
			],
            submittedProjectIds: [
                "submittedthisyup",
                "syrupisgood33"
			]
		}/*,
		{
			// insert another user here if you want after removing surrounding block quotes
			// included a date var to use up above that's commented out ---> c
		}*/
	];
	return {
		value: val,
		status: true
	}
}

function getUser(id) {
	return {
        id: "userID1",
        username: "username1",
        email: "email%40hotmail.com",
        lastLogin: d,
        profilePic: type.string(),
        facebookId: "555sadstuff",
        watchedProjectIds: [
            "sad21",
            "lost22"
        ],
        yourProjectIds: [
            "abelincoln13",
            "44sailors"
        ],
        submittedProjectIds: [
            "submittedthisyup",
            "syrupisgood33"
        ]
    };
}

function getAllProjects() {
	return {
		status: true,
		value: [
			{
				id: "bairdproj111",
				name: "mean%20website",
            	createdDate: "01/19/2017",
				tags: [
					"nodeJs",
					"Mongo",
					"angularJs"
				],
				user: {
					userId: "baird123",
            	    username: "jacobBaird"
            	}
			},
			{projectId: "bairdproj222",projectName: "c%2B%2B%20desktop%20application", projectDate: "01/19/2017", projectTags: ["c%2B%2B", "sql"], userName: "jacobBaird", userId: "baird123"},
			{projectId: "melosiproj111",projectName: "dragons", projectDate: "01/19/2017", projectTags: ["design"], userName: "jacobMelosi", userId: "melosi123"},
			{projectId: "melosiproj222",projectName: "picture", projectDate: "01/19/2017", projectTags: [], userName: "jacobMelosi", userId: "melosi123"},
			{projectId: "missiproj111",projectName: "graduate", projectDate: "01/19/2017", projectTags: ["grades"], userName: "tivonMissi", userId: "missi123"},
			{projectId: "missiproj222",projectName: "animate", projectDate: "01/19/2017", projectTags: ["video"], userName: "tivonMissi", userId: "missi123"},
			{projectId: "galboproj111",projectName: "annotate", projectDate: "01/19/2017", projectTags: ["word"], userName: "enzoGalbo", userId: "galbo123"},
			{projectId: "galboproj222",projectName: "map", projectDate: "01/19/2017", projectTags: ["drawing"], userName: "enzoGalbo", userId: "galbo123"}
		]
	};

	//return { status: false, msg: "Database found no projects."};
}

function getProject(id) {
	//name, description, dateCreated, username, tags, status, userId
	if(id == "bairdproj111"){
		return {
			status: true,
			msg: "here%27s%20your%20message%2C%20yo.%20encoded%2C%20too!",
			value:{
				id: "bairdproj111",
				name: "mean%20website",
				createdDate: "01/19/2017",
				description: "This%20is%20a%20test%20string%20encoded%20for%20the%20purposes%20of%20testing.",
				tags: [
					"nodeJs",
					"Mongo",
					"angularJs"
				],
				status: "open",
				user:{
					username: "jacobBaird",
					userId: "baird123"
				},
				submissions: [
					{
						id: "submission111",
                   		submissionDate: "01/30/2017",
                   		fileUrl: "bairdproj111.tivonMissi.zip",
						rating: 4,
						user: {
							userName: "tivonMissi",
                       		id: "missi123"
                   		},
						accepted: false,
						feedback: "feedback1"
					},
                	{
                   		id: "submission112",
                   		submissionDate: "02/30/2017",
                   		fileUrl: "bairdproj112.tivonMissi.zip",
                   		rating: 3,
                   		user: {
                       		userName: "bairdJake",
                       		id: "baird123"
                   		},
                   		accepted: false,
                   		feedback: "feedback2"
                	}
				]
			}
		}
	}
	if(id == "bairdproj222"){
		return {status: true , value: {
			projectId: "bairdproj222",
			name: "mean%20website",
			dateCreated: "01/19/2017",
			description: "This%20is%20a%20test%20string%20encoded%20for%20the%20purposes%20of%20testing.",
			tags: ["nodeJs", "Mongo", "angularJs"],
			status: "open",
			username: "jacobBaird",
			userId: "baird123"
		}}
	}
	if(id == "bairdproj333"){
		return {status: true, value: {
			projectId: "bairdproj333",
			name: "mean%20website",
			dateCreated: "01/19/2017",
			description: "This%20is%20a%20test%20string%20encoded%20for%20the%20purposes%20of%20testing.",
			tags: ["nodeJs", "Mongo", "angularJs"],
			status: "closed",
			username: "jacobBaird",
			userId: "baird123",
			submissions: [
			{submissionId: "submission311", dateCreated: "01/30/2017", file: "bairdproj333.tivonMissi.zip", rating: 3, userName: "tivonMissi", userId: "missi123", accepted: true}
			]
		}}
	}
	return { status: false, msg: "Database could not find the requested project."};
}

function getProjectsByUser(id){
	return [
		{
            status: true,
            msg: "here%27s%20your%20message%2C%20yo.%20encoded%2C%20too!",
            value: {
                id: "bairdproj111",
                name: "mean%20website",
                createdDate: "01/19/2017",
                description: "This%20is%20a%20test%20string%20encoded%20for%20the%20purposes%20of%20testing.",
                tags: [
                    "nodeJs",
                    "Mongo",
                    "angularJs"
                ],
                status: "open",
                user: {
                    username: "jacobBaird",
                    userId: "baird123"
                }
            }
		}/*,
		{
			// add another project if you'd like by uncommenting the surrounding block comment and populating this obj
		}*/
	];
}


module.exports = {
    checkLogin: checkLogin,
    getUsers: getUsers,
    getUser: getUser,
    getAllProjects: getAllProjects,
    getProject: getProject,
    getProjectsByUser: getProjectsByUser,
    createUser: createUser
};