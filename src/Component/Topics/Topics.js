import React, { Component } from 'react';


class Topics extends Component {

    state = {
        tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6", "Tag 7"]
    }

    render() {
        return (<div className="topicsBox__wrapper min-height-full img-bg"
                     style={{"backgroundImage": "url(assets/images/topics-bg.jpg)"}}>

            <header className="headerBox">
                <div className="container">
                    <a href="#" className="headerBox__logo">
                        <img src="assets/images/logo.png" alt=""/>
                    </a>
                </div>
            </header>

            <article className="topicsBox">
                <div className="container">
                    <h1 className="topicsBox__title">Choose Topics of<br/>Interest</h1>

                    <ul className="topicsBox__list mg-b70 mg-sm-b30">
                        {
                            this.state.tags.map(tag =>
                                <li key={tag}>
                                    <label className="custom-checkbox2">
                                        <input type="checkbox" name={tag}/>
                                        <span className="custom-checkbox2__text">{tag}</span>
                                    </label>
                                </li>
                            )
                        }
                    </ul>

                    <div className="pd-l15 pd-r15 text-sm-center">
                        <button className="btn btn-primary">Next ></button>
                    </div>
                </div>
            </article>
        </div>);
    }
}


export default Topics;
