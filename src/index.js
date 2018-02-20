import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment';
import 'moment/locale/ru';
import PageHeader from './page-header';
import CalendarGrid from './calendar-grid';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: {
                month: moment().month(),
                day: moment().date()
            },
            view: {
                month: moment().month()
            }
        }
    }

    setMonth(month) {
        const view = this.state.view;
        const current = this.state.current;

        switch (month) {
            case "prev":
                month = view.month - 1;
                break;

            case "next":
                month = view.month + 1;
                break;

            case "cur":
                month = current.month;
                break;

            default:
                break;
        }

        if (typeof month !== "number") {
            return;
        }

        view.month = month;
        this.setState({
            view: view
        })
    }

    render() {
        console.log("this.state.view.month: " + this.state.view.month);
        const viewDate = moment().add(this.state.view.month - this.state.current.month, "months").format("MMMM, YYYY");
        const currentDate = moment().format("YYYY.MM.DD");

        return (
            <div>
                <PageHeader />

                <div className="l-container">
                    <div className="date-controls">
                        <button onClick={ () => this.setMonth("prev") }>-</button>
                        <span>{ viewDate }</span>
                        <button onClick={ () => this.setMonth("next") }>+</button>
                        <button onClick={ () => this.setMonth("cur") }>Сегодня</button>
                    </div>

                    <CalendarGrid month={ this.state.view.month } currentDate={ currentDate } />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);