const fs = require('fs');

const configPath = './config.json';
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
	const config = require(configPath);
	config.databaseUrl = databaseUrl;

	fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
	console.log('Updated config.json with DATABASE_URL');
} else {
	console.error('DATABASE_URL not set');
}