import 'cross-fetch/polyfill';
import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, { userOne, postOne } from './utils/seedDatabase';
import { getPosts, myPosts, updatePost, createPost, deletePost, subscribeToPosts } from './utils/operations';

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test('Should expose published posts', async () => {
	const response = await client.query({
		query: getPosts,
	});

	expect(response.data.posts.length).toBe(1);
	expect(response.data.posts[0].published).toBe(true);
});

test('Should fetch my posts', async () => {
	const client = getClient(userOne.jwt);

	const { data } = await client.query({ query: myPosts });

	expect(data.myPosts.length).toBe(1);
});

test('Should be able to update own post', async () => {
	const client = getClient(userOne.jwt);
	const variables = {
		id: postOne.post.id,
		data: {
			published: false,
		},
	};

	const { data } = await client.mutate({
		mutation: updatePost,
		variables,
	});
	const exists = await prisma.exists.Post({
		id: postOne.post.id,
		published: false,
	});

	expect(data.updatePost.published).toBe(false);
	expect(exists).toBe(true);
});

test('Should be able to create a post', async () => {
	const client = getClient(userOne.jwt);
	const variables = {
		data: {
			title: "testing t",
			body: "testing b",
			published: false,
		},
	};

	const { data } = await client.mutate({
		mutation: createPost,
		variables,
	});
	const exists = await prisma.exists.Post({
		id: data.createPost.id,
		published: data.createPost.published,
		title: data.createPost.title,
		body: data.createPost.body,
	});

	expect(data.createPost.published).toBe(false);
	expect(data.createPost.title).toBe("testing t");
	expect(data.createPost.body).toBe("testing b");
	expect(exists).toBe(true);
});

test('Should be able to delete a own post', async () => {
	const client = getClient(userOne.jwt);
	const variables = {
		id: postOne.post.id,
	};

	const { data } = await client.mutate({
		mutation: deletePost,
		variables,
	});
	const exists = await prisma.exists.Post({
		id: postOne.post.id,
	});

	expect(data.deletePost.id).toBe(postOne.post.id);
	expect(exists).toBe(false);
});

test('Should subscribe to posts', async (done) => {
	client.subscribe({
		query: subscribeToPosts,
	}).subscribe({
		next(response) {
			expect(response.data.post.mutation).toBe('DELETED');
			done();
		}
	});

	await prisma.mutation.deletePost({
		where: {
			id: postOne.post.id,
		},
	});
});
