import React, { useContext, useEffect, useState } from 'react'
import { eventContext } from '../../../../Context/Event/EventContextProvider'
import { database } from '../../../../Firebase/firebase'
import ButtonWithLoader from '../../../ButtonWithLoader/ButtonWithLoader'
import ReadMore from '../../../ReadMore/ReadMore'

export default function PartnerWithUsCard(props) {
    const { data, countIn } = props
    const { getPartnerWithUsAgreeStatus } = useContext(eventContext)
    const [alreadyAgreed, setAlreadyAgreed] = useState(false)

    useEffect(() => {
        getPartnerWithUsAgreeStatus(data.id).then((status) => {
            setAlreadyAgreed(status)
        }).catch(err => console.log(err))
    }, [])

    const count = () => {
        return new Promise(async (res, rej) => {
            try {
                await countIn(data.eventId, data.id)
                setAlreadyAgreed(true)
                res()
            } catch (error) {
                rej(error)
            }
        })
    }



    return (
        <div class="partnerBox__item">
            <div class="partnerBox__item-pic">
                <img src={data.thumbnailUrl} alt="" />
            </div>
            <div class="partnerBox__item-text">
                <h3 class="partnerBox__item-title mg-b20">{data.title}</h3>
                <ReadMore className="partnerBox__item-desc mg-b20" description={data.description} limit={100} />
                <h3 class="partnerBox__item-title mg-b20">{data.subTitle}</h3>
                <ReadMore className="partnerBox__item-desc mg-b20" description={data.subDesciption} limit={100} />
                <div class="partnerBox__item-action">
                    <ButtonWithLoader className="btn btn-secondary" name={alreadyAgreed ? 'Thanks' : 'Count me in'} disabled={alreadyAgreed} handleClick={count} />
                </div>
            </div>
        </div>
    )
}
