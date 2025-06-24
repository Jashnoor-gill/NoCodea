@comments = [data-v-component-comments]
@comment  = [data-v-component-comments] [data-v-comment]

@comment|deleteAllButFirstChild

@comment|before = <?php
if (isset($_comments_idx)) $_comments_idx++; else $_comments_idx = 0;
$commentsData = $this->_component['comments'][$_comments_idx];
$comments = $commentsData['comment'];

if($comments && is_array($comments)) {
	foreach ($comments as $index => $comment) {?>
		
		@comment [data-v-comment-content]|innerText = $comment['content']
		@comment [data-v-comment-author]|innerText = $comment['author']
		@comment [data-v-comment-avatar]|src = $comment['avatar']
		@comment [data-v-comment-reply-url]|href = $comment['reply-url']
	
	@comment|after = <?php 
	} 
}
?>

<div data-v-component-comments>
    <div data-v-comment>
        <img data-v-comment-avatar src="/default-avatar.png" width="60">
        <strong data-v-comment-author>Author Name</strong>
        <div data-v-comment-content>Comment content...</div>
        <a data-v-comment-reply-url href="#">Reply</a>
    </div>
</div> 