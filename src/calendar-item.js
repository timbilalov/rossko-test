import React from "react";
import moment from 'moment';
import 'moment/locale/ru';

export default class CalendarItem extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(event) {
        event.stopPropagation();
        this.props.onClick(this.props.date);
    }

    render() {
        const date = moment(this.props.date, "YYYY.MM.DD").format(this.props.format);
        const classNameModifier = this.props.classNameModifier || "";
        const event = this.props.event || {};
        const eventName = event.name || "";
        return (
            <div className={ "calendar-item " + classNameModifier } data-date={ this.props.date } onClick={ (e) => this.handleClick(e) }>
                <div className="calendar-item__inner">
                    <div className="calendar-item__date">
                        { date }
                    </div>

                    <div className="calendar-item__text">
                        { eventName }
                    </div>
                </div>
            </div>
        );
    }
}