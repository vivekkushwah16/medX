import React, { useContext } from 'react'
import { MediaModalType } from '../../../../AppConstants/ModalType'
import { TRENDING_ITEM_TYPE } from '../../../../AppConstants/TrendingItemTypes'
import { MediaModalContext } from '../../../../Context/MedialModal/MediaModalContextProvider'
import ReadMore from '../../../ReadMore/ReadMore'

export default function TrendingItem(props) {
    const { showMediaModal } = useContext(MediaModalContext)
    const { data } = props
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
