import React from "react";
import CalendarItem from './calendar-item';
import moment from 'moment';
import 'moment/locale/ru';

export default class CalendarGrid extends React.Component {
    render() {
        let items = [];
        const viewMonth = typeof this.props.month === "number" ? this.props.month : moment().month();
        const firstMonthDay = moment().month(viewMonth).startOf("month");
        const lastMonthDay = moment().month(viewMonth).endOf("month");
        const firstMonthDayWeekDay = firstMonthDay.day() || 7;
        const firstCalendarViewDay = moment(firstMonthDay).date(- firstMonthDayWeekDay + 1);

        let itemsCount = moment(firstMonthDay).daysInMonth();
        itemsCount += (firstMonthDayWeekDay - 1);
        itemsCount += (7 - (lastMonthDay.day() || 7));
        const classNameModifierGrid = itemsCount === 35 ? "" : "calendar-grid--long";
        const events = this.props.events || [];

        for (let i = 0; i < itemsCount; i++) {
            let date = firstCalendarViewDay.add(1, "days");
            let classNameModifierItem = date.month() === firstMonthDay.month() ? "" : "calendar-item--option";
            if (date.format("YYYY.MM.DD") === moment().format("YYYY.MM.DD")) {
                classNameModifierItem += " calendar-item--current";
            }
            const format = i < 7 ? "dddd, D" : "D";
            date = date.format("YYYY.MM.DD");
            let event = events.filter((elem) => elem.date === date);
            if (event.length > 0) {
                event = event[0];
            }
            items.push(<CalendarItem classNameModifier={ classNameModifierItem } key={ i } date={ date } format={ format } onClick={ (date) => this.props.onClick(date) } event={ event } />);
        }

        return (
            <div className={ "calendar-grid " + classNameModifierGrid }>
                { items }
            </div>
        );
    }
}