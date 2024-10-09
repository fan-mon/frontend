const NoticeModal = ({isOpne, onClose, title, content}) => {
    if (!isOpne) return null;  // 모달이 열려있지 않으면 랜더링 X
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="modal-top">
                    <div className="modal-title">{title}</div>
                    <div className="modal-content">{content}</div>
                </div>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}
export default NoticeModal;