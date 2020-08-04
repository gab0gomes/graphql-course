const users = [
	{
		id: '1',
		name: 'user1',
		email: 'user1@users.com',
		age: 27,
	},
	{
		id: '2',
		name: 'user2',
		email: 'user2@users.com',
	},
	{
		id: '3',
		name: 'user3',
		email: 'user3@users.com',
	},
];

const posts = [
	{
		id: '10',
		title: 'GraphQL 101',
		body: 'post text',
		published: true,
		author: '1'
	},
	{
		id: '11',
		title: 'GraphQL 201',
		body: 'post text',
		published: false,
		author: '1',
	},
	{
		id: '12',
		title: 'Music',
		body: 'post text',
		published: false,
		author: '2'
	},
];

const comments = [
	{
		id: '10',
		text: 'comment 1',
		author: '2',
		post: '10',
	},
	{
		id: '11',
		text: 'comment 2',
		author: '3',
		post: '11',
	},
	{
		id: '12',
		text: 'comment 3',
		author: '3',
		post: '12',
	},
];

const db = {
	users,
	posts,
	comments,
};

export { db as default };
