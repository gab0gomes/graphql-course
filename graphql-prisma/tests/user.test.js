import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';
import prisma from '../src/prisma';

const client = new ApolloBoost({
	uri: 'http://localhost:4000',
});

jest.setTimeout(30000);

beforeEach(async () => {
	await prisma.mutation.deleteManyPosts();
	await prisma.mutation.deleteManyUsers();
	const user = await prisma.mutation.createUser({
		data: {
			name: 'jen',
			email: 'jen@example.com',
			password: bcrypt.hashSync('asdfrewq'),
		}
	});
	await prisma.mutation.createPost({
		data: {
			title: 'post 1',
			body: 'body 1',
			published: true,
			author: {
				connect: {
					id: user.id
				},
			},
		},
	});
	await prisma.mutation.createPost({
		data: {
			title: 'post 2',
			body: 'body 2',
			published: false,
			author: {
				connect: {
					id: user.id
				},
			},
		},
	});
});

test('Should create a new user', async () => {
	const createUser = gql`
		mutation {
			createUser(
				data: {
					name: "dummy",
					email: "dummy@test.com",
					password: "pass1234",
				}
			) {
				token,
				user {
					id
				}
			}
		}
	`;

	const response = await client.mutate({
		mutation: createUser,
	});

	const exists = await prisma.exists.User({
		id: response.data.createUser.user.id,
	});

	expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
	const getPosts = gql`
		query {
			users {
				id,
				name,
				email,
			}
		}
	`;

	const response = await client.query({
		query: getPosts,
	});

	expect(response.data.users.length).toBe(1);
	expect(response.data.users[0].email).toBe(null);
	expect(response.data.users[0].name).toBe('jen');
});

test('Should expose published posts', async () => {
	const getUsers = gql`
		query {
			posts {
				id,
				title,
				body,
				published,
			}
		}
	`;

	const response = await client.query({
		query: getUsers,
	});

	expect(response.data.posts.length).toBe(1);
	expect(response.data.posts[0].published).toBe(true);
});

test('Should not login with bad credentials', async () => {
	const login = gql`
		mutation {
			login(
				data: {
					email: "test@test.com"
					password: "opsopsops"
				}
			) {
				token
			}
		}
	`
	await expect(
		client.mutate({ mutation: login})
	).rejects.toThrow();
});

test('Should not signup with short password', async () => {
	const createUser = gql`
		mutation {
			createUser(
				data: {
					name: "dummy2",
					email: "dummy2@test.com",
					password: "pass",
				}
			) {
				token,
				user {
					id
				}
			}
		}
	`;

	await expect(
		client.mutate({ mutation: createUser})
	).rejects.toThrow();
})