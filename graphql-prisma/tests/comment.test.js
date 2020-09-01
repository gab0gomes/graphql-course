import 'cross-fetch/polyfill';
import prisma from '../src/prisma';

import getClient from './utils/getClient';
import seedDatabase, { userTwo, commentTwo, commentOne, postOne } from './utils/seedDatabase';
import { deleteComment, subscribeToComments } from './utils/operations';

const client = getClient();

jest.setTimeout(30000);

beforeEach(seedDatabase);

test('Should delete own comment', async () => {
	const client = getClient(userTwo.jwt);

	const variables = {
		id: commentOne.comment.id
	};

	const response = await client.mutate({
		mutation: deleteComment,
		variables,
	});

	const exists = await prisma.exists.Comment({
		id: commentOne.comment.id,
	});

	expect(response.data.deleteComment.id).toBe(commentOne.comment.id);
	expect(exists).toBe(false);
});

test('Should not delete other users comment', async () => {
	const client = getClient(userTwo.jwt);

	const variables = {
		id: commentTwo.comment.id
	};

	await expect(
		client.mutate({
			mutation: deleteComment,
			variables,
		})
	).rejects.toThrow();
});

test('Should subscribe to comments for a post', async (done) => {
	const variables = {
		postId: postOne.post.id,
	};

	client.subscribe({
		query: subscribeToComments,
		variables,
	}).subscribe({
		next(response) {
			expect(response.data.comment.mutation).toBe('DELETED');
			done();
		}
	});

	await prisma.mutation.deleteComment({
		where: {
			id: commentTwo.comment.id,
		},
	});
});
