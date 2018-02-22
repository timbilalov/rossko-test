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
                isOnEdit: false,
                isSingleString: false,
                singleString: ""
            },
            defaultEventName: "Событие без названия",
            events: [],
            searchValue: "",
            searchResult: []
        };
    }

    setMonth(month) {
        const view = this.state.view;
        const current = this.state.current;

        if (month === view.month) {
            return;
        }

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

        this.closeEventPopup();
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
        event.isSingleString = false;
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

            case "singleString":
                event.singleString = value;
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
        let evName, evDate, evDescription, selectedDate;

        if (!this.state.event.isSingleString) {
            evName = props.name || this.state.event.name || this.state.defaultEventName;
            evDate = props.date || this.state.event.date;
            evDescription = props.description || this.state.event.description;
            selectedDate = this.state.event.selectedDate;

        } else {
            const singleString = this.state.event.singleString || this.state.defaultEventName;
            const arr = singleString.split(",");

            if (arr.length < 2) {
                evDate = moment().format("YYYY.MM.DD");
                evName = arr[0].trim();

            } else {
                evDate = moment(arr[0], "D MMMM YYYY");
                if (isNaN(evDate)) {
                    console.error("can't parse date from event single string");
                    return;
                }
                evDate = evDate.format("YYYY.MM.DD");
                evName = arr[1].trim();
            }
        }

        switch (type) {
            case "add":
                if (events.filter((elem) => elem.date === evDate).length > 0) {
                    console.error("event on date " + evDate + " already exist");
                    return;
                }

                const newEvent = {
                    name: evName,
                    date: evDate,
                    description: evDescription
                };
                events.push(newEvent);
                break;

            case "edit":
                events.forEach(function(elem) {
                    if (elem.date === selectedDate) {
                        elem.name = evName;
                        elem.date = evDate;
                    }
                });
                break;

            case "delete":
                events.forEach(function(elem) {
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
                isOnEdit: false,
                isSingleString: false,
                singleString: ""
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

        const allGridItems = document.querySelectorAll(".calendar-item");
        const selectedClass = "calendar-item--selected";

        Array.prototype.forEach.call(allGridItems, function(elem) {
            elem.classList.remove(selectedClass);
        });
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

    openSingleStringPopup() {
        const popup = document.querySelector("#event-popup");
        const headerControlsBlock = document.querySelector(".page-header__controls");
        popup.style.display = "block";
        headerControlsBlock.appendChild(popup);
        const event = this.state.event;
        event.isSingleString = true;
        event.date = "";
        event.isOnEdit = false;
        event.isNew = true;
        this.setState({
            event: event
        });
    }

    clearAll() {
        const context = this;
        const f = function() {
            context.closeEventPopup();
            const allGridItems = document.querySelectorAll(".calendar-item");
            const selectedClass = "calendar-item--selected";
            Array.prototype.forEach.call(allGridItems, function(elem) {
                elem.classList.remove(selectedClass);
            });
        };

        const events = [];
        this.setState({
            events: events
        }, f);

        if (localStorage) {
            localStorage.setItem("events", JSON.stringify(events));
        }
    }

    render() {
        const viewDate = moment().add(this.state.view.month - this.state.current.month, "months").format("MMMM, YYYY");
        const currentDate = moment().format("YYYY.MM.DD");

        return (
            <div>
                <PageHeader searchResult={ this.state.searchResult } searchValue={ this.state.searchValue } onSearchChange={ (e) => this.handleSearchChange(e) } onSearchResClick={ (date) => this.handleSearchResClick(date) } />

                <div className="l-container">
                    <div className="date-controls">
                        <button className="btn" onClick={ () => this.setMonth("prev") }>🠈</button>
                        <span className="btn">{ viewDate }</span>
                        <button className="btn" onClick={ () => this.setMonth("next") }>🠊</button>
                        <button className="btn" onClick={ () => this.setMonth("cur") }>Сегодня</button>
                    </div>

                    <CalendarGrid month={ this.state.view.month } currentDate={ currentDate } onClick={ (date) => this.handleClick(date) } events={ this.state.events } />

                    <button onClick={ () => this.clearAll() }>Удалить все события и очистить localStorage</button>
                    <br/>
                    <br/>
                </div>

                <div className="event-popup" id="event-popup">
                    <div className="event-popup__text">
                        {
                            this.state.event.isSingleString &&
                            <div className="event-popup__inputs">
                                <input type="text" placeholder={ "" + moment().format("D MMMM") + ", событие" } value={ this.state.event.singleString } onChange={ (e, type) => this.handleChange(e, "singleString") } />
                            </div>
                        }
                        {
                            !this.state.event.isSingleString && (!this.state.event.isNew && !this.state.event.isOnEdit) &&
                            <div>
                                <p className="event-popup__date">{ this.state.event.date }</p>
                                <p className="event-popup__name">{ this.state.event.name }</p>
                                <p className="event-popup__description">{ this.state.event.description }</p>
                            </div>
                        }
                        {
                            !this.state.event.isSingleString && (this.state.event.isNew || this.state.event.isOnEdit) &&
                            <div className="event-popup__inputs">
                                <input type="text" placeholder="Событие" value={ this.state.event.name } onChange={ (e, type) => this.handleChange(e, "name") } />
                                <input type="text" placeholder="День, месяц, год" value={ this.state.event.date } onChange={ (e, type) => this.handleChange(e, "date") } />
                                <textarea placeholder="Описание" value={ this.state.event.description } onChange={ (e, type) => this.handleChange(e, "description") }></textarea>
                            </div>
                        }
                    </div>

                    <button className="event-popup__close" onClick={ () => this.closeEventPopup() }>X</button>

                    {
                        this.state.event.isNew &&
                        <button className="btn" onClick={ (type, props) => this.eventAction("add", this.state.event) }>Добавить</button>
                    }
                    {
                        (!this.state.event.isNew && !this.state.event.isOnEdit) &&
                        <button className="btn" onClick={ () => this.setEditState() }>Редактировать</button>
                    }
                    {
                        (!this.state.event.isNew && this.state.event.isOnEdit) &&
                        <button className="btn" onClick={ (type, props) => this.eventAction("edit", this.state.event) }>Сохранить</button>
                    }
                    {
                        !this.state.event.isNew &&
                        <button className="btn" onClick={ (type, props) => this.eventAction("delete", this.state.event) }>Удалить</button>
                    }
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

    componentDidMount() {
        const headerControlsBlock = document.querySelector(".page-header__controls");
        headerControlsBlock.querySelector("button").addEventListener("click", () => this.openSingleStringPopup());
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