var port = process.env.PORT || 3000;
var config = {
	rootFolder: __dirname,
	projectName: 'ALBUM-SERVER',
	siteUrl: 'http://localhost:' + port,
};

if (process.env.NODE_ENV === 'production') {
} else if (process.env.NODE_ENV === 'staging') {
}

module.exports = config;