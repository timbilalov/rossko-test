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
            },
            event: {
                name: "",
                date: "",
                selectedDate: "",
                description: "",
                isNew: true,
                isOnEdit: false
            },
            events: [],
            searchValue: "",
            searchResult: []
        };
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

    handleClick(date) {
        this.closeEventPopup();

        const popup = document.querySelector("#event-popup");
        popup.style.display = "block";
        const gridItem = document.querySelector(".calendar-item[data-date='" + date + "']");
        gridItem.appendChild(popup);
        let selectedDayEvent = this.state.events.filter((elem) => elem.date === date);
        const event = this.state.event;
        if (selectedDayEvent.length > 0) {
            selectedDayEvent = selectedDayEvent[0];
            event.name = selectedDayEvent.name;
            event.description = selectedDayEvent.description;
            event.selectedDate = date;
            event.isNew = false;
        } else {
            event.isNew = true;
        }
        event.date = date;
        this.setState({
            event: event
        })
    }

    handleChange(e, type) {
        const event = this.state.event;
        const value = e.target.value || "";
        switch (type) {
            case "date":
                event.date = value;
                break;

            case "name":
                event.name = value;
                break;

            case "description":
                event.description = value;
                break;

            default:
                break;
        }

        this.setState({
            event: event
        });
    }

    eventAction(type, props) {
        props = props || {};

        const events = this.state.events.slice();
        const evName = props.name || this.state.event.name;
        const evDate = props.date || this.state.event.date;
        const evDescription = props.description || this.state.event.description;
        const selectedDate = this.state.event.selectedDate;
        switch (type) {
            case "add":
                const newEvent = {
                    name: evName,
                    date: evDate,
                    description: evDescription
                };
                events.push(newEvent);
                break;

            case "edit":
                events.map(function(elem) {
                    if (elem.date === selectedDate) {
                        elem.name = evName;
                        elem.date = evDate;
                    }
                });
                break;

            case "delete":
                events.map(function(elem) {
                    if (elem.date === evDate) {
                        elem.name = evName;
                    }
                });
                let event = events.filter((elem) => elem.date === evDate);
                if (event.length <= 0) {
                    return;
                }
                event = event[0];
                const index = events.indexOf(event);
                events.splice(index, 1);
                break;

            default:
                break;
        }

        this.setState({
            events: events,
            event: {
                name: "",
                date: "",
                selectedDate: "",
                description: "",
                isNew: true,
                isOnEdit: false
            }
        }, this.updateSearchResults);

        if (localStorage) {
            localStorage.setItem("events", JSON.stringify(events));
        }

        this.closeEventPopup();
    }

    closeEventPopup() {
        const popup = document.querySelector("#event-popup");
        popup.style.display = "none";
        const event = this.state.event;
        if (!event.isNew) {
            event.isNew = true;
            event.isOnEdit = false;
            event.name = "";
            event.date = "";
            event.selectedDate = "";
            this.setState({
                event: event
            });
        }
    }

    setEditState() {
        const event = this.state.event;
        event.isOnEdit = true;
        this.setState({
            event: event
        });
    }

    handleSearchChange(e) {
        const value = e.target.value;

        this.setState({
            searchValue: value
        }, this.updateSearchResults);
    }

    updateSearchResults() {
        const value = this.state.searchValue || "";
        const regexp = new RegExp(value, "i");
        const events = this.state.events.slice();
        const foundEvents = events.filter(function(elem) {
            const str = "" + elem.name + " " + elem.date + " " + elem.description;
            const res = regexp.test(str);
            return res;
        });

        this.setState({
            searchResult: foundEvents
        });
    }

    handleSearchResClick(date) {
        const monthsDiff = Math.round(moment(date).date(1).diff(moment().date(1), "months", true));
        this.setMonth(this.state.current.month + monthsDiff);

        setTimeout(function() {
            document.querySelector(".calendar-item[data-date='" + date + "'").click();
        }, 100);
    }

    render() {
        const viewDate = moment().add(this.state.view.month - this.state.current.month, "months").format("MMMM, YYYY");
        const currentDate = moment().format("YYYY.MM.DD");

        return (
            <div>
                <PageHeader searchResult={ this.state.searchResult } searchValue={ this.state.searchValue } onSearchChange={ (e) => this.handleSearchChange(e) } onSearchResClick={ (date) => this.handleSearchResClick(date) } />

                <div className="l-container">
                    <div className="date-controls">
                        <button onClick={ () => this.setMonth("prev") }>-</button>
                        <span>{ viewDate }</span>
                        <button onClick={ () => this.setMonth("next") }>+</button>
                        <button onClick={ () => this.setMonth("cur") }>Сегодня</button>
                    </div>

                    <CalendarGrid month={ this.state.view.month } currentDate={ currentDate } onClick={ (date) => this.handleClick(date) } events={ this.state.events } />
                </div>

                <div className="event-popup" id="event-popup">
                    {
                        (!this.state.event.isNew && !this.state.event.isOnEdit) &&
                        <div className="event-popup__text">
                            <p className="event-popup__date">{ this.state.event.date }</p>
                            <p className="event-popup__name">{ this.state.event.name }</p>
                            <p className="event-popup__description">{ this.state.event.description }</p>
                        </div>
                    }
                    {
                        (this.state.event.isNew || this.state.event.isOnEdit) &&
                        <div>
                            <input type="text" placeholder="Событие" value={ this.state.event.name } onChange={ (e, type) => this.handleChange(e, "name") } />
                            <input type="text" placeholder="День, месяц, год" value={ this.state.event.date } onChange={ (e, type) => this.handleChange(e, "date") } />
                            <textarea placeholder="Описание" value={ this.state.event.description } onChange={ (e, type) => this.handleChange(e, "description") }></textarea>
                        </div>
                    }
                    {
                        this.state.event.isNew &&
                        <button onClick={ (type, props) => this.eventAction("add", this.state.event) }>Добавить</button>
                    }
                    {
                        (!this.state.event.isNew && !this.state.event.isOnEdit) &&
                        <button onClick={ () => this.setEditState() }>Редактировать</button>
                    }
                    {
                        (!this.state.event.isNew && this.state.event.isOnEdit) &&
                        <button onClick={ (type, props) => this.eventAction("edit", this.state.event) }>Сохранить</button>
                    }
                    {
                        !this.state.event.isNew &&
                        <button onClick={ (type, props) => this.eventAction("delete", this.state.event) }>Удалить</button>
                    }
                    <button onClick={ () => this.closeEventPopup() }>Отмена</button>
                </div>
            </div>
        )
    }

    componentWillMount() {
        if (localStorage && localStorage.getItem("events")) {
            this.setState({
                events: JSON.parse(localStorage.getItem("events"))
            });
        }
    }

    componentDidUpdate() {
        const date = this.state.event.date;
        const gridItem = document.querySelector(".calendar-item[data-date='" + date + "']");
        const allGridItems = document.querySelectorAll(".calendar-item");
        const selectedClass = "calendar-item--selected";

        Array.prototype.forEach.call(allGridItems, function(elem) {
            elem.classList.remove(selectedClass);
        });

        if (!date || !gridItem) {
            return;
        }

        gridItem.classList.add(selectedClass);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);