import React from "react";
import moment from 'moment';
import 'moment/locale/ru';

export default class CalendarItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date
        }
    }

    render() {
        const date = moment(this.state.date, "YYYY.MM.DD").format(this.props.format);
        const classNameModifier = this.props.classNameModifier || "";
        return (
            <div className={ "calendar-item " + classNameModifier } data-date={ this.state.date } onClick={ (date) => this.props.onClick(this.state.date) }>
                <div className="calendar-item__inner">
                    <div className="calendar-item__date">
                        { date }
                    </div>

                    <div className="calendar-item__text">
                    </div>
                </div>
            </div>
        );
    }
}