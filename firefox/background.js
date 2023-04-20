// Listen for messages from content script and popup
browser.runtime.onMessage.addListener((message, sender) => {
    switch (message.type) {
      case 'saveComment':
        return saveComment(message.payload);
      case 'getComments':
        return getComments();
      case 'deleteComment':
        return deleteComment(message.payload);
    }
  });
  
  // Save a comment with its location and text reference
  function saveComment({ url, text, comment }) {
    return browser.storage.local.get('comments').then(({ comments }) => {
      if (!comments) {
        comments = [];
      }
      comments.push({ url, text, comment });
      return browser.storage.local.set({ comments });
    });
  }
  
  // Retrieve all comments
  function getComments() {
    return browser.storage.local.get('comments').then(({ comments }) => comments || []);
  }
  
  // Delete a comment
  function deleteComment({ url, text }) {
    return browser.storage.local.get('comments').then(({ comments }) => {
      if (comments) {
        comments = comments.filter(comment => comment.url !== url || comment.text !== text);
        return browser.storage.local.set({ comments });
      }
    });
  }
  