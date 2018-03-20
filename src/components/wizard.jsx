import React from 'react';
//import { connect } from 'react-redux';
import Form from './form/form';
import './wizard.css';

class WizardComponent extends React.Component{
    constructor(props){
        super(props);
        /* currentIndex: where the user is
         * steps: forms and their values
         * status: current states of the whole wizard: 0. unstarted, 1. inProgress, 2. done
         */
        this.state = {
            currentIndex : this.getCurrentIndex(),
            /* each step is a form:  [{name: Intro, index: 0, fields: [] } ] */
            steps: props.steps,
            /* store the status of each step */
            stepsStatus: this.getStepStatus(props.steps),
            /* 0: unstarted, 1: inProgress, 2: done */
            status: 0
        };

        // get forms changes
        this.handleFormChanges = this.handleFormChanges.bind(this);
    }

    getCurrentIndex() {
        if (window.localStorage && localStorage['demo-wizard-state']) {
            let localData = JSON.parse(localStorage['demo-wizard-state']);
            return localData.currentIndex ? localData.currentIndex : 0;
        }
        return 0;
    }

    /* initialize step status */
    getStepStatus(steps) {
        if (!steps) {
            return {};
        }
        if (window.localStorage && localStorage['demo-wizard-state']) {
            return JSON.parse(localStorage['demo-wizard-state']).stepsStatus;
        }
        let stepsStatus = {};
        for (let index = 0; index < steps.length; index++) {
            stepsStatus[index] = 0;
        }
        return stepsStatus;
    }

    /* decide class for titles according to the step status*/
    getTitleClass( index ){
        let titleClass =  "tabItem w25";

        /* if index=currentIndex */
        titleClass = this.state.stepsStatus[index] === 2 ? titleClass + " done" : titleClass;
        titleClass = index === this.state.currentIndex ? titleClass + " selected" : titleClass;

        return titleClass;
    }

    /* use font-awesome icons for diff status */
    getTitleIcon(index) {
        return this.state.stepsStatus[index] === 0 ? "" : (this.state.stepsStatus[index] === 1 ? "fa fa-pencil-square-o fa-fw" : "fa fa-check-square-o fa-fw");
    }

    /* control visibility of forms when clicking tabs in navigation */
    getFormClass(index) {
        return index === this.state.currentIndex ? "normalForm" : "normalForm hidden";
    }

    /* can jump to any other forms which are done only when current form is in 'done' state */
    handleTabClicking = (e) => {
        let currentIndex = this.state.currentIndex;
        let index = parseInt(e.target.id);
        if (index === currentIndex) {
            return;
        } else if (index > currentIndex) {
            if (this.state.stepsStatus[currentIndex] !== 2) {
                return;
            } else if (!this.checkStepsInBetween(currentIndex, index)) {
                return;
            }
        }
        this.setState({currentIndex : index});
    }

    checkStepsInBetween(currentIndex, index) {
        for (let i = currentIndex; i < index; i++) {
            if (this.state.stepsStatus[i] !== 2) {
                return false;
            }
        }
        return true;
    }

    /* handleFormChanges is a callback to get status change from a form
     * fields have been mapped to props, so no need to setState for fields  */
    handleFormChanges(index, formStatus, fields) {
        let stepsStatus = this.state.stepsStatus;
        stepsStatus[index] = formStatus;
        this.setState({stepsStatus: stepsStatus});
        for (let index = this.state.steps.length - 1; index >= 0; index--) {
            if (this.state.steps[index].id === "summary") {
                this.updateSummary(fields, this.state.steps[index].fields);
                break;
            }
        }
        if (window.localStorage) {
            let localStorage = window.localStorage;
            localStorage['demo-wizard-state'] = JSON.stringify(this.state);
        }
    }

    /* update fields in summary tab */
    updateSummary(sourceFields, targetFields) {
        for (let sourceIndex = 0; sourceIndex < sourceFields.length; sourceIndex++){
            let sourceField = sourceFields[sourceIndex];
            for (let targetIndex = 0; targetIndex < targetFields.length; targetIndex++) {
                let targetField = targetFields[targetIndex];
                if (sourceField.name === targetField.name) {
                    targetField.value = sourceField.value;
                    break;
                }
            }
        }
    }

    render( ){
        return(
            <div id={this.props.id} className="wizardBg">
                { /* generate tabs in top nav */ }
                <div className="wizardNav" id="wizard-navigator">
                    {
                        this.state.steps.map((step, index) => {
                            return(
                                <div key={index} onClick={this.handleTabClicking}
                                     className={this.getTitleClass(index)}>
                                    <div id={index} className="tabItemCon">
                                        {step.name}
                                        <div className="tabItemIcon">
                                            <span>
                                                <i className={this.getTitleIcon(index)}></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                { /* use Form to generate the body of each step */ }
                <div className="tabItemWrap">
                    {
                        this.state.steps.map((step, index)=>{
                            return(
                                <div key={index} className={this.getFormClass(index)}>
                                    <Form  key={index} fields={step.fields} index={index} editable={step.editable} formStatus={this.state.stepsStatus[index]} onFormChanged={this.handleFormChanges}></Form>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default WizardComponent