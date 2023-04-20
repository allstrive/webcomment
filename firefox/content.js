// Constants
const HIGHLIGHT_CLASS = 'text-commenter-highlight';

// Retrieve and highlight previously commented text
browser.runtime.sendMessage({ type: 'getComments' }).then(comments => {
  const currentUrl = window.location.href;
  comments
    .filter(comment => comment.url === currentUrl)
    .forEach(comment => {
      highlightText(comment.text);
    });
});

// Listen for user's text selection
document.addEventListener('mouseup', event => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
    const comment = prompt('Enter your comment:');

    if (comment) {
      const payload = {
        url: window.location.href,
        text: selectedText,
        comment
      };

      // Save the comment and highlight the text
      browser.runtime.sendMessage({ type: 'saveComment', payload }).then(() => {
        highlightText(selectedText);
      });
    }
  }
});

// Highlight the text
function highlightText(text) {
  const textNodes = findTextNodes(document.body, text);

  textNodes.forEach(node => {
    const span = document.createElement('span');
    span.className = HIGHLIGHT_CLASS;
    span.style.backgroundColor = 'yellow';

    node.parentNode.insertBefore(span, node);
    span.appendChild(node);
  });
}

// Find text nodes containing the specified text
function findTextNodes(element, searchText) {
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.includes(searchText)) {
      textNodes.push(node);
    }
  }

  return textNodes;
}
