// import '@babel/polyfill';
// import express from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const getInst = require('../core');
const getGql = require('./gql');

require('dotenv').config();

async function init() {
	const wrapper = await getInst();
	await wrapper.validate();

	const types = wrapper.getTypes();
	const modules = getGql({types});

	console.log('initializing',modules);

	const app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cors());

	const server = new ApolloServer({
		modules: [
			require('./common'),
		].concat(modules),
	});

	server.applyMiddleware({ app });

	app.get('/', (req, res) => res.send('Hello BlueSteel'));

	app.listen({ port: 5000 }, () =>
		console.log(`🚀 Server ready at http://localhost:5000`)
	);
}

init();