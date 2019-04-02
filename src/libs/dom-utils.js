import {paths} from './paths';

// Creates the option bar to display the options
export function createOptionsBar() {
	let optionsBar = document.querySelector('.__rhn__options-bar');
	if (optionsBar) {
		return optionsBar;
	}

	const mainTbody = document.querySelector('table#hnmain > tbody');
	optionsBar = document.createElement('div');
	optionsBar.classList.add('__rhn__options-bar');

	const insertBeforeTr = mainTbody.querySelectorAll('tr')[3];
	mainTbody.insertBefore(optionsBar, insertBeforeTr);

	return optionsBar;
}

// From: https://stackoverflow.com/a/22480938
export function elementInScrollView(el) {
	const rect = el.getBoundingClientRect();
	const elemTop = rect.top;
	const elemBottom = rect.bottom;

	const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
	return isVisible;
}

export function getAllComments() {
	return document.querySelectorAll('tr.comtr');
}

export function getTopLevelComments() {
	const allComments = getAllComments();
	const topLevelComments = [];

	for (const comment of allComments) {
		const indentCell = comment.querySelector('td.ind img');
		if (indentCell.width === 0) {
			topLevelComments.push(comment);
		}
	}

	return topLevelComments;
}

export function getGroupedStories(itemlist) {
	const rows = [...itemlist.querySelectorAll(':scope > tbody > tr')];
	while (!rows[0].matches('.athing')) {
		rows.shift();
	}

	const stories = [];

	for (let i = 0; i < rows.length - 2; i += 3) {
		const id = parseInt(rows[i].id, 10);
		const storyUrl = rows[i].querySelector('a.storylink').href;

		const scoreSpan = rows[i + 1].querySelector('span.score');
		const score = scoreSpan ? parseInt(scoreSpan.innerText, 10) : null;

		const defaultRank = parseInt(rows[i].querySelector('span.rank').innerText, 10);

		const commentsLink = [...rows[i + 1].querySelectorAll('a')]
			.find(a => a.innerText.includes('comment') || a.innerText.includes('discuss'));
		const commentsCount = commentsLink ? parseInt(commentsLink.innerText, 10) : null;

		const elements = [
			rows[i],
			rows[i + 1],
			rows[i + 2]
		];

		stories.push({
			id,
			storyUrl,
			score,
			elements,
			defaultRank,
			commentsLink,
			commentsCount
		});
	}

	return stories;
}

export function newReplyTextareasObserver(callback) {
	const mainTable = document.querySelector('table#hnmain');

	if (paths.comments.includes(window.location.pathname) && mainTable) {
		const observer = new MutationObserver(mutationsList => {
			for (const mutation of mutationsList) {
				const {addedNodes} = mutation;
				for (const node of addedNodes) {
					if (node.nodeType !== Node.ELEMENT_NODE) {
						continue;
					}

					const textarea = node.querySelector('textarea');
					if (textarea) {
						textarea.addEventListener('keydown', callback);
					}
				}
			}
		});

		const observerConfig = {
			attributes: false,
			childList: true,
			subtree: true
		};

		window.addEventListener('load', observer.observe(mainTable, observerConfig));
	}
}
