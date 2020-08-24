import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
	uri: 'http://localhost:4000'
});

const getPosts = gql`
	query {
		posts {
			title,
			author {
				name,
			},
		}
	}
`;

client.query({
	query: getPosts,
}).then(({ data }) => {
	let postsHtml = '';

	data.posts.forEach(post => {
		postsHtml += `
			<p>${post.title} - ${post.author.name} </p>
		`
	});

	document.querySelector('#posts').innerHTML = postsHtml;
});
