import React  from 'react';

import WizardComponent from './components/wizard';
import ConsumerInfo from './stores/consumerInfo';
import './App.css';

class App extends React.Component {

    getWizardSteps() {
        if (window.localStorage && window.localStorage['demo-wizard-state']) {
            let localData = JSON.parse(localStorage['demo-wizard-state']);
            return localData.steps;
        }
        return this.concatWizardSteps(ConsumerInfo);
    }

    concatWizardSteps (sourceData) {
        let summaryStep = {
            "id": "summary",
            "name": "Check Out",
            "editable": false,
            "fields": []
        };
        for (let i = 0; i < sourceData.length; i++) {
            summaryStep.fields = summaryStep.fields.concat(sourceData[i].fields);
        }
        sourceData.push(summaryStep);
        return sourceData;
    }

    render() {
        return(
            <div className="container">
                <WizardComponent steps={this.getWizardSteps()}>
                </WizardComponent>
            </div>
        );
    }
}

export default App;
