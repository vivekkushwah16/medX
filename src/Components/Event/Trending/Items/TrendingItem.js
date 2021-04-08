import React, { useContext } from 'react'
import { MediaModalType } from '../../../../AppConstants/ModalType'
import { TRENDING_ITEM_TYPE } from '../../../../AppConstants/TrendingItemTypes'
import { MediaModalContext } from '../../../../Context/MedialModal/MediaModalContextProvider'
import ReadMore from '../../../ReadMore/ReadMore'

export default function TrendingItem(props) {
    const { showMediaModal } = useContext(MediaModalContext)
    const { data } = props

    return (
        <div key={`AgendaCard-${data.id}`} id={`AgendaCard-${data.id}`} className={`maincardBox__card `} style={{ border: '0.12rem solid rgb(174 165 165 / 39%)'}}>
            {
                data.type === TRENDING_ITEM_TYPE.PDF &&
                <div className="maincardBox__card-video"
                    style={{
                        backgroundImage: `url(/assets/images/pdf.jpg)`,
                    }}>
                    <div className="tint"></div>
                </div>
            }
            {
                data.type !== TRENDING_ITEM_TYPE.PDF &&
                <div className="maincardBox__card-video"
                    style={{
                        backgroundImage: `url(${data.thumbnailUrl})`,
                    }}>
                    <div className="tint"></div>
                </div>
            }
            <div class="maincardBox__card-body">
                <div class="text-block">
                    <h4 className="mg-b15 maincardBox__card-title">{data.title}
                    </h4>
                    <ReadMore className="mg-b25 maincardBox__card-desc" description={data.description} />

                </div>
                <div class="rating-block" style={{ minWidth: 'unset', maxWidth: 'unset' }}>
                    {
                        data.type === TRENDING_ITEM_TYPE.VIDEO &&
                        <button class="btn btn-outline btn-locked mg-t10 " disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.Videos, data.link)}>Play <i class="icon-lock"></i></button>
                    }
                    {
                        data.type === TRENDING_ITEM_TYPE.IMAGE &&
                        <button class="btn btn-outline btn-locked mg-t10 " disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.Image, data.link)}>Open <i class="icon-lock"></i></button>
                    }
                    {
                        data.type === TRENDING_ITEM_TYPE.PDF &&
                        <button class="btn btn-outline btn-locked mg-t10 " disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.PDF, data.link)}>Open <i class="icon-lock"></i></button>
                    }
                    {/* <button className={`mg-b40 mg-sm-b20 like-btn ${like ? 'like-btn--active' : ''} `} onClick={() => toggleLikeToTarget()}><i className="icon-like"></i>{timeline.likes}</button> */}

                </div>
            </div>
        </div>
    )

    return (
        <div class="trendingBox__item">
            <div class="trendingBox__item-pic">
                {
                    data.type === TRENDING_ITEM_TYPE.PDF &&
                    <img src="/assets/images/pdf.jpg" alt="" />
                }
                {
                    data.type !== TRENDING_ITEM_TYPE.PDF &&
                    <img src={data.thumbnailUrl} alt="" />
                }
            </div>
            <div class="trendingBox__item-text">
                <h3 class="trendingBox__item-title mg-b20">{data.title}</h3>
                <ReadMore className={"trendingBox__item-desc"} description={data.description} />
            </div>
            <div class="trendingBox__item-action">
                {
                    data.type === TRENDING_ITEM_TYPE.VIDEO &&
                    <button class="btn btn-outline btn-locked" disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.Videos, data.link)}>Play <i class="icon-lock"></i></button>
                }
                {
                    data.type === TRENDING_ITEM_TYPE.IMAGE &&
                    <button class="btn btn-outline btn-locked" disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.Image, data.link)}>Open <i class="icon-lock"></i></button>
                }
                {
                    data.type === TRENDING_ITEM_TYPE.PDF &&
                    <button class="btn btn-outline btn-locked" disabled={data.disabled} onClick={() => showMediaModal(MediaModalType.PDF, data.link)}>Open <i class="icon-lock"></i></button>
                }
            </div>
        </div>
    )
}
