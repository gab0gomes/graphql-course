import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
	typeDefs: 'graphql-prisma/src/generated/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
	secret: 'testsecret',
	fragmentReplacements,
});

export { prisma as default };
