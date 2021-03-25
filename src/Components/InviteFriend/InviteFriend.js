import React from 'react'
import InviteFriendModal from './InviteFriendModal/InviteFriendModal';

function InviteFriendBtn(props) {
    return (
        <>
            <button
                className="btn btn-secondary invite-btn hide-on-mobile"
                onClick={() => {
                    props.handleClick();
                }}
            >
                <i className="icon-invite"></i> Invite your friends
        </button>
            <button
                className="btn btn-secondary invite-btn hide-on-desktop"
                onClick={() => {
                    props.handleClick();
                }}
            >
                <i className="icon-invite" style={{margin: '0'}}></i>
            </button>
        </>
    )
}


export default function InviteFriend(props) {
    return (
        <>
            <InviteFriendBtn handleClick={() => props.toggleInviteFriendModal(true)} />
            {
                props.showInviteFriendModal &&
                <InviteFriendModal handleClick={() => props.toggleInviteFriendModal(false)} />
            }
        </>
    )
}
