import React, { useContext } from 'react'
import ReactPlayer from 'react-player'
import { MediaModalType } from '../../AppConstants/ModalType'
import { MediaModalContext } from '../../Context/MedialModal/MediaModalContextProvider'
import './MediaModal.css'

export default function MediaModal() {
    const { closeMediaModal, mediaModalStatus, modalDetails } = useContext(MediaModalContext)
    return (
        <>
            {
                mediaModalStatus &&
                <>
                    <div className="mediaModal" onClick={(e) => {
                        if (e) { e.preventDefault() }
                        closeMediaModal()
                    }}>
                        <div className="mediaModal_container">
                            {
                                modalDetails.type === MediaModalType.Image &&
                                <img src={modalDetails.link} alt="imageLink" />
                            }
                            {
                                 modalDetails.type === MediaModalType.Videos &&
                                <ReactPlayer
                                    playing={true}
                                    url={modalDetails.link}
                                    playsinline={true}
                                    volume={0.85}
                                    controls={true}
                                    width='100%'
                                    height='100%'
                                    style={{
                                        background: 'black',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            }
                            {
                                modalDetails.type === MediaModalType.PDF &&
                                <iframe src={modalDetails.link} title="pdfViewer" />
                            }
                            <div className="mediaModal_container_loader">
                                <div className="lds-dual-ring"></div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
