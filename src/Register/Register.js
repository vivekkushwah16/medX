import React, {Component} from 'react';
import {CountryDropdown, RegionDropdown, CountryRegionData} from 'react-country-region-selector';


const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class Register extends Component {

    state = {
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
        hospitalName: "",
        designation: "",
        country: "",
        state: "",
        city: "",
        termsAndConditions: false,
        errors: {
            email: "",
            phoneNumber: "",
            firstName: "",
            lastName: "",
            hospitalName: "",
            designation: "",
            country: "",
            state: "",
            city: "",
            termsAndConditions: ""
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }


    validateForm = () => {
        let errors = this.state.errors;

        errors.email = validEmailRegex.test(this.state.email) ? '' : 'Email is not valid!';
        errors.phoneNumber = this.state.phoneNumber.length > 0 ? '' : 'Phone number is required';
        errors.firstName = this.state.firstName.length > 0 ? '' : 'First name is required';
        errors.hospitalName = this.state.hospitalName.length > 0 ? '' : 'Hospital name is required';
        errors.designation = this.state.designation.length > 0 ? '' : 'Designation is required';
        errors.country = this.state.country.length > 0 ? '' : 'Country is required';
        errors.state = this.state.state.length > 0 ? '' : 'State is required';
        errors.city = this.state.city.length > 0 ? '' : 'City is required';
        errors.termsAndConditions = this.state.termsAndConditions == true ? '' : 'Please accept terms and conditions';

        this.setState({errors: errors});
    }

    isValidForm = (errors) => {
        let valid = true;
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        return valid;
    }


    handleSubmit = (event) => {
        event.preventDefault();

        this.validateForm();

        if (!this.isValidForm(this.state.errors)) {
            console.log(this.state);
            return;
        }
    }

    render() {
        return (
            <div className="loginBox__wrapper min-height-full gradient-bg">

                <header className="headerBox">
                    <div className="container">
                        <a href="#" className="headerBox__logo">
                            <img src="assets/images/logo.png" alt=""/>
                        </a>
                    </div>
                </header>

                <div className="loginBox__left">
                    <div className="loginBox__label">One Stop Resource for your Medical Practice</div>
                    <div className="loginBox__video">
                        <a href="#" className="loginBox__video__play"><i className="icon-play"></i></a>
                        <img src="assets/images/video-thumb.jpg" alt=""/>
                    </div>
                </div>

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
                            {this.state.errors.email &&
                            <span className="input-error2">Please enter correct email address.</span>}
                        </div>

                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Phone number"
                                   name="phoneNumber"
                                   value={this.state.phoneNumber}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.phoneNumber &&
                            <span className="input-error2">Please enter correct phone number.</span>}
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
                                    {this.state.errors.firstName &&
                                    <span className="input-error2">Please enter first name.</span>}
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
                            <input type="text"
                                   className="form-control"
                                   placeholder="Hospital Name"
                                   name="hospitalName"
                                   value={this.state.hospitalName}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.hospitalName &&
                            <span className="input-error2">Please enter hospital name.</span>}
                        </div>
                        <div className="form-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Designation"
                                   name="designation"
                                   value={this.state.designation}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.designation &&
                            <span className="input-error2">Please enter designation.</span>}
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
                                <CountryDropdown
                                    name="country" id="country" name="country" className="form-control"
                                    value={this.state.country}
                                    onChange={(val) => this.setState({country: val})}
                                />
                                {this.state.errors.country &&
                                <span className="input-error2">Please enter country name.</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="custom-select">
                                <RegionDropdown
                                    name="city" id="city" name="city" className="form-control"
                                    country={this.state.country}
                                    value={this.state.state}
                                    onChange={(val) => this.setState({state: val})}
                                />
                                {this.state.errors.state &&
                                <span className="input-error2">Please enter state name.</span>}
                            </div>
                        </div>
                        <div className="form-group mg-b30">
                            <input type="text"
                                   className="form-control"
                                   placeholder="City"
                                   name="hospitalName"
                                   value={this.state.city}
                                   onChange={this.handleInputChange}
                            />
                            {this.state.errors.city &&
                            <span className="input-error2">Please enter city name.</span>}
                        </div>
                        <div className="mg-b30">
                            <button className="btn btn-primary" type={"submit"}>Sign Up</button>
                        </div>
                        <label className="custom-checkbox">
                            <input
                                name="termsAndConditions"
                                type="checkbox"
                                checked={this.state.termsAndConditions}
                                onChange={this.handleInputChange}/>
                            I accept term and condition</label>
                        {this.state.errors.termsAndConditions &&
                            <span className="input-error">Please accept terms and conditions.</span>}
                    </form>

                </article>

            </div>

        );
    }

}


export default Register;
