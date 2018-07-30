# Definition Parser
A Node.js application to parses the String Definition of MongoDB Schema.

## Definition
	1. @model: A collection would be made in mongo for types with @model directive
	2. @unique: Determines field values should be unique
 	3. ‘!’ : Determines that field cannot be null (are required)
	4. [ ] : Determines fields to be an array

## Example
	const Address = ` type Address {
 	  city: String,
	  state: String
	} `;
	const User = `
		type User @model {
		id: String! @unique
		email: String! @unique name: String!
		age: Int
		addresses: [Address]
		dateOfBirth: Date
	}`;

The program parses the String definitions, creates schemas, and applies proper validation on saving a document in mongodb.

## Run
	1. npm install (if run for 1st time)
	2. npm start
Before running the program, make sure mongodb is running on port 27017 in background.

## Test
	1. npm run test
