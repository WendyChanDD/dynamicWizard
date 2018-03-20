import React from 'react';
import { FormErrors } from './FormErrors';
import './form.css';

class Form extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
          index: props.index,
          fields: props.fields,
          editable: props.editable,
          formStatus: props.formStatus,
          formErrors: {'fullName': '', 'alias': ''},
          formValid: props.editable ? false : true
      };
  }

  /* validate fields input value */
  validateField(fieldName, value) {
      let fieldsError = this.state.formErrors;
      /* find the current field from state */
      let currentField;
      for (let fieldIndex = 0; fieldIndex < this.state.fields.length; fieldIndex++) {
          currentField = this.state.fields[fieldIndex];
          fieldsError[currentField.name] = this.validateFieldByType(currentField.type, currentField.value);
      }
      return fieldsError;
  }

   /* validate the field with some basic rules, you may change the rule-set below */
   validateFieldByType(type, value) {
       let fieldError = '';
       if (!value) {
           return ' cannot be empty';
       }
       switch(type) {
           case 'email':
               fieldError = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : ' is invalid';
               break;
           case 'password':
               fieldError = value.length >= 6 ? '': ' is too short';
               break;
           default:
               fieldError = value.trim().length > 0 ? '': ' cannot be empty';
               break;
       }
       return fieldError;
   }

  /* set form valid based on fields valid
   * the save button is active,only when all fields are valid,
   */
  validateForm(fieldsError) {
      // check if any error in fields
      let allValid = true;
      for (let fieldKey in fieldsError) {
          if (fieldsError.hasOwnProperty(fieldKey) && fieldsError[fieldKey].length > 0) {
              allValid = false;
              break;
          }
      }
      return allValid;
  }

    /* handle user input, valid the field and whole form */
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let fields = this.state.fields;
        for (let index = 0; index < fields.length; index++) {
            if (fields[index].name === name) {
                fields[index].value = value;
                break;
            }
        }
        /* setState to keep it on UI */
        this.setState({fields: fields});
        let fieldsError = this.validateField(name, value);
        let formValid = this.validateForm(fieldsError);
        this.setState({formErrors: fieldsError, formValid: formValid});
        this.props.onFormChanged(this.state.index, 1, this.state.fields);
    }

  saveForm = (e) => {
      /* set to Done*/
      if (this.state.formValid) {
          this.setState({formStatus: 2});
          /* call back onFormChanged of wizard to notice the changes */
          this.props.onFormChanged(this.state.index, 2, this.state.fields);
      }
  }

  render () {
      return (
          <form onSubmit={this.saveForm}>
              <div className="w100">
                  {
                      this.state.fields.map((field, index ) =>  {
                          return(
                              <div key={field.name} className="formRow">
                                  <label className="formLabel">{field.text}</label>
                                  <input readOnly={!this.state.editable} className="formInput" type={field.type} name={field.name} value={field.value}
                                   onChange={this.handleUserInput}  />
                              </div>
                          )
                      })
                  }
              </div>
              <div className="w50 h2rem">
                  <FormErrors formErrors={this.state.formErrors} />
              </div>
              <input type="submit" className={this.state.formValid ? "button" : "button disable" } value={this.state.editable ? "Save" : "Done"} disabled={!this.state.formValid}/>
          </form>
      )
  }
}

export default Form;
