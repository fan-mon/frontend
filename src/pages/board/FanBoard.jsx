const FanBoard = ({ fanBoard }) => {
    return (
        <div className="fanboard-wrap">
            <div className="fanboard-title">FAN BOARD</div>
            <div className="fanboard-body">
                <div className="new-post-wrap">
                    <textarea className="writing-box" name="" id="" cols="30" maxLength="150" rows="10" placeholder="아티스트에게 응원의 한마디! (150자 이내)">
                        
                    </textarea>
                    <div className="send-post">
                        post
                    </div>
                </div>
                {fanBoard && fanBoard.length > 0 ? (
                    fanBoard.map((post) => (
                            <div className="fanboard-content-wrap">
                                <div className="content-top">
                                    <div className="fanname">
                                        {post.user.name}
                                    </div>
                                    <div className="date">
                                        {new Date(post.createdat).toLocaleDateString('ko-KR')} {new Date(post.createdat).toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    </div>
                                </div>
                                <div className="fanboard-content">
                                    {post.content}
                                </div>
                            </div>
                        )
                    )) : (
                    <p></p>
                )}
            </div>
        </div>
    );
}

export default FanBoard;