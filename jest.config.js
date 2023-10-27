/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/**/*.spec.ts', '**/**/*.test.ts'],
	verbose: true,
	forceExit: true,
	resetMocks: true,
	restoreMocks: true,
	clearMocks:true,
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.ts"],
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
		"@app": "<rootDir>/src/app",
		"@test": "<rootDir>/__test__",
	},
};