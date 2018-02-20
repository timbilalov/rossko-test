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
            view: {}
        }
    }

    setViewMonth(month) {
        const view = this.state.view || {};
        view.month = month;
        this.setState({
            view: view
        })
    }

    setPrevMonth() {
        const view = this.state.view;
        if (!view) {
            return;
        }
        view.month = view.month - 1;
        this.setState({
            view: view
        })
    }

    setNextMonth() {
        const view = this.state.view;
        if (!view) {
            return;
        }
        view.month = view.month + 1;
        this.setState({
            view: view
        })
    }

    render() {
        console.log("this.state.view.month: " + this.state.view.month);
        const viewDate = moment().add(this.state.view.month - this.state.current.month, "months").format("MMMM, YYYY");
        return (
            <div>
                <PageHeader />

                <div className="l-container">
                    <button onClick={ () => this.setPrevMonth() }>-</button>
                    <span>{ viewDate }</span>
                    <button onClick={ () => this.setNextMonth() }>+</button>
                    <CalendarGrid month={ this.state.view.month } />
                </div>
            </div>
        )
    }

    componentWillMount() {
        this.setViewMonth(this.state.current.month);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);