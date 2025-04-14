// import config from "./src/data/config";
const config = require("./src/data/config")
const blogs = require("./src/data/blogs")
const locations = require("./src/data/location")

const allblogs = blogs.blog_data;
const path = require('path')
const storeLocations = locations.location_data;

exports.createPages = async ({ actions: { createPage } }) => {
	createPage({
		path: `/test-from-node`,
		component: require.resolve("./src/templates/test-template.js"),
		context: { data: config },
	});

	allblogs.forEach((data, index) => {
		const postlink = data.link;
		createPage({
			path: postlink,
			component: path.resolve("src/templates/blog-template.js"),
			context: {
				data: data,
				pageSlug: postlink,
				prev: index === 0 ? null : allblogs[index - 1],
				next: index === allblogs.length - 1 ? null : allblogs[index + 1]
			}
		});
	});

	storeLocations.forEach((data, index) => {
		const shopLink = data.link;
		createPage({
			path: shopLink,
			component: path.resolve("src/pages/shop/index.js"),
			context: {
				pageCity: data.name
			}
		});
	});

}
