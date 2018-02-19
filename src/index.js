import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import 'moment/locale/ru';
import PageHeader from './page-header';
import CalendarGrid from './calendar-grid';

console.log(moment.locale())
console.log(moment().format('LLLL'));
console.log(moment().calendar());

class App extends React.Component {
    render() {
        return (
            <div>
                <PageHeader />

                <div className="l-container">
                    <CalendarGrid />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);