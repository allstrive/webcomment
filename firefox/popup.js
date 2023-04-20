// Display comments
function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = '';
  
    comments.forEach(comment => {
      const div = document.createElement('div');
      div.className = 'comment';
  
      const link = document.createElement('a');
      link.href = comment.url;
      link.textContent = comment.text;
      link.target = '_blank';
      div.appendChild(link);
  
      // Add a paragraph element to display the comment text
      const commentText = document.createElement('p');
      commentText.textContent = comment.comment;
      div.appendChild(commentText);
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => {
        browser.runtime.sendMessage({ type: 'deleteComment', payload: { url: comment.url, text: comment.text } }).then(() => {
          displayComments(comments.filter(c => c !== comment));
        });
      };
      div.appendChild(deleteButton);
  
      container.appendChild(div);
    });
  }
  
  // Retrieve and display comments
  browser.runtime.sendMessage({ type: 'getComments' }).then(displayComments);
  