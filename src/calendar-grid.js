import React from "react";
import CalendarItem from './calendar-item';
import moment from 'moment';
import 'moment/locale/ru';

export default class CalendarGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items = [];
        const firstMonthDay = moment().month(moment().month()).date(1);
        const firstCalendarViewDay = firstMonthDay.subtract(firstMonthDay.day(), "days");

        for (let i = 0; i < 35; i++) {
            let date = firstCalendarViewDay.add(1, "days");
            date = date.format("DD MMMM");
            items.push(<CalendarItem key={ i } date={ date } />);
        }

        return (
            <div className="calendar-grid">
                { items }
            </div>
        );
    }
}