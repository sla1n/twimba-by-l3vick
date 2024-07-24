import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const userName = '@l3vick'

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replyMaker){
        handleMakingReplyClick(e.target.dataset.replyMaker)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.deleteReply){
        const tweetId = e.target.dataset.tweetId
        const replyIndex = e.target.dataset.deleteReply
        handleDeleteReplyClick(tweetId, replyIndex)
    }
})
 

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: userName,
            profilePic: `images/l3vick.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleMakingReplyClick(tweetId){

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    
    if(replyInput.value ){
        targetTweetObj.replies.push({
            handle: userName,
            profilePic: `images/l3vick.jpg`,
            tweetText: replyInput.value,
        })
    render()
    replyInput.value = ''
    }
}

function handleDeleteClick(tweetId){
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    if (tweetIndex > -1) {
        tweetsData.splice(tweetIndex, 1);
    }

    render();
}

function handleDeleteReplyClick(tweetId, replyIndex){
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);
    if (targetTweetObj) {
        targetTweetObj.replies.splice(replyIndex, 1);
    }
    render();
}



function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let deleteTweetIconHtml = ''
        let deleteReplyIconHtml = ''

        if (tweet.handle === userName) {
            deleteTweetIconHtml = `<i class="fa-solid fa-trash hover-effect" id="delete-${tweet.uuid}" data-delete="${tweet.uuid}"></i>`
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply, index){
                if(reply.handle === userName){
                    deleteReplyIconHtml = `<i class="fa-solid fa-trash delete-reply-icon hover-effect" id="delete-reply-${index}" data-delete-reply="${index}" data-tweet-id="${tweet.uuid}"></i>`
                }
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        
                        <img src="${reply.profilePic}" class="profile-pic">
                        
                        
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                            
                        </div>
                        
                    </div>
                    <p>${deleteReplyIconHtml}</p>
                </div>
`
            })
        }
        
        


          
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>
                ${deleteTweetIconHtml}  
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
                <div class="reply-container">
                    <textarea class="reply-input" placeholder="Publish a reply" id="reply-input-${tweet.uuid}"></textarea>
                    <button class="reply-btn" id="reply-btn" data-reply-maker="${tweet.uuid}">Reply</button>
                </div>
            </div>   
            
            
        </div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

