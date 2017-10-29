var routeManager = {
	register: (router, routes) => {
		routes.forEach((o) => {
			router.use(o.path, require(o.controller));
		});
	}
};

module.exports = routeManager;