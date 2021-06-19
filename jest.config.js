export default {
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	
};

// "jest": {
// 	"testEnvironment": "node",
// 	"coveragePathIgnorePatterns": [
// 		"/node_modules/"
// 	]
// },
