import React, {Component} from 'react';


const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class Register extends Component {

    state = {
        email: "",
        firstName: "",
        lastName: "",
        termAndCondition: false,
        errors: {
            email: "",
            firstName: "",
            lastName: "",
            termAndCondition: ""
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });

        let errors = this.state.errors;

        switch (name) {
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value});
    }



     validateForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }


    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.state);

    }

    render() {
        return (
            <div className="loginBox__wrapper min-height-full"
                 style={{"backgroundImage": "url(assets/images/login-bg.jpg)"}}>

                <header className="headerBox">
                    <img src="assets/images/logo.png" alt=""/>
                </header>

                <div className="loginBox__label">One Stop Resource for your Medical Practice</div>

                <article className="loginBox">
                    <h1 className="loginBox__title mg-b30">Create your account</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Email or phone number"
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="row">
                            <div className="col-50">
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="First Name"
                                           name="firstName"
                                           value={this.state.firstName}
                                           onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="col-50">
                                <div className="form-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Last Name"
                                           name="lastName"
                                           value={this.state.lastName}
                                           onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>Hospital Name</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>Designation</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>Your Speciality</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>City</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>State</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group mg-b30">
                            <div className="custom-select">
                                <select className="form-control">
                                    <option>Country</option>
                                </select>
                            </div>
                        </div>
                        <div className="mg-b30">
                            <button className="btn btn-primary" type={"submit"}>Sign Up</button>
                        </div>
                        <label className="custom-checkbox">
                            <input
                                name="termAndCondition"
                                type="checkbox"
                                checked={this.state.termAndCondition}
                                onChange={this.handleInputChange}/>
                            I accept term and condition</label>

                    </form>

                </article>

            </div>);
    }

}


export default Register;
