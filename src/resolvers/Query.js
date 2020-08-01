const Query = {
	me() {
		return {
			id: '123098',
			name: 'Gabriel',
			email: 'test@test.com',
			age: 45,
		};
	},
	post() {
		return {
			id: '123098',
			title: 'dummy post',
			body: 'lorem',
			published: false,
		};
	},
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts;
		}

		return db.posts.filter((post) => {
			const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
			const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
			return isTitleMatch || isBodyMatch;
		});
	},
	greeting(parent, args, { db }, info) {
		if (args.name) {
			return `Hello, ${args.name}!`
		}
		return 'Hello!';
	},
	add(parent, args) {
		return args.numbers.reduce((acc, number) => acc + number, 0);
	},
	grades(parent, args, ctx, info) {
		return [1, 2, 3];
	},
	users(parent, args, { db }, info) {
		if (args.query) {
			return db.users.filter(user => user
				.name
				.toLowerCase()
				.includes(args.query.toLowerCase()))
		}
		return db.users;
	},
	comments(parent, args, { db }, info) {
		return db.comments;
	},
};

export { Query as default };
