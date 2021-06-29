import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { PROFILE_COLLECTION } from '../../AppConstants/CollectionConstants'
import { HOME_ROUTE } from '../../AppConstants/Routes'
import { UserContext } from '../../Context/Auth/UserContextProvider'
import { firestore } from '../../Firebase/firebase'

import './index.css'

const values = {
    "Respiratory": [
        "COPD",
        "Asthma",
        "ILD/IPF",
        "Inhalation Devices",
        "Allergic Rhinitis",
        "Pulmonary Hypertension",
        "Bronchiectasis",
        "Covid19",
        "Nebulization",
        "Pediatric asthma",
    ],
    "Critical Care": [
        "Anti fungal",
        "Covid19"
    ],
    "Cardiology": [
        "Cardiovascular",
        "Heart Failure"
    ],
    "Others": [
        "Telemedicine",
        "Impact Sessions",
        "Impact Panel Discussion"
    ]
}

class IntersetSelection extends Component {

    state = {
        "Respiratory": [],
        "Critical Care": [],
        "Cardiology": [],
        "Others": [],
        loading: false
    }

    componentDidMount() {
        if (this.context.userInfo) {
            if (this.context.userInfo.interests) {
                this.setState({
                    ...this.context.userInfo.interests
                })
            }
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.value) {
            if (newProps.value.interests) {
                this.setState({
                    ...newProps.value.interests
                })
            }
        }
    }


    handleCheckboxClick = (event) => {
        if (event.target.checked) {
            this.setState(prevData => ({
                [`${event.target.id}`]: [...prevData[`${event.target.id}`], event.target.name.toLowerCase()]
            }))
        } else {
            this.setState(prevData => ({
                [`${event.target.id}`]: prevData[`${event.target.id}`].filter(item => item !== event.target.name.toLowerCase())
            }))
        }
    }

    canSubmitBeActive = () => {
        return !(this.state.Respiratory.length > 0 ||
            this.state["Critical Care"].length > 0 ||
            this.state["Cardiology"].length > 0 ||
            this.state["Others"].length > 0)
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        })

        let finalData = {}
        Object.keys(values).forEach(cate => {
            if (this.state[cate].length != 0) {
                finalData[cate] = [];
                for (let i = 0; i < this.state[cate].length; i++) {
                    finalData[cate][i] = this.state[cate][i].toLowerCase()
                }
            }
        })

        let docRef = firestore.collection(PROFILE_COLLECTION).doc(this.context.user.uid)
        await docRef.update({
            interests: finalData
        })

        await this.context.forceUpdateUserInfo()

        // this.setState({
        //     loading: false
        // })
        setTimeout(() => {
            const { history } = this.props;
            if (history) history.push(HOME_ROUTE);
        }, 2000)
    }


    render() {
        return (
            <>
                {
                    this.state.loading &&
                    <div className="loaderContainer loaderContainer_interest">
                        <div className="lds-dual-ring"></div>
                    </div>
                }
                <div className="topicsBox__wrapper min-height-full img-bg intersetSelectionPage" style={{
                    backgroundImage: `url(/assets/images/AdobeStock_369176443.jpeg)`
                }}>
                    <header className="headerBox">
                        <div className="container">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="headerBox__left">
                                    <a href="#" className="headerBox__logo">
                                        <img src="../assets/images/logo.png" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>

                    <article className="topicsBox">
                        <div className="container">
                            <h1 className="topicsBox__title">Choose your  <br />Topics of Interest</h1>
                            {
                                Object.keys(values).map(categories => (
                                    <>
                                        <h3 className="topicsBox__title_categories">{categories}</h3>
                                        <ul className="topicsBox__list mg-b30 mg-sm-b30">
                                            {
                                                values[categories].map(tag => (
                                                    <li key={`${categories}_${tag}`}>
                                                        <label className="custom-checkbox2" >
                                                            <input
                                                                checked type="checkbox"
                                                                id={categories}
                                                                name={tag}
                                                                onChange={this.handleCheckboxClick}
                                                                checked={this.state[categories].indexOf(tag.toLowerCase()) !== -1}
                                                            />
                                                            <span className="custom-checkbox2__text">{tag}</span>
                                                        </label>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </>
                                ))
                            }
                            <div className="pd-l15 pd-r15 text-sm-center">
                                <button
                                    onClick={this.handleSubmit}
                                    className="btn btn-primary"
                                    disabled={this.canSubmitBeActive()}>
                                    Start Watching
                                </button>
                            </div>
                        </div>
                    </article>

                </div>
            </>
        )
    }
}
IntersetSelection.contextType = UserContext
export default withRouter(IntersetSelection)